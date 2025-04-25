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
  BadgeDollarSign
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
}

interface Upgrade {
  id: number;
  name: string;
  description: string;
  bonus: number;
  cost: number;
  applied: boolean;
}

const Mining: React.FC = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const { miningProgress, setMiningProgress, updateMiningProgress } = useMining();
  
  const [rigs, setRigs] = useState<MiningRig[]>([
    {
      id: 1,
      name: "Basic Miner",
      level: 1,
      hashRate: 10,
      power: 5,
      cost: 100,
      owned: true,
      type: 'basic'
    },
    {
      id: 2,
      name: "Advanced Miner",
      level: 1,
      hashRate: 25,
      power: 15,
      cost: 500,
      owned: false,
      type: 'advanced'
    },
    {
      id: 3,
      name: "Premium Miner",
      level: 1,
      hashRate: 50,
      power: 40,
      cost: 2000,
      owned: false,
      type: 'premium'
    }
  ]);
  
  const [upgrades, setUpgrades] = useState<Upgrade[]>([
    {
      id: 1,
      name: "Cooling System",
      description: "Reduces power consumption by 10%",
      bonus: 10,
      cost: 200,
      applied: false
    },
    {
      id: 2,
      name: "Overclocking Chip",
      description: "Increases hash rate by 15%",
      bonus: 15,
      cost: 300,
      applied: false
    },
    {
      id: 3,
      name: "Solar Panels",
      description: "Generates 20% of required power",
      bonus: 20,
      cost: 450,
      applied: false
    },
    {
      id: 4,
      name: "Quantum Accelerator",
      description: "Boosts hash rate by 30%",
      bonus: 30,
      cost: 1200,
      applied: false
    }
  ]);
  
  const [miningData, setMiningData] = useState({
    totalHashRate: 10,
    totalPower: 5,
    earnings: 15,
    balance: 750,
    nextReward: 100,
    autoCollect: false
  });
  
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [selectedRig, setSelectedRig] = useState<MiningRig | null>(null);
  const [collecting, setCollecting] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  
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
      const reward = miningData.nextReward;
      
      setMiningData(prev => ({
        ...prev,
        balance: prev.balance + reward,
        nextReward: Math.floor(Math.random() * 50) + 75,
      }));
      
      setMiningProgress(0);
      
      toast({
        title: "Rewards Collected!",
        description: `${reward} GCC has been added to your balance`,
      });
      
      setCollecting(false);
    }, 1500);
  };
  
  const handleBuyRig = (rigId: number) => {
    const rig = rigs.find(r => r.id === rigId);
    
    if (!rig) return;
    
    if (miningData.balance < rig.cost) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough GCC to purchase this mining rig",
        variant: "destructive",
      });
      return;
    }
    
    setMiningData(prev => ({
      ...prev,
      balance: prev.balance - rig.cost,
      totalHashRate: prev.totalHashRate + rig.hashRate,
      totalPower: prev.totalPower + rig.power
    }));
    
    setRigs(prev => prev.map(r => r.id === rigId ? { ...r, owned: true } : r));
    
    toast({
      title: "Mining Rig Purchased!",
      description: `You have successfully purchased the ${rig.name}`,
    });
  };
  
  const handleUpgradeRig = () => {
    if (!selectedRig) return;
    
    setUpgrading(true);
    
    // Cost calculation: level * base cost * 0.5
    const upgradeCost = selectedRig.level * selectedRig.cost * 0.5;
    
    if (miningData.balance < upgradeCost) {
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
        balance: prev.balance - upgradeCost,
        totalHashRate: prev.totalHashRate + (selectedRig.hashRate * 0.3),
        totalPower: prev.totalPower + (selectedRig.power * 0.2)
      }));
      
      setRigs(prev => prev.map(r => {
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
    
    if (miningData.balance < upgrade.cost) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough GCC to purchase this upgrade",
        variant: "destructive",
      });
      return;
    }
    
    setMiningData(prev => {
      let newHashRate = prev.totalHashRate;
      let newPower = prev.totalPower;
      
      // Apply specific upgrade effects
      if (upgrade.name === "Cooling System") {
        newPower = newPower * 0.9; // Reduce power by 10%
      } else if (upgrade.name === "Overclocking Chip") {
        newHashRate = newHashRate * 1.15; // Increase hash rate by 15%
      } else if (upgrade.name === "Solar Panels") {
        newPower = newPower * 0.8; // Reduce power by 20%
      } else if (upgrade.name === "Quantum Accelerator") {
        newHashRate = newHashRate * 1.3; // Increase hash rate by 30%
      }
      
      return {
        ...prev,
        balance: prev.balance - upgrade.cost,
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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background pb-20"
    >
      <TopBar />
      
      <main className="mt-16 px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-rajdhani font-bold text-2xl">Mining Operations</h1>
          <Badge className="bg-gradient-to-r from-primary to-secondary">
            <BadgeDollarSign className="mr-1 h-4 w-4" />
            {miningData.balance.toFixed(2)} GCC
          </Badge>
        </div>
        
        {/* Mining Dashboard Card */}
        <Card className="bg-surface border-none neon-border mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Mining Dashboard</CardTitle>
            <CardDescription>Your mining operation statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-surface-light p-3 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Hash Rate</div>
                <div className="flex items-center">
                  <Cpu className="h-4 w-4 text-primary mr-1" />
                  <span className="text-lg font-bold neon-text-primary">{miningData.totalHashRate.toFixed(2)} H/s</span>
                </div>
              </div>
              
              <div className="bg-surface-light p-3 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Power Usage</div>
                <div className="flex items-center">
                  <Zap className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-lg font-bold">{miningData.totalPower.toFixed(2)} kW</span>
                </div>
              </div>
              
              <div className="bg-surface-light p-3 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Daily Earnings</div>
                <div className="flex items-center">
                  <BadgeDollarSign className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-lg font-bold text-green-500">{miningData.earnings.toFixed(2)} GCC</span>
                </div>
              </div>
              
              <div className="bg-surface-light p-3 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Efficiency</div>
                <div className="flex items-center">
                  <Zap className="h-4 w-4 text-primary mr-1" />
                  <span className="text-lg font-bold">{(miningData.totalHashRate / miningData.totalPower).toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Mining Progress</span>
                <span className="text-xs text-muted-foreground">Next: {miningData.nextReward} GCC</span>
              </div>
              
              <div className="relative mb-2">
                <Progress value={miningProgress} className="h-2" />
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={miningProgress >= 100 ? { scale: [0, 1.2, 1] } : { scale: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-primary text-white text-xs px-2 py-0.5 rounded-full"
                  >
                    Ready!
                  </motion.div>
                </div>
              </div>
              
              <Button
                onClick={handleCollectRewards}
                disabled={miningProgress < 100 || collecting}
                className="w-full bg-gradient-to-r from-primary to-secondary"
              >
                {collecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Collecting...
                  </>
                ) : (
                  <>
                    <Cloud className="mr-2 h-4 w-4" />
                    {miningProgress >= 100 ? "Collect Mining Rewards" : `Mining in Progress (${miningProgress}%)`}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Mining Operations Tabs */}
        <Tabs defaultValue="rigs" className="mb-6">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="rigs" className="data-[state=active]:neon-text-primary">
              <Building className="mr-2 h-4 w-4" />
              Mining Rigs
            </TabsTrigger>
            <TabsTrigger value="upgrades" className="data-[state=active]:neon-text-primary">
              <ArrowUp className="mr-2 h-4 w-4" />
              Upgrades
            </TabsTrigger>
          </TabsList>
          
          {/* Mining Rigs Tab */}
          <TabsContent value="rigs">
            <div className="space-y-4">
              {rigs.map((rig) => (
                <motion.div
                  key={rig.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-surface rounded-xl ${
                    rig.owned ? 'neon-border' : 'border border-muted'
                  } overflow-hidden`}
                >
                  <div className="flex justify-between items-center p-4 border-b border-border">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full ${getTypeColor(rig.type)} mr-3`}>
                        <Server className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-medium text-base">{rig.name}</h3>
                          {rig.owned && (
                            <Badge variant="outline" className="ml-2">
                              Level {rig.level}
                            </Badge>
                          )}
                        </div>
                        <p className={`text-xs ${getTypeTextColor(rig.type)} font-medium`}>
                          {rig.type.charAt(0).toUpperCase() + rig.type.slice(1)} Miner
                        </p>
                      </div>
                    </div>
                    
                    {!rig.owned && (
                      <Badge variant="outline" className="text-primary">
                        {rig.cost} GCC
                      </Badge>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-background/30 p-2 rounded-lg">
                        <div className="text-xs text-muted-foreground">Hash Rate</div>
                        <div className="flex items-center">
                          <Cpu className="h-3 w-3 text-primary mr-1" />
                          <span className="text-sm font-medium">{rig.hashRate.toFixed(1)} H/s</span>
                        </div>
                      </div>
                      
                      <div className="bg-background/30 p-2 rounded-lg">
                        <div className="text-xs text-muted-foreground">Power</div>
                        <div className="flex items-center">
                          <Battery className="h-3 w-3 text-yellow-500 mr-1" />
                          <span className="text-sm font-medium">{rig.power.toFixed(1)} kW</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        Efficiency: <span className="font-medium">{calculateRigEfficiency(rig).toFixed(2)}</span>
                      </div>
                      
                      {rig.owned ? (
                        <Button 
                          size="sm" 
                          className="text-xs bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                          onClick={() => {
                            setSelectedRig(rig);
                            setShowUpgradeDialog(true);
                          }}
                        >
                          <ArrowUp className="h-3 w-3 mr-1" />
                          Upgrade
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          className="text-xs bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                          onClick={() => handleBuyRig(rig.id)}
                          disabled={miningData.balance < rig.cost}
                        >
                          <BadgeDollarSign className="h-3 w-3 mr-1" />
                          Buy
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
            <div className="space-y-4">
              {upgrades.map((upgrade) => (
                <motion.div
                  key={upgrade.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 bg-surface rounded-xl ${
                    upgrade.applied ? 'neon-border' : 'border border-muted'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{upgrade.name}</h3>
                      <p className="text-xs text-muted-foreground">{upgrade.description}</p>
                    </div>
                    
                    {upgrade.applied ? (
                      <Badge className="bg-green-600">
                        Applied
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-primary">
                        {upgrade.cost} GCC
                      </Badge>
                    )}
                  </div>
                  
                  {!upgrade.applied && (
                    <div className="flex justify-end mt-4">
                      <Button 
                        size="sm" 
                        className="text-xs bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                        onClick={() => handleBuyUpgrade(upgrade.id)}
                        disabled={miningData.balance < upgrade.cost}
                      >
                        <BadgeDollarSign className="h-3 w-3 mr-1" />
                        Buy Upgrade
                      </Button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Settings Card */}
        <Card className="bg-surface border-none neon-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Sliders className="mr-2 h-5 w-5 text-primary" />
              Mining Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center py-2">
              <div>
                <h3 className="text-sm font-medium">Auto-Collect Rewards</h3>
                <p className="text-xs text-muted-foreground">Automatically collect mining rewards when ready</p>
              </div>
              <Button 
                variant={miningData.autoCollect ? "default" : "outline"} 
                size="sm"
                className={miningData.autoCollect ? "bg-primary" : ""}
                onClick={() => setMiningData(prev => ({ ...prev, autoCollect: !prev.autoCollect }))}
              >
                {miningData.autoCollect ? "Enabled" : "Disabled"}
              </Button>
            </div>
            
            <div className="flex justify-between items-center py-2 border-t border-border">
              <div>
                <h3 className="text-sm font-medium">Energy Saving Mode</h3>
                <p className="text-xs text-muted-foreground">Reduce power consumption at the cost of mining speed</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
              >
                Configure
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex justify-between items-center py-2 border-t border-border">
              <div>
                <h3 className="text-sm font-medium">Mining Schedule</h3>
                <p className="text-xs text-muted-foreground">Set up automatic mining schedules</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
              >
                Configure
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      
      {/* Upgrade Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="bg-surface border-none neon-border">
          <DialogHeader>
            <DialogTitle className="font-rajdhani text-xl">Upgrade Mining Rig</DialogTitle>
            {selectedRig && (
              <DialogDescription>
                Upgrade your {selectedRig.name} to increase performance
              </DialogDescription>
            )}
          </DialogHeader>
          
          {selectedRig && (
            <div className="space-y-4 py-4">
              <div className="bg-surface-light p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full ${getTypeColor(selectedRig.type)} mr-3`}>
                      <Server className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium">{selectedRig.name}</h3>
                      <p className="text-xs text-muted-foreground">Current Level: {selectedRig.level}</p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    Level {selectedRig.level} → {selectedRig.level + 1}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 my-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Hash Rate</div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{selectedRig.hashRate.toFixed(1)} H/s</span>
                      <ChevronRight className="h-4 w-4 text-primary mx-1" />
                      <span className="text-sm font-medium text-primary">{(selectedRig.hashRate * 1.3).toFixed(1)} H/s</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Power Usage</div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{selectedRig.power.toFixed(1)} kW</span>
                      <ChevronRight className="h-4 w-4 text-yellow-500 mx-1" />
                      <span className="text-sm font-medium text-yellow-500">{(selectedRig.power * 1.2).toFixed(1)} kW</span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-2">
                  <div className="text-xs text-muted-foreground mb-1">Efficiency</div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{calculateRigEfficiency(selectedRig).toFixed(2)}</span>
                    <ChevronRight className="h-4 w-4 text-primary mx-1" />
                    <span className="text-sm font-medium text-primary">
                      {((selectedRig.hashRate * 1.3) / (selectedRig.power * 1.2)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center px-4 py-3 bg-yellow-900/20 border border-yellow-600/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                <div>
                  <p className="text-sm font-medium text-yellow-500">Upgrade Cost</p>
                  <p className="text-xs text-muted-foreground">
                    This upgrade will cost {(selectedRig.level * selectedRig.cost * 0.5).toFixed(0)} GCC
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowUpgradeDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpgradeRig}
              disabled={upgrading || (selectedRig && miningData.balance < selectedRig.level * selectedRig.cost * 0.5)}
              className="bg-gradient-to-r from-primary to-secondary"
            >
              {upgrading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Upgrading...
                </>
              ) : (
                <>
                  <ArrowUp className="mr-2 h-4 w-4" />
                  Upgrade
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <BottomNav />
    </motion.div>
  );
};

export default Mining;
