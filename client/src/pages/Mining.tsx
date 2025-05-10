import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { useMining } from "@/hooks/useMining";
import { useUser } from "@/hooks/useUser";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { 
  Cpu, 
  Building, 
  ArrowUp, 
  Zap,
  Battery, 
  Cloud,
  Server, 
  Loader2, 
  AlertTriangle,
  Sliders, 
  ChevronRight,
  BadgeDollarSign,
  Gauge,
  TrendingUp,
  Users,
  Play,
  Trophy,
  ChevronUp,
  Gift,
  Share2,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MiningRig {
  id: number;
  name: string;
  level: number;
  hashRate: number;
  power: number;
  cost: number;
  owned: boolean;
  type: 'basic' | 'advanced' | 'premium';
  category: 'free' | 'super';
  boostActive?: boolean;
  boostEndTime?: number;
  boostMultiplier?: number;
  skinId?: string;
}

interface Upgrade {
  id: number;
  name: string;
  description: string;
  bonus: number;
  cost: number;
  applied: boolean;
  category: 'free' | 'super' | 'both';
}

interface AdBoost {
  id: number;
  name: string;
  description: string;
  duration: number; // in minutes
  multiplier: number;
  adCount: number; // number of ads to watch
}

interface MiningLeague {
  id: number;
  name: string;
  minHashRate: number;
  prizePool: number;
  participants: number;
  endTime: number; // timestamp
}

interface Team {
  id: number;
  name: string;
  members: number;
  totalHashRate: number;
  rank: number;
}

const Mining: React.FC = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const { miningProgress, setMiningProgress, updateMiningProgress } = useMining();
  
  // Free Miners (In-App Token Mining)
  const [freeMiners, setFreeMiners] = useState<MiningRig[]>([
    {
      id: 1,
      name: "Basic Miner",
      level: 1,
      hashRate: 10,
      power: 5,
      cost: 100,
      owned: true,
      type: 'basic',
      category: 'free'
    },
    {
      id: 2,
      name: "Advanced Miner",
      level: 1,
      hashRate: 25,
      power: 15,
      cost: 500,
      owned: false,
      type: 'advanced',
      category: 'free'
    },
    {
      id: 3,
      name: "Premium Miner",
      level: 1,
      hashRate: 50,
      power: 40,
      cost: 2000,
      owned: false,
      type: 'premium',
      category: 'free'
    }
  ]);
  
  // Super Miners (On-Chain Token Mining)
  const [superMiners, setSuperMiners] = useState<MiningRig[]>([
    {
      id: 4,
      name: "Stake Miner",
      level: 1,
      hashRate: 30,
      power: 10,
      cost: 50, // on-chain tokens
      owned: false,
      type: 'basic',
      category: 'super'
    },
    {
      id: 5,
      name: "Quantum Miner",
      level: 1,
      hashRate: 75,
      power: 25,
      cost: 200, // on-chain tokens
      owned: false,
      type: 'advanced',
      category: 'super'
    },
    {
      id: 6,
      name: "Genesis Miner",
      level: 1,
      hashRate: 150,
      power: 60,
      cost: 500, // on-chain tokens
      owned: false,
      type: 'premium',
      category: 'super'
    }
  ]);
  
  const [upgrades, setUpgrades] = useState<Upgrade[]>([
    {
      id: 1,
      name: "Cooling System",
      description: "Reduces power consumption by 10%",
      bonus: 10,
      cost: 200,
      applied: false,
      category: 'free'
    },
    {
      id: 2,
      name: "Overclocking Chip",
      description: "Increases hash rate by 15%",
      bonus: 15,
      cost: 300,
      applied: false,
      category: 'free'
    },
    {
      id: 3,
      name: "Solar Panels",
      description: "Generates 20% of required power",
      bonus: 20,
      cost: 450,
      applied: false,
      category: 'free'
    },
    {
      id: 4,
      name: "Quantum Accelerator",
      description: "Boosts hash rate by 30%",
      bonus: 30,
      cost: 1200,
      applied: false,
      category: 'free'
    },
    {
      id: 5,
      name: "Token Bridge",
      description: "Use on-chain tokens to boost free miner efficiency by 25%",
      bonus: 25,
      cost: 100, // on-chain tokens
      applied: false,
      category: 'both'
    },
    {
      id: 6,
      name: "Network Optimizer",
      description: "Increases mining rewards during low network congestion by 40%",
      bonus: 40,
      cost: 150, // on-chain tokens
      applied: false,
      category: 'super'
    }
  ]);
  
  // Ad-based boosts
  const [adBoosts, setAdBoosts] = useState<AdBoost[]>([
    {
      id: 1,
      name: "Quick Boost",
      description: "Watch 1 ad to boost mining power by 50% for 1 hour",
      duration: 60, // 60 minutes
      multiplier: 1.5,
      adCount: 1
    },
    {
      id: 2,
      name: "Power Surge",
      description: "Watch 3 ads to boost mining power by 100% for 3 hours",
      duration: 180, // 180 minutes
      multiplier: 2.0,
      adCount: 3
    },
    {
      id: 3,
      name: "Mega Boost",
      description: "Watch 5 ads to boost mining power by 200% for 6 hours",
      duration: 360, // 360 minutes
      multiplier: 3.0,
      adCount: 5
    }
  ]);
  
  // Mining leagues
  const [miningLeagues, setMiningLeagues] = useState<MiningLeague[]>([
    {
      id: 1,
      name: "Rookie League",
      minHashRate: 0,
      prizePool: 1000,
      participants: 245,
      endTime: Date.now() + 86400000 * 2 // 2 days from now
    },
    {
      id: 2,
      name: "Pro League",
      minHashRate: 100,
      prizePool: 5000,
      participants: 78,
      endTime: Date.now() + 86400000 * 2 // 2 days from now
    },
    {
      id: 3,
      name: "Elite League",
      minHashRate: 500,
      prizePool: 20000,
      participants: 12,
      endTime: Date.now() + 86400000 * 2 // 2 days from now
    }
  ]);
  
  // Teams/Guilds
  const [teams, setTeams] = useState<Team[]>([
    {
      id: 1,
      name: "Crypto Crusaders",
      members: 24,
      totalHashRate: 1250,
      rank: 1
    },
    {
      id: 2,
      name: "Block Busters",
      members: 18,
      totalHashRate: 980,
      rank: 2
    },
    {
      id: 3,
      name: "Hash Masters",
      members: 12,
      totalHashRate: 780,
      rank: 3
    }
  ]);
  
  const [miningData, setMiningData] = useState({
    totalHashRate: 10,
    totalPower: 5,
    earnings: {
      daily: 15,
      weekly: 105,
      monthly: 450
    },
    balance: {
      inApp: 750, // in-app tokens (GCC)
      onChain: 25  // on-chain tokens (ETH/MATIC/etc.)
    },
    nextReward: {
      inApp: 100,
      onChain: 0.05
    },
    autoCollect: false,
    teamMining: false,
    currentTeamId: null,
    adStreak: 0,
    dailyAdsWatched: 0,
    referralCount: 0,
    referralBonus: 0
  });
  
  const [activeCategory, setActiveCategory] = useState<'free' | 'super'>('free');
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [showAdBoostDialog, setShowAdBoostDialog] = useState(false);
  const [showTeamDialog, setShowTeamDialog] = useState(false);
  const [showReferralDialog, setShowReferralDialog] = useState(false);
  const [selectedRig, setSelectedRig] = useState<MiningRig | null>(null);
  const [selectedBoost, setSelectedBoost] = useState<AdBoost | null>(null);
  const [collecting, setCollecting] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [playingAd, setPlayingAd] = useState(false);
  const [adWatchCount, setAdWatchCount] = useState(0);
  
  useEffect(() => {
    document.title = "CryptoVerse - Mining";
    
    // Start mining progress simulation
    const interval = setInterval(() => {
      updateMiningProgress();
    }, 2000);
    
    return () => clearInterval(interval);
  }, [updateMiningProgress]);
  
  const handleCollectRewards = () => {
    setCollecting(true);
    
    // Simulate API call
    setTimeout(() => {
      const reward = miningData.nextReward.inApp;
      const onChainReward = miningData.nextReward.onChain;
      
      setMiningData(prev => ({
        ...prev,
        balance: {
          ...prev.balance,
          inApp: prev.balance.inApp + reward,
          onChain: prev.balance.onChain + onChainReward
        },
        nextReward: {
          inApp: Math.floor(Math.random() * 50) + 75,
          onChain: Number((Math.random() * 0.03 + 0.02).toFixed(3))
        }
      }));
      
      setMiningProgress(0);
      
      toast({
        title: "Rewards Collected!",
        description: `${reward} GCC and ${onChainReward} ETH has been added to your balance`,
      });
      
      setCollecting(false);
    }, 1500);
  };
  
  const handleBuyRig = (rigId: number) => {
    const freeMiner = freeMiners.find(r => r.id === rigId);
    const superMiner = superMiners.find(r => r.id === rigId);
    const rig = freeMiner || superMiner;
    
    if (!rig) return;
    
    const category = rig.category;
    const balanceType = category === 'free' ? 'inApp' : 'onChain';
    
    if (miningData.balance[balanceType] < rig.cost) {
      toast({
        title: "Insufficient Balance",
        description: `You don't have enough ${category === 'free' ? 'GCC' : 'ETH'} to purchase this mining rig`,
        variant: "destructive",
      });
      return;
    }
    
    setMiningData(prev => ({
      ...prev,
      balance: {
        ...prev.balance,
        [balanceType]: prev.balance[balanceType] - rig.cost
      },
      totalHashRate: prev.totalHashRate + rig.hashRate,
      totalPower: prev.totalPower + rig.power
    }));
    
    if (category === 'free') {
      setFreeMiners(prev => prev.map(r => r.id === rigId ? { ...r, owned: true } : r));
    } else {
      setSuperMiners(prev => prev.map(r => r.id === rigId ? { ...r, owned: true } : r));
    }
    
    toast({
      title: "Mining Rig Purchased!",
      description: `You have successfully purchased the ${rig.name}`,
    });
  };
  
  const handleActivateAdBoost = () => {
    if (!selectedBoost) return;
    
    setPlayingAd(true);
    
    // Simulate watching an ad
    setTimeout(() => {
      setAdWatchCount(prev => prev + 1);
      
      if (adWatchCount + 1 >= selectedBoost.adCount) {
        // All ads have been watched, apply the boost
        const currentTime = Date.now();
        const boostEndTime = currentTime + selectedBoost.duration * 60 * 1000;
        
        setMiningData(prev => ({
          ...prev,
          adStreak: prev.adStreak + 1,
          dailyAdsWatched: prev.dailyAdsWatched + selectedBoost.adCount,
          totalHashRate: prev.totalHashRate * selectedBoost.multiplier
        }));
        
        // Apply boost to free miners
        setFreeMiners(prev => 
          prev.map(miner => 
            miner.owned 
              ? { 
                  ...miner, 
                  boostActive: true, 
                  boostEndTime: boostEndTime, 
                  boostMultiplier: selectedBoost.multiplier,
                  hashRate: miner.hashRate * selectedBoost.multiplier 
                }
              : miner
          )
        );
        
        toast({
          title: "Boost Activated!",
          description: `Your free miners are now boosted by ${(selectedBoost.multiplier - 1) * 100}% for ${selectedBoost.duration} minutes!`,
        });
        
        setAdWatchCount(0);
        setShowAdBoostDialog(false);
        setPlayingAd(false);
        
        // If streak milestone reached, give bonus
        if (miningData.adStreak % 3 === 0) {
          setMiningData(prev => ({
            ...prev,
            balance: {
              ...prev.balance,
              inApp: prev.balance.inApp + 50
            }
          }));
          
          toast({
            title: "Streak Bonus!",
            description: "You received 50 GCC for maintaining your ad-watching streak!",
          });
        }
        
        // Check daily ad challenge
        if (miningData.dailyAdsWatched >= 5) {
          toast({
            title: "Daily Challenge Completed!",
            description: "You've unlocked a rare miner skin! Check your inventory.",
          });
        }
      } else {
        toast({
          title: "Ad Watched",
          description: `${selectedBoost.adCount - (adWatchCount + 1)} more ads to activate the boost!`,
        });
        setPlayingAd(false);
      }
    }, 3000);
  };
  
  const handleUpgradeRig = () => {
    if (!selectedRig) return;
    
    setUpgrading(true);
    
    // Cost calculation: level * base cost * 0.5
    const upgradeCost = selectedRig.level * selectedRig.cost * 0.5;
    
    if (miningData.balance.inApp < upgradeCost) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough GCC to upgrade this mining rig",
        variant: "destructive",
      });
      setUpgrading(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      setMiningData(prev => ({
        ...prev,
        balance: {
          ...prev.balance,
          inApp: prev.balance.inApp - upgradeCost
        },
        totalHashRate: prev.totalHashRate + (selectedRig.hashRate * 0.3),
        totalPower: prev.totalPower + (selectedRig.power * 0.2)
      }));
      
      if (activeCategory === 'free') {
        setFreeMiners(prev => prev.map(r => {
          if (r.id === selectedRig.id) {
            return {
              ...r,
              level: r.level + 1,
              hashRate: r.hashRate * 1.3,
              power: r.power * 1.2
            };
          }
          return r;
        }));
      } else {
        setSuperMiners(prev => prev.map(r => {
          if (r.id === selectedRig.id) {
            return {
              ...r,
              level: r.level + 1,
              hashRate: r.hashRate * 1.3,
              power: r.power * 1.2
            };
          }
          return r;
        }));
      }
      
      toast({
        title: "Mining Rig Upgraded!",
        description: `The ${selectedRig.name} has been upgraded to level ${selectedRig.level + 1}`,
      });
      
      setUpgrading(false);
      setShowUpgradeDialog(false);
    }, 1500);
  };
  
  const handleBuyUpgrade = (upgradeId: number) => {
    const upgrade = upgrades.find(u => u.id === upgradeId);
    
    if (!upgrade) return;
    
    const balanceType = upgrade.category === 'free' ? 'inApp' : upgrade.category === 'super' ? 'onChain' : 'both';
    
    if (balanceType === 'inApp' && miningData.balance.inApp < upgrade.cost) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough GCC to purchase this upgrade",
        variant: "destructive",
      });
      return;
    } else if (balanceType === 'onChain' && miningData.balance.onChain < upgrade.cost) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough ETH to purchase this upgrade",
        variant: "destructive",
      });
      return;
    } else if (balanceType === 'both' && (miningData.balance.inApp < upgrade.cost / 2 || miningData.balance.onChain < upgrade.cost / 2)) {
      toast({
        title: "Insufficient Balance",
        description: "You need both GCC and ETH to purchase this cross-chain upgrade",
        variant: "destructive",
      });
      return;
    }
    
    setMiningData(prev => {
      let newHashRate = prev.totalHashRate;
      let newPower = prev.totalPower;
      let newInAppBalance = prev.balance.inApp;
      let newOnChainBalance = prev.balance.onChain;
      
      // Apply specific upgrade effects
      if (upgrade.name === "Cooling System") {
        newPower = newPower * 0.9; // Reduce power by 10%
        newInAppBalance -= upgrade.cost;
      } else if (upgrade.name === "Overclocking Chip") {
        newHashRate = newHashRate * 1.15; // Increase hash rate by 15%
        newInAppBalance -= upgrade.cost;
      } else if (upgrade.name === "Solar Panels") {
        newPower = newPower * 0.8; // Reduce power by 20%
        newInAppBalance -= upgrade.cost;
      } else if (upgrade.name === "Quantum Accelerator") {
        newHashRate = newHashRate * 1.3; // Increase hash rate by 30%
        newInAppBalance -= upgrade.cost;
      } else if (upgrade.name === "Token Bridge") {
        // Apply to both free and super miners
        newHashRate = newHashRate * 1.25; // Increase hash rate by 25%
        newInAppBalance -= upgrade.cost / 2;
        newOnChainBalance -= upgrade.cost / 2;
      } else if (upgrade.name === "Network Optimizer") {
        // Super miners only
        newOnChainBalance -= upgrade.cost;
        // Effect is handled during reward collection
      }
      
      return {
        ...prev,
        balance: {
          inApp: newInAppBalance,
          onChain: newOnChainBalance
        },
        totalHashRate: newHashRate,
        totalPower: newPower,
      };
    });
    
    setUpgrades(prev => prev.map(u => u.id === upgradeId ? { ...u, applied: true } : u));
    
    toast({
      title: "Upgrade Purchased!",
      description: `You have successfully purchased the ${upgrade.name}`,
    });
  };
  
  const calculateRigEfficiency = (rig: MiningRig) => {
    return rig.hashRate / rig.power;
  };
  
  const getTypeColor = (type: MiningRig['type']) => {
    switch (type) {
      case 'basic':
        return 'bg-blue-600';
      case 'advanced':
        return 'bg-purple-600';
      case 'premium':
        return 'bg-amber-600';
      default:
        return 'bg-blue-600';
    }
  };
  
  const getTypeTextColor = (type: MiningRig['type']) => {
    switch (type) {
      case 'basic':
        return 'text-blue-500';
      case 'advanced':
        return 'text-purple-500';
      case 'premium':
        return 'text-amber-500';
      default:
        return 'text-blue-500';
    }
  };
  
  const getCategoryColor = (category: MiningRig['category']) => {
    return category === 'free' 
      ? 'from-blue-500/70 to-purple-600/70' 
      : 'from-amber-500/70 to-red-600/70';
  };
  
  const formatTimeLeft = (endTime: number) => {
    const diff = endTime - Date.now();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };
  
  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background pb-20"
    >
      <TopBar />
      
      <main className="mt-16 px-4 py-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="font-rajdhani font-bold text-3xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Mining Hub</h1>
            <p className="text-muted-foreground text-sm">Manage your crypto mining operations</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 text-md shadow-glow">
              <BadgeDollarSign className="mr-1.5 h-5 w-5" />
              {formatNumber(miningData.balance.inApp)} GCC
            </Badge>
            <Badge className="bg-gradient-to-r from-amber-500 to-red-600 text-white px-4 py-2 text-md shadow-glow">
              <BadgeDollarSign className="mr-1.5 h-5 w-5" />
              {miningData.balance.onChain.toFixed(3)} ETH
            </Badge>
          </div>
        </div>
        
        {/* Active Boosts Banner */}
        {freeMiners.some(m => m.boostActive) && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl p-4 mb-6 border border-primary/30 shadow-glow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/30 p-2 rounded-lg">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">Mining Boost Active</h3>
                  <p className="text-xs text-muted-foreground">
                    {freeMiners.find(m => m.boostActive && m.boostEndTime)?.boostMultiplier && 
                      `+${((freeMiners.find(m => m.boostActive && m.boostEndTime)?.boostMultiplier || 1) - 1) * 100}% boost for ${formatTimeLeft(freeMiners.find(m => m.boostActive && m.boostEndTime)?.boostEndTime || 0)}`
                    }
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="text-xs border-primary/30 text-primary">
                <Play className="h-3 w-3 mr-1.5" />
                Watch Ad to Extend
              </Button>
            </div>
          </motion.div>
        )}
        
        {/* Mining Dashboard Card */}
        <Card className="bg-surface border-none neon-border shadow-glow mb-8">
          <CardHeader className="pb-3 border-b border-border/30">
            <CardTitle className="text-xl font-medium flex items-center gap-2">
              <div className="bg-primary/20 p-1.5 rounded-md">
                <Gauge className="h-5 w-5 text-primary" />
              </div>
              Dashboard
            </CardTitle>
            <CardDescription>Real-time mining statistics</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-surface-light to-surface p-4 rounded-xl shadow-sm border border-border/20">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Hash Rate</div>
                <div className="flex items-center mt-1">
                  <Cpu className="h-5 w-5 text-primary mr-2" />
                  <span className="text-xl font-bold neon-text-primary">{miningData.totalHashRate.toFixed(2)}</span>
                  <span className="text-xs ml-1 text-muted-foreground">H/s</span>
                </div>
                <div className="text-xs text-primary/60 mt-2 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +2.5% from last week
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-surface-light to-surface p-4 rounded-xl shadow-sm border border-border/20">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Power Usage</div>
                <div className="flex items-center mt-1">
                  <Zap className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="text-xl font-bold">{miningData.totalPower.toFixed(2)}</span>
                  <span className="text-xs ml-1 text-muted-foreground">kW</span>
                </div>
                <div className="text-xs text-yellow-500/60 mt-2 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Optimized
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-surface-light to-surface p-4 rounded-xl shadow-sm border border-border/20">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Daily Earnings</div>
                <div className="flex items-center mt-1">
                  <BadgeDollarSign className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-xl font-bold text-green-500">{miningData.earnings.daily.toFixed(2)}</span>
                  <span className="text-xs ml-1 text-muted-foreground">GCC</span>
                </div>
                <div className="text-xs text-green-500/60 mt-2 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +5.3% this month
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-surface-light to-surface p-4 rounded-xl shadow-sm border border-border/20">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Efficiency</div>
                <div className="flex items-center mt-1">
                  <Gauge className="h-5 w-5 text-primary mr-2" />
                  <span className="text-xl font-bold">{(miningData.totalHashRate / miningData.totalPower).toFixed(2)}</span>
                </div>
                <div className="text-xs text-primary/60 mt-2 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Good performance
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Free Miner Progress */}
              <div className="bg-surface-light p-5 rounded-xl shadow-inner border border-border/20">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Free Miner Progress</span>
                      <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-500 border-blue-500/30">In-App</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Auto-mining in progress</p>
                  </div>
                  <div className="bg-background/40 px-3 py-1 rounded-full">
                    <span className="text-xs font-medium">Next: <span className="text-blue-500">{miningData.nextReward.inApp} GCC</span></span>
                  </div>
                </div>
                
                <div className="relative mb-4">
                  <Progress value={miningProgress} className="h-3 bg-background/50" />
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={miningProgress >= 100 ? { scale: [0, 1.2, 1] } : { scale: 0 }}
                      transition={{ duration: 0.5 }}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs px-3 py-1 rounded-full shadow-glow"
                    >
                      Ready to Collect!
                    </motion.div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={handleCollectRewards}
                    disabled={miningProgress < 100 || collecting}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium shadow-glow"
                  >
                    {collecting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Collecting...
                      </>
                    ) : (
                      <>
                        <Cloud className="mr-2 h-5 w-5" />
                        {miningProgress >= 100 ? "Collect GCC" : `Mining (${miningProgress}%)`}
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={() => {
                      setShowAdBoostDialog(true);
                      setAdWatchCount(0);
                    }}
                    className="bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30"
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Super Miner Progress */}
              <div className="bg-surface-light p-5 rounded-xl shadow-inner border border-border/20">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Super Miner Progress</span>
                      <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-500 border-amber-500/30">On-Chain</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Staking-based mining</p>
                  </div>
                  <div className="bg-background/40 px-3 py-1 rounded-full">
                    <span className="text-xs font-medium">Next: <span className="text-amber-500">{miningData.nextReward.onChain} ETH</span></span>
                  </div>
                </div>
                
                <div className="relative mb-4">
                  <Progress value={miningProgress * 0.7} className="h-3 bg-background/50" />
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={miningProgress * 0.7 >= 100 ? { scale: [0, 1.2, 1] } : { scale: 0 }}
                      transition={{ duration: 0.5 }}
                      className="bg-gradient-to-r from-amber-500 to-red-600 text-white text-xs px-3 py-1 rounded-full shadow-glow"
                    >
                      Ready to Collect!
                    </motion.div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={handleCollectRewards}
                    disabled={(miningProgress * 0.7) < 100 || collecting}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-red-600 text-white font-medium shadow-glow"
                  >
                    {collecting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Collecting...
                      </>
                    ) : (
                      <>
                        <Cloud className="mr-2 h-5 w-5" />
                        {miningProgress * 0.7 >= 100 ? "Collect ETH" : `Mining (${Math.round(miningProgress * 0.7)}%)`}
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={() => setActiveCategory('super')}
                    className="bg-amber-500/20 text-amber-500 border border-amber-500/30 hover:bg-amber-500/30"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-3">
              <Button 
                variant="outline" 
                className="bg-surface-light text-primary border-primary/20 hover:bg-primary/10 shadow-sm"
                onClick={() => setShowReferralDialog(true)}
              >
                <div className="flex flex-col items-center">
                  <Share2 className="h-5 w-5 mb-1" />
                  <span className="text-xs">Refer Friends</span>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="bg-surface-light text-purple-500 border-purple-500/20 hover:bg-purple-500/10 shadow-sm"
                onClick={() => setShowTeamDialog(true)}
              >
                <div className="flex flex-col items-center">
                  <Users className="h-5 w-5 mb-1" />
                  <span className="text-xs">Team Mining</span>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="bg-surface-light text-amber-500 border-amber-500/20 hover:bg-amber-500/10 shadow-sm"
              >
                <div className="flex flex-col items-center">
                  <Trophy className="h-5 w-5 mb-1" />
                  <span className="text-xs">Tournaments</span>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Mining Operations Tabs */}
        <Tabs defaultValue="free" className="mb-8">
          <TabsList className="grid grid-cols-4 mb-6 bg-surface-light p-1 rounded-xl">
            <TabsTrigger value="free" className="data-[state=active]:neon-text-primary data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/10 data-[state=active]:to-surface-light data-[state=active]:shadow-sm py-3 rounded-lg">
              <Building className="mr-2 h-4 w-4" />
              Free Miners
            </TabsTrigger>
            <TabsTrigger value="super" className="data-[state=active]:neon-text-primary data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/10 data-[state=active]:to-surface-light data-[state=active]:shadow-sm py-3 rounded-lg">
              <Sparkles className="mr-2 h-4 w-4" />
              Super Miners
            </TabsTrigger>
            <TabsTrigger value="upgrades" className="data-[state=active]:neon-text-primary data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/10 data-[state=active]:to-surface-light data-[state=active]:shadow-sm py-3 rounded-lg">
              <ArrowUp className="mr-2 h-4 w-4" />
              Upgrades
            </TabsTrigger>
            <TabsTrigger value="teams" className="data-[state=active]:neon-text-primary data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/10 data-[state=active]:to-surface-light data-[state=active]:shadow-sm py-3 rounded-lg">
              <Users className="mr-2 h-4 w-4" />
              Teams
            </TabsTrigger>
          </TabsList>
          
          {/* Free Miners Tab */}
          <TabsContent value="free">
            <Card className="bg-gradient-to-br from-blue-500/5 to-purple-600/5 border-blue-500/20 mb-6 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <Badge className="bg-blue-500 text-white">Free</Badge> 
                      In-App Token Mining
                    </h3>
                    <p className="text-sm text-muted-foreground">Earn GCC tokens with no upfront investment</p>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                    onClick={() => {
                      setShowAdBoostDialog(true);
                      setAdWatchCount(0);
                    }}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Boost with Ads
                  </Button>
                </div>
              
                {/* Ad Streak Progress */}
                <div className="bg-surface p-4 rounded-lg mb-6 border border-border/30">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-500/20 p-1.5 rounded-md">
                        <Play className="h-4 w-4 text-blue-500" />
                      </div>
                      <span className="text-sm font-medium">Ad Streak: {miningData.adStreak} days</span>
                    </div>
                    <Badge variant="outline" className="text-blue-500 border-blue-500/30">
                      {miningData.dailyAdsWatched}/5 Today
                    </Badge>
                  </div>
                  <Progress value={(miningData.dailyAdsWatched / 5) * 100} className="h-2 mb-2" />
                  <p className="text-xs text-muted-foreground">
                    Watch 5 ads today to unlock a rare miner skin!
                    {miningData.adStreak > 0 && <span className="text-blue-500"> Next streak bonus in {3 - (miningData.adStreak % 3)} days</span>}
                  </p>
                </div>
              </CardContent>
            </Card>
          
            <div className="grid gap-5">
              {freeMiners.map((rig) => (
                <motion.div
                  key={rig.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-gradient-to-br from-surface-light to-surface rounded-xl ${
                    rig.owned ? 'neon-border shadow-glow' : 'border border-muted'
                  } overflow-hidden transition-all hover:shadow-lg`}
                >
                  <div className="flex justify-between items-center p-5 border-b border-border/30">
                    <div className="flex items-center">
                      <div className={`p-3 rounded-xl ${getTypeColor(rig.type)} bg-opacity-90 mr-4 shadow-glow`}>
                        <Server className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-medium text-lg">{rig.name}</h3>
                          {rig.owned && (
                            <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-primary/30">
                              Level {rig.level}
                            </Badge>
                          )}
                          {rig.boostActive && (
                            <Badge className="ml-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                              +{((rig.boostMultiplier || 1) - 1) * 100}%
                            </Badge>
                          )}
                        </div>
                        <p className={`text-xs ${getTypeTextColor(rig.type)} font-medium mt-0.5`}>
                          {rig.type.charAt(0).toUpperCase() + rig.type.slice(1)} Class Mining Hardware
                        </p>
                      </div>
                    </div>
                    
                    {!rig.owned && (
                      <Badge variant="outline" className="text-primary border-primary/30 px-3 py-1.5">
                        <BadgeDollarSign className="h-4 w-4 mr-1" />
                        {rig.cost} GCC
                      </Badge>
                    )}
                  </div>
                  
                  <div className="p-5">
                    <div className="grid grid-cols-2 gap-4 mb-5">
                      <div className="bg-background/50 p-3 rounded-xl border border-border/20">
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Hash Rate</div>
                        <div className="flex items-center mt-1.5">
                          <Cpu className="h-4 w-4 text-primary mr-2" />
                          <span className="text-base font-medium">{rig.hashRate.toFixed(1)} H/s</span>
                        </div>
                      </div>
                      
                      <div className="bg-background/50 p-3 rounded-xl border border-border/20">
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Power</div>
                        <div className="flex items-center mt-1.5">
                          <Battery className="h-4 w-4 text-yellow-500 mr-2" />
                          <span className="text-base font-medium">{rig.power.toFixed(1)} kW</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between bg-surface-light p-3 rounded-xl">
                      <div className="flex items-center">
                        <Gauge className="h-4 w-4 text-primary mr-2" />
                        <div className="text-xs font-medium">
                          Efficiency Rating: <span className="text-primary">{calculateRigEfficiency(rig).toFixed(2)}</span>
                        </div>
                      </div>
                      
                      {rig.owned ? (
                        <Button 
                          size="sm" 
                          className="text-xs bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-glow px-4"
                          onClick={() => {
                            setSelectedRig(rig);
                            setShowUpgradeDialog(true);
                          }}
                        >
                          <ArrowUp className="h-3 w-3 mr-1.5" />
                          Upgrade Rig
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          className="text-xs bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-glow px-4"
                          onClick={() => handleBuyRig(rig.id)}
                          disabled={miningData.balance.inApp < rig.cost}
                        >
                          <BadgeDollarSign className="h-3 w-3 mr-1.5" />
                          Purchase
                        </Button>
                      )}
                    </div>
                    
                    {rig.owned && rig.level >= 3 && (
                      <div className="mt-4 p-3 bg-primary/10 rounded-xl border border-primary/20">
                        <div className="text-xs flex items-center text-primary">
                          <Gift className="h-3 w-3 mr-1" />
                          Max level reached! You're eligible for the Daily Prize Pool Lottery
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
          
          {/* Super Miners Tab */}
          <TabsContent value="super">
            <Card className="bg-gradient-to-br from-amber-500/5 to-red-600/5 border-amber-500/20 mb-6 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <Badge className="bg-amber-500 text-white">Super</Badge> 
                      On-Chain Token Mining
                    </h3>
                    <p className="text-sm text-muted-foreground">Stake ETH tokens to earn real blockchain rewards</p>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-amber-500 to-red-600 text-white"
                    onClick={() => {
                      window.open("https://exchange.cryptoverse.app", "_blank");
                    }}
                  >
                    <BadgeDollarSign className="mr-2 h-4 w-4" />
                    Exchange Tokens
                  </Button>
                </div>
              
                {/* Mining League */}
                <div className="bg-surface p-4 rounded-lg mb-6 border border-border/30">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-amber-500/20 p-1.5 rounded-md">
                        <Trophy className="h-4 w-4 text-amber-500" />
                      </div>
                      <span className="text-sm font-medium">Mining League: {miningLeagues[0].name}</span>
                    </div>
                    <Badge variant="outline" className="text-amber-500 border-amber-500/30">
                      {formatTimeLeft(miningLeagues[0].endTime)} Left
                    </Badge>
                  </div>
                  <Progress value={50} className="h-2 mb-2" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Prize Pool: <span className="text-amber-500">{miningLeagues[0].prizePool} ETH</span>
                    </span>
                    <span className="text-muted-foreground">
                      Your Position: <span className="text-amber-500">#12 of {miningLeagues[0].participants}</span>
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          
            <div className="grid gap-5">
              {superMiners.map((rig) => (
                <motion.div
                  key={rig.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-gradient-to-br from-surface-light to-surface rounded-xl ${
                    rig.owned ? 'shadow-glow border border-amber-500/30' : 'border border-muted'
                  } overflow-hidden transition-all hover:shadow-lg`}
                >
                  <div className="flex justify-between items-center p-5 border-b border-border/30">
                    <div className="flex items-center">
                      <div className={`p-3 rounded-xl ${getTypeColor(rig.type)} bg-opacity-90 mr-4 shadow-glow`}>
                        <Server className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-medium text-lg">{rig.name}</h3>
                          {rig.owned && (
                            <Badge variant="outline" className="ml-2 bg-amber-500/10 text-amber-500 border-amber-500/30">
                              Level {rig.level}
                            </Badge>
                          )}
                        </div>
                        <p className={`text-xs ${getTypeTextColor(rig.type)} font-medium mt-0.5`}>
                          Stake-based {rig.type.charAt(0).toUpperCase() + rig.type.slice(1)} Miner
                        </p>
                      </div>
                    </div>
                    
                    {!rig.owned && (
                      <Badge variant="outline" className="text-amber-500 border-amber-500/30 px-3 py-1.5">
                        <BadgeDollarSign className="h-4 w-4 mr-1" />
                        {rig.cost} ETH
                      </Badge>
                    )}
                  </div>
                  
                  <div className="p-5">
                    <div className="grid grid-cols-2 gap-4 mb-5">
                      <div className="bg-background/50 p-3 rounded-xl border border-border/20">
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Hash Rate</div>
                        <div className="flex items-center mt-1.5">
                          <Cpu className="h-4 w-4 text-amber-500 mr-2" />
                          <span className="text-base font-medium">{rig.hashRate.toFixed(1)} H/s</span>
                        </div>
                      </div>
                      
                      <div className="bg-background/50 p-3 rounded-xl border border-border/20">
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Rewards</div>
                        <div className="flex items-center mt-1.5">
                          <BadgeDollarSign className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-base font-medium">{(rig.hashRate * 0.0008).toFixed(4)} ETH/day</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between bg-surface-light p-3 rounded-xl">
                      <div className="flex items-center">
                        <Gauge className="h-4 w-4 text-amber-500 mr-2" />
                        <div className="text-xs font-medium">
                          ROI Period: <span className="text-amber-500">{Math.ceil(rig.cost / (rig.hashRate * 0.0008)).toFixed(0)} days</span>
                        </div>
                      </div>
                      
                      {rig.owned ? (
                        <Button 
                          size="sm" 
                          className="text-xs bg-gradient-to-r from-amber-500 to-red-600 hover:opacity-90 text-white shadow-glow px-4"
                          onClick={() => {
                            setSelectedRig(rig);
                            setShowUpgradeDialog(true);
                          }}
                        >
                          <ArrowUp className="h-3 w-3 mr-1.5" />
                          Upgrade Rig
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          className="text-xs bg-gradient-to-r from-amber-500 to-red-600 hover:opacity-90 text-white shadow-glow px-4"
                          onClick={() => handleBuyRig(rig.id)}
                          disabled={miningData.balance.onChain < rig.cost}
                        >
                          <BadgeDollarSign className="h-3 w-3 mr-1.5" />
                          Stake & Mine
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
          
          {/* Upgrades Tab */}
          <TabsContent value="upgrades">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-gradient-to-br from-blue-500/5 to-purple-600/5 border-blue-500/20 shadow-sm">
                <CardContent className="pt-6 pb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-blue-500/20 p-1.5 rounded-md">
                      <Building className="h-4 w-4 text-blue-500" />
                    </div>
                    <h3 className="text-base font-medium">Free Miner Upgrades</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">Enhance your in-app miners with GCC tokens</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-amber-500/5 to-red-600/5 border-amber-500/20 shadow-sm">
                <CardContent className="pt-6 pb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-amber-500/20 p-1.5 rounded-md">
                      <Sparkles className="h-4 w-4 text-amber-500" />
                    </div>
                    <h3 className="text-base font-medium">Super Miner Upgrades</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">Enhance your on-chain miners with ETH tokens</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20 shadow-sm">
                <CardContent className="pt-6 pb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-primary/20 p-1.5 rounded-md">
                      <Share2 className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="text-base font-medium">Cross-Chain Upgrades</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">Upgrades that benefit both miner types</p>
                </CardContent>
              </Card>
            </div>
          
            <div className="grid gap-5">
              {upgrades.map((upgrade) => (
                <motion.div
                  key={upgrade.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-5 bg-gradient-to-br from-surface-light to-surface rounded-xl ${
                    upgrade.applied ? 'neon-border shadow-glow' : 'border border-muted'
                  } transition-all hover:shadow-lg`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-lg ${
                        upgrade.applied 
                          ? 'bg-green-500/20' 
                          : upgrade.category === 'free' 
                            ? 'bg-blue-500/20' 
                            : upgrade.category === 'super' 
                              ? 'bg-amber-500/20' 
                              : 'bg-primary/20'
                      }`}>
                        <ArrowUp className={`h-5 w-5 ${
                          upgrade.applied 
                            ? 'text-green-500' 
                            : upgrade.category === 'free' 
                              ? 'text-blue-500' 
                              : upgrade.category === 'super' 
                                ? 'text-amber-500' 
                                : 'text-primary'
                        }`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-base">{upgrade.name}</h3>
                          <Badge variant="outline" className={`text-xs ${
                            upgrade.category === 'free' 
                              ? 'bg-blue-500/10 text-blue-500 border-blue-500/30' 
                              : upgrade.category === 'super' 
                                ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' 
                                : 'bg-primary/10 text-primary border-primary/30'
                          }`}>
                            {upgrade.category === 'free' 
                              ? 'Free' 
                              : upgrade.category === 'super' 
                                ? 'Super' 
                                : 'Both'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{upgrade.description}</p>
                      </div>
                    </div>
                    
                    {upgrade.applied ? (
                      <Badge className="bg-green-600 shadow-glow px-3 py-1.5">
                        <span className="flex items-center gap-1.5">
                          <div className="h-1.5 w-1.5 bg-white rounded-full animate-pulse"></div>
                          Active
                        </span>
                      </Badge>
                    ) : (
                      <Badge variant="outline" className={`px-3 py-1.5 ${
                        upgrade.category === 'free' 
                          ? 'text-blue-500 border-blue-500/30' 
                          : upgrade.category === 'super' 
                            ? 'text-amber-500 border-amber-500/30' 
                            : 'text-primary border-primary/30'
                      }`}>
                        <BadgeDollarSign className="h-4 w-4 mr-1" />
                        {upgrade.cost} {upgrade.category === 'free' ? 'GCC' : 'ETH'}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="bg-background/50 p-3 rounded-lg my-3 border border-border/20">
                    <div className="text-xs text-muted-foreground">Performance Impact</div>
                    <div className="mt-1 text-sm font-medium text-primary">+{upgrade.bonus}% Mining Efficiency</div>
                  </div>
                  
                  {!upgrade.applied && (
                    <div className="flex justify-end mt-4">
                      <Button 
                        size="sm" 
                        className={`text-xs text-white shadow-glow px-4 ${
                          upgrade.category === 'free' 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                            : upgrade.category === 'super' 
                              ? 'bg-gradient-to-r from-amber-500 to-red-600' 
                              : 'bg-gradient-to-r from-primary to-secondary'
                        }`}
                        onClick={() => handleBuyUpgrade(upgrade.id)}
                        disabled={
                          upgrade.category === 'free' 
                            ? miningData.balance.inApp < upgrade.cost
                            : upgrade.category === 'super'
                              ? miningData.balance.onChain < upgrade.cost
                              : miningData.balance.inApp < upgrade.cost / 2 || miningData.balance.onChain < upgrade.cost / 2
                        }
                      >
                        <BadgeDollarSign className="h-3 w-3 mr-1.5" />
                        Purchase Upgrade
                      </Button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </TabsContent>
          
          {/* Teams Tab */}
          <TabsContent value="teams">
            <Card className="bg-gradient-to-br from-purple-500/5 to-blue-600/5 border-purple-500/20 shadow-sm mb-6">
              <CardContent className="pt-6 pb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-purple-500/20 p-1.5 rounded-md">
                        <Users className="h-4 w-4 text-purple-500" />
                      </div>
                      <h3 className="text-lg font-medium">Team Mining</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">Join forces with other miners to boost your rewards</p>
                  </div>
                  
                  {miningData.teamMining ? (
                    <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1.5">
                      <span className="flex items-center gap-1.5">
                        <div className="h-1.5 w-1.5 bg-white rounded-full animate-pulse"></div>
                        Team Active
                      </span>
                    </Badge>
                  ) : (
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                      onClick={() => setShowTeamDialog(true)}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Join a Team
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <div className="mb-6">
              <h3 className="text-base font-medium mb-4">Top Mining Teams</h3>
              
              <div className="space-y-4">
                {teams.map((team) => (
                  <div key={team.id} className="bg-surface rounded-xl border border-border/20 p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                        team.rank === 1 
                          ? 'bg-gradient-to-br from-amber-500 to-yellow-300' 
                          : team.rank === 2 
                            ? 'bg-gradient-to-br from-slate-400 to-slate-300' 
                            : 'bg-gradient-to-br from-amber-700 to-amber-500'
                      }`}>
                        <span className="text-white font-bold text-lg">#{team.rank}</span>
                      </div>
                      <div>
                        <h4 className="font-medium">{team.name}</h4>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Users className="h-3 w-3 mr-1" />
                          {team.members} members
                          <span className="mx-2">•</span>
                          <Cpu className="h-3 w-3 mr-1" />
                          {formatNumber(team.totalHashRate)} H/s
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-xs border-purple-500/30 text-purple-500"
                      onClick={() => setShowTeamDialog(true)}
                    >
                      View Team
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-surface rounded-xl border border-border/20 p-6">
              <h3 className="text-base font-medium mb-4">Create Your Own Team</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start your own mining team and invite friends to join. Team members share mining rewards and gain efficiency bonuses.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="bg-background/50 p-3 rounded-lg border border-border/20">
                  <div className="text-xs text-muted-foreground">Team Size Bonus</div>
                  <div className="text-sm font-medium mt-1">+5% hash rate per member</div>
                </div>
                
                <div className="bg-background/50 p-3 rounded-lg border border-border/20">
                  <div className="text-xs text-muted-foreground">Team Requirements</div>
                  <div className="text-sm font-medium mt-1">1,000 GCC to create a team</div>
                </div>
              </div>
              
              <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                <Users className="mr-2 h-4 w-4" />
                Create New Team
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Settings Card */}
        <Card className="bg-gradient-to-br from-surface-light to-surface border-none neon-border shadow-glow mb-8">
          <CardHeader className="pb-3 border-b border-border/30">
            <CardTitle className="text-xl font-medium flex items-center gap-2">
              <div className="bg-primary/20 p-1.5 rounded-md">
                <Sliders className="h-5 w-5 text-primary" />
              </div>
              Mining Settings
            </CardTitle>
            <CardDescription>Configure your mining operations</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex justify-between items-center p-5 hover:bg-surface-light transition-colors">
              <div>
                <h3 className="text-sm font-medium">Auto-Collect Rewards</h3>
                <p className="text-xs text-muted-foreground mt-1">Automatically collect mining rewards when ready</p>
              </div>
              <Button 
                variant={miningData.autoCollect ? "default" : "outline"} 
                size="sm"
                className={miningData.autoCollect ? "bg-gradient-to-r from-primary to-secondary text-white shadow-glow" : "border-primary/30 text-primary"}
                onClick={() => setMiningData(prev => ({ ...prev, autoCollect: !prev.autoCollect }))}
              >
                {miningData.autoCollect ? "Enabled" : "Disabled"}
              </Button>
            </div>
            
            <div className="flex justify-between items-center p-5 border-t border-border/30 hover:bg-surface-light transition-colors">
              <div>
                <h3 className="text-sm font-medium">Energy Saving Mode</h3>
                <p className="text-xs text-muted-foreground mt-1">Reduce power consumption at the cost of mining speed</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="border-primary/30 text-primary"
              >
                Configure
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex justify-between items-center p-5 border-t border-border/30 hover:bg-surface-light transition-colors">
              <div>
                <h3 className="text-sm font-medium">Referral Program</h3>
                <p className="text-xs text-muted-foreground mt-1">Earn 10% of your friends' mining rewards</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="border-primary/30 text-primary"
                onClick={() => setShowReferralDialog(true)}
              >
                Manage
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      
      {/* Upgrade Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="bg-gradient-to-br from-surface-light to-surface border-none neon-border shadow-glow max-w-md">
          <DialogHeader>
            <DialogTitle className="font-rajdhani text-2xl flex items-center gap-3">
              <div className="bg-primary/20 p-2 rounded-lg">
                <ArrowUp className="h-5 w-5 text-primary" />
              </div>
              Upgrade Mining Rig
            </DialogTitle>
            {selectedRig && (
              <DialogDescription className="text-muted-foreground">
                Enhance your {selectedRig.name} to boost performance and efficiency
              </DialogDescription>
            )}
          </DialogHeader>
          
          {selectedRig && (
            <div className="space-y-4 py-4">
              <div className="bg-surface/70 p-5 rounded-xl border border-border/20">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-xl ${getTypeColor(selectedRig.type)} mr-4 shadow-glow`}>
                      <Server className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">{selectedRig.name}</h3>
                      <p className={`text-xs ${getTypeTextColor(selectedRig.type)} font-medium mt-0.5`}>
                        {selectedRig.type.charAt(0).toUpperCase() + selectedRig.type.slice(1)} Class
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 px-3 py-1.5 shadow-glow">
                    Level {selectedRig.level} → {selectedRig.level + 1}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 my-5">
                  <div className="bg-background/50 p-4 rounded-xl border border-border/10">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Hash Rate</div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{selectedRig.hashRate.toFixed(1)} H/s</span>
                      <div className="flex items-center text-primary">
                        <ChevronRight className="h-4 w-4 text-primary mx-1" />
                        <span className="text-base font-medium">{(selectedRig.hashRate * 1.3).toFixed(1)} H/s</span>
                      </div>
                    </div>
                    <div className="text-xs text-primary mt-2 text-right">+30% Increase</div>
                  </div>
                  
                  <div className="bg-background/50 p-4 rounded-xl border border-border/10">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Power Usage</div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{selectedRig.power.toFixed(1)} kW</span>
                      <div className="flex items-center text-yellow-500">
                        <ChevronRight className="h-4 w-4 text-yellow-500 mx-1" />
                        <span className="text-base font-medium">{(selectedRig.power * 1.2).toFixed(1)} kW</span>
                      </div>
                    </div>
                    <div className="text-xs text-yellow-500 mt-2 text-right">+20% Consumption</div>
                  </div>
                </div>
                
                <div className="bg-background/50 p-4 rounded-xl border border-border/10">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Efficiency Rating</div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Gauge className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{calculateRigEfficiency(selectedRig).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center text-primary">
                      <ChevronRight className="h-4 w-4 text-primary mx-1" />
                      <div className="flex items-center gap-1.5">
                        <Gauge className="h-4 w-4 text-primary" />
                        <span className="text-base font-medium">
                          {((selectedRig.hashRate * 1.3) / (selectedRig.power * 1.2)).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-primary mt-2 text-right">+8.3% Net Efficiency</div>
                </div>
              </div>
              
              <div className="flex items-center px-5 py-4 bg-yellow-900/20 border border-yellow-600/20 rounded-xl">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-500">Upgrade Cost</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    This upgrade will cost <span className="text-yellow-400 font-medium">{(selectedRig.level * selectedRig.cost * 0.5).toFixed(0)} {selectedRig.category === 'free' ? 'GCC' : 'ETH'}</span>
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowUpgradeDialog(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpgradeRig}
              disabled={upgrading || (selectedRig ? (selectedRig.category === 'free' ? miningData.balance.inApp < selectedRig.level * selectedRig.cost * 0.5 : miningData.balance.onChain < selectedRig.level * selectedRig.cost * 0.5) : false)}
              className="bg-gradient-to-r from-primary to-secondary text-white shadow-glow flex-1"
            >
              {upgrading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Upgrading...
                </>
              ) : (
                <>
                  <ArrowUp className="mr-2 h-4 w-4" />
                  Upgrade Now
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Ad Boost Dialog */}
      <Dialog open={showAdBoostDialog} onOpenChange={setShowAdBoostDialog}>
        <DialogContent className="bg-gradient-to-br from-blue-500/5 to-purple-600/5 border-blue-500/30 shadow-glow max-w-md">
          <DialogHeader>
            <DialogTitle className="font-rajdhani text-2xl flex items-center gap-3">
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <Play className="h-5 w-5 text-blue-500" />
              </div>
              Ad Power Boosts
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Watch ads to boost your mining power and earn bonuses
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            {adBoosts.map((boost) => (
              <motion.div 
                key={boost.id}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedBoost?.id === boost.id
                    ? 'bg-blue-500/10 border-blue-500/30 shadow-glow'
                    : 'bg-surface border-border/20 hover:border-blue-500/20'
                }`}
                onClick={() => setSelectedBoost(boost)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-base">{boost.name}</h3>
                    <p className="text-xs text-muted-foreground">{boost.description}</p>
                  </div>
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    {boost.adCount} {boost.adCount === 1 ? 'Ad' : 'Ads'}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="bg-background/70 p-2 rounded-lg text-center">
                    <div className="text-xs text-muted-foreground">Boost Amount</div>
                    <div className="text-sm font-medium text-blue-500">+{(boost.multiplier - 1) * 100}%</div>
                  </div>
                  <div className="bg-background/70 p-2 rounded-lg text-center">
                    <div className="text-xs text-muted-foreground">Duration</div>
                    <div className="text-sm font-medium text-blue-500">{boost.duration / 60} hours</div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {playingAd && (
              <div className="bg-surface p-5 rounded-xl border border-blue-500/30 mt-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                    <span className="font-medium">Ad {adWatchCount + 1}/{selectedBoost?.adCount}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">0:15</span>
                </div>
                <div className="bg-background h-32 rounded-lg flex items-center justify-center mb-3">
                  <div className="text-center">
                    <p className="text-muted-foreground">Ad is playing...</p>
                    <p className="text-xs text-muted-foreground mt-1">Please wait</p>
                  </div>
                </div>
                <Progress value={(adWatchCount / (selectedBoost?.adCount || 1)) * 100 + (100 / (selectedBoost?.adCount || 1)) * 0.6} className="h-1 mb-2" />
              </div>
            )}
          </div>
          
          <DialogFooter className="gap-3 mt-2">
            <Button
              variant="outline"
              onClick={() => setShowAdBoostDialog(false)}
              disabled={playingAd}
              className="flex-1 border-blue-500/30 text-blue-500"
            >
              Cancel
            </Button>
            <Button
              onClick={handleActivateAdBoost}
              disabled={playingAd || !selectedBoost}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-glow flex-1"
            >
              {playingAd ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Watching Ad...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Watch {selectedBoost ? selectedBoost.adCount : ''} {selectedBoost?.adCount === 1 ? 'Ad' : 'Ads'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Team Mining Dialog */}
      <Dialog open={showTeamDialog} onOpenChange={setShowTeamDialog}>
        <DialogContent className="bg-gradient-to-br from-purple-500/5 to-blue-600/5 border-purple-500/30 shadow-glow max-w-xl">
          <DialogHeader>
            <DialogTitle className="font-rajdhani text-2xl flex items-center gap-3">
              <div className="bg-purple-500/20 p-2 rounded-lg">
                <Users className="h-5 w-5 text-purple-500" />
              </div>
              Team Mining
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Join forces with other miners to boost your rewards
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="bg-surface p-5 rounded-xl border border-border/30 mb-5">
              <h3 className="text-base font-medium mb-3">Team Benefits</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-background/50 p-3 rounded-lg text-center border border-border/20">
                  <div className="text-xs text-muted-foreground">Hash Rate Bonus</div>
                  <div className="text-lg font-medium text-purple-500">+5%</div>
                  <div className="text-xs text-muted-foreground">per team member</div>
                </div>
                <div className="bg-background/50 p-3 rounded-lg text-center border border-border/20">
                  <div className="text-xs text-muted-foreground">Team Max Size</div>
                  <div className="text-lg font-medium text-purple-500">10</div>
                  <div className="text-xs text-muted-foreground">miners</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Team mining pools the hash power of all members. Rewards are distributed proportionally to each member's contribution.
              </p>
            </div>
            
            <h3 className="text-base font-medium mb-3">Available Teams</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {teams.map((team) => (
                <div 
                  key={team.id} 
                  className="bg-surface rounded-lg border border-border/20 p-4 flex justify-between items-center hover:border-purple-500/30 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      team.rank === 1 
                        ? 'bg-gradient-to-br from-amber-500 to-yellow-300' 
                        : team.rank === 2 
                          ? 'bg-gradient-to-br from-slate-400 to-slate-300' 
                          : 'bg-gradient-to-br from-amber-700 to-amber-500'
                    }`}>
                      <span className="text-white font-bold text-lg">#{team.rank}</span>
                    </div>
                    <div>
                      <h4 className="font-medium">{team.name}</h4>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {team.members}/10
                        </span>
                        <span className="flex items-center">
                          <Cpu className="h-3 w-3 mr-1" />
                          {formatNumber(team.totalHashRate)} H/s
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-purple-500 to-blue-600 text-white"
                  >
                    Join Team
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter className="mt-2">
            <Button
              variant="outline"
              onClick={() => setShowTeamDialog(false)}
              className="border-purple-500/30 text-purple-500"
            >
              Close
            </Button>
            <Button
              className="bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-glow"
              onClick={() => setShowTeamDialog(false)}
            >
              Create My Team
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Referral Program Dialog */}
      <Dialog open={showReferralDialog} onOpenChange={setShowReferralDialog}>
        <DialogContent className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/30 shadow-glow max-w-md">
          <DialogHeader>
            <DialogTitle className="font-rajdhani text-2xl flex items-center gap-3">
              <div className="bg-primary/20 p-2 rounded-lg">
                <Share2 className="h-5 w-5 text-primary" />
              </div>
              Referral Program
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Invite friends and earn 10% of their mining rewards forever
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-5">
            <div className="bg-surface p-5 rounded-xl border border-border/30">
              <h3 className="text-base font-medium mb-3">Your Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background/50 p-3 rounded-lg text-center border border-border/20">
                  <div className="text-xs text-muted-foreground">Referrals</div>
                  <div className="text-lg font-medium text-primary">{miningData.referralCount}</div>
                  <div className="text-xs text-muted-foreground">friends invited</div>
                </div>
                <div className="bg-background/50 p-3 rounded-lg text-center border border-border/20">
                  <div className="text-xs text-muted-foreground">Earned</div>
                  <div className="text-lg font-medium text-primary">{miningData.referralBonus}</div>
                  <div className="text-xs text-muted-foreground">GCC from referrals</div>
                </div>
              </div>
            </div>
            
            <div className="bg-surface p-5 rounded-xl border border-border/30">
              <h3 className="text-base font-medium mb-3">Your Referral Link</h3>
              <div className="flex mb-3">
                <Input 
                  value="https://cryptoverse.app/ref/yourusername" 
                  readOnly 
                  className="bg-background/50 border-border/20 rounded-r-none"
                />
                <Button className="rounded-l-none bg-primary">Copy</Button>
              </div>
              
              <div className="flex justify-between gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1 text-xs border-primary/30 text-primary"
                  onClick={() => window.open("https://twitter.com/intent/tweet?text=Join%20me%20on%20CryptoVerse%20and%20start%20mining%20crypto!%20https://cryptoverse.app/ref/yourusername", "_blank")}
                >
                  Share on Twitter
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 text-xs border-primary/30 text-primary"
                  onClick={() => window.open("https://t.me/share/url?url=https://cryptoverse.app/ref/yourusername&text=Join%20me%20on%20CryptoVerse%20and%20start%20mining%20crypto!", "_blank")}
                >
                  Share on Telegram
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter className="mt-2">
            <Button
              onClick={() => setShowReferralDialog(false)}
              className="bg-gradient-to-r from-primary to-secondary text-white shadow-glow"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <BottomNav />
    </motion.div>
  );
};

export default Mining;
