import { create } from "zustand";
import { apiRequest } from "@/lib/queryClient";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";

interface MiningStation {
  id: number;
  userId: number;
  level: number;
  power: number;
  lastCollectedAt: string;
}

interface MiningStore {
  miningProgress: number;
  setMiningProgress: (progress: number) => void;
  updateMiningProgress: () => void;
}

export const useMiningStore = create<MiningStore>((set, get) => ({
  miningProgress: 0,
  setMiningProgress: (progress) => set({ miningProgress: progress }),
  updateMiningProgress: () => {
    const miningInterval = setInterval(() => {
      set((state) => {
        const newProgress = (state.miningProgress + 1) % 100;
        return { miningProgress: newProgress };
      });
    }, 1000);
    
    return () => clearInterval(miningInterval);
  },
}));

export const useMining = () => {
  const { miningProgress, setMiningProgress, updateMiningProgress } = useMiningStore();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { toast } = useToast();
  
  // Update mining progress continuously
  React.useEffect(() => {
    const cleanup = updateMiningProgress();
    return cleanup;
  }, [updateMiningProgress]);
  
  // Fetch mining station
  const { data: miningStation } = useQuery<MiningStation>({
    queryKey: ['/api/mining', user?.id],
    enabled: !!user,
  });
  
  // Calculate tokens to collect based on time elapsed
  const calculateTokensToCollect = () => {
    if (!miningStation) return 0;
    
    const now = new Date();
    const lastCollected = new Date(miningStation.lastCollectedAt);
    const hoursPassed = (now.getTime() - lastCollected.getTime()) / (1000 * 60 * 60);
    const tokensPerHour = miningStation.power;
    return Math.floor(hoursPassed * tokensPerHour);
  };
  
  // Collect tokens mutation
  const collectMutation = useMutation({
    mutationFn: async () => {
      if (!user || !miningStation) throw new Error("User or mining station not found");
      
      const response = await apiRequest('POST', `/api/mining/${user.id}/collect`, {});
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/mining', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['/api/users', user?.id] });
      
      toast({
        title: "Tokens collected",
        description: `You collected ${data.tokensMined} game tokens`,
      });
      
      // Reset mining progress
      setMiningProgress(0);
    },
    onError: (error) => {
      toast({
        title: "Collection failed",
        description: error.message || "Failed to collect tokens",
        variant: "destructive",
      });
    },
  });
  
  // Upgrade mutation
  const upgradeMutation = useMutation({
    mutationFn: async () => {
      if (!user || !miningStation) throw new Error("User or mining station not found");
      
      const response = await apiRequest('POST', `/api/mining/${user.id}/upgrade`, {});
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/mining', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['/api/users', user?.id] });
      
      toast({
        title: "Mining station upgraded",
        description: `Mining station is now level ${data.station.level}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Upgrade failed",
        description: error.message || "Failed to upgrade mining station",
        variant: "destructive",
      });
    },
  });
  
  // Boost mining (simulated)
  const boostMutation = useMutation({
    mutationFn: async () => {
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { success: true };
    },
    onSuccess: () => {
      // Increase mining progress
      setMiningProgress(Math.min(miningProgress + 15, 99));
      
      toast({
        title: "Mining boosted",
        description: "Mining speed temporarily increased",
      });
    },
  });
  
  return {
    miningStation,
    miningProgress,
    tokensToCollect: calculateTokensToCollect(),
    collectTokens: collectMutation.mutate,
    isCollecting: collectMutation.isPending,
    upgradeMiningStation: upgradeMutation.mutate,
    isUpgrading: upgradeMutation.isPending,
    boostMining: boostMutation.mutate,
    isBoosting: boostMutation.isPending,
  };
};
