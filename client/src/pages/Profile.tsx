import React, { useEffect } from "react";
import { motion } from "framer-motion";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { useUser } from "@/hooks/useUser";
import { useCrypto } from "@/hooks/useCrypto";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { UserIcon, TrophyIcon, HistoryIcon, SettingsIcon } from "lucide-react";
import { useSocial } from "@/hooks/useSocial";

const Profile: React.FC = () => {
  const { user, achievements, challenges } = useUser();
  const { posts } = useSocial();
  const { cryptos } = useCrypto();
  
  useEffect(() => {
    document.title = "CryptoVerse - Profile";
  }, []);
  
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <h1 className="text-3xl font-bold text-center mb-4 neon-text-primary">CryptoVerse</h1>
        <p className="text-center mb-4">Please login to view your profile</p>
      </div>
    );
  }
  
  const userPosts = posts.filter(post => post.userId === user.id);
  const completedAchievements = achievements.filter(a => a.unlocked).length;
  const totalAchievements = achievements.length;
  const completedChallenges = challenges.filter(c => c.completed).length;
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background pb-20"
    >
      <TopBar />
      
      <main className="mt-16 px-4 py-6">
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-surface-light border-4 border-primary/40 mb-4">
            {user.profileImageUrl ? (
              <img src={user.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-primary text-4xl font-rajdhani">
                {user.username.substring(0, 1).toUpperCase()}
              </div>
            )}
          </div>
          
          <h1 className="text-2xl font-bold neon-text-primary">{user.username}</h1>
          
          <div className="mt-2 flex items-center">
            <Badge variant="default" className="mr-2">Level {user.level}</Badge>
            <Badge variant="secondary">Trader</Badge>
          </div>
          
          <div className="w-full mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Level Progress</span>
              <span>{user.levelProgress}%</span>
            </div>
            <Progress value={user.levelProgress} className="h-2" />
          </div>
        </div>
        
        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="stats" className="data-[state=active]:neon-text-primary">
              <UserIcon className="mr-2 h-4 w-4" />
              Stats
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:neon-text-primary">
              <TrophyIcon className="mr-2 h-4 w-4" />
              Badges
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:neon-text-primary">
              <HistoryIcon className="mr-2 h-4 w-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:neon-text-primary">
              <SettingsIcon className="mr-2 h-4 w-4" />
              Edit
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="stats">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                <Card className="bg-surface border-none neon-border">
                  <CardContent className="pt-6">
                    <h3 className="text-gray-400 text-sm mb-1">Game Tokens</h3>
                    <div className="text-xl font-bold neon-text-primary">{user.gameTokens}</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-surface border-none neon-border">
                  <CardContent className="pt-6">
                    <h3 className="text-gray-400 text-sm mb-1">Trade Tokens</h3>
                    <div className="text-xl font-bold neon-text-secondary">{user.tradeTokens}</div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={itemVariants} className="neon-border rounded-xl bg-surface p-4">
                <h3 className="font-medium mb-3">Stats</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Mining Level</span>
                    <span className="font-medium">Level 3</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Posts</span>
                    <span className="font-medium">{userPosts.length}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Achievements</span>
                    <span className="font-medium">{completedAchievements}/{totalAchievements}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Challenges</span>
                    <span className="font-medium">{completedChallenges}/{challenges.length}</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="achievements">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3">
                {achievements.map((achievement, index) => (
                  <Card key={achievement.id} className={`bg-surface border-none ${achievement.unlocked ? 'neon-border' : 'border border-gray-700'}`}>
                    <CardContent className="pt-4 pb-4 flex flex-col items-center justify-center">
                      <div className={`w-12 h-12 rounded-full ${achievement.unlocked ? `bg-${index % 2 === 0 ? 'primary' : 'secondary'}/20` : 'bg-gray-700/20'} flex items-center justify-center mb-2 ${!achievement.unlocked && 'grayscale opacity-50'}`}>
                        <i className={`${achievement.iconClass} ${achievement.unlocked ? index % 2 === 0 ? 'text-primary' : 'text-secondary' : 'text-gray-500'}`}></i>
                      </div>
                      <div className="text-xs text-center font-medium">
                        {achievement.title}
                      </div>
                      {!achievement.unlocked && (
                        <Badge variant="outline" className="mt-2 text-xs">Locked</Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="history">
            <Card className="bg-surface border-none">
              <CardContent className="pt-6">
                <h3 className="font-medium mb-4">Trading History</h3>
                
                {cryptos.length > 0 ? (
                  <div className="space-y-3">
                    {cryptos.slice(0, 3).map((crypto, index) => (
                      <div key={crypto.id} className="flex items-center justify-between bg-background p-3 rounded-lg">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full bg-${index % 2 === 0 ? 'primary' : 'secondary'}/20 flex items-center justify-center mr-2`}>
                            <i className={`${crypto.iconClass} ${index % 2 === 0 ? 'text-primary' : 'text-secondary'}`}></i>
                          </div>
                          <div>
                            <div className="font-medium">{crypto.symbol}</div>
                            <div className="text-xs text-gray-400">Bought 0.5</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${(crypto.currentPrice / 200).toFixed(2)}</div>
                          <div className="text-xs text-gray-400">12h ago</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-400">
                    No trading history yet
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card className="bg-surface border-none">
              <CardContent className="pt-6">
                <h3 className="font-medium mb-4">Profile Settings</h3>
                
                <div className="text-center py-6 text-gray-400">
                  Profile editing coming soon
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <BottomNav />
    </motion.div>
  );
};

export default Profile;
