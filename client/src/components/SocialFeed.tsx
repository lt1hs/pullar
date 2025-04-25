import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSocial } from "@/hooks/useSocial";
import { useUser } from "@/hooks/useUser";
import { Comment as CommentType } from "@/hooks/useSocial";
import { 
  HeartIcon, 
  MessageCircleIcon, 
  ShareIcon, 
  ImageIcon, 
  XIcon, 
  TrendingUpIcon, 
  SendIcon,
  SmileIcon,
  ChevronDownIcon,
  RocketIcon,
  ZapIcon,
  ThumbsUpIcon,
  ThumbsDownIcon
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";

// Emoji picker component for post reactions
const EmojiPicker = ({ onEmojiSelect }: { onEmojiSelect: (emoji: string) => void }) => {
  const emojis = [
    { icon: <ThumbsUpIcon className="h-5 w-5" />, name: "👍" },
    { icon: <HeartIcon className="h-5 w-5" />, name: "❤️" },
    { icon: <RocketIcon className="h-5 w-5" />, name: "🚀" },
    { icon: <ZapIcon className="h-5 w-5" />, name: "⚡" },
    { icon: <ThumbsDownIcon className="h-5 w-5" />, name: "👎" },
    { icon: <SmileIcon className="h-5 w-5" />, name: "😄" }
  ];
  
  return (
    <div className="flex flex-wrap gap-2 p-2">
      {emojis.map((emoji, index) => (
        <motion.button
          key={index}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 hover:bg-primary/10 rounded-full"
          onClick={() => onEmojiSelect(emoji.name)}
        >
          {emoji.icon}
        </motion.button>
      ))}
    </div>
  );
};

// Comment component
const Comment = ({ comment }: { comment: Comment }) => {
  return (
    <div className="flex items-start mb-3 pl-10">
      <div className="w-8 h-8 rounded-full overflow-hidden mr-2 bg-surface-light flex items-center justify-center text-primary border border-primary/30 flex-shrink-0">
        {comment.user?.profileImageUrl ? (
          <img src={comment.user.profileImageUrl} alt="User" className="w-full h-full object-cover" />
        ) : (
          comment.user?.username?.substring(0, 1).toUpperCase() || '?'
        )}
      </div>
      <div className="flex-1 bg-surface-light p-2 rounded-lg text-sm">
        <div className="font-medium text-xs">{comment.user?.username || "Unknown User"}</div>
        <div className="text-xs mt-1">{comment.content}</div>
      </div>
    </div>
  );
};

const SocialFeed: React.FC = () => {
  const { posts, likePost, createPost, addComment } = useSocial();
  const { user } = useUser();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [postImage, setPostImage] = useState<File | null>(null);
  const [postImagePreview, setPostImagePreview] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const [feedFilter, setFeedFilter] = useState("all"); // 'all', 'popular', 'following'
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Tags for posts
  const availableTags = [
    { id: "bitcoin", label: "Bitcoin" },
    { id: "ethereum", label: "Ethereum" },
    { id: "altcoin", label: "Altcoin" },
    { id: "defi", label: "DeFi" },
    { id: "nft", label: "NFT" },
    { id: "trading", label: "Trading" },
    { id: "mining", label: "Mining" }
  ];
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPostImage(file);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setPostImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveImage = () => {
    setPostImage(null);
    setPostImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const handleTagToggle = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };
  
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
      // In a real app, we'd upload the image and get the URL
      const imageUrl = postImagePreview ? "https://example.com/demo-image.jpg" : null;
      
      await createPost({
        userId: user.id,
        content: newPostContent,
        imageUrl: imageUrl,
        tags: selectedTags
      });
      
      setNewPostContent("");
      setPostImage(null);
      setPostImagePreview(null);
      setSelectedTags([]);
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
  
  const handleAddComment = (postId: number) => {
    if (!commentText.trim() || !user) return;
    
    addComment({
      postId,
      userId: user.id,
      content: commentText
    });
    
    setCommentText("");
  };
  
  const toggleExpandPost = (postId: number) => {
    if (expandedPost === postId) {
      setExpandedPost(null);
    } else {
      setExpandedPost(postId);
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
      
      {/* Feed filters */}
      <Tabs defaultValue="all" className="mb-4" onValueChange={setFeedFilter}>
        <TabsList className="w-full bg-surface-light">
          <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
          <TabsTrigger value="popular" className="flex-1">Popular</TabsTrigger>
          <TabsTrigger value="following" className="flex-1">Following</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <AnimatePresence>
        {posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-6 text-gray-400"
          >
            <i className="ri-ghost-line text-5xl mb-2 block text-primary/40"></i>
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
                  
                  {/* Post tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {post.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs py-0 px-2 border-primary/30">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {post.imageUrl && (
                    <motion.div 
                      className="mt-3 rounded-lg overflow-hidden"
                      whileHover={{ scale: 1.01 }}
                    >
                      <img src={post.imageUrl} alt="Post content" className="w-full h-40 object-cover" />
                    </motion.div>
                  )}
                </div>
              </div>
              
              {/* Reactions area */}
              <div className="flex justify-between items-center text-sm text-gray-400 mb-3 border-t border-b border-gray-800 py-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center hover:text-primary transition"
                    >
                      <HeartIcon className="mr-1 h-4 w-4" />
                      <span>{post.likes}</span>
                    </motion.button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <EmojiPicker onEmojiSelect={(emoji) => likePost(post.id, emoji)} />
                  </PopoverContent>
                </Popover>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleExpandPost(post.id)}
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
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center hover:text-primary transition"
                >
                  <TrendingUpIcon className="mr-1 h-4 w-4" />
                  <span>{Math.floor(Math.random() * 50)}%</span>
                </motion.button>
              </div>
              
              {/* Comments section */}
              <AnimatePresence>
                {expandedPost === post.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {post.commentsList && post.commentsList.length > 0 ? (
                      <div className="mb-3">
                        {post.commentsList.map((comment) => (
                          <Comment key={comment.id} comment={comment} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500 text-center py-2 mb-3">
                        No comments yet. Be the first to comment!
                      </div>
                    )}
                    
                    <div className="flex items-center">
                      <Input 
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment..."
                        className="bg-surface-light border-primary/30 text-sm rounded-r-none"
                      />
                      <Button 
                        size="sm"
                        className="rounded-l-none h-10" 
                        onClick={() => handleAddComment(post.id)}
                      >
                        <SendIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
      
      {/* Create post dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-surface border-none neon-border max-w-md">
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
          
          {/* Tags selection */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Add tags</label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <Badge 
                  key={tag.id}
                  variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleTagToggle(tag.id)}
                >
                  #{tag.label}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Image upload */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400 mb-2 block">Add image</label>
            
            {postImagePreview ? (
              <div className="relative">
                <img 
                  src={postImagePreview} 
                  alt="Preview" 
                  className="rounded-md max-h-40 w-full object-cover" 
                />
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2 w-8 h-8"
                  onClick={handleRemoveImage}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div 
                className="border-2 border-dashed border-primary/30 rounded-md p-8 text-center cursor-pointer hover:bg-primary/5 transition"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-400">Click to upload an image</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  hidden 
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            )}
          </div>
          
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
