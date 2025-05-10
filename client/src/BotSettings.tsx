import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Activity,
  BarChart4,
  Bot,
  CreditCard,
  DollarSign,
  Layers,
  Play,
  Plus,
  PlusCircle,
  Power,
  PowerOff,
  RefreshCw,
  Settings,
  Sparkles,
  Zap,
  Shuffle,
  Grid,
  Grid3X3,
  BarChart,
  LineChart,
  PieChart,
  Lock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Timer
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";

// Bot strategy icons mapped to their names
const strategyIcons = {
  "ai dca pro": <Sparkles className="h-5 w-5" />,
  "martingl": <Shuffle className="h-5 w-5" />,
  "ai dca": <Bot className="h-5 w-5" />,
  "ai grid": <Grid className="h-5 w-5" />,
  "ai dual grid": <Grid3X3 className="h-5 w-5" />,
  "dca": <RefreshCw className="h-5 w-5" />
};

// Sample data for bots
const virtualBots = [
  {
    id: 1,
    name: "BTC Virtual Trader",
    strategy: "ai dca pro",
    status: "running",
    automated: true,
    profit: 14.5,
    profitAmount: 1250,
    currency: "GCC",
    totalTrades: 348,
    winRate: 68,
    settings: {
      marketType: "spot",
      riskLevel: "medium",
      pair: "BTC/USDT",
      leverage: 1
    },
    createdAt: "2023-10-15"
  },
  {
    id: 2,
    name: "ETH Grid Bot",
    strategy: "ai grid",
    status: "running",
    automated: true,
    profit: 8.2,
    profitAmount: 670,
    currency: "GCC",
    totalTrades: 215,
    winRate: 62,
    settings: {
      marketType: "spot",
      riskLevel: "low",
      pair: "ETH/USDT",
      leverage: 1
    },
    createdAt: "2023-11-03"
  },
  {
    id: 3,
    name: "SOL DCA Strategy",
    strategy: "dca",
    status: "stopped",
    automated: false,
    profit: 0,
    profitAmount: 0,
    currency: "GCC",
    totalTrades: 42,
    winRate: 55,
    settings: {
      marketType: "spot",
      riskLevel: "medium",
      pair: "SOL/USDT",
      leverage: 1
    },
    createdAt: "2023-12-01"
  }
];

const realBots = [
  {
    id: 101,
    name: "BTC Futures Trader",
    strategy: "martingl",
    status: "running",
    automated: true,
    profit: 11.2,
    profitAmount: 0.023,
    currency: "BTC",
    totalTrades: 127,
    winRate: 71,
    exchange: "Binance",
    premium: true,
    settings: {
      marketType: "futures",
      riskLevel: "high",
      pair: "BTC/USDT",
      leverage: 10
    },
    createdAt: "2023-09-20"
  },
  {
    id: 102,
    name: "ETH DCA Bot",
    strategy: "ai dca",
    status: "stopped",
    automated: true,
    profit: 6.8,
    profitAmount: 0.58,
    currency: "ETH",
    totalTrades: 85,
    winRate: 64,
    exchange: "Coinbase",
    premium: true,
    settings: {
      marketType: "spot",
      riskLevel: "medium",
      pair: "ETH/USDC",
      leverage: 1
    },
    createdAt: "2023-10-05"
  },
  {
    id: 103,
    name: "Dual Grid Algo",
    strategy: "ai dual grid",
    status: "running",
    automated: true,
    profit: 18.2,
    profitAmount: 245.62,
    currency: "USDT",
    totalTrades: 312,
    winRate: 73,
    exchange: "Binance",
    premium: true,
    settings: {
      marketType: "futures",
      riskLevel: "medium",
      pair: "BNB/USDT",
      leverage: 5
    },
    createdAt: "2023-08-15"
  }
];

// Overall analytics data
const analyticsData = {
  totalProfit: {
    virtual: 1920,
    real: 425.82
  },
  profitPercentage: {
    virtual: 12.4,
    real: 15.8
  },
  totalTrades: {
    virtual: 605,
    real: 524
  },
  avgWinRate: {
    virtual: 65,
    real: 69
  },
  activeBots: {
    virtual: 2,
    real: 2
  },
  monthlyPerformance: [
    { month: "Aug", virtual: 3.2, real: 5.4 },
    { month: "Sep", virtual: 4.8, real: 3.2 },
    { month: "Oct", virtual: 2.1, real: 4.5 },
    { month: "Nov", virtual: 4.2, real: 6.8 },
    { month: "Dec", virtual: 5.5, real: 7.2 }
  ]
};

// Bot component for displaying individual bot cards
const BotCard = ({ bot, type }: { bot: any, type: 'virtual' | 'real' }) => {
  const [isActive, setIsActive] = useState(bot.status === "running");
  
  const handleToggle = () => {
    setIsActive(!isActive);
  };
  
  const isProfitable = bot.profit > 0;
  const StatusIcon = isActive ? Power : PowerOff;
  
  return (
    <Card className="bg-surface border-none neon-border overflow-hidden">
      <CardHeader className="pb-2 relative">
        {bot.premium && type === 'real' && (
          <Badge className="absolute right-4 top-4 bg-amber-500/80 text-black font-semibold">
            PREMIUM
          </Badge>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`p-2 rounded-full ${isActive ? 'bg-green-500/20' : 'bg-gray-500/20'} mr-3`}>
              {strategyIcons[bot.strategy] || <Bot className="h-5 w-5" />}
            </div>
            <div>
              <CardTitle className="text-lg">{bot.name}</CardTitle>
              <CardDescription>
                <div className="flex items-center mt-1">
                  <Badge variant="outline" className="mr-2 text-xs">
                    {bot.strategy.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {bot.settings.marketType.toUpperCase()}
                  </Badge>
                  {type === 'real' && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      {bot.exchange}
                    </Badge>
                  )}
                </div>
              </CardDescription>
            </div>
          </div>
          <Switch 
            checked={isActive} 
            onCheckedChange={handleToggle} 
            className="data-[state=checked]:bg-green-500"
          />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex justify-between items-center my-2">
          <span className="text-sm text-muted-foreground">Profit</span>
          <div className="flex items-center">
            <span className={`text-lg font-semibold ${isProfitable ? 'text-green-500' : 'text-red-500'}`}>
              {isProfitable ? '+' : ''}{bot.profit}%
            </span>
            <span className="ml-2 text-xs text-muted-foreground">
              ({isProfitable ? '+' : ''}{bot.profitAmount} {bot.currency})
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-background/50 p-2 rounded-lg">
            <div className="text-xs text-muted-foreground">Win Rate</div>
            <div className="text-base font-medium">{bot.winRate}%</div>
          </div>
          <div className="bg-background/50 p-2 rounded-lg">
            <div className="text-xs text-muted-foreground">Total Trades</div>
            <div className="text-base font-medium">{bot.totalTrades}</div>
          </div>
        </div>
        
        <div className="flex items-center mt-4">
          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-500'} mr-2`}></div>
          <span className="text-xs text-muted-foreground">{isActive ? 'Running' : 'Stopped'}</span>
          <div className="flex-1"></div>
          <span className="text-xs text-muted-foreground flex items-center">
            <Layers className="h-3 w-3 mr-1" />
            {bot.settings.pair}
          </span>
          {bot.settings.leverage > 1 && (
            <Badge className="ml-2 text-xs" variant="outline">
              {bot.settings.leverage}x
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="border-t border-border/30 pt-3 flex justify-between">
        <div className="flex items-center">
          {bot.automated ? (
            <Badge variant="outline" className="text-xs bg-primary/10">
              <Sparkles className="h-3 w-3 mr-1" /> AI Managed
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs">
              <Settings className="h-3 w-3 mr-1" /> Manual
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="sm" className="text-xs">
          Settings
        </Button>
      </CardFooter>
    </Card>
  );
};

// Analytics component showing overall performance
const BotAnalytics = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-surface border-none neon-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Total Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Virtual</div>
                <div className="text-xl font-bold text-green-500">+{analyticsData.totalProfit.virtual} GCC</div>
                <div className="text-xs text-green-500">+{analyticsData.profitPercentage.virtual}%</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Real</div>
                <div className="text-xl font-bold text-green-500">+{analyticsData.totalProfit.real} USDT</div>
                <div className="text-xs text-green-500">+{analyticsData.profitPercentage.real}%</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-surface border-none neon-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Bot Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-x-2 gap-y-3">
              <div>
                <div className="text-xs text-muted-foreground">Active Bots</div>
                <div className="text-lg font-semibold">
                  {analyticsData.activeBots.virtual + analyticsData.activeBots.real}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Total Trades</div>
                <div className="text-lg font-semibold">
                  {analyticsData.totalTrades.virtual + analyticsData.totalTrades.real}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Avg Win Rate</div>
                <div className="text-lg font-semibold">
                  {Math.round((analyticsData.avgWinRate.virtual + analyticsData.avgWinRate.real) / 2)}%
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Success Rate</div>
                <div className="text-lg font-semibold text-green-500">92%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-surface border-none neon-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Monthly Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
            <div>Performance %</div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-primary mr-1"></div>
              <span>Virtual</span>
              <div className="w-3 h-3 rounded-full bg-secondary ml-3 mr-1"></div>
              <span>Real</span>
            </div>
          </div>
          
          <div className="h-32 flex items-end space-x-1">
            {analyticsData.monthlyPerformance.map((month, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full flex space-x-1">
                  <div 
                    className="w-1/2 bg-primary/70 rounded-t" 
                    style={{ height: `${month.virtual * 5}%` }}
                  ></div>
                  <div 
                    className="w-1/2 bg-secondary/70 rounded-t" 
                    style={{ height: `${month.real * 5}%` }}
                  ></div>
                </div>
                <div className="text-xs mt-1">{month.month}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Main Trading Bots Page Component
const BotSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("virtual");
  
  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar />
      
      <main className="mt-16 p-4">
        <h1 className="text-2xl font-bold mb-4">Trading Bots</h1>
        
        <Tabs defaultValue="virtual" className="mb-6" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="virtual" className="text-sm">Virtual Bots</TabsTrigger>
            <TabsTrigger value="real" className="text-sm">Real Bots</TabsTrigger>
            <TabsTrigger value="analytics" className="text-sm">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="virtual">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-medium">Virtual Trading Bots</h2>
              <Button size="sm" className="text-xs">
                <Plus className="h-3.5 w-3.5 mr-1" /> New Bot
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              Virtual bots trade on our in-platform markets and generate GCC tokens.
            </p>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <Badge variant="outline" className="text-xs">
                  {virtualBots.filter(b => b.status === "running").length} Active
                </Badge>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    <Activity className="h-3.5 w-3.5 mr-1" /> All
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    <Play className="h-3.5 w-3.5 mr-1" /> Running
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    <PowerOff className="h-3.5 w-3.5 mr-1" /> Stopped
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {virtualBots.map(bot => (
                  <BotCard key={bot.id} bot={bot} type="virtual" />
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="real">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-medium">Real Trading Bots</h2>
              <Button size="sm" className="text-xs">
                <Plus className="h-3.5 w-3.5 mr-1" /> New Bot
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              Premium bots that connect to real exchanges and trade your crypto assets.
            </p>
            
            <div className="bg-primary/10 rounded-lg p-3 mb-4 flex items-start">
              <Lock className="h-5 w-5 text-primary mr-2 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium mb-1">Premium Feature</h3>
                <p className="text-xs text-muted-foreground">
                  Unlock premium trading bots to trade on major exchanges with API keys and earn real crypto profits.
                </p>
                <Button size="sm" className="mt-2 text-xs">
                  <CreditCard className="h-3.5 w-3.5 mr-1" /> Upgrade to Premium
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <Badge variant="outline" className="text-xs">
                  {realBots.filter(b => b.status === "running").length} Active
                </Badge>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    <Activity className="h-3.5 w-3.5 mr-1" /> All
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    <Play className="h-3.5 w-3.5 mr-1" /> Running
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    <PowerOff className="h-3.5 w-3.5 mr-1" /> Stopped
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {realBots.map(bot => (
                  <BotCard key={bot.id} bot={bot} type="real" />
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics">
            <h2 className="text-lg font-medium mb-3">Bot Analytics</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Track the performance of all your trading bots.
            </p>
            
            <BotAnalytics />
          </TabsContent>
        </Tabs>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Available Strategies</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create a new bot using one of our advanced trading strategies.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { 
                name: "AI DCA Pro", 
                icon: <Sparkles className="h-5 w-5 text-primary" />,
                description: "Advanced dollar-cost averaging with AI timing",
                markets: ["Spot", "Futures"],
                automated: true
              },
              { 
                name: "Martingale", 
                icon: <Shuffle className="h-5 w-5 text-green-400" />,
                description: "Progressive position sizing strategy",
                markets: ["Spot", "Futures"],
                automated: true
              },
              { 
                name: "AI DCA", 
                icon: <Bot className="h-5 w-5 text-blue-400" />,
                description: "Basic AI-powered dollar-cost averaging",
                markets: ["Futures", "Spot"],
                automated: true
              },
              { 
                name: "AI Grid", 
                icon: <Grid className="h-5 w-5 text-indigo-400" />,
                description: "Grid trading with AI-optimized levels",
                markets: ["Futures", "Spot"],
                automated: true
              },
              { 
                name: "AI Dual Grid", 
                icon: <Grid3X3 className="h-5 w-5 text-purple-400" />,
                description: "Dual grid strategy for volatile markets",
                markets: ["Futures"],
                automated: true
              },
              { 
                name: "Basic DCA", 
                icon: <RefreshCw className="h-5 w-5 text-cyan-400" />,
                description: "Simple dollar-cost averaging strategy",
                markets: ["Futures", "Spot"],
                automated: false
              }
            ].map((strategy, index) => (
              <Card key={index} className="bg-surface border-none">
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-background mr-3">
                      {strategy.icon}
                    </div>
                    <div>
                      <CardTitle className="text-base">{strategy.name}</CardTitle>
                      <div className="flex mt-1">
                        {strategy.markets.map((market, i) => (
                          <Badge key={i} variant="outline" className={`text-xs ${i > 0 ? 'ml-1' : ''}`}>
                            {market}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    {strategy.description}
                  </p>
                </CardContent>
                <CardFooter className="border-t border-border/30 pt-3">
                  <div className="flex items-center justify-between w-full">
                    <Badge variant={strategy.automated ? "default" : "outline"} className="text-xs bg-primary/10">
                      {strategy.automated ? (
                        <>
                          <Sparkles className="h-3 w-3 mr-1" /> AI Managed
                        </>
                      ) : (
                        <>
                          <Settings className="h-3 w-3 mr-1" /> Manual
                        </>
                      )}
                    </Badge>
                    <Button variant="ghost" size="sm" className="text-xs">
                      <PlusCircle className="h-3.5 w-3.5 mr-1" /> Create
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default BotSettings; 