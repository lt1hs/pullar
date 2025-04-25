import React, { useState, useEffect } from "react";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { 
  BarChart3Icon, 
  ZapIcon, 
  BatteryChargingIcon, 
  TrendingUpIcon,
  UsersIcon,
  RefreshCwIcon,
  ShieldIcon,
  AwardIcon,
  FlameIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Miners: React.FC = () => {
  const { t, dir } = useLanguage();
  const { toast } = useToast();
  const [miners, setMiners] = useState([
    {
      id: 1,
      name: "Basic Miner",
      level: 3,
      efficiency: 68,
      hashRate: "2.5 H/s",
      power: "120 W",
      dailyEarnings: "12 GT",
      status: "active",
      type: "basic",
      upgradeAvailable: true,
      upgradeCost: 250,
      boostCost: 30
    },
    {
      id: 2,
      name: "Advanced Miner",
      level: 2,
      efficiency: 75,
      hashRate: "5.2 H/s",
      power: "220 W",
      dailyEarnings: "28 GT",
      status: "active",
      type: "advanced",
      upgradeAvailable: true,
      upgradeCost: 450,
      boostCost: 45
    },
    {
      id: 3,
      name: "Premium Miner",
      level: 1,
      efficiency: 92,
      hashRate: "12.1 H/s",
      power: "300 W",
      dailyEarnings: "65 GT",
      status: "inactive",
      type: "premium",
      upgradeAvailable: false,
      upgradeCost: 1000,
      boostCost: 80
    }
  ]);

  const [activeMiners, setActiveMiners] = useState(2);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalHashRate, setTotalHashRate] = useState("7.7 H/s");
  const [teamBonus, setTeamBonus] = useState(12);
  const [selectedMiner, setSelectedMiner] = useState<any>(null);
  const [showMinerDetails, setShowMinerDetails] = useState(false);
  const [boostDuration, setBoostDuration] = useState(0);

  useEffect(() => {
    // Calculate total earnings
    let earnings = 0;
    miners.forEach(miner => {
      if (miner.status === "active") {
        earnings += parseInt(miner.dailyEarnings.split(" ")[0]);
      }
    });
    setTotalEarnings(earnings);
  }, [miners]);

  const handleToggleMinerStatus = (id: number) => {
    setMiners(miners.map(miner => {
      if (miner.id === id) {
        const newStatus = miner.status === "active" ? "inactive" : "active";
        const newActiveMiners = newStatus === "active" ? activeMiners + 1 : activeMiners - 1;
        setActiveMiners(newActiveMiners);
        return { ...miner, status: newStatus };
      }
      return miner;
    }));
  };

  const openMinerDetails = (miner: any) => {
    setSelectedMiner(miner);
    setShowMinerDetails(true);
  };

  const closeMinerDetails = () => {
    setShowMinerDetails(false);
    setSelectedMiner(null);
  };

  const handleUpgradeMiner = () => {
    if (!selectedMiner) return;
    
    toast({
      title: t('mining.upgraded'),
      description: t('mining.upgraded.success', { name: selectedMiner.name, level: selectedMiner.level + 1 }),
      variant: "default",
    });
    
    // Update the miner
    setMiners(miners.map(miner => {
      if (miner.id === selectedMiner.id) {
        const newHashRate = (parseFloat(miner.hashRate) * 1.25).toFixed(1) + " H/s";
        const newDailyEarnings = (parseInt(miner.dailyEarnings) * 1.3).toFixed(0) + " GT";
        return { 
          ...miner, 
          level: miner.level + 1,
          hashRate: newHashRate,
          dailyEarnings: newDailyEarnings,
          efficiency: Math.min(99, miner.efficiency + 5),
          upgradeCost: Math.floor(miner.upgradeCost * 1.6)
        };
      }
      return miner;
    }));

    // Update selected miner
    if (selectedMiner) {
      const updatedMiner = miners.find(m => m.id === selectedMiner.id);
      setSelectedMiner(updatedMiner);
    }
  };

  const handleBoostMiner = () => {
    if (!selectedMiner) return;
    
    toast({
      title: t('miners.boosted'),
      description: t('miners.boosted.success', { name: selectedMiner.name, duration: "4 hours" }),
      variant: "default",
    });
    
    setBoostDuration(4);
  };

  return (
    <div className="min-h-screen pb-20 bg-background" dir={dir()}>
      <TopBar />
      
      <main className="container max-w-md mx-auto pt-20 px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-2xl font-bold mb-6 neon-text-primary"
        >
          {t('miners.title')}
        </motion.h1>
        
        {/* Dashboard Summary */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-6 bg-surface rounded-xl p-4 border border-surface-light"
        >
          <h2 className="text-lg font-semibold mb-3">{t('miners.dashboard')}</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-surface-light p-3 flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                <UsersIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t('miners.active')}</p>
                <p className="font-bold">{activeMiners} / {miners.length}</p>
              </div>
            </div>
            
            <div className="rounded-lg bg-surface-light p-3 flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                <BarChart3Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t('miners.earnings')}</p>
                <p className="font-bold">{totalEarnings} GT</p>
              </div>
            </div>
            
            <div className="rounded-lg bg-surface-light p-3 flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                <ZapIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t('miners.hashrate')}</p>
                <p className="font-bold">{totalHashRate}</p>
              </div>
            </div>
            
            <div className="rounded-lg bg-surface-light p-3 flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                <ShieldIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t('miners.teambonus')}</p>
                <p className="font-bold">+{teamBonus}%</p>
              </div>
            </div>
          </div>
        </motion.section>
        
        {/* Miners List */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">{t('miners.list')}</h2>
            <button className="text-sm text-primary flex items-center">
              <RefreshCwIcon className="w-4 h-4 mr-1" /> {t('miners.refresh')}
            </button>
          </div>
          
          <div className="space-y-3">
            {miners.map((miner) => (
              <div 
                key={miner.id}
                onClick={() => openMinerDetails(miner)}
                className="bg-surface rounded-lg border border-surface-light p-3 cursor-pointer hover:border-primary/40 transition-colors"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                      miner.status === 'active' ? 'bg-primary/20' : 'bg-surface-light'
                    }`}>
                      {miner.type === 'basic' && <ZapIcon className={`w-5 h-5 ${miner.status === 'active' ? 'text-primary' : 'text-muted-foreground'}`} />}
                      {miner.type === 'advanced' && <TrendingUpIcon className={`w-5 h-5 ${miner.status === 'active' ? 'text-primary' : 'text-muted-foreground'}`} />}
                      {miner.type === 'premium' && <FlameIcon className={`w-5 h-5 ${miner.status === 'active' ? 'text-primary' : 'text-muted-foreground'}`} />}
                    </div>
                    <div>
                      <h3 className="font-medium">{miner.name}</h3>
                      <div className="flex items-center">
                        <AwardIcon className="w-3 h-3 text-primary mr-1" />
                        <span className="text-xs">{t('miners.level')} {miner.level}</span>
                      </div>
                    </div>
                  </div>
                  <div 
                    className={`px-2 py-1 rounded-full text-xs ${
                      miner.status === 'active' 
                        ? 'bg-primary/20 text-primary' 
                        : 'bg-surface-light text-muted-foreground'
                    }`}
                  >
                    {miner.status === 'active' ? t('miners.active') : t('miners.inactive')}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div>
                    <p className="text-xs text-muted-foreground">{t('miners.hashrate')}</p>
                    <p className="text-sm font-medium">{miner.hashRate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t('miners.efficiency')}</p>
                    <p className="text-sm font-medium">{miner.efficiency}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t('miners.earnings')}</p>
                    <p className="text-sm font-medium">{miner.dailyEarnings}</p>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleMinerStatus(miner.id);
                    }}
                    className={`text-xs py-1 px-3 rounded-full ${
                      miner.status === 'active' 
                        ? 'bg-surface-light text-foreground' 
                        : 'bg-primary/80 text-primary-foreground'
                    }`}
                  >
                    {miner.status === 'active' ? t('miners.deactivate') : t('miners.activate')}
                  </button>
                  
                  {miner.upgradeAvailable && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        openMinerDetails(miner);
                      }}
                      className="text-xs py-1 px-3 rounded-full bg-primary/20 text-primary"
                    >
                      {t('miners.upgrade')}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </main>
      
      {/* Miner Details Modal */}
      {showMinerDetails && selectedMiner && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-surface rounded-xl w-full max-w-sm border border-surface-light p-5"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{selectedMiner.name}</h2>
              <button 
                onClick={closeMinerDetails}
                className="w-8 h-8 rounded-full bg-surface-light flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            
            <div className="flex items-center justify-center mb-5">
              <div className={`w-20 h-20 rounded-full ${
                selectedMiner.status === 'active' ? 'bg-primary/20' : 'bg-surface-light'
              } flex items-center justify-center`}>
                {selectedMiner.type === 'basic' && <ZapIcon className="w-10 h-10 text-primary" />}
                {selectedMiner.type === 'advanced' && <TrendingUpIcon className="w-10 h-10 text-primary" />}
                {selectedMiner.type === 'premium' && <FlameIcon className="w-10 h-10 text-primary" />}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="bg-surface-light rounded-lg p-3">
                <p className="text-xs text-muted-foreground">{t('miners.level')}</p>
                <p className="text-lg font-bold">{selectedMiner.level}</p>
              </div>
              
              <div className="bg-surface-light rounded-lg p-3">
                <p className="text-xs text-muted-foreground">{t('miners.efficiency')}</p>
                <p className="text-lg font-bold">{selectedMiner.efficiency}%</p>
              </div>
              
              <div className="bg-surface-light rounded-lg p-3">
                <p className="text-xs text-muted-foreground">{t('miners.hashrate')}</p>
                <p className="text-lg font-bold">{selectedMiner.hashRate}</p>
              </div>
              
              <div className="bg-surface-light rounded-lg p-3">
                <p className="text-xs text-muted-foreground">{t('miners.power')}</p>
                <p className="text-lg font-bold">{selectedMiner.power}</p>
              </div>
              
              <div className="bg-surface-light rounded-lg p-3 col-span-2">
                <p className="text-xs text-muted-foreground">{t('miners.earnings')}</p>
                <p className="text-lg font-bold">{selectedMiner.dailyEarnings}</p>
              </div>
            </div>
            
            {boostDuration > 0 && (
              <div className="bg-primary/20 text-primary rounded-lg p-3 mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{t('miners.boosted')}</p>
                    <p className="text-xs">{t('miners.boost.remaining', { hours: boostDuration })}</p>
                  </div>
                  <FlameIcon className="w-6 h-6 animate-pulse" />
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              {selectedMiner.upgradeAvailable && (
                <button 
                  onClick={handleUpgradeMiner}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-medium"
                >
                  {t('miners.upgrade')} ({selectedMiner.upgradeCost} GT)
                </button>
              )}
              
              <button 
                onClick={handleBoostMiner}
                className="w-full py-3 rounded-lg border border-primary/30 text-primary font-medium"
              >
                {t('miners.boost')} ({selectedMiner.boostCost} GT)
              </button>
              
              <button 
                onClick={closeMinerDetails}
                className="w-full py-3 rounded-lg bg-surface-light text-foreground"
              >
                {t('miners.close')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      <BottomNav />
    </div>
  );
};

export default Miners;