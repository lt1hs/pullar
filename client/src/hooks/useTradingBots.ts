import { useState, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/hooks/use-toast";

interface TradingBot {
  id: number;
  userId: number;
  name: string;
  enabled: boolean;
  strategy: string;
  performance?: number;
  wins?: number;
  losses?: number;
}

interface CreateBotData {
  userId: number;
  name: string;
  strategy: string;
  enabled: boolean;
}

export const useTradingBots = () => {
  const { user } = useUser();
  const { toast } = useToast();
  
  const [bots, setBots] = useState<TradingBot[]>([
    {
      id: 1,
      userId: 1,
      name: "DCA Bitcoin",
      strategy: "dollar_cost_averaging",
      enabled: true,
      performance: 820, // basis points
      wins: 15,
      losses: 4
    },
    {
      id: 2,
      userId: 1,
      name: "ETH Swing Trader",
      strategy: "swing_trading",
      enabled: false,
      performance: 540, // basis points
      wins: 9,
      losses: 7
    }
  ]);
  
  const [isLoadingBots, setIsLoadingBots] = useState(false);
  const [isTogglingBot, setIsTogglingBot] = useState(false);
  const [isCreatingBot, setIsCreatingBot] = useState(false);
  
  const toggleBot = async (botId: number) => {
    setIsTogglingBot(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setBots(bots.map(bot => {
        if (bot.id === botId) {
          return { ...bot, enabled: !bot.enabled };
        }
        return bot;
      }));
      
      toast({
        title: "Bot status updated",
        description: "The bot has been toggled successfully",
      });
    } catch (error) {
      toast({
        title: "Error updating bot",
        description: "Failed to update the bot status",
        variant: "destructive",
      });
    } finally {
      setIsTogglingBot(false);
    }
  };
  
  const createBot = async (botData: CreateBotData) => {
    setIsCreatingBot(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newBot: TradingBot = {
        ...botData,
        id: bots.length + 1,
        performance: Math.floor(Math.random() * 1000),
        wins: Math.floor(Math.random() * 10) + 5,
        losses: Math.floor(Math.random() * 5) + 2
      };
      
      setBots([...bots, newBot]);
      
      toast({
        title: "Bot created",
        description: "Your new trading bot has been created",
      });
    } catch (error) {
      toast({
        title: "Error creating bot",
        description: "Failed to create the trading bot",
        variant: "destructive",
      });
    } finally {
      setIsCreatingBot(false);
    }
  };
  
  return {
    bots,
    isLoadingBots,
    toggleBot,
    isTogglingBot,
    createBot,
    isCreatingBot,
  };
};
