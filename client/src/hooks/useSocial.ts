import { create } from "zustand";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/hooks/useUser";
import React from "react";

interface Post {
  id: number;
  userId: number;
  content: string;
  imageUrl?: string;
  createdAt: string;
  likes: number;
  comments: number;
  shares: number;
  user?: {
    id: number;
    username: string;
    profileImageUrl?: string;
  };
}

interface NewPost {
  userId: number;
  content: string;
  imageUrl?: string;
}

interface SocialStore {
  selectedPost: Post | null;
  selectPost: (post: Post) => void;
  resetSelectedPost: () => void;
}

export const useSocialStore = create<SocialStore>((set) => ({
  selectedPost: null,
  selectPost: (post) => set({ selectedPost: post }),
  resetSelectedPost: () => set({ selectedPost: null }),
}));

export const useSocial = () => {
  const { selectedPost, selectPost, resetSelectedPost } = useSocialStore();
  const queryClient = useQueryClient();
  const { user } = useUser();
  
  // Fetch all posts
  const { data: posts = [], isLoading: isLoadingPosts } = useQuery<Post[]>({
    queryKey: ['/api/posts'],
  });
  
  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: async (newPost: NewPost) => {
      const response = await apiRequest('POST', '/api/posts', newPost);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
    },
  });
  
  // Like post mutation
  const likePostMutation = useMutation({
    mutationFn: async (postId: number) => {
      const response = await apiRequest('POST', `/api/posts/${postId}/like`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
    },
  });
  
  // Initialize WebSocket connection
  React.useEffect(() => {
    if (!user) return;
    
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);
    
    socket.onopen = () => {
      // Authenticate with the server
      socket.send(JSON.stringify({
        type: 'auth',
        userId: user.id
      }));
    };
    
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'new_post' || data.type === 'post_update') {
          queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    };
    
    return () => {
      socket.close();
    };
  }, [user, queryClient]);
  
  return {
    posts,
    isLoadingPosts,
    selectedPost,
    selectPost,
    resetSelectedPost,
    createPost: createPostMutation.mutate,
    isCreatingPost: createPostMutation.isPending,
    likePost: likePostMutation.mutate,
    isLikingPost: likePostMutation.isPending,
  };
};
