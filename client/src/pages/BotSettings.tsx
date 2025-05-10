import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  ArrowLeft,
  Timer,
  ChevronRight,
  ChevronLeft,
  HelpCircle,
  Info,
  Trophy,
  Star,
  Users,
  Sliders,
  Share2,
  BookOpen,
  Gift,
  Bell,
  Calendar,
  ArrowUpRight,
  Award,
  Clock8,
  Calculator,
  Download,
  Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Bot strategy icons mapped to their names
const strategyIcons = {
  "ai dca pro": <Sparkles className="h-5 w-5" />,
  "martingl": <Shuffle className="h-5 w-5" />,
  "ai dca": <Bot className="h-5 w-5" />,
  "ai grid": <Grid className="h-5 w-5" />,
  "ai dual grid": <Grid3X3 className="h-5 w-5" />,
  "dca": <RefreshCw className="h-5 w-5" />
};

// Strategy details including risk levels and descriptions
const strategyDetails = {
  "ai dca pro": {
    name: "AI DCA Pro",
    icon: <Sparkles className="h-5 w-5 text-purple-500" />,
    description: "Advanced dollar-cost averaging with AI timing",
    fullDescription: "Ideal for long-term accumulation in volatile markets. The AI optimizes entry points based on market conditions.",
    riskLevel: "medium",
    riskColor: "text-yellow-500",
    markets: ["Spot", "Futures"],
    automated: true,
    color: "from-blue-500/20 to-indigo-500/20",
    performanceStats: {
      avgROI: 14.2,
      winRate: 68,
      userCount: 1250
    },
    isPremium: true
  },
  "martingl": {
    name: "Martingale",
    icon: <Shuffle className="h-5 w-5 text-red-500" />,
    description: "Progressive position sizing strategy",
    fullDescription: "Best for experienced traders in sideways markets. Increases position size after losses to average down entry price.",
    riskLevel: "high",
    riskColor: "text-red-500",
    markets: ["Spot", "Futures"],
    automated: true,
    color: "from-green-500/20 to-emerald-500/20",
    performanceStats: {
      avgROI: 18.6,
      winRate: 58,
      userCount: 780
    },
    isPremium: true
  },
  "ai dca": {
    name: "AI DCA",
    icon: <Bot className="h-5 w-5 text-blue-500" />,
    description: "Basic AI-powered dollar-cost averaging",
    fullDescription: "A beginner-friendly strategy that uses AI to optimize your regular purchases based on market trends.",
    riskLevel: "low",
    riskColor: "text-green-500",
    markets: ["Spot", "Futures"],
    automated: true,
    color: "from-blue-400/20 to-sky-400/20",
    performanceStats: {
      avgROI: 9.5,
      winRate: 72,
      userCount: 1800
    },
    isPremium: false
  },
  "ai grid": {
    name: "AI Grid",
    icon: <Grid className="h-5 w-5 text-indigo-500" />,
    description: "Grid trading with AI-optimized levels",
    fullDescription: "Excels in range-bound markets by buying low and selling high within a price range. AI optimizes grid levels.",
    riskLevel: "medium",
    riskColor: "text-yellow-500",
    markets: ["Spot", "Futures"],
    automated: true,
    color: "from-indigo-500/20 to-violet-500/20",
    performanceStats: {
      avgROI: 12.8,
      winRate: 65,
      userCount: 1450
    },
    isPremium: true
  },
  "ai dual grid": {
    name: "AI Dual Grid",
    icon: <Grid3X3 className="h-5 w-5 text-purple-600" />,
    description: "Dual grid strategy for volatile markets",
    fullDescription: "High-risk/high-reward strategy for futures traders. Uses two opposing grid setups to profit from volatility.",
    riskLevel: "very high",
    riskColor: "text-red-600",
    markets: ["Futures"],
    automated: true,
    color: "from-purple-500/20 to-fuchsia-500/20",
    performanceStats: {
      avgROI: 22.4,
      winRate: 52,
      userCount: 650
    },
    isPremium: true
  },
  "dca": {
    name: "Basic DCA",
    icon: <RefreshCw className="h-5 w-5 text-teal-500" />,
    description: "Simple dollar-cost averaging strategy",
    fullDescription: "The safest approach for long-term investors. Automatically buys fixed amounts at regular intervals.",
    riskLevel: "very low",
    riskColor: "text-green-600",
    markets: ["Spot"],
    automated: false,
    color: "from-cyan-500/20 to-teal-500/20",
    performanceStats: {
      avgROI: 7.2,
      winRate: 80,
      userCount: 2100
    },
    isPremium: false
  }
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
  const [isHovered, setIsHovered] = useState(false);
  
  const handleToggle = () => {
    setIsActive(!isActive);
  };
  
  const isProfitable = bot.profit > 0;
  const StatusIcon = isActive ? Power : PowerOff;
  
  // Ensure the strategy icon exists or default to Bot icon
  const getStrategyIcon = (strategy: string) => {
    if (strategy in strategyIcons) {
      return strategyIcons[strategy as keyof typeof strategyIcons];
    }
    return <Bot className="h-5 w-5" />;
  };
  
  return (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className={`border-none overflow-hidden transition-all duration-300 ${isHovered ? 'shadow-lg' : ''}`}>
        <CardHeader className="pb-2 relative">
          {bot.premium && type === 'real' && (
            <Badge className="absolute right-4 top-4 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-semibold">
              PREMIUM
            </Badge>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`p-2.5 rounded-full ${isActive ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-400'} mr-3 transition-colors duration-300`}>
                {getStrategyIcon(bot.strategy)}
              </div>
              <div>
                <CardTitle className="text-lg font-medium">{bot.name}</CardTitle>
                <CardDescription>
                  <div className="flex items-center mt-1.5">
                    <Badge variant="outline" className="mr-2 text-xs font-medium">
                      {bot.strategy.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="text-xs font-medium">
                      {bot.settings.marketType.toUpperCase()}
                    </Badge>
                    {type === 'real' && (
                      <Badge variant="outline" className="ml-2 text-xs font-medium">
                        {bot.exchange}
                      </Badge>
                    )}
                  </div>
                </CardDescription>
              </div>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Switch 
                    checked={isActive} 
                    onCheckedChange={handleToggle} 
                    className="data-[state=checked]:bg-green-500"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isActive ? 'Stop bot' : 'Activate bot'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex justify-between items-center my-3">
            <span className="text-sm text-muted-foreground font-medium">Profit</span>
            <div className="flex items-center">
              <span className={`text-lg font-bold ${isProfitable ? 'text-green-500' : 'text-red-500'}`}>
                {isProfitable ? '+' : ''}{bot.profit}%
              </span>
              <span className="ml-2 text-xs text-muted-foreground">
                ({isProfitable ? '+' : ''}{bot.profitAmount} {bot.currency})
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-muted/40 p-3 rounded-xl flex flex-col transition-all duration-300 hover:bg-muted/60">
              <div className="text-xs text-muted-foreground font-medium">Win Rate</div>
              <div className="text-base font-bold mt-1 flex items-center">
                {bot.winRate}%
                {bot.winRate > 65 && <TrendingUp className="h-3.5 w-3.5 ml-1 text-green-500" />}
              </div>
              <Progress value={bot.winRate} className="h-1.5 mt-1" />
            </div>
            <div className="bg-muted/40 p-3 rounded-xl flex flex-col transition-all duration-300 hover:bg-muted/60">
              <div className="text-xs text-muted-foreground font-medium">Total Trades</div>
              <div className="text-base font-bold mt-1">{bot.totalTrades}</div>
              <Progress value={bot.totalTrades > 300 ? 100 : (bot.totalTrades / 3)} className="h-1.5 mt-1" />
            </div>
          </div>
          
          <div className="flex items-center mt-4">
            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'} mr-2`}></div>
            <span className="text-xs text-muted-foreground">{isActive ? 'Running' : 'Stopped'}</span>
            <div className="flex-1"></div>
            <span className="text-xs text-muted-foreground flex items-center">
              <Layers className="h-3 w-3 mr-1" />
              {bot.settings.pair}
            </span>
            {bot.settings.leverage > 1 && (
              <Badge className="ml-2 text-xs bg-yellow-500/10 text-yellow-500" variant="outline">
                {bot.settings.leverage}x
              </Badge>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="border-t border-border/30 pt-3 flex justify-between">
          <div className="flex items-center">
            {bot.automated ? (
              <Badge variant="outline" className="text-xs text-primary font-medium">
                <Sparkles className="h-3 w-3 mr-1" /> AI Managed
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs font-medium">
                <Settings className="h-3 w-3 mr-1" /> Manual
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" className="text-xs font-medium hover:bg-primary/10">
            Settings <ChevronRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

// Analytics component showing overall performance
const BotAnalytics = () => {
  const [profitTrendData] = useState([25, 36, 42, 38, 45, 56, 65, 70, 68, 75]);
  
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-none overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              Total Profit
              <span className="ml-2 p-1 rounded-full bg-green-500/10 text-green-500"><TrendingUp className="h-3.5 w-3.5" /></span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <div>
                <div className="text-sm text-muted-foreground font-medium">Virtual</div>
                <div className="text-2xl font-bold text-green-500 mt-1">+{analyticsData.totalProfit.virtual} <span className="text-xs font-normal">GCC</span></div>
                <div className="text-xs text-green-500 font-medium flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{analyticsData.profitPercentage.virtual}%
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground font-medium">Real</div>
                <div className="text-2xl font-bold text-green-500 mt-1">+{analyticsData.totalProfit.real} <span className="text-xs font-normal">USDT</span></div>
                <div className="text-xs text-green-500 font-medium flex items-center justify-end">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{analyticsData.profitPercentage.real}%
                </div>
              </div>
            </div>
            
            {/* Profit trend mini chart */}
            <div className="mt-4 h-10 flex items-end space-x-1">
              {profitTrendData.map((value, index) => (
                <div 
                  key={index} 
                  className="flex-1 bg-green-500/70 rounded-t"
                  style={{ height: `${value}%` }}
                ></div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              Bot Performance
              <HelpCircle className="h-3.5 w-3.5 ml-2 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              <div>
                <div className="text-xs text-muted-foreground font-medium">Active Bots</div>
                <div className="text-xl font-bold mt-1 flex items-center">
                  {analyticsData.activeBots.virtual + analyticsData.activeBots.real}
                  <span className="ml-2 text-xs p-1 rounded bg-green-500/10 text-green-500 font-normal">
                    {analyticsData.activeBots.virtual + analyticsData.activeBots.real > 3 ? 'Optimal' : 'Add More'}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground font-medium">Total Trades</div>
                <div className="text-xl font-bold mt-1">
                  {analyticsData.totalTrades.virtual + analyticsData.totalTrades.real}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground font-medium">Avg Win Rate</div>
                <div className="text-xl font-bold mt-1 flex items-center">
                  {Math.round((analyticsData.avgWinRate.virtual + analyticsData.avgWinRate.real) / 2)}%
                  <Progress value={Math.round((analyticsData.avgWinRate.virtual + analyticsData.avgWinRate.real) / 2)} className="h-1.5 w-12 ml-2" />
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground font-medium">Success Rate</div>
                <div className="text-xl font-bold mt-1 text-green-500 flex items-center">
                  92%
                  <div className="h-1.5 w-12 ml-2 bg-green-500/30 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: "92%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="border-none overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base">Monthly Performance</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <span className="text-xs">2023</span>
              <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center text-xs text-muted-foreground mb-2">
            <div>Performance %</div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-primary mr-1"></div>
              <span>Virtual</span>
              <div className="w-3 h-3 rounded-full bg-secondary ml-3 mr-1"></div>
              <span>Real</span>
            </div>
          </div>
          
          <div className="h-40 flex items-end space-x-2 mt-4">
            {analyticsData.monthlyPerformance.map((month, index) => (
              <div key={index} className="flex-1 flex flex-col items-center group">
                <div className="w-full flex space-x-1 relative">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${month.virtual * 5}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="w-1/2 bg-gradient-to-t from-primary/70 to-primary/90 rounded-t-md"
                  ></motion.div>
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${month.real * 5}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                    className="w-1/2 bg-gradient-to-t from-secondary/70 to-secondary/90 rounded-t-md"
                  ></motion.div>
                  
                  {/* Tooltip on hover */}
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    Virtual: +{month.virtual}% | Real: +{month.real}%
                  </div>
                </div>
                <div className="text-xs mt-2 font-medium">{month.month}</div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-border/30">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/40 p-3 rounded-lg">
                <div className="text-xs text-muted-foreground">Best Month</div>
                <div className="text-base font-medium mt-1">December (+{Math.max(...analyticsData.monthlyPerformance.map(m => m.virtual + m.real))}%)</div>
              </div>
              <div className="bg-muted/40 p-3 rounded-lg">
                <div className="text-xs text-muted-foreground">Average Monthly</div>
                <div className="text-base font-medium mt-1">+{(analyticsData.monthlyPerformance.reduce((acc, curr) => acc + (curr.virtual + curr.real)/2, 0) / analyticsData.monthlyPerformance.length).toFixed(1)}%</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// CreateBotModal component for creating a new bot
const CreateBotModal = ({ 
  isOpen, 
  onClose, 
  botType = "virtual" 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  botType?: "virtual" | "real" 
}) => {
  const [step, setStep] = useState(1);
  const [botConfig, setBotConfig] = useState({
    name: "",
    strategy: "ai dca pro",
    pair: "BTC/USDT",
    investment: 100,
    riskLevel: "medium",
    marketType: "spot",
    automated: true,
    leverage: 1,
    exchange: botType === "real" ? "Binance" : undefined,
    apiKey: botType === "real" ? "" : undefined,
    apiSecret: botType === "real" ? "" : undefined,
  });

  const handleChange = (field: string, value: any) => {
    setBotConfig({
      ...botConfig,
      [field]: value
    });
  };

  const handleNext = () => {
    if (step < (botType === "real" ? 4 : 3)) {
      setStep(step + 1);
    } else {
      // Submit form and create bot
      onClose();
      // Reset form
      setStep(1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onClose();
    }
  };

  const getStrategyDetails = (stratId: string) => {
    return strategyDetails[stratId as keyof typeof strategyDetails] || strategyDetails["ai dca"];
  };

  const selectedStrategy = getStrategyDetails(botConfig.strategy);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[420px] border-none bg-background/95 backdrop-blur-lg shadow-lg rounded-xl">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center">
            {step === 1 && <Plus className="h-5 w-5 mr-2 text-primary" />}
            {step === 2 && <Sparkles className="h-5 w-5 mr-2 text-primary" />}
            {step === 3 && <Sliders className="h-5 w-5 mr-2 text-primary" />}
            {step === 4 && <CreditCard className="h-5 w-5 mr-2 text-primary" />}
            <DialogTitle className="text-xl">
              {step === 1 && `Create New ${botType === "virtual" ? "Virtual" : "Real"} Bot`}
              {step === 2 && "Select Strategy"}
              {step === 3 && "Configure Settings"}
              {step === 4 && "Connect Exchange"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground mt-2">
            {step === 1 && "Configure your trading bot to automate your strategy"}
            {step === 2 && "Choose the trading strategy that matches your goals"}
            {step === 3 && "Fine-tune your bot's trading parameters"}
            {step === 4 && "Connect to your exchange account securely"}
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="botName">Bot Name</Label>
              <Input
                id="botName"
                placeholder="My Trading Bot"
                value={botConfig.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tradingPair">Trading Pair</Label>
              <Select 
                value={botConfig.pair} 
                onValueChange={(value) => handleChange("pair", value)}
              >
                <SelectTrigger id="tradingPair">
                  <SelectValue placeholder="Select a trading pair" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BTC/USDT">BTC/USDT</SelectItem>
                  <SelectItem value="ETH/USDT">ETH/USDT</SelectItem>
                  <SelectItem value="SOL/USDT">SOL/USDT</SelectItem>
                  <SelectItem value="BNB/USDT">BNB/USDT</SelectItem>
                  <SelectItem value="ADA/USDT">ADA/USDT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="investment">Initial Investment</Label>
              <div className="flex items-center">
                <Input
                  id="investment"
                  type="number"
                  placeholder="100"
                  value={botConfig.investment}
                  onChange={(e) => handleChange("investment", parseFloat(e.target.value))}
                  className="flex-1"
                />
                <span className="ml-2 text-muted-foreground">{botType === "virtual" ? "GCC" : "USDT"}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {botType === "virtual" 
                  ? "Amount of GCC tokens to allocate to this bot"
                  : "Amount of USDT to allocate to this bot on exchange"}
              </p>
            </div>

            <div className="grid gap-2">
              <Label>Market Type</Label>
              <div className="flex items-center space-x-2">
                <RadioGroup 
                  defaultValue={botConfig.marketType}
                  onValueChange={(value) => handleChange("marketType", value)}
                  className="flex"
                >
                  <div className="flex items-center space-x-2 mr-4">
                    <RadioGroupItem value="spot" id="spot" />
                    <Label htmlFor="spot" className="cursor-pointer">Spot</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="futures" id="futures" />
                    <Label htmlFor="futures" className="cursor-pointer">Futures</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Strategy Selection */}
        {step === 2 && (
          <div className="py-4">
            <div className="grid grid-cols-1 gap-4 mb-4">
              {Object.entries(strategyDetails).map(([key, strategy]) => (
                <div
                  key={key}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    botConfig.strategy === key
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => handleChange("strategy", key)}
                >
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full bg-muted mr-3`}>
                      {strategy.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{strategy.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {strategy.fullDescription}
                      </p>
                      <div className="flex mt-2">
                        <Badge className={`mr-2 ${strategy.riskColor}`}>
                          {strategy.riskLevel.charAt(0).toUpperCase() + strategy.riskLevel.slice(1)} Risk
                        </Badge>
                        {strategy.markets.map((market) => (
                          <Badge key={market} variant="outline" className="mr-2">
                            {market}
                          </Badge>
                        ))}
                        <Badge variant="outline" className="bg-primary/10 text-primary">
                          {strategy.performanceStats.avgROI}% Avg. ROI
                        </Badge>
                      </div>
                    </div>
                    <div className="ml-2">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          botConfig.strategy === key
                            ? "border-primary"
                            : "border-muted-foreground"
                        }`}
                      >
                        {botConfig.strategy === key && (
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Configure Settings */}
        {step === 3 && (
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Automation Mode</Label>
                <p className="text-xs text-muted-foreground">
                  Choose whether to let AI manage your bot or set manual parameters
                </p>
              </div>
              <Switch 
                checked={botConfig.automated} 
                onCheckedChange={(checked) => handleChange("automated", checked)}
              />
            </div>

            <div className="grid gap-2">
              <Label>Risk Level</Label>
              <div className="space-y-4">
                <div className="flex justify-between text-xs">
                  <span>Conservative</span>
                  <span>Balanced</span>
                  <span>Aggressive</span>
                </div>
                <Slider
                  defaultValue={[
                    botConfig.riskLevel === "low" 
                      ? 25 
                      : botConfig.riskLevel === "medium" 
                        ? 50 
                        : 75
                  ]} 
                  max={100}
                  step={25}
                  onValueChange={(value) => {
                    const riskLevel = value[0] <= 25 
                      ? "low" 
                      : value[0] <= 50 
                        ? "medium" 
                        : "high";
                    handleChange("riskLevel", riskLevel);
                  }}
                />
              </div>
            </div>

            {botConfig.marketType === "futures" && (
              <div className="grid gap-2">
                <div className="flex justify-between">
                  <Label htmlFor="leverage">Leverage</Label>
                  <span className="text-sm font-medium">{botConfig.leverage}x</span>
                </div>
                <Slider
                  defaultValue={[botConfig.leverage]}
                  min={1}
                  max={20}
                  step={1}
                  onValueChange={(value) => handleChange("leverage", value[0])}
                />
                <p className="text-xs text-amber-500">
                  <AlertTriangle className="h-3 w-3 inline-block mr-1" />
                  Higher leverage increases both potential profits and risks.
                </p>
              </div>
            )}
            
            {botConfig.automated ? (
              <div className="p-3 rounded-lg border border-primary/20 bg-primary/5">
                <div className="flex items-center">
                  <Sparkles className="h-4 w-4 text-primary mr-2" />
                  <h4 className="font-medium text-primary">AI Management Active</h4>
                </div>
                <p className="text-sm mt-1">
                  Our AI will automatically optimize your entry and exit points, rebalance your portfolio, 
                  and adjust to market conditions.
                </p>
                <div className="mt-2 text-xs flex items-center text-muted-foreground">
                  <Info className="h-3 w-3 mr-1" />
                  Backtested to achieve {selectedStrategy.performanceStats.avgROI}% average ROI with a win rate of {selectedStrategy.performanceStats.winRate}%.
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-lg border border-muted">
                <div className="flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  <h4 className="font-medium">Manual Management Selected</h4>
                </div>
                <p className="text-sm mt-1">
                  You'll need to set and adjust your own parameters. Consider using our strategy guides for better results.
                </p>
                <Button variant="outline" size="sm" className="mt-2 text-xs">
                  <BookOpen className="h-3 w-3 mr-1" /> View Strategy Guide
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Connect Exchange (Real Bots Only) */}
        {step === 4 && botType === "real" && (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="exchange">Exchange</Label>
              <Select 
                value={botConfig.exchange} 
                onValueChange={(value) => handleChange("exchange", value)}
              >
                <SelectTrigger id="exchange">
                  <SelectValue placeholder="Select an exchange" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Binance">Binance</SelectItem>
                  <SelectItem value="Coinbase">Coinbase</SelectItem>
                  <SelectItem value="Kucoin">Kucoin</SelectItem>
                  <SelectItem value="Bybit">Bybit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                placeholder="Enter your API key"
                value={botConfig.apiKey || ""}
                onChange={(e) => handleChange("apiKey", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Create a read-only API key with trading permissions only
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="apiSecret">API Secret</Label>
              <Input
                id="apiSecret"
                type="password"
                placeholder="Enter your API secret"
                value={botConfig.apiSecret || ""}
                onChange={(e) => handleChange("apiSecret", e.target.value)}
              />
            </div>

            <div className="p-3 rounded-lg border bg-muted/30">
              <div className="flex items-center">
                <Lock className="h-4 w-4 text-green-500 mr-2" />
                <h4 className="font-medium">Secure Connection</h4>
              </div>
              <p className="text-xs mt-1 text-muted-foreground">
                Your API credentials are encrypted and stored securely. We never have access to your funds directly.
              </p>
            </div>
          </div>
        )}

        <DialogFooter className="flex items-center border-t pt-4 mt-4">
          <div className="flex-1 flex items-center">
            <div className="flex items-center">
              {Array.from({ length: botType === "real" ? 4 : 3 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full mr-1.5 ${
                    i + 1 === step
                      ? "bg-primary"
                      : i + 1 < step
                      ? "bg-primary/30"
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground ml-2">
              Step {step} of {botType === "real" ? 4 : 3}
            </span>
          </div>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="border-muted-foreground/20"
            >
              {step === 1 ? "Cancel" : "Back"}
            </Button>
            <Button onClick={handleNext} className="bg-primary text-white hover:bg-primary/90">
              {step < (botType === "real" ? 4 : 3) ? (
                <>
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </>
              ) : (
                <>
                  Create Bot <Sparkles className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// BotSettings component for individual bot settings
const BotSettingsModal = ({ 
  isOpen, 
  onClose, 
  bot 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  bot: any;
}) => {
  const [activeTab, setActiveTab] = useState("general");
  const [botConfig, setBotConfig] = useState({
    ...bot,
    riskLevel: bot.settings.riskLevel,
    leverage: bot.settings.leverage,
    marketType: bot.settings.marketType
  });

  const handleChange = (field: string, value: any) => {
    setBotConfig({
      ...botConfig,
      [field]: value
    });
  };

  const handleSave = () => {
    // Save bot settings
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[420px] border-none bg-background/95 backdrop-blur-lg shadow-lg rounded-xl">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center">
            <div className={`p-2 rounded-full mr-3 ${botConfig.status === "running" ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-400'}`}>
              {getStrategyIcon(bot.strategy)}
            </div>
            <div>
              <DialogTitle className="text-xl">{bot.name} Settings</DialogTitle>
              <DialogDescription className="text-muted-foreground mt-1">
                Configure your bot's parameters and monitoring settings
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="general" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="parameters">Parameters</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="botName">Bot Name</Label>
              <Input
                id="botName"
                value={botConfig.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tradingPair">Trading Pair</Label>
              <Select 
                value={botConfig.settings.pair} 
                onValueChange={(value) => handleChange("pair", value)}
              >
                <SelectTrigger id="tradingPair">
                  <SelectValue placeholder="Select a trading pair" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BTC/USDT">BTC/USDT</SelectItem>
                  <SelectItem value="ETH/USDT">ETH/USDT</SelectItem>
                  <SelectItem value="SOL/USDT">SOL/USDT</SelectItem>
                  <SelectItem value="BNB/USDT">BNB/USDT</SelectItem>
                  <SelectItem value="ADA/USDT">ADA/USDT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="block mb-1">Bot Status</Label>
                <p className="text-xs text-muted-foreground">Enable or disable your bot</p>
              </div>
              <Switch 
                checked={botConfig.status === "running"} 
                onCheckedChange={(checked) => handleChange("status", checked ? "running" : "stopped")}
                className="data-[state=checked]:bg-green-500"
              />
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="delete">
                <AccordionTrigger className="text-red-500 hover:text-red-600 text-sm">
                  Delete Bot
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm mb-2">This action cannot be undone. This will permanently delete your bot and all its trading history.</p>
                  <Button variant="destructive" size="sm">
                    Delete Permanently
                  </Button>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          {/* Trading Parameters */}
          <TabsContent value="parameters" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Automation Mode</Label>
                <p className="text-xs text-muted-foreground">
                  Choose whether to let AI manage your bot
                </p>
              </div>
              <Switch 
                checked={botConfig.automated} 
                onCheckedChange={(checked) => handleChange("automated", checked)}
              />
            </div>

            <div className="grid gap-2">
              <Label>Risk Level</Label>
              <div className="space-y-4">
                <div className="flex justify-between text-xs">
                  <span>Conservative</span>
                  <span>Balanced</span>
                  <span>Aggressive</span>
                </div>
                <Slider
                  defaultValue={[
                    botConfig.riskLevel === "low" ? 25 : botConfig.riskLevel === "medium" ? 50 : 75
                  ]} 
                  max={100}
                  step={25}
                  onValueChange={(value) => {
                    const riskLevel = value[0] <= 25 ? "low" : value[0] <= 50 ? "medium" : "high";
                    handleChange("riskLevel", riskLevel);
                  }}
                />
              </div>
            </div>

            {botConfig.marketType === "futures" && (
              <div className="grid gap-2">
                <div className="flex justify-between">
                  <Label htmlFor="leverage">Leverage</Label>
                  <span className="text-sm font-medium">{botConfig.leverage}x</span>
                </div>
                <Slider
                  defaultValue={[botConfig.leverage]}
                  min={1}
                  max={20}
                  step={1}
                  onValueChange={(value) => handleChange("leverage", value[0])}
                />
                <p className="text-xs text-amber-500">
                  <AlertTriangle className="h-3 w-3 inline-block mr-1" />
                  Higher leverage increases both potential profits and risks.
                </p>
              </div>
            )}

            {botConfig.automated ? (
              <div className="p-3 rounded-lg border border-primary/20 bg-primary/5">
                <div className="flex items-center">
                  <Sparkles className="h-4 w-4 text-primary mr-2" />
                  <h4 className="font-medium text-primary">AI Management Active</h4>
                </div>
                <p className="text-sm mt-1">
                  Our AI will automatically optimize your entry and exit points, rebalance your portfolio, 
                  and adjust to market conditions.
                </p>
                <Button variant="outline" size="sm" className="mt-2 text-xs">
                  <Info className="h-3 w-3 mr-1" /> View AI Strategy Details
                </Button>
              </div>
            ) : (
              <div className="space-y-4 mt-3 p-4 rounded-lg border border-border/20 bg-muted/20">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Manual Trading Parameters</h4>
                  <Button variant="outline" size="sm" className="text-xs">
                    <BookOpen className="h-3 w-3 mr-1" /> View Guide
                  </Button>
                </div>
                
                <div className="grid gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-2">
                      <Label htmlFor="takeProfit">Take Profit</Label>
                      <div className="flex items-center">
                        <Input
                          id="takeProfit"
                          type="number"
                          placeholder="5"
                          value={botConfig.takeProfit || 5}
                          onChange={(e) => handleChange("takeProfit", parseFloat(e.target.value))}
                          className="flex-1"
                        />
                        <span className="ml-2 text-sm text-muted-foreground">%</span>
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="stopLoss">Stop Loss</Label>
                      <div className="flex items-center">
                        <Input
                          id="stopLoss"
                          type="number"
                          placeholder="3"
                          value={botConfig.stopLoss || 3}
                          onChange={(e) => handleChange("stopLoss", parseFloat(e.target.value))}
                          className="flex-1"
                        />
                        <span className="ml-2 text-sm text-muted-foreground">%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="entryCondition">Entry Condition</Label>
                    <Select defaultValue="price_below">
                      <SelectTrigger id="entryCondition">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="price_below">Price Below Target</SelectItem>
                        <SelectItem value="price_above">Price Above Target</SelectItem>
                        <SelectItem value="ma_crossover">MA Crossover</SelectItem>
                        <SelectItem value="rsi_oversold">RSI Oversold</SelectItem>
                        <SelectItem value="rsi_overbought">RSI Overbought</SelectItem>
                        <SelectItem value="custom">Custom Condition</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="entryPrice">Entry Price Target</Label>
                    <div className="flex items-center">
                      <Input
                        id="entryPrice"
                        type="number"
                        placeholder="0.00"
                        value={botConfig.entryPrice || ''}
                        onChange={(e) => handleChange("entryPrice", e.target.value)}
                        className="flex-1"
                      />
                      <span className="ml-2 text-sm text-muted-foreground">USDT</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Strategy-specific parameters */}
                  {botConfig.strategy === "dca" && (
                    <>
                      <h4 className="text-sm font-medium text-primary">DCA Parameters</h4>
                      <div className="grid gap-2">
                        <Label htmlFor="dcaInterval">DCA Interval</Label>
                        <Select 
                          value={botConfig.interval || "daily"} 
                          onValueChange={(value) => handleChange("interval", value)}
                        >
                          <SelectTrigger id="dcaInterval">
                            <SelectValue placeholder="Select interval" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hourly">Hourly</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="dcaAmount">Amount per Interval</Label>
                        <div className="flex items-center">
                          <Input
                            id="dcaAmount"
                            type="number"
                            placeholder="10"
                            value={botConfig.dcaAmount || 10}
                            onChange={(e) => handleChange("dcaAmount", parseFloat(e.target.value))}
                            className="flex-1"
                          />
                          <span className="ml-2 text-sm text-muted-foreground">USDT</span>
                        </div>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="maxBuyCount">Maximum Buy Count</Label>
                        <Input
                          id="maxBuyCount"
                          type="number"
                          placeholder="10"
                          value={botConfig.maxBuyCount || 10}
                          onChange={(e) => handleChange("maxBuyCount", parseInt(e.target.value))}
                          className="flex-1"
                        />
                      </div>
                    </>
                  )}
                  
                  {botConfig.strategy === "martingl" && (
                    <>
                      <h4 className="text-sm font-medium text-primary">Martingale Parameters</h4>
                      <div className="grid gap-2">
                        <Label htmlFor="multiplier">Position Size Multiplier</Label>
                        <div className="flex items-center">
                          <Input
                            id="multiplier"
                            type="number"
                            placeholder="2"
                            value={botConfig.multiplier || 2}
                            onChange={(e) => handleChange("multiplier", parseFloat(e.target.value))}
                            className="flex-1"
                            step="0.1"
                          />
                          <span className="ml-2 text-sm text-muted-foreground">x</span>
                        </div>
                        <p className="text-xs text-amber-500">
                          <AlertTriangle className="h-3 w-3 inline-block mr-1" />
                          Higher multiplier increases risk significantly
                        </p>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="maxPositions">Maximum Positions</Label>
                        <Input
                          id="maxPositions"
                          type="number"
                          placeholder="5"
                          value={botConfig.maxPositions || 5}
                          onChange={(e) => handleChange("maxPositions", parseInt(e.target.value))}
                          className="flex-1"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="priceDeviation">Price Deviation</Label>
                        <div className="flex items-center">
                          <Input
                            id="priceDeviation"
                            type="number"
                            placeholder="2"
                            value={botConfig.priceDeviation || 2}
                            onChange={(e) => handleChange("priceDeviation", parseFloat(e.target.value))}
                            className="flex-1"
                            step="0.1"
                          />
                          <span className="ml-2 text-sm text-muted-foreground">%</span>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {(botConfig.strategy === "ai grid" || botConfig.strategy === "ai dual grid") && (
                    <>
                      <h4 className="text-sm font-medium text-primary">Grid Parameters</h4>
                      <div className="grid gap-2">
                        <Label htmlFor="gridLevels">Grid Levels</Label>
                        <Input
                          id="gridLevels"
                          type="number"
                          placeholder="10"
                          value={botConfig.gridLevels || 10}
                          onChange={(e) => handleChange("gridLevels", parseInt(e.target.value))}
                          className="flex-1"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="gridSpread">Grid Spread</Label>
                        <div className="flex items-center">
                          <Input
                            id="gridSpread"
                            type="number"
                            placeholder="1.5"
                            value={botConfig.gridSpread || 1.5}
                            onChange={(e) => handleChange("gridSpread", parseFloat(e.target.value))}
                            className="flex-1"
                            step="0.1"
                          />
                          <span className="ml-2 text-sm text-muted-foreground">%</span>
                        </div>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label>Price Range</Label>
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <Input
                              placeholder="Lower"
                              type="number"
                              value={botConfig.lowerPrice || ''}
                              onChange={(e) => handleChange("lowerPrice", e.target.value)}
                            />
                          </div>
                          <span>to</span>
                          <div className="flex-1">
                            <Input
                              placeholder="Upper"
                              type="number"
                              value={botConfig.upperPrice || ''}
                              onChange={(e) => handleChange("upperPrice", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                
                <Collapsible className="mt-4 pt-3 border-t border-border/30">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-xs flex items-center w-full justify-between">
                      <div className="flex items-center">
                        <ArrowUpRight className="h-3.5 w-3.5 mr-2 text-blue-500" />
                        <span className="text-blue-500 font-medium">Advanced Options</span>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-blue-500" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3 space-y-3">
                    <div className="grid gap-2">
                      <Label htmlFor="maxDrawdown">Maximum Drawdown</Label>
                      <div className="flex items-center">
                        <Input
                          id="maxDrawdown"
                          type="number"
                          placeholder="25"
                          value={botConfig.maxDrawdown || 25}
                          onChange={(e) => handleChange("maxDrawdown", parseFloat(e.target.value))}
                          className="flex-1"
                        />
                        <span className="ml-2 text-sm text-muted-foreground">%</span>
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="tradingHours">Trading Hours</Label>
                      <Select defaultValue="24h">
                        <SelectTrigger id="tradingHours">
                          <SelectValue placeholder="Select hours" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="24h">24 Hours</SelectItem>
                          <SelectItem value="day">Day Only (8am-8pm)</SelectItem>
                          <SelectItem value="night">Night Only (8pm-8am)</SelectItem>
                          <SelectItem value="custom">Custom Hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="maxOpenTrades">Maximum Open Trades</Label>
                      <Input
                        id="maxOpenTrades"
                        type="number"
                        placeholder="5"
                        value={botConfig.maxOpenTrades || 5}
                        onChange={(e) => handleChange("maxOpenTrades", parseInt(e.target.value))}
                      />
                    </div>
                    
                    <div className="p-3 rounded-lg bg-blue-500/10 text-blue-500 text-xs flex items-start">
                      <Info className="h-4 w-4 mr-2 mt-0.5" />
                      <p>
                        Advanced options give you more control but require deeper market knowledge. 
                        Consider running a backtest with these settings before activating the bot.
                      </p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            )}

            <div className="grid gap-2">
              <Label>DCA Interval (for DCA strategies)</Label>
              <Select 
                value={botConfig.interval || "daily"} 
                onValueChange={(value) => handleChange("interval", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Take Profit</Label>
              <div className="flex items-center">
                <Input
                  type="number"
                  value={botConfig.takeProfit || 5}
                  onChange={(e) => handleChange("takeProfit", parseFloat(e.target.value))}
                  className="flex-1"
                />
                <span className="ml-2">%</span>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Stop Loss</Label>
              <div className="flex items-center">
                <Input
                  type="number"
                  value={botConfig.stopLoss || 3}
                  onChange={(e) => handleChange("stopLoss", parseFloat(e.target.value))}
                  className="flex-1"
                />
                <span className="ml-2">%</span>
              </div>
            </div>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Trade Notifications</Label>
                <p className="text-xs text-muted-foreground">
                  Get notified about trades executed by this bot
                </p>
              </div>
              <Switch 
                checked={botConfig.tradeNotifications || false} 
                onCheckedChange={(checked) => handleChange("tradeNotifications", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Performance Reports</Label>
                <p className="text-xs text-muted-foreground">
                  Weekly reports about this bot's performance
                </p>
              </div>
              <Switch 
                checked={botConfig.performanceReports || true} 
                onCheckedChange={(checked) => handleChange("performanceReports", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Error Alerts</Label>
                <p className="text-xs text-muted-foreground">
                  Get notified when the bot encounters errors
                </p>
              </div>
              <Switch 
                checked={botConfig.errorAlerts || true} 
                onCheckedChange={(checked) => handleChange("errorAlerts", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Smart Notifications</Label>
                <p className="text-xs text-muted-foreground">
                  AI-powered alerts for unusual market movements
                </p>
              </div>
              <Switch 
                checked={botConfig.smartNotifications || false} 
                onCheckedChange={(checked) => handleChange("smartNotifications", checked)}
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex items-center border-t pt-4 mt-4">
          <Button variant="outline" onClick={onClose} className="border-muted-foreground/20">Cancel</Button>
          <Button onClick={handleSave} className="bg-primary text-white hover:bg-primary/90">
            <CheckCircle2 className="h-4 w-4 mr-1.5" /> Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Helper function for getting strategy icon safely
const getStrategyIcon = (strategy: string) => {
  if (strategy in strategyIcons) {
    return strategyIcons[strategy as keyof typeof strategyIcons];
  }
  return <Bot className="h-5 w-5" />;
};

// BacktestModal component for testing strategies with historical data
const BacktestModal = ({ 
  isOpen, 
  onClose,
  strategy = "ai dca pro", 
  pair = "BTC/USDT"
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  strategy?: string;
  pair?: string;
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);
  const [backtestConfig, setBacktestConfig] = useState({
    timeframe: "1d",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    initialCapital: 1000,
    strategy: strategy,
    pair: pair,
    leverage: 1,
    fees: 0.1
  });

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsRunning(false);
      setIsComplete(false);
      setProgress(0);
      setResults(null);
    }
  }, [isOpen]);

  const handleChange = (field: string, value: any) => {
    setBacktestConfig({
      ...backtestConfig,
      [field]: value
    });
  };

  const runBacktest = () => {
    setIsRunning(true);
    setProgress(0);
    
    // Simulate backtest progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          setIsComplete(true);
          
          // Generate mock results based on strategy
          const stratDetails = strategyDetails[backtestConfig.strategy as keyof typeof strategyDetails] || strategyDetails["ai dca"];
          const randomFactor = 0.8 + (Math.random() * 0.4); // Random factor between 0.8 and 1.2
          
          setResults({
            totalTrades: Math.floor(50 + Math.random() * 100),
            winRate: Math.floor(stratDetails.performanceStats.winRate * randomFactor),
            profit: (stratDetails.performanceStats.avgROI * randomFactor).toFixed(2),
            maxDrawdown: (15 + Math.random() * 10).toFixed(2),
            sharpeRatio: (1 + Math.random()).toFixed(2),
            bestTrade: (stratDetails.performanceStats.avgROI * 2 * randomFactor).toFixed(2),
            worstTrade: (-1 * (5 + Math.random() * 10)).toFixed(2),
            dailyData: Array.from({ length: 12 }, (_, i) => ({
              date: `${i+1}/2023`,
              balance: Math.floor(backtestConfig.initialCapital * (1 + ((stratDetails.performanceStats.avgROI/100) * (i/12) * randomFactor)))
            }))
          });
          
          return 100;
        }
        return prev + (100 - prev) / 10;
      });
    }, 500);
    
    return () => clearInterval(interval);
  };

  const getStrategyDetails = (stratId: string) => {
    return strategyDetails[stratId as keyof typeof strategyDetails] || strategyDetails["ai dca"];
  };

  const selectedStrategy = getStrategyDetails(backtestConfig.strategy);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[420px] border-none bg-background/95 backdrop-blur-lg shadow-lg rounded-xl">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center">
            {!isComplete ? (
              <LineChart className="h-5 w-5 mr-2 text-primary" />
            ) : (
              <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
            )}
            <div>
              <DialogTitle className="text-xl">
                {!isComplete ? "Backtest Strategy" : "Backtest Results"}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mt-1">
                {!isComplete 
                  ? "Test your trading strategy against historical market data"
                  : `Results for ${selectedStrategy.name} on ${backtestConfig.pair} (${backtestConfig.startDate} to ${backtestConfig.endDate})`}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {!isComplete ? (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="strategy">Strategy</Label>
                <Select 
                  value={backtestConfig.strategy} 
                  onValueChange={(value) => handleChange("strategy", value)}
                >
                  <SelectTrigger id="strategy">
                    <SelectValue placeholder="Select strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(strategyDetails).map(([key, strat]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center">
                          {strat.icon}
                          <span className="ml-2">{strat.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="pair">Trading Pair</Label>
                <Select 
                  value={backtestConfig.pair} 
                  onValueChange={(value) => handleChange("pair", value)}
                >
                  <SelectTrigger id="pair">
                    <SelectValue placeholder="Select pair" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BTC/USDT">BTC/USDT</SelectItem>
                    <SelectItem value="ETH/USDT">ETH/USDT</SelectItem>
                    <SelectItem value="SOL/USDT">SOL/USDT</SelectItem>
                    <SelectItem value="BNB/USDT">BNB/USDT</SelectItem>
                    <SelectItem value="ADA/USDT">ADA/USDT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={backtestConfig.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={backtestConfig.endDate}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="initialCapital">Initial Capital</Label>
                <div className="flex items-center">
                  <Input
                    id="initialCapital"
                    type="number"
                    value={backtestConfig.initialCapital}
                    onChange={(e) => handleChange("initialCapital", parseFloat(e.target.value))}
                    className="flex-1"
                  />
                  <span className="ml-2 text-muted-foreground">USDT</span>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="timeframe">Timeframe</Label>
                <Select 
                  value={backtestConfig.timeframe} 
                  onValueChange={(value) => handleChange("timeframe", value)}
                >
                  <SelectTrigger id="timeframe">
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5m">5 minutes</SelectItem>
                    <SelectItem value="15m">15 minutes</SelectItem>
                    <SelectItem value="1h">1 hour</SelectItem>
                    <SelectItem value="4h">4 hours</SelectItem>
                    <SelectItem value="1d">1 day</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="leverage">Leverage</Label>
                <div className="flex items-center">
                  <Input
                    id="leverage"
                    type="number"
                    value={backtestConfig.leverage}
                    onChange={(e) => handleChange("leverage", parseFloat(e.target.value))}
                    className="flex-1"
                    min="1"
                  />
                  <span className="ml-2 text-muted-foreground">x</span>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="fees">Trading Fees</Label>
                <div className="flex items-center">
                  <Input
                    id="fees"
                    type="number"
                    value={backtestConfig.fees}
                    onChange={(e) => handleChange("fees", parseFloat(e.target.value))}
                    className="flex-1"
                    step="0.01"
                  />
                  <span className="ml-2 text-muted-foreground">%</span>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/40 p-3 rounded-lg mt-2">
              <div className="flex items-start">
                <div className="p-2 rounded-full bg-muted mr-3">
                  {selectedStrategy.icon}
                </div>
                <div>
                  <h4 className="font-medium">{selectedStrategy.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedStrategy.fullDescription}
                  </p>
                  <div className="flex mt-2">
                    <Badge className={`mr-2 ${selectedStrategy.riskColor}`}>
                      {selectedStrategy.riskLevel.charAt(0).toUpperCase() + selectedStrategy.riskLevel.slice(1)} Risk
                    </Badge>
                    <Badge variant="outline" className="bg-primary/10 text-primary">
                      {selectedStrategy.performanceStats.avgROI}% Avg. ROI
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {isRunning && (
              <div className="mt-2">
                <Label className="text-sm mb-2 block">Backtest Progress</Label>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2 flex items-center">
                  <Timer className="h-3 w-3 mr-1.5 animate-pulse" />
                  Processing historical data ({Math.floor(progress)}%)
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-muted-foreground">Total Return</div>
                  <div className="text-3xl font-bold text-green-500">+{results.profit}%</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    ({backtestConfig.initialCapital} → {Math.floor(backtestConfig.initialCapital * (1 + parseFloat(results.profit)/100))} USDT)
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Win Rate</div>
                  <div className="text-3xl font-bold">{results.winRate}%</div>
                  <div className="text-sm text-muted-foreground mt-1">{results.totalTrades} total trades</div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-muted/20 p-3 rounded-lg">
                <div className="text-xs text-muted-foreground">Max Drawdown</div>
                <div className="text-lg font-semibold text-red-500">-{results.maxDrawdown}%</div>
              </div>
              <div className="bg-muted/20 p-3 rounded-lg">
                <div className="text-xs text-muted-foreground">Sharpe Ratio</div>
                <div className="text-lg font-semibold">{results.sharpeRatio}</div>
              </div>
              <div className="bg-muted/20 p-3 rounded-lg">
                <div className="text-xs text-muted-foreground">Best Trade</div>
                <div className="text-lg font-semibold text-green-500">+{results.bestTrade}%</div>
              </div>
              <div className="bg-muted/20 p-3 rounded-lg">
                <div className="text-xs text-muted-foreground">Worst Trade</div>
                <div className="text-lg font-semibold text-red-500">{results.worstTrade}%</div>
              </div>
            </div>
            
            <div className="mt-2">
              <h3 className="text-base font-medium mb-3">Balance Curve</h3>
              <div className="h-48 w-full bg-muted/20 rounded-lg p-4">
                <div className="w-full h-full relative">
                  {/* Simple chart display */}
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-muted-foreground/30"></div>
                  <div className="absolute top-0 left-0 h-full w-[1px] bg-muted-foreground/30"></div>
                  
                  <div className="flex h-full items-end relative">
                    {results.dailyData.map((point: any, i: number) => {
                      const normalizedHeight = (point.balance / (backtestConfig.initialCapital * 2)) * 100;
                      return (
                        <div key={i} className="flex-1 group relative">
                          <div 
                            className="w-full bg-green-500/70 rounded-t transition-all"
                            style={{ height: `${Math.min(normalizedHeight, 100)}%` }}
                          ></div>
                          
                          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                            {point.date}: {point.balance} USDT
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <Button variant="outline" onClick={() => setIsComplete(false)}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Modify Settings
              </Button>
              
              <Button variant="default" onClick={() => {
                // Would create a bot with these settings in real app
                onClose();
              }}>
                <PlusCircle className="h-4 w-4 mr-2" /> Create Bot with These Settings
              </Button>
            </div>
          </div>
        )}

        <DialogFooter className={`${!isComplete ? 'flex items-center' : 'hidden'} border-t pt-4 mt-4`}>
          <div className="flex-1 mr-auto">
            {isRunning && (
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2 text-primary" />
                <span className="text-sm text-muted-foreground">
                  Processing... {Math.floor(progress)}%
                </span>
              </div>
            )}
          </div>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              onClick={onClose} 
              disabled={isRunning}
              className="border-muted-foreground/20"
            >
              Cancel
            </Button>
            <Button 
              onClick={runBacktest} 
              disabled={isRunning}
              className={`${isRunning ? 'bg-primary/70' : 'bg-primary'} text-white hover:bg-primary/90`}
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Running
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" /> Run Backtest
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Main Trading Bots Page Component
const BotSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("virtual");
  const [selectedBot, setSelectedBot] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isBacktestModalOpen, setIsBacktestModalOpen] = useState(false);
  const [backtestStrategy, setBacktestStrategy] = useState("ai dca pro");
  const [backtestPair, setBacktestPair] = useState("BTC/USDT");
  const [createBotType, setCreateBotType] = useState<"virtual" | "real">("virtual");
  const [simulatorParams, setSimulatorParams] = useState({
    investment: 100,
    days: 30,
    strategy: "ai dca pro"
  });
  const [showEducationalModal, setShowEducationalModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | "running" | "stopped">("all");
  
  // Simulate expected returns based on parameter inputs
  const calculateSimulatedReturns = () => {
    const strategy = strategyDetails[simulatorParams.strategy as keyof typeof strategyDetails];
    const dailyROI = (strategy.performanceStats.avgROI / 100) / 30; // Monthly ROI to daily
    const compoundedReturn = simulatorParams.investment * Math.pow(1 + dailyROI, simulatorParams.days);
    return {
      finalAmount: compoundedReturn,
      profit: compoundedReturn - simulatorParams.investment,
      profitPercentage: ((compoundedReturn / simulatorParams.investment) - 1) * 100
    };
  };
  
  // Calculate returns for display
  const simulatedReturns = calculateSimulatedReturns();
  
  const handleOpenCreateModal = (type: "virtual" | "real") => {
    setCreateBotType(type);
    setIsCreateModalOpen(true);
  };
  
  const handleOpenSettingsModal = (bot: any) => {
    setSelectedBot(bot);
    setIsSettingsModalOpen(true);
  };
  
  const handleOpenBacktestModal = (strategy: string, pair: string) => {
    setBacktestStrategy(strategy);
    setBacktestPair(pair);
    setIsBacktestModalOpen(true);
  };
  
  const filteredVirtualBots = useMemo(() => {
    if (filterStatus === "all") return virtualBots;
    return virtualBots.filter(bot => 
      filterStatus === "running" ? bot.status === "running" : bot.status === "stopped"
    );
  }, [filterStatus]);
  
  const filteredRealBots = useMemo(() => {
    if (filterStatus === "all") return realBots;
    return realBots.filter(bot => 
      filterStatus === "running" ? bot.status === "running" : bot.status === "stopped"
    );
  }, [filterStatus]);
  
  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar />
      
      {/* Hero section with improved visuals - removing the blue gradient background */}
      <div className="pt-16 pb-8">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-6"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Trading Bots</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Automate your crypto trading with AI-powered strategies. Earn rewards whether you're a beginner or an expert.
            </p>
          </motion.div>
          
          {/* "Limited Time Offer" Banner */}
          <motion.div 
            className="bg-gradient-to-r from-amber-500/90 to-yellow-600/90 text-black p-3 rounded-lg mb-6 shadow-lg max-w-3xl mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <div className="flex items-center">
              <div className="mr-3 bg-white/20 p-2 rounded-full">
                <Clock8 className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Limited-Time Offer: 20% off AI Dual Grid Premium Strategy</h3>
                <p className="text-sm opacity-90">Get access to our highest-performing strategies for a special price. Offer ends in 3 days!</p>
              </div>
              <Button size="sm" className="bg-white text-amber-600 hover:bg-white/90 whitespace-nowrap text-sm">
                Claim Offer
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
      
      <main className="px-4 py-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Bot Dashboard</h1>
            <Button size="sm" variant="outline" className="text-sm">
              <HelpCircle className="h-4 w-4 mr-2" /> Tutorial
            </Button>
          </div>
        </motion.div>
        
        <Tabs defaultValue="virtual" className="mb-8" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6 p-1 backdrop-blur-sm rounded-lg">
            <TabsTrigger value="virtual" className="text-sm rounded-md py-2.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Bot className="h-4 w-4 mr-2" /> Virtual Bots
            </TabsTrigger>
            <TabsTrigger value="real" className="text-sm rounded-md py-2.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <BarChart4 className="h-4 w-4 mr-2" /> Real Bots
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-sm rounded-md py-2.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <LineChart className="h-4 w-4 mr-2" /> Analytics
            </TabsTrigger>
          </TabsList>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent value="virtual" className="mt-0">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">Virtual Trading Bots</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Virtual bots trade on our in-platform markets and generate GCC tokens.
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => handleOpenBacktestModal("ai dca pro", "BTC/USDT")}
                    >
                      <LineChart className="h-3.5 w-3.5 mr-1.5" /> Backtest
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-primary to-primary/90 text-white"
                      onClick={() => handleOpenCreateModal("virtual")}
                    >
                      <Plus className="h-4 w-4 mr-1.5" /> New Bot
                    </Button>
                  </div>
                </div>
                
                {/* Virtual OTC Bots Card */}
                <Card className="border-none overflow-hidden mb-6">
                  <CardHeader className="pb-2">
                    <Badge variant="outline" className="self-start bg-blue-500/10 text-blue-500 mb-2">For Beginners</Badge>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Bot className="h-5 w-5 text-blue-500" />
                      Virtual OTC Bots
                    </CardTitle>
                    <CardDescription>
                      Trade with app tokens, learn strategies, and earn in-app rewards without risking real funds.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>Learn-to-Earn with risk-free trading competitions</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>Earn up to 100 GCC tokens daily with AI strategies</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>Compete in leaderboards for bonus rewards</span>
                      </li>
                    </ul>
                    <div className="mt-3 bg-blue-500/10 text-blue-500 rounded p-2 text-sm flex items-center">
                      <Trophy className="h-4 w-4 mr-2" />
                      500+ users now earning daily rewards
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                      onClick={() => handleOpenCreateModal("virtual")}
                    >
                      Start Virtual Trading
                    </Button>
                  </CardFooter>
                </Card>
                
                <div className="space-y-5">
                  <div className="flex justify-between items-center mb-4">
                    <Badge variant="outline" className="text-xs py-1.5 px-3 font-medium bg-green-500/10 text-green-500">
                      {filteredVirtualBots.filter(b => b.status === "running").length} Active Bots
                    </Badge>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={`text-xs ${filterStatus === "all" ? "bg-primary/10 text-primary border-primary/20" : "bg-background hover:bg-background/80"}`}
                        onClick={() => setFilterStatus("all")}
                      >
                        <Activity className="h-3.5 w-3.5 mr-1.5" /> All
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={`text-xs ${filterStatus === "running" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-background hover:bg-background/80"}`}
                        onClick={() => setFilterStatus("running")}
                      >
                        <Play className="h-3.5 w-3.5 mr-1.5" /> Running
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={`text-xs ${filterStatus === "stopped" ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-background hover:bg-background/80"}`}
                        onClick={() => setFilterStatus("stopped")}
                      >
                        <PowerOff className="h-3.5 w-3.5 mr-1.5" /> Stopped
                      </Button>
                    </div>
                  </div>
                  
                  {filteredVirtualBots.length === 0 ? (
                    <div className="bg-muted/30 rounded-lg p-8 text-center">
                      <div className="mx-auto w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                        <Bot className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No bots found</h3>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
                        {filterStatus !== "all" 
                          ? `You don't have any ${filterStatus} virtual bots. Try changing the filter or create a new bot.`
                          : "You haven't created any virtual bots yet. Start by creating your first bot."}
                      </p>
                      <Button 
                        onClick={() => handleOpenCreateModal("virtual")}
                        className="bg-primary/90 hover:bg-primary"
                      >
                        <Plus className="h-4 w-4 mr-2" /> Create Virtual Bot
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredVirtualBots.map(bot => (
                        <div key={bot.id} onClick={() => handleOpenSettingsModal(bot)}>
                          <BotCard bot={bot} type="virtual" />
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Virtual Bots Pro Tips */}
                  <Card className="border-none mt-8">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Sparkles className="h-5 w-5 mr-2 text-primary" /> Virtual Bot Pro Tips
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg border flex items-start">
                          <Trophy className="h-4 w-4 mr-2 mt-0.5 text-amber-500" />
                          <div>
                            <h4 className="text-sm font-medium">Compete in Trading Contests</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              Join weekly contests to earn bonus rewards and climb the leaderboard!
                            </p>
                          </div>
                        </div>
                        <div className="p-3 rounded-lg border flex items-start">
                          <BookOpen className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
                          <div>
                            <h4 className="text-sm font-medium">Learn from Top Performers</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              Study strategies from leading traders to improve your skills.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="real" className="mt-0">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">Real Trading Bots</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Premium bots that connect to real exchanges and trade your crypto assets.
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => handleOpenBacktestModal("martingl", "BTC/USDT")}
                    >
                      <LineChart className="h-3.5 w-3.5 mr-1.5" /> Backtest
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-primary to-primary/90 text-white"
                      onClick={() => handleOpenCreateModal("real")}
                    >
                      <Plus className="h-4 w-4 mr-1.5" /> New Bot
                    </Button>
                  </div>
                </div>
                
                {/* Real Crypto Bots Card */}
                <Card className="border-none overflow-hidden mb-6">
                  <CardHeader className="pb-2">
                    <Badge variant="outline" className="self-start bg-purple-500/10 text-purple-500 mb-2">For Experts</Badge>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <BarChart4 className="h-5 w-5 text-purple-500" />
                      Real Crypto Bots
                    </CardTitle>
                    <CardDescription>
                      Connect to exchanges via API and trade real crypto with our advanced strategies.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>Secure API integration with top exchanges</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>Top 3 bots averaged 15% ROI last month</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>Basic ($10/mo) and Premium ($50/mo) plans</span>
                      </li>
                    </ul>
                    <div className="mt-3 bg-purple-500/10 text-purple-500 rounded p-2 text-sm flex items-center">
                      <Lock className="h-4 w-4 mr-2" />
                      7-day free trial available for new users
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
                      onClick={() => handleOpenCreateModal("real")}
                    >
                      Start 7-Day Free Trial
                    </Button>
                  </CardFooter>
                </Card>
                
                <div className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded-xl p-4 mb-5 flex items-start">
                  <Lock className="h-6 w-6 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-base font-semibold mb-1 text-amber-500">Premium Feature</h3>
                    <p className="text-sm text-muted-foreground">
                      Unlock premium trading bots to trade on major exchanges with API keys and earn real crypto profits.
                      Our premium bots use advanced AI algorithms for optimal trading performance.
                    </p>
                    <Button size="sm" className="mt-3 text-sm bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-medium hover:from-amber-600 hover:to-yellow-600">
                      <CreditCard className="h-4 w-4 mr-2" /> Upgrade to Premium
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-5">
                  <div className="flex justify-between items-center mb-4">
                    <Badge variant="outline" className="text-xs py-1.5 px-3 font-medium bg-green-500/10 text-green-500">
                      {filteredRealBots.filter(b => b.status === "running").length} Active Bots
                    </Badge>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={`text-xs ${filterStatus === "all" ? "bg-primary/10 text-primary border-primary/20" : "bg-background hover:bg-background/80"}`}
                        onClick={() => setFilterStatus("all")}
                      >
                        <Activity className="h-3.5 w-3.5 mr-1.5" /> All
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={`text-xs ${filterStatus === "running" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-background hover:bg-background/80"}`}
                        onClick={() => setFilterStatus("running")}
                      >
                        <Play className="h-3.5 w-3.5 mr-1.5" /> Running
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={`text-xs ${filterStatus === "stopped" ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-background hover:bg-background/80"}`}
                        onClick={() => setFilterStatus("stopped")}
                      >
                        <PowerOff className="h-3.5 w-3.5 mr-1.5" /> Stopped
                      </Button>
                    </div>
                  </div>
                  
                  {filteredRealBots.length === 0 ? (
                    <div className="bg-muted/30 rounded-lg p-8 text-center">
                      <div className="mx-auto w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                        <BarChart4 className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No bots found</h3>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
                        {filterStatus !== "all" 
                          ? `You don't have any ${filterStatus} real bots. Try changing the filter or create a new bot.`
                          : "You haven't created any real trading bots yet. Start by creating your first bot."}
                      </p>
                      <Button 
                        onClick={() => handleOpenCreateModal("real")}
                        className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                      >
                        <Plus className="h-4 w-4 mr-2" /> Create Real Bot
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredRealBots.map(bot => (
                        <div key={bot.id} onClick={() => handleOpenSettingsModal(bot)}>
                          <BotCard bot={bot} type="real" />
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Exchange Connection */}
                  <Card className="border-none mt-8">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <CreditCard className="h-5 w-5 mr-2 text-purple-500" /> Connected Exchanges
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="p-3 rounded-lg border flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-8 w-8 flex items-center justify-center rounded-full bg-muted mr-3">B</div>
                            <div>
                              <h4 className="text-sm font-medium">Binance</h4>
                              <p className="text-xs text-muted-foreground">Connected on Sept 20, 2023</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="text-xs">
                            Manage
                          </Button>
                        </div>
                        <div className="p-3 rounded-lg border flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-8 w-8 flex items-center justify-center rounded-full bg-muted mr-3">C</div>
                            <div>
                              <h4 className="text-sm font-medium">Coinbase</h4>
                              <p className="text-xs text-muted-foreground">Connected on Oct 5, 2023</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="text-xs">
                            Manage
                          </Button>
                        </div>
                        <Button className="w-full" variant="outline" size="sm">
                          <Plus className="h-3.5 w-3.5 mr-1.5" /> Connect New Exchange
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="analytics" className="mt-0">
                <div className="mb-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold">Bot Analytics</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Track the performance of all your trading bots and optimize your strategies.
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px] h-9 text-xs">
                        <SelectValue placeholder="Filter by bot type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Bots</SelectItem>
                        <SelectItem value="virtual">Virtual Bots Only</SelectItem>
                        <SelectItem value="real">Real Bots Only</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button variant="outline" size="sm" className="text-xs">
                      <Download className="h-3.5 w-3.5 mr-1.5" /> Export
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {/* Summary Statistics */}
                  <Card className="border-none">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center justify-between">
                        <span>Overall Performance</span>
                        <Select defaultValue="30d">
                          <SelectTrigger className="w-[100px] h-7 text-xs">
                            <SelectValue placeholder="Time period" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="7d">7 Days</SelectItem>
                            <SelectItem value="30d">30 Days</SelectItem>
                            <SelectItem value="90d">90 Days</SelectItem>
                            <SelectItem value="1y">1 Year</SelectItem>
                          </SelectContent>
                        </Select>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground">Total Profit</span>
                          <span className="text-2xl font-bold text-green-500">
                            +{analyticsData.totalProfit.virtual + analyticsData.totalProfit.real} USD
                          </span>
                          <span className="text-xs text-green-500">
                            +{((analyticsData.profitPercentage.virtual + analyticsData.profitPercentage.real) / 2).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground">Active Bots</span>
                          <span className="text-2xl font-bold">
                            {analyticsData.activeBots.virtual + analyticsData.activeBots.real}/{virtualBots.length + realBots.length}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {analyticsData.activeBots.virtual} virtual, {analyticsData.activeBots.real} real
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground">Win Rate</span>
                          <span className="text-2xl font-bold">
                            {Math.round((analyticsData.avgWinRate.virtual + analyticsData.avgWinRate.real) / 2)}%
                          </span>
                          <div className="mt-1 w-full bg-muted rounded-full h-1.5">
                            <div 
                              className="bg-primary h-1.5 rounded-full" 
                              style={{ width: `${Math.round((analyticsData.avgWinRate.virtual + analyticsData.avgWinRate.real) / 2)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground">Total Trades</span>
                          <span className="text-2xl font-bold">
                            {analyticsData.totalTrades.virtual + analyticsData.totalTrades.real}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Last 30 days
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Performance Charts */}
                  <Tabs defaultValue="overview" className="mt-6">
                    <TabsList className="grid grid-cols-3 w-[400px]">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="performance">Performance</TabsTrigger>
                      <TabsTrigger value="comparison">Comparison</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview" className="mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="border-none">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Monthly Performance</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-64">
                              <BotAnalytics />
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="border-none">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Strategy Performance</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {Object.values(strategyDetails).map((strategy, index) => (
                                <div key={index} className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <div className="p-1.5 rounded-full bg-muted mr-2.5">
                                      {strategy.icon}
                                    </div>
                                    <div>
                                      <div className="text-sm font-medium">{strategy.name}</div>
                                      <div className="text-xs text-muted-foreground">
                                        Win Rate: {strategy.performanceStats.winRate}%
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm font-semibold text-green-500">
                                      +{strategy.performanceStats.avgROI}%
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {strategy.performanceStats.userCount} users
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="performance" className="mt-4">
                      <Card className="border-none overflow-hidden">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center justify-between">
                            <div className="flex items-center">
                              <span>Detailed Performance</span>
                              <Info className="h-4 w-4 ml-2 text-muted-foreground" />
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                                <ChevronLeft className="h-3.5 w-3.5" />
                              </Button>
                              <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                                <ChevronRight className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-80 bg-muted/20 rounded-lg p-4 relative">
                            {/* A more detailed performance chart would go here */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-full h-48 flex items-end space-x-1">
                                {Array.from({ length: 30 }, (_, i) => (
                                  <div 
                                    key={i} 
                                    className={`flex-1 ${Math.random() > 0.5 ? 'bg-green-500/70' : 'bg-red-500/70'} rounded-t`}
                                    style={{ height: `${20 + Math.random() * 80}%` }}
                                  ></div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="absolute bottom-4 left-4 right-4 flex justify-between text-xs text-muted-foreground">
                              <span>May 1</span>
                              <span>May 15</span>
                              <span>May 30</span>
                            </div>
                          </div>
                          
                          <div className="mt-4 grid grid-cols-3 gap-4">
                            <div className="bg-muted/20 p-3 rounded-lg">
                              <div className="text-xs text-muted-foreground">Average Daily Return</div>
                              <div className="text-base font-medium mt-1 text-green-500">+0.42%</div>
                            </div>
                            <div className="bg-muted/20 p-3 rounded-lg">
                              <div className="text-xs text-muted-foreground">Maximum Drawdown</div>
                              <div className="text-base font-medium mt-1 text-red-500">-8.2%</div>
                            </div>
                            <div className="bg-muted/20 p-3 rounded-lg">
                              <div className="text-xs text-muted-foreground">Risk/Reward Ratio</div>
                              <div className="text-base font-medium mt-1">1:2.5</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="comparison" className="mt-4">
                      <Card className="border-none overflow-hidden">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Strategy Comparison</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                              <Select defaultValue="ai_dca_pro">
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue placeholder="Select strategy 1" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="ai_dca_pro">AI DCA Pro</SelectItem>
                                  <SelectItem value="martingl">Martingale</SelectItem>
                                  <SelectItem value="ai_grid">AI Grid</SelectItem>
                                </SelectContent>
                              </Select>
                              <span>vs.</span>
                              <Select defaultValue="martingl">
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue placeholder="Select strategy 2" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="ai_dca_pro">AI DCA Pro</SelectItem>
                                  <SelectItem value="martingl">Martingale</SelectItem>
                                  <SelectItem value="ai_grid">AI Grid</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="h-64 bg-muted/20 rounded-lg p-4 relative">
                              {/* Comparative chart visualization would go here */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-full h-full relative">
                                  {/* Two lines representing strategy performance */}
                                  <div className="absolute inset-x-0 bottom-0 h-[1px] bg-muted-foreground/30"></div>
                                  <div className="absolute inset-y-0 left-0 w-[1px] bg-muted-foreground/30"></div>
                                  
                                  <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
                                    {/* First strategy line */}
                                    <path 
                                      d="M0,50 C10,45 20,30 30,35 C40,40 50,20 60,15 C70,10 80,25 90,20 L100,10" 
                                      fill="none" 
                                      stroke="hsl(var(--primary))" 
                                      strokeWidth="1"
                                    />
                                    {/* Second strategy line */}
                                    <path 
                                      d="M0,50 C10,48 20,40 30,42 C40,44 50,30 60,28 C70,26 80,32 90,30 L100,25" 
                                      fill="none" 
                                      stroke="hsl(var(--secondary))" 
                                      strokeWidth="1"
                                    />
                                  </svg>
                                </div>
                              </div>
                              
                              <div className="absolute top-4 right-4 flex items-center space-x-3 text-xs">
                                <div className="flex items-center">
                                  <div className="w-3 h-1 bg-primary mr-1.5"></div>
                                  <span>AI DCA Pro</span>
                                </div>
                                <div className="flex items-center">
                                  <div className="w-3 h-1 bg-secondary mr-1.5"></div>
                                  <span>Martingale</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-4 gap-2 text-center">
                              <div className="p-2 rounded-lg bg-muted/20">
                                <div className="text-xs text-muted-foreground">Win Rate</div>
                                <div className="text-sm font-medium mt-1">AI DCA Pro: 68%</div>
                                <div className="text-sm font-medium">Martingale: 58%</div>
                              </div>
                              <div className="p-2 rounded-lg bg-muted/20">
                                <div className="text-xs text-muted-foreground">Avg. ROI</div>
                                <div className="text-sm font-medium mt-1 text-green-500">AI DCA Pro: 14.2%</div>
                                <div className="text-sm font-medium text-green-500">Martingale: 18.6%</div>
                              </div>
                              <div className="p-2 rounded-lg bg-muted/20">
                                <div className="text-xs text-muted-foreground">Max Drawdown</div>
                                <div className="text-sm font-medium mt-1 text-red-500">AI DCA Pro: -12%</div>
                                <div className="text-sm font-medium text-red-500">Martingale: -24%</div>
                              </div>
                              <div className="p-2 rounded-lg bg-muted/20">
                                <div className="text-xs text-muted-foreground">Risk Level</div>
                                <div className="text-sm font-medium mt-1">AI DCA Pro: Medium</div>
                                <div className="text-sm font-medium">Martingale: High</div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                  
                  {/* Profit Simulator */}
                  <Card className="border-none">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <Calculator className="h-5 w-5 mr-2 text-primary" /> Profit Simulator
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-4 col-span-2">
                          <div>
                            <Label>Strategy</Label>
                            <Select 
                              value={simulatorParams.strategy} 
                              onValueChange={(value) => setSimulatorParams({...simulatorParams, strategy: value})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a strategy" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(strategyDetails).map(([key, strategy]) => (
                                  <SelectItem key={key} value={key}>
                                    <div className="flex items-center">
                                      <div className="mr-2">{strategy.icon}</div>
                                      <span>{strategy.name}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <div className="flex justify-between">
                              <Label>Investment Amount</Label>
                              <span className="text-sm">{simulatorParams.investment} USD</span>
                            </div>
                            <Slider
                              value={[simulatorParams.investment]}
                              min={100}
                              max={10000}
                              step={100}
                              onValueChange={(value) => setSimulatorParams({...simulatorParams, investment: value[0]})}
                              className="mt-2"
                            />
                          </div>
                          
                          <div>
                            <div className="flex justify-between">
                              <Label>Time Period</Label>
                              <span className="text-sm">{simulatorParams.days} days</span>
                            </div>
                            <Slider
                              value={[simulatorParams.days]}
                              min={7}
                              max={365}
                              step={7}
                              onValueChange={(value) => setSimulatorParams({...simulatorParams, days: value[0]})}
                              className="mt-2"
                            />
                          </div>
                          
                          <div className="text-xs text-muted-foreground">
                            <AlertTriangle className="h-3 w-3 inline mr-1" />
                            Past performance is not indicative of future results. This is only a simulation.
                          </div>
                        </div>
                        
                        <div className="bg-muted/30 rounded-lg p-4 flex flex-col justify-center">
                          <div className="text-center mb-4">
                            <h3 className="text-sm font-medium text-muted-foreground">Projected Returns</h3>
                            <div className="text-3xl font-bold text-green-500 mt-1">
                              ${simulatedReturns.finalAmount.toFixed(2)}
                            </div>
                            <div className="text-sm text-green-500">
                              +${simulatedReturns.profit.toFixed(2)} (+{simulatedReturns.profitPercentage.toFixed(2)}%)
                            </div>
                          </div>
                          
                          <Separator className="my-3" />
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Initial Investment:</span>
                              <span>${simulatorParams.investment.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Time Period:</span>
                              <span>{simulatorParams.days} days</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Strategy:</span>
                              <span>{strategyDetails[simulatorParams.strategy as keyof typeof strategyDetails]?.name}</span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 mt-4">
                            <Button
                              className="flex-1"
                              onClick={() => handleOpenBacktestModal(simulatorParams.strategy, "BTC/USDT")}
                            >
                              <LineChart className="h-4 w-4 mr-2" /> Backtest
                            </Button>
                            <Button className="flex-1" onClick={() => handleOpenCreateModal(activeTab === "virtual" ? "virtual" : "real")}>
                              <Play className="h-4 w-4 mr-2" /> Create Bot
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Leaderboard */}
                  <Card className="border-none">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <Trophy className="h-5 w-5 mr-2 text-amber-500" /> Top Performers Leaderboard
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Tabs defaultValue="weekly" className="w-[300px]">
                          <TabsList>
                            <TabsTrigger value="weekly">Weekly</TabsTrigger>
                            <TabsTrigger value="monthly">Monthly</TabsTrigger>
                            <TabsTrigger value="alltime">All Time</TabsTrigger>
                          </TabsList>
                        </Tabs>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="text-left text-xs text-muted-foreground">
                                <th className="py-2 pr-6">Rank</th>
                                <th className="py-2 pr-6">Bot Name</th>
                                <th className="py-2 pr-6">Owner</th>
                                <th className="py-2 pr-6">Strategy</th>
                                <th className="py-2 pr-6">Monthly ROI</th>
                                <th className="py-2">Win Rate</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[
                                { rank: 1, botName: "CryptoWhale", owner: "TRADER_954", strategy: "ai dual grid", roi: 28.4, winRate: 74 },
                                { rank: 2, botName: "Alpha Seeker", owner: "moonwalker", strategy: "martingl", roi: 24.1, winRate: 68 },
                                { rank: 3, botName: "ETH Master", owner: "cryptoninjas", strategy: "ai dca pro", roi: 22.8, winRate: 82 },
                                { rank: 4, botName: "Steady Gains", owner: "blockchainer", strategy: "ai grid", roi: 18.6, winRate: 77 },
                                { rank: 5, botName: "BTC Knight", owner: "satoshi23", strategy: "ai dca pro", roi: 17.2, winRate: 71 }
                              ].map((entry, i) => (
                                <tr key={i} className="border-t border-border/30">
                                  <td className="py-2 pr-6">
                                    <div className="flex items-center">
                                      {entry.rank <= 3 ? (
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-1 
                                          ${entry.rank === 1 ? 'bg-amber-500/20 text-amber-500' : 
                                            entry.rank === 2 ? 'bg-slate-300/20 text-slate-400' : 
                                            'bg-amber-700/20 text-amber-700'}`}
                                        >
                                          {entry.rank}
                                        </div>
                                      ) : (
                                        <div className="w-6 h-6 flex items-center justify-center mr-1">
                                          {entry.rank}
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                  <td className="py-2 pr-6 font-medium">{entry.botName}</td>
                                  <td className="py-2 pr-6">{entry.owner}</td>
                                  <td className="py-2 pr-6">
                                    <div className="flex items-center">
                                      {strategyDetails[entry.strategy as keyof typeof strategyDetails]?.icon}
                                      <span className="ml-1.5 text-sm">
                                        {strategyDetails[entry.strategy as keyof typeof strategyDetails]?.name}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="py-2 pr-6 text-green-500">+{entry.roi}%</td>
                                  <td className="py-2">{entry.winRate}%</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <Button variant="outline" size="sm" className="text-xs">
                            <Users className="h-3.5 w-3.5 mr-1.5" /> Find Friends
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs">
                            View Full Leaderboard <ChevronRight className="h-3.5 w-3.5 ml-1.5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
        
        {/* Strategy Cards Section */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold">Available Strategies</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Create a new bot using one of our advanced trading strategies.
              </p>
            </div>
            <Button variant="outline" size="sm" className="text-sm">
              Compare All <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { 
                name: "AI DCA Pro", 
                icon: <Sparkles className="h-5 w-5 text-purple-500" />,
                description: "Advanced dollar-cost averaging with AI timing",
                markets: ["Spot", "Futures"],
                automated: true,
                color: "from-blue-500/20 to-indigo-500/20"
              },
              { 
                name: "Martingale", 
                icon: <Shuffle className="h-5 w-5 text-red-500" />,
                description: "Progressive position sizing strategy",
                markets: ["Spot", "Futures"],
                automated: true,
                color: "from-green-500/20 to-emerald-500/20"
              },
              { 
                name: "AI DCA", 
                icon: <Bot className="h-5 w-5 text-blue-500" />,
                description: "Basic AI-powered dollar-cost averaging",
                markets: ["Futures", "Spot"],
                automated: true,
                color: "from-blue-400/20 to-sky-400/20"
              },
              { 
                name: "AI Grid", 
                icon: <Grid className="h-5 w-5 text-indigo-500" />,
                description: "Grid trading with AI-optimized levels",
                markets: ["Futures", "Spot"],
                automated: true,
                color: "from-indigo-500/20 to-violet-500/20"
              },
              { 
                name: "AI Dual Grid", 
                icon: <Grid3X3 className="h-5 w-5 text-purple-600" />,
                description: "Dual grid strategy for volatile markets",
                markets: ["Futures"],
                automated: true,
                color: "from-purple-500/20 to-fuchsia-500/20"
              },
              { 
                name: "Basic DCA", 
                icon: <RefreshCw className="h-5 w-5 text-teal-500" />,
                description: "Simple dollar-cost averaging strategy",
                markets: ["Futures", "Spot"],
                automated: false,
                color: "from-cyan-500/20 to-teal-500/20"
              }
            ].map((strategy, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="border-none overflow-hidden h-full">
                  <CardHeader className="pb-2 relative">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-muted mr-3">
                        {strategy.icon}
                      </div>
                      <div>
                        <CardTitle className="text-base">{strategy.name}</CardTitle>
                        <div className="flex mt-1.5">
                          {strategy.markets.map((market, i) => (
                            <Badge key={i} variant="outline" className={`text-xs ${i > 0 ? 'ml-1' : ''}`}>
                              {market}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="relative">
                    <p className="text-sm text-muted-foreground">
                      {strategy.description}
                    </p>
                  </CardContent>
                  <CardFooter className="border-t border-border/20 pt-3 relative">
                    <div className="flex items-center justify-between w-full">
                      <Badge 
                        variant={strategy.automated ? "default" : "outline"} 
                        className={`text-xs ${strategy.automated ? 'bg-green-500/10 text-green-500' : ''}`}
                      >
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
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs hover:bg-muted/60"
                      >
                        <PlusCircle className="h-3.5 w-3.5 mr-1" /> Create
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      
      <BottomNav />
      
      {/* Modal components */}
      {isCreateModalOpen && (
        <CreateBotModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)} 
          botType={createBotType}
        />
      )}
      
      {isSettingsModalOpen && selectedBot && (
        <BotSettingsModal 
          isOpen={isSettingsModalOpen} 
          onClose={() => setIsSettingsModalOpen(false)} 
          bot={selectedBot}
        />
      )}
      
      {isBacktestModalOpen && (
        <BacktestModal 
          isOpen={isBacktestModalOpen} 
          onClose={() => setIsBacktestModalOpen(false)} 
          strategy={backtestStrategy}
          pair={backtestPair}
        />
      )}
      
    </div>
  );
};

export default BotSettings;
