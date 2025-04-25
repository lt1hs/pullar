import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMining } from "@/hooks/useMining";
import { MiningAnimation } from "@/components/ui/mining-animation";
import { 
  FlashlightIcon, 
  Drill, 
  ShareIcon, 
  ChevronUpIcon, 
  ChevronDownIcon,
  ZapIcon,
  LightbulbIcon,
  BarChart2Icon
} from "lucide-react";

// Mining particles animation
const MiningParticle = ({ delay, x, y }: { delay: number; x: number; y: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 0, x: x }}
    animate={{ 
      opacity: [0, 1, 0],
      y: [0, y],
      x: [x, x + (Math.random() * 20 - 10)]
    }}
    transition={{ 
      duration: 1.5, 
      delay: delay,
      repeat: Infinity,
      repeatDelay: Math.random() * 2
    }}
    className="absolute w-1.5 h-1.5 rounded-full bg-primary/60"
  />
);

const MiningSection: React.FC = () => {
  const { 
    miningStation, 
    miningProgress, 
    tokensToCollect,
    collectTokens, 
    upgradeMiningStation, 
    boostMining,
    isCollecting,
    isUpgrading,
    isBoosting
  } = useMining();
  
  const [showDetails, setShowDetails] = useState(false);
  
  if (!miningStation) return null;
  
  // Calculate next level stats
  const nextLevelPower = miningStation.power + 2;
  const upgradeCost = 50 * miningStation.level;
  
  return (
    <section className="px-4 py-3">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-rajdhani font-bold text-xl">Virtual Mining</h2>
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center text-sm text-primary"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
          {showDetails ? <ChevronUpIcon className="h-4 w-4 ml-1" /> : <ChevronDownIcon className="h-4 w-4 ml-1" />}
        </button>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="neon-border rounded-2xl bg-surface p-4 mb-6 relative overflow-hidden"
      >
        {/* Mining animation particles */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <MiningParticle 
              key={i} 
              delay={i * 0.2} 
              x={40 + Math.random() * 60} 
              y={-(30 + Math.random() * 50)}
            />
          ))}
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-rajdhani font-semibold text-lg neon-text-primary">Mining Station</h3>
            <p className="text-xs text-gray-400">Generates Game Tokens over time</p>
          </div>
          <div className="w-16 h-16 flex items-center justify-center">
            <MiningAnimation size={isBoosting ? "lg" : "md"} />
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-2">
          <div className="text-xs text-gray-400">Mining Power:</div>
          <div className="text-sm font-medium">
            <span className="neon-text-primary">Level {miningStation.level}</span> ({miningStation.power} tokens/hr)
          </div>
        </div>
        
        {/* Mining progress bar with animated glow */}
        <div className="w-full h-3 rounded-full bg-surface-light mb-4 relative overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${miningProgress}%` }}
            transition={{ duration: 0.5 }}
            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary relative"
          >
            <motion.div 
              className="absolute inset-0 bg-white/20"
              animate={{ 
                opacity: [0, 0.5, 0],
                x: ['-100%', '100%']
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                repeatDelay: 0.5 
              }}
            />
          </motion.div>
        </div>
        
        {showDetails && (
          <AnimatePresence>
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-4 overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-4 bg-surface-light rounded-lg p-3 mb-3">
                <div className="flex flex-col items-center">
                  <LightbulbIcon className="h-5 w-5 text-primary mb-1" />
                  <p className="text-xs text-gray-400">Current Power</p>
                  <p className="font-medium">{miningStation.power} tokens/hr</p>
                </div>
                <div className="flex flex-col items-center">
                  <ZapIcon className="h-5 w-5 text-primary mb-1" />
                  <p className="text-xs text-gray-400">Next Level</p>
                  <p className="font-medium">{nextLevelPower} tokens/hr</p>
                </div>
              </div>
              <div className="bg-surface-light rounded-lg p-3">
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-gray-400">Upgrade Cost:</span>
                  <span className="text-xs font-medium">{upgradeCost} Game Tokens</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-400">Ready to collect:</span>
                  <span className="text-xs font-medium">{tokensToCollect} Game Tokens</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
        
        <div className="grid grid-cols-3 gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isBoosting}
            onClick={() => boostMining()}
            className="bg-surface-light border border-primary/30 rounded-lg py-2 text-center text-sm font-medium hover:bg-primary/10 transition disabled:opacity-50"
          >
            <FlashlightIcon className="text-primary block mx-auto mb-1 h-5 w-5" />
            {isBoosting ? "Boosting..." : "Boost"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isUpgrading}
            onClick={() => upgradeMiningStation()}
            className="bg-surface-light border border-primary/30 rounded-lg py-2 text-center text-sm font-medium hover:bg-primary/10 transition disabled:opacity-50"
          >
            <Drill className="text-primary block mx-auto mb-1 h-5 w-5" />
            {isUpgrading ? "Upgrading..." : "Upgrade"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isCollecting}
            onClick={() => collectTokens()}
            className="relative bg-surface-light border border-primary/30 rounded-lg py-2 text-center text-sm font-medium hover:bg-primary/10 transition disabled:opacity-50"
          >
            <ShareIcon className="text-primary block mx-auto mb-1 h-5 w-5" />
            {isCollecting ? "Collecting..." : "Collect"}
            
            {tokensToCollect > 0 && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-primary text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
              >
                {tokensToCollect > 99 ? '99+' : tokensToCollect}
              </motion.div>
            )}
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
};

export default MiningSection;
