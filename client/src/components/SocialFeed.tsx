import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSocial } from "@/hooks/useSocial";
import { useUser } from "@/hooks/useUser";
import { HeartIcon, MessageCircleIcon, ShareIcon, ImageIcon, XIcon, TrendingUpIcon, SendIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const SocialFeed: React.FC = () => {
  const { posts, likePost, createPost } = useSocial();
  const { user } = useUser();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleCreatePost = async () => {
    if (!user) return;
    if (!newPostContent.trim()) {
      toast({
        title: "Error",
        description: "Post content cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await createPost({
        userId: user.id,
        content: newPostContent
      });
      
      setNewPostContent("");
      setIsDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Your post has been published",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const minutes = Math.floor(diffInMs / (1000 * 60));
      return `${minutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`;
    }
  };
  
  return (
    <section className="px-4 py-3">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-rajdhani font-bold text-xl">Social Feed</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsDialogOpen(true)}
          className="text-primary text-sm flex items-center"
        >
          New Post
          <i className="ri-add-line ml-1"></i>
        </motion.button>
      </div>
      
      <AnimatePresence>
        {posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-6 text-gray-400"
          >
            No posts yet. Be the first to share!
          </motion.div>
        ) : (
          posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="neon-border rounded-xl bg-surface p-4 mb-4"
            >
              <div className="flex items-start mb-3">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-surface-light flex items-center justify-center text-primary border border-primary/30">
                  {post.user?.profileImageUrl ? (
                    <img src={post.user.profileImageUrl} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    post.user?.username?.substring(0, 1).toUpperCase() || '?'
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div className="font-medium">{post.user?.username || "Unknown User"}</div>
                    <div className="text-xs text-gray-400">{formatTime(post.createdAt)}</div>
                  </div>
                  <div className="text-sm text-gray-300 mt-1">
                    {post.content}
                  </div>
                  
                  {post.imageUrl && (
                    <div className="mt-3 rounded-lg overflow-hidden">
                      <img src={post.imageUrl} alt="Post content" className="w-full h-40 object-cover" />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm text-gray-400">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => likePost(post.id)}
                  className="flex items-center hover:text-primary transition"
                >
                  <HeartIcon className="mr-1 h-4 w-4" />
                  <span>{post.likes}</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center hover:text-primary transition"
                >
                  <MessageCircleIcon className="mr-1 h-4 w-4" />
                  <span>{post.comments}</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center hover:text-primary transition"
                >
                  <ShareIcon className="mr-1 h-4 w-4" />
                  <span>{post.shares}</span>
                </motion.button>
              </div>
            </motion.div>
          ))
        )}
      </AnimatePresence>
      
      {posts.length > 0 && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 text-center text-primary font-medium border border-primary/30 rounded-xl hover:bg-primary/10 transition"
        >
          Load More
        </motion.button>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-surface border-none neon-border">
          <DialogHeader>
            <DialogTitle className="font-rajdhani text-xl">Create New Post</DialogTitle>
            <DialogDescription>
              Share your crypto journey with the community
            </DialogDescription>
          </DialogHeader>
          
          <Textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="What's on your mind?"
            className="bg-background min-h-[120px]"
          />
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreatePost}
              disabled={isSubmitting || !newPostContent.trim()}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              {isSubmitting ? "Posting..." : "Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default SocialFeed;
