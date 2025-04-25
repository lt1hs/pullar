import { useState, useEffect, useCallback } from 'react';
import { create } from 'zustand';

// Mining store for global state
interface MiningStore {
  miningProgress: number;
  setMiningProgress: (progress: number) => void;
  updateMiningProgress: () => void;
}

export const useMiningStore = create<MiningStore>((set, get) => ({
  miningProgress: 0,
  setMiningProgress: (progress) => set({ miningProgress: progress }),
  updateMiningProgress: () => {
    const currentProgress = get().miningProgress;
    const increment = Math.random() * 5 + 5; // 5-10% increment
    const newProgress = Math.min(100, currentProgress + increment);
    set({ miningProgress: newProgress });
  },
}));

// Hook for mining functionality
export const useMining = () => {
  const { miningProgress, setMiningProgress, updateMiningProgress } = useMiningStore();
  
  return {
    miningProgress,
    setMiningProgress,
    updateMiningProgress,
  };
};
