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
  LayoutGrid
} from "lucide-react";

const Home: React.FC = () => {
  const { user, isLoading, achievements, challenges, userTradingBots, toggleTradingBot } = useUser();
  const { toast } = useToast();
  
  useEffect(() => {
    document.title = "CryptoVerse - Home";
  }, []);
  
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
      
      <main className="mt-16 pb-4">
        <DashboardSummary />
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
      </main>
      
      <BottomNav />
    </motion.div>
  );
};

export default Home;
