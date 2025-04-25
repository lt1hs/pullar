import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import DashboardSummary from "@/components/DashboardSummary";
import MiningSection from "@/components/MiningSection";
import MarketSection from "@/components/MarketSection";
import SocialFeed from "@/components/SocialFeed";
import TradingBot from "@/components/TradingBot";
import Achievements from "@/components/Achievements";
import DailyTasks from "@/components/DailyTasks";
import Wallet from "@/components/Wallet";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  BarChart4, 
  Wallet as WalletIcon, 
  UserCircle, 
  Settings, 
  MessageCircle, 
  TrendingUp, 
  CheckCircle, 
  Bot,
  LayoutGrid,
  ChevronRight
} from "lucide-react";

const Home: React.FC = () => {
  const { user, isLoading, achievements, challenges, userTradingBots, toggleTradingBot } = useUser();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  
  useEffect(() => {
    document.title = "CryptoVerse - Home";
  }, []);
  
  // App icons with badges for the home screen
  const appIcons = [
    {
      name: "Trade",
      icon: <TrendingUp className="h-6 w-6" />,
      path: "/trade",
      badge: 3
    },
    {
      name: "Wallet",
      icon: <WalletIcon className="h-6 w-6" />,
      path: "/wallet",
      badge: 1
    },
    {
      name: "Bots",
      icon: <Bot className="h-6 w-6" />,
      path: "/bots",
      badge: 0
    },
    {
      name: "Profile",
      icon: <UserCircle className="h-6 w-6" />,
      path: "/profile",
      badge: 0
    },
    {
      name: "Social",
      icon: <MessageCircle className="h-6 w-6" />,
      path: "/social",
      badge: 5
    },
    {
      name: "Tasks",
      icon: <CheckCircle className="h-6 w-6" />,
      path: "/tasks",
      badge: 4
    },
    {
      name: "Mining",
      icon: <BarChart4 className="h-6 w-6" />,
      path: "/mining",
      badge: 2
    },
    {
      name: "Settings",
      icon: <Settings className="h-6 w-6" />,
      path: "/settings",
      badge: 0
    }
  ];
  
  const handleConfigureBot = () => {
    toast({
      title: "Trading Bot",
      description: "Bot configuration feature coming soon!",
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Spinner className="h-12 w-12 text-primary" />
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <h1 className="text-3xl font-bold text-center mb-4 neon-text-primary">CryptoVerse</h1>
        <p className="text-center mb-4">Please login to access your dashboard</p>
      </div>
    );
  }
  
  // Extract trading bot data for the component
  const activeBot = userTradingBots[0] || {
    id: 0,
    performance: 14.8,
    wins: 12,
    losses: 4,
    enabled: true
  };
  
  const activeStrategies = userTradingBots.map(bot => ({
    id: bot.id,
    name: bot.name,
    performance: bot.performance / 100, // Convert from basis points to percentage
    icon: bot.strategy === 'dollar_cost_averaging' ? 'ri-robot-line' : 'ri-robot-line'
  }));
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background pb-20"
    >
      <TopBar />
      
      <main className="mt-16 px-4 pb-4">
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="dashboard" className="data-[state=active]:neon-text-primary">
              <LayoutGrid className="mr-2 h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="apps" className="data-[state=active]:neon-text-primary">
              <LayoutGrid className="mr-2 h-4 w-4" />
              Apps
            </TabsTrigger>
            <TabsTrigger value="widgets" className="data-[state=active]:neon-text-primary">
              <LayoutGrid className="mr-2 h-4 w-4" />
              Widgets
            </TabsTrigger>
          </TabsList>
          
          {/* Dashboard Tab - Shows original components */}
          <TabsContent value="dashboard">
            <DashboardSummary />
            {/* Temporarily commented until components are fully functional */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <DailyTasks />
              <Wallet />
            </div> */}
            <MiningSection />
            <MarketSection />
            <SocialFeed />
            
            <TradingBot 
              performance={activeBot.performance / 100} // Convert from basis points to percentage
              wins={activeBot.wins}
              losses={activeBot.losses}
              isEnabled={activeBot.enabled}
              onToggle={() => toggleTradingBot(activeBot.id)}
              strategies={activeStrategies.length ? activeStrategies : [
                { id: 1, name: "DCA Bitcoin", performance: 8.2, icon: "ri-robot-line" },
                { id: 2, name: "ETH Swing Trader", performance: 5.4, icon: "ri-robot-line" }
              ]}
              onConfigure={handleConfigureBot}
            />
            
            <Achievements 
              achievements={achievements} 
              challenges={challenges}
            />
          </TabsContent>
          
          {/* Apps Tab - Shows app icons in a grid */}
          <TabsContent value="apps">
            <div className="grid grid-cols-4 gap-4">
              {appIcons.map((app, index) => (
                <Link key={index} href={app.path} style={{textDecoration: "none"}}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: index * 0.05 } }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center justify-center p-4 bg-surface rounded-xl neon-border cursor-pointer relative"
                  >
                    <div className="p-3 bg-background rounded-full mb-2 text-primary">
                      {app.icon}
                    </div>
                    <span className="text-sm font-medium">{app.name}</span>
                    
                    {app.badge > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-primary text-primary-foreground text-xs font-bold rounded-full">
                        {app.badge}
                      </span>
                    )}
                  </motion.div>
                </Link>
              ))}
            </div>
            
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0, transition: { delay: item * 0.1 } }}
                    className="p-3 bg-surface rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div className="p-2 bg-background rounded-full mr-3">
                        <TrendingUp className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">New Achievement Unlocked</h3>
                        <p className="text-xs text-muted-foreground">30 minutes ago</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          {/* Widgets Tab - Shows customizable widgets */}
          <TabsContent value="widgets">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* <DailyTasks /> */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-surface rounded-xl neon-border overflow-hidden"
              >
                <div className="p-4 bg-gradient-to-r from-primary to-secondary">
                  <h2 className="text-lg font-bold text-primary-foreground">Portfolio Value</h2>
                  <p className="text-primary-foreground/80 text-sm">Last 30 days</p>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-bold">$24,561.85</h3>
                    <Badge className="bg-green-600">+14.5%</Badge>
                  </div>
                  
                  <div className="h-32 w-full flex items-end space-x-1">
                    {Array.from({ length: 30 }).map((_, i) => {
                      const height = 20 + Math.random() * 80;
                      return (
                        <div
                          key={i}
                          className="flex-1 bg-primary/20 rounded-t"
                          style={{ height: `${height}%` }}
                        ></div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <Card className="bg-surface border-none neon-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Mining Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold neon-text-primary">23.5 GCC/hr</div>
                  <div className="text-xs text-muted-foreground">+5% from yesterday</div>
                </CardContent>
              </Card>
              
              <Card className="bg-surface border-none neon-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Total Mined</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold neon-text-primary">1,245 GCC</div>
                  <div className="text-xs text-muted-foreground">Since you started</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <BottomNav />
    </motion.div>
  );
};

export default Home;
