import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { useUser } from "@/hooks/useUser";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Bell, 
  TrendingUp, 
  Sparkles,
  MessageCircle,
  Heart,
  Share,
  Search
} from "lucide-react";

const Social: React.FC = () => {
  const { user } = useUser();
  
  useEffect(() => {
    document.title = "CryptoVerse - Social Network";
  }, []);
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background pb-20"
    >
      <TopBar />
      
      <main className="mt-16 px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-rajdhani font-bold text-2xl">Social Network</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8" aria-label="Search">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 relative" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 bg-primary h-4 w-4 rounded-full text-[10px] flex items-center justify-center text-primary-foreground">
                3
              </span>
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="feed" className="mb-6">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="feed" className="data-[state=active]:neon-text-primary">
              <Sparkles className="mr-2 h-4 w-4" />
              Feed
            </TabsTrigger>
            <TabsTrigger value="discover" className="data-[state=active]:neon-text-primary">
              <Users className="mr-2 h-4 w-4" />
              Discover
            </TabsTrigger>
            <TabsTrigger value="trending" className="data-[state=active]:neon-text-primary">
              <TrendingUp className="mr-2 h-4 w-4" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:neon-text-primary">
              <Bell className="mr-2 h-4 w-4" />
              Notifs
            </TabsTrigger>
          </TabsList>
          
          {/* Feed Tab */}
          <TabsContent value="feed">
            <Card className="bg-surface border-none neon-border mb-6">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {user?.username?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <Input 
                      placeholder="What's happening in the crypto world?"
                      className="mb-3 bg-surface-light"
                    />
                    
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="text-xs">
                          Image
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs">
                          Tag
                        </Button>
                      </div>
                      
                      <Button 
                        size="sm"
                        className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                      >
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Sample post */}
            <Card className="bg-surface border-none neon-border overflow-hidden mb-4">
              <CardContent className="pt-6">
                <div className="flex gap-3 mb-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary/20 text-primary">CW</AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium">CryptoWhale</span>
                      <Badge className="ml-1 h-4 px-1 bg-primary">
                        <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">30 minutes ago</p>
                  </div>
                </div>
                
                <p className="mb-4">Just made 500 GCC from my new trading strategy! Anyone else seeing success with the swing trading approach?</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-sm">❤️</span>
                    <span className="text-sm">👍</span>
                    <span className="text-xs text-muted-foreground ml-1">24</span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>5 comments</span>
                    <span>2 shares</span>
                  </div>
                </div>
                
                <div className="flex mt-3 pt-3 border-t border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 flex items-center justify-center"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Like
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 flex items-center justify-center"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Comment
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 flex items-center justify-center"
                  >
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Another sample post */}
            <Card className="bg-surface border-none neon-border overflow-hidden">
              <CardContent className="pt-6">
                <div className="flex gap-3 mb-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary/20 text-primary">MP</AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium">MiningPro</span>
                    </div>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                
                <p className="mb-4">Just upgraded my mining rig! Now getting 45 H/s with minimal power consumption. The new cooling system really helps!</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-sm">👍</span>
                    <span className="text-xs text-muted-foreground ml-1">18</span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>3 comments</span>
                    <span>1 share</span>
                  </div>
                </div>
                
                <div className="flex mt-3 pt-3 border-t border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 flex items-center justify-center"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Like
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 flex items-center justify-center"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Comment
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 flex items-center justify-center"
                  >
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Other tabs would be implemented here */}
          <TabsContent value="discover">
            <Card className="bg-surface border-none neon-border p-6">
              <h2 className="text-xl font-bold mb-4">Discover functionality coming soon!</h2>
              <p>This tab will show suggested users and communities to follow.</p>
            </Card>
          </TabsContent>
          
          <TabsContent value="trending">
            <Card className="bg-surface border-none neon-border p-6">
              <h2 className="text-xl font-bold mb-4">Trending functionality coming soon!</h2>
              <p>This tab will show trending topics and popular posts.</p>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card className="bg-surface border-none neon-border p-6">
              <h2 className="text-xl font-bold mb-4">Notifications functionality coming soon!</h2>
              <p>This tab will show your recent notifications and activity updates.</p>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <BottomNav />
    </motion.div>
  );
};

export default Social;
