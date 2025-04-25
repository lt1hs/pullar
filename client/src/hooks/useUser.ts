import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";

interface User {
  id: number;
  username: string;
  level: number;
  levelProgress: number;
  gameTokens: number;
  tradeTokens: number;
  profileImageUrl?: string;
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  iconClass: string;
  unlocked: boolean;
  unlockedAt?: string;
}

interface Challenge {
  id: number;
  title: string;
  progress: number;
  maxProgress: number;
  completed: boolean;
  challenge?: {
    id: number;
    title: string;
    description: string;
    rewardGameTokens: number;
    rewardTradeTokens: number;
  };
}

interface TradingBot {
  id: number;
  userId: number;
  name: string;
  enabled: boolean;
  strategy: string;
  performance: number;
  wins: number;
  losses: number;
}

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
  socket: WebSocket | null;
  setSocket: (socket: WebSocket | null) => void;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  connect: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      socket: null,
      setUser: (user) => set({ user }),
      setSocket: (socket) => set({ socket }),
      login: async (username, password) => {
        try {
          const response = await apiRequest('POST', '/api/auth/login', { username, password });
          const userData = await response.json();
          set({ user: userData });
          return userData;
        } catch (error) {
          console.error('Login error:', error);
          // For demo purposes, create a mock user if login fails
          const mockUser = {
            id: 1,
            username,
            level: 8,
            levelProgress: 70,
            gameTokens: 2458,
            tradeTokens: 156.3,
            profileImageUrl: ""
          };
          set({ user: mockUser });
          return mockUser;
        }
      },
      logout: () => {
        const { socket } = get();
        if (socket) {
          socket.close();
        }
        set({ user: null, socket: null });
      },
      connect: () => {
        const { user } = get();
        if (!user) return;
        
        try {
          const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
          const wsUrl = `${protocol}//${window.location.host}/ws`;
          const socket = new WebSocket(wsUrl);
          
          socket.onopen = () => {
            socket.send(JSON.stringify({
              type: 'auth',
              userId: user.id
            }));
            set({ socket });
          };
          
          socket.onmessage = (event) => {
            try {
              const data = JSON.parse(event.data);
              
              if (data.type === 'user_update' && data.user) {
                set({ user: data.user });
              }
            } catch (error) {
              console.error('WebSocket message error:', error);
            }
          };
          
          socket.onerror = (error) => {
            console.error('WebSocket error:', error);
          };
          
          socket.onclose = () => {
            set({ socket: null });
          };
        } catch (error) {
          console.error('WebSocket connection error:', error);
        }
      }
    }),
    {
      name: 'user-storage'
    }
  )
);

export const useUser = () => {
  const { user, setUser, login, logout, connect } = useUserStore();
  const queryClient = useQueryClient();
  
  // Loading state
  const [isLoading, setIsLoading] = React.useState(true);
  
  // Initialize demo achievements and challenges
  const achievements = [
    { id: 1, title: "First Trade", description: "Complete your first trade", iconClass: "ri-trophy-line", unlocked: true },
    { id: 2, title: "Top Trader", description: "Achieve 10% profit in a day", iconClass: "ri-vip-crown-line", unlocked: true },
    { id: 3, title: "Mining Pro", description: "Upgrade mining station to level 5", iconClass: "ri-rocket-line", unlocked: false }
  ];
  
  const challenges = [
    { id: 1, title: "Complete 3 trades", progress: 100, maxProgress: 100, completed: true },
    { id: 2, title: "Earn 50 mining tokens", progress: 100, maxProgress: 100, completed: true },
    { id: 3, title: "Share 1 post", progress: 0, maxProgress: 100, completed: false }
  ];
  
  // Initialize demo trading bots
  const userTradingBots = [
    { 
      id: 1, 
      userId: user?.id || 1, 
      name: "DCA Bitcoin", 
      enabled: true, 
      strategy: "dollar_cost_averaging",
      performance: 820, // 8.2%
      wins: 12,
      losses: 4
    },
    { 
      id: 2, 
      userId: user?.id || 1, 
      name: "ETH Swing Trader", 
      enabled: true, 
      strategy: "swing_trading",
      performance: 540, // 5.4%
      wins: 8,
      losses: 2
    }
  ];
  
  // Toggle trading bot status
  const toggleTradingBot = async (botId: number) => {
    try {
      await apiRequest('PATCH', `/api/trading-bots/${botId}/toggle`, {});
      queryClient.invalidateQueries({ queryKey: ['/api/trading-bots', user?.id] });
    } catch (error) {
      console.error('Toggle trading bot error:', error);
    }
  };
  
  // Simulate loading state
  React.useEffect(() => {
    if (user) {
      setIsLoading(false);
    } else {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [user]);
  
  // Fetch user achievements if user exists
  const { data: userAchievements = achievements } = useQuery<Achievement[]>({
    queryKey: ['/api/achievements', user?.id],
    enabled: !!user,
  });
  
  // Fetch user challenges if user exists
  const { data: userChallenges = challenges } = useQuery<Challenge[]>({
    queryKey: ['/api/challenges', user?.id],
    enabled: !!user,
  });
  
  // Fetch user trading bots if user exists
  const { data: tradingBots = userTradingBots } = useQuery<TradingBot[]>({
    queryKey: ['/api/trading-bots', user?.id],
    enabled: !!user,
  });
  
  return {
    user,
    isLoading,
    login,
    logout,
    connect,
    achievements: userAchievements,
    challenges: userChallenges,
    userTradingBots: tradingBots,
    toggleTradingBot
  };
};
