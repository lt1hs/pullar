import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { useCrypto } from "@/hooks/useCrypto";
import { useUser } from "@/hooks/useUser";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { NeonButton } from "@/components/ui/neon-button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpIcon, ArrowDownIcon, BarChart2Icon, WalletIcon, TrendingUpIcon, ArrowRightIcon, RefreshCwIcon, MoreHorizontalIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface PortfolioViewProps {
  userId: number;
}

const PortfolioView: React.FC<PortfolioViewProps> = ({ userId }) => {
  const { useHoldings, calculatePortfolioValue, tradeCrypto } = useCrypto();
  const { data: holdings = [], isLoading } = useHoldings(userId);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const portfolioValue = calculatePortfolioValue(holdings);
  
  // Simulate portfolio change for now (would be calculated from historical data in a real app)
  const portfolioChange = Math.random() * 20 - 10; // Random between -10% and +10%
  const isPositiveChange = portfolioChange >= 0;

  const handleRefresh = () => {
    setIsRefreshing(true);
    // In a real app this would refresh the portfolio data
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full rounded-xl bg-surface-light" />
        <Skeleton className="h-12 w-full rounded-xl bg-surface-light" />
        <Skeleton className="h-20 w-full rounded-xl bg-surface-light" />
        <Skeleton className="h-20 w-full rounded-xl bg-surface-light" />
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <Card className="bg-surface border-none neon-border">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-gray-400 text-sm">Portfolio value</p>
              <div className="text-3xl font-bold neon-text-primary mt-1">
                ${portfolioValue.toFixed(2)}
              </div>
            </div>
            <div className="text-right">
              <div className={`text-sm ${isPositiveChange ? 'text-green-500' : 'text-red-500'}`}>
                {isPositiveChange ? '+' : ''}{portfolioChange.toFixed(2)}%
              </div>
              <div className="text-xs text-gray-400 mt-1">24h change</div>
            </div>
          </div>
          
          <div className="h-12 w-full relative">
            <svg width="100%" height="100%" viewBox="0 0 300 50" preserveAspectRatio="none">
              <path 
                className="chart-line" 
                style={{ stroke: isPositiveChange ? 'hsl(var(--primary))' : 'hsl(var(--secondary))' }} 
                d={isPositiveChange 
                  ? "M0,40 C20,35 40,20 60,25 C80,30 100,10 120,5 C140,0 160,15 180,10 C200,5 220,15 240,10 C260,5 280,25 300,20"
                  : "M0,10 C20,15 40,30 60,25 C80,20 100,40 120,45 C140,50 160,35 180,40 C200,45 220,35 240,40 C260,45 280,25 300,30"
                }
              />
            </svg>
          </div>
          
          <div className="flex justify-between mt-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-xs gap-1"
            >
              <RefreshCwIcon className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs gap-1"
            >
              <MoreHorizontalIcon className="h-3 w-3" />
              Details
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {holdings.length === 0 ? (
        <div className="text-center py-8 bg-surface rounded-xl neon-border">
          <WalletIcon className="h-10 w-10 mx-auto text-gray-500 mb-3" />
          <p className="text-gray-400 mb-4">You don't own any assets yet</p>
          <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
            Start Trading
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-medium text-sm">Your Assets</h3>
            <Badge variant="outline" className="text-xs">
              {holdings.length} {holdings.length === 1 ? 'asset' : 'assets'}
            </Badge>
          </div>
          
          {holdings.map((holding) => {
            if (!holding.crypto) return null;
            
            const value = holding.amount * holding.crypto.currentPrice / 100;
            const isPositive = holding.crypto.change24h > 0;
            
            return (
              <motion.div
                key={holding.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="neon-border rounded-xl bg-surface p-4"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full bg-${isPositive ? 'primary' : 'secondary'}/20 flex items-center justify-center mr-3`}>
                      <i className={holding.crypto.iconClass + (isPositive ? ' text-primary' : ' text-secondary')}></i>
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium mr-2">{holding.crypto.symbol}</h3>
                        <Badge variant={isPositive ? "default" : "secondary"} className="text-xs">
                          {isPositive ? '+' : ''}{(holding.crypto.change24h / 100).toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-400">
                        {holding.amount} {holding.crypto.symbol} ≈ ${value.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => tradeCrypto(holding.crypto!)}
                  >
                    <ArrowRightIcon className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const Trade: React.FC = () => {
  const { cryptos, trade, isTrading, selectedCrypto, tradeCrypto, resetSelectedCrypto } = useCrypto();
  const { user } = useUser();
  const { toast } = useToast();
  const [amount, setAmount] = useState(1);
  const [tradeAction, setTradeAction] = useState<'buy' | 'sell'>('buy');
  const [showTradeModal, setShowTradeModal] = useState(false);
  
  useEffect(() => {
    document.title = "CryptoVerse - Trade";
  }, []);
  
  const handleTradeClick = (crypto: any) => {
    tradeCrypto(crypto);
    setShowTradeModal(true);
  };
  
  const handleTradeConfirm = () => {
    if (!user || !selectedCrypto) return;
    
    // Calculate token cost
    const tokenCost = Math.ceil(amount * (selectedCrypto.currentPrice / 10000)) / 10;
    
    if (tradeAction === 'buy' && user.tradeTokens < tokenCost) {
      toast({
        title: "Insufficient tokens",
        description: `You need ${tokenCost} trade tokens for this transaction`,
        variant: "destructive"
      });
      return;
    }
    
    trade({
      userId: user.id,
      cryptoId: selectedCrypto.id,
      action: tradeAction,
      amount
    });
    
    // Close modal
    setShowTradeModal(false);
    resetSelectedCrypto();
    setAmount(1);
  };
  
  const closeTradeModal = () => {
    setShowTradeModal(false);
    resetSelectedCrypto();
    setAmount(1);
  };
  
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
        <h1 className="font-rajdhani font-bold text-2xl mb-4">Trading Market</h1>
        
        <Tabs defaultValue="market" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="market" className="data-[state=active]:neon-text-primary">
              <BarChart2Icon className="mr-2 h-4 w-4" />
              Market
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="data-[state=active]:neon-text-primary">
              <WalletIcon className="mr-2 h-4 w-4" />
              Portfolio
            </TabsTrigger>
            <TabsTrigger value="watchlist" className="data-[state=active]:neon-text-primary">
              <TrendingUpIcon className="mr-2 h-4 w-4" />
              Watchlist
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="market">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {cryptos.map((crypto, index) => {
                const isPositive = crypto.change24h > 0;
                const changePercent = (crypto.change24h / 100).toFixed(1);
                const price = (crypto.currentPrice / 100).toFixed(2);
                
                return (
                  <motion.div
                    key={crypto.id}
                    variants={itemVariants}
                    className="neon-border rounded-xl bg-surface p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full bg-${isPositive ? 'primary' : 'secondary'}/20 flex items-center justify-center mr-3`}>
                          <i className={crypto.iconClass + (isPositive ? ' text-primary' : ' text-secondary')}></i>
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium mr-2">{crypto.symbol}</h3>
                            <Badge variant={isPositive ? "default" : "secondary"} className="text-xs">
                              {isPositive ? '+' : ''}{changePercent}%
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-400">{crypto.name}</div>
                        </div>
                      </div>
                      <div className="text-lg font-bold font-rajdhani">${price}</div>
                    </div>
                    
                    <div className="h-20 w-full relative mb-4">
                      <svg width="100%" height="100%" viewBox="0 0 300 80" preserveAspectRatio="none">
                        <path 
                          className="chart-line" 
                          style={{ stroke: isPositive ? 'hsl(var(--primary))' : 'hsl(var(--secondary))' }} 
                          d={isPositive 
                            ? "M0,60 C20,50 40,70 60,30 C80,10 100,30 120,20 C140,10 160,30 180,20 C200,10 220,30 240,20 C260,10 280,30 300,20"
                            : "M0,20 C20,30 40,10 60,30 C80,50 100,40 120,45 C140,50 160,40 180,45 C200,50 220,40 240,35 C260,30 280,40 300,45"
                          }
                        />
                      </svg>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <NeonButton 
                        onClick={() => {
                          tradeCrypto(crypto);
                          setTradeAction('buy');
                          setShowTradeModal(true);
                        }}
                        variant="default"
                      >
                        <ArrowUpIcon className="mr-2 h-4 w-4" />
                        Buy
                      </NeonButton>
                      <NeonButton 
                        onClick={() => {
                          tradeCrypto(crypto);
                          setTradeAction('sell');
                          setShowTradeModal(true);
                        }}
                        variant="secondary"
                      >
                        <ArrowDownIcon className="mr-2 h-4 w-4" />
                        Sell
                      </NeonButton>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </TabsContent>
          
          <TabsContent value="portfolio">
            {user ? (
              <PortfolioView userId={user.id} />
            ) : (
              <Card className="bg-surface border-none">
                <CardContent className="pt-6">
                  <div className="text-center py-10">
                    <p className="text-gray-400 mb-4">Please log in to view your portfolio</p>
                    <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                      Login
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="watchlist">
            <Card className="bg-surface border-none">
              <CardContent className="pt-6">
                <div className="text-center py-10">
                  <p className="text-gray-400 mb-4">No assets in your watchlist yet</p>
                  <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                    Add Assets
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <BottomNav />
      
      {/* Trade Dialog */}
      <Dialog open={showTradeModal && !!selectedCrypto} onOpenChange={closeTradeModal}>
        <DialogContent className="bg-surface border-none neon-border">
          <DialogHeader>
            <DialogTitle className="font-rajdhani text-xl">
              {tradeAction === 'buy' ? 'Buy' : 'Sell'} {selectedCrypto?.symbol}
            </DialogTitle>
            <DialogDescription>
              Current price: ${selectedCrypto ? (selectedCrypto.currentPrice / 100).toFixed(2) : 0}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <label className="text-sm text-gray-400 mb-2 block">Amount</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Math.max(1, Number(e.target.value)))}
              min="1"
              className="bg-background"
            />
            
            <div className="mt-4">
              <label className="text-sm text-gray-400 mb-2 block">Adjust amount</label>
              <Slider
                defaultValue={[1]}
                min={1}
                max={100}
                step={1}
                value={[amount]}
                onValueChange={(value) => setAmount(value[0])}
              />
            </div>
            
            <div className="mt-6 p-3 bg-background rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Total cost:</span>
                <span className="font-bold">
                  {selectedCrypto ? (Math.ceil(amount * selectedCrypto.currentPrice / 10000) / 10).toFixed(1) : 0} trade tokens
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Available:</span>
                <span>{user?.tradeTokens || 0} trade tokens</span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeTradeModal}
            >
              Cancel
            </Button>
            <Button
              disabled={isTrading}
              onClick={handleTradeConfirm}
              className={`bg-gradient-to-r ${tradeAction === 'buy' ? 'from-primary to-secondary' : 'from-secondary to-primary'} hover:opacity-90`}
            >
              {isTrading ? "Processing..." : `Confirm ${tradeAction === 'buy' ? 'Purchase' : 'Sale'}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default Trade;
