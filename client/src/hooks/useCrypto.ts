import { create } from "zustand";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface Crypto {
  id: number;
  symbol: string;
  name: string;
  currentPrice: number;
  change24h: number;
  iconClass: string;
}

interface Holding {
  id: number;
  userId: number;
  cryptoId: number;
  amount: number;
  crypto?: Crypto;
}

interface CryptoStore {
  selectedCrypto: Crypto | null;
  portfolioValue: number;
  portfolioChange: number;
  tradeCrypto: (crypto: Crypto) => void;
  resetSelectedCrypto: () => void;
  setPortfolioData: (value: number, change: number) => void;
}

export const useCryptoStore = create<CryptoStore>((set) => ({
  selectedCrypto: null,
  portfolioValue: 8245.36,
  portfolioChange: 12.4,
  tradeCrypto: (crypto) => set({ selectedCrypto: crypto }),
  resetSelectedCrypto: () => set({ selectedCrypto: null }),
  setPortfolioData: (value, change) => set({ portfolioValue: value, portfolioChange: change }),
}));

export const useCrypto = () => {
  const { selectedCrypto, portfolioValue, portfolioChange, tradeCrypto, resetSelectedCrypto } = useCryptoStore();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Fetch cryptos
  const { data: cryptos = [] } = useQuery<Crypto[]>({
    queryKey: ['/api/cryptos'],
    staleTime: 30000, // 30 seconds
  });
  
  // Fetch holdings for a user
  const useHoldings = (userId?: number) => {
    return useQuery<Holding[]>({
      queryKey: ['/api/holdings', userId],
      enabled: !!userId,
    });
  };
  
  // Trade mutation
  const tradeMutation = useMutation({
    mutationFn: async ({ userId, cryptoId, action, amount }: { userId: number, cryptoId: number, action: 'buy' | 'sell', amount: number }) => {
      const response = await apiRequest('POST', '/api/trade', { userId, cryptoId, action, amount });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/holdings'] });
      
      toast({
        title: "Trade successful",
        description: "Your trade has been executed",
      });
    },
    onError: (error) => {
      toast({
        title: "Trade failed",
        description: error.message || "An error occurred during your trade",
        variant: "destructive",
      });
    },
  });
  
  // Calculate portfolio value from holdings
  const calculatePortfolioValue = (holdings: Holding[]) => {
    return holdings.reduce((total, holding) => {
      if (holding.crypto) {
        return total + (holding.amount * holding.crypto.currentPrice / 100);
      }
      return total;
    }, 0);
  };
  
  return {
    cryptos,
    selectedCrypto,
    portfolioValue,
    portfolioChange,
    tradeCrypto,
    resetSelectedCrypto,
    useHoldings,
    trade: tradeMutation.mutate,
    isTrading: tradeMutation.isPending,
    calculatePortfolioValue,
  };
};
