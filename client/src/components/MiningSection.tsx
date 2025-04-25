import React from "react";
import { motion } from "framer-motion";
import { useMining } from "@/hooks/useMining";
import { MiningAnimation } from "@/components/ui/mining-animation";
import { FlashlightIcon, Drill, ShareIcon } from "lucide-react";

const MiningSection: React.FC = () => {
  const { 
    miningStation, 
    miningProgress, 
    collectTokens, 
    upgradeMiningStation, 
    boostMining,
    isCollecting,
    isUpgrading,
    isBoosting
  } = useMining();
  
  if (!miningStation) return null;
  
  return (
    <section className="px-4 py-3">
      <h2 className="font-rajdhani font-bold text-xl mb-4">Virtual Mining</h2>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="neon-border rounded-2xl bg-surface p-4 mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-rajdhani font-semibold text-lg">Mining Station</h3>
            <p className="text-xs text-gray-400">Generates Game Tokens over time</p>
          </div>
          <div className="w-16 h-16 flex items-center justify-center">
            <MiningAnimation />
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-2">
          <div className="text-xs text-gray-400">Mining Power:</div>
          <div className="text-sm font-medium">
            Level {miningStation.level} ({miningStation.power} tokens/hr)
          </div>
        </div>
        
        <div className="w-full h-2 rounded-full bg-surface-light mb-4">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${miningProgress}%` }}
            transition={{ duration: 0.5 }}
            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
          ></motion.div>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isBoosting}
            onClick={boostMining}
            className="bg-surface-light border border-primary/30 rounded-lg py-2 text-center text-sm font-medium hover:bg-primary/10 transition disabled:opacity-50"
          >
            <FlashlightIcon className="text-primary block mx-auto mb-1 h-5 w-5" />
            {isBoosting ? "Boosting..." : "Boost"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isUpgrading}
            onClick={upgradeMiningStation}
            className="bg-surface-light border border-primary/30 rounded-lg py-2 text-center text-sm font-medium hover:bg-primary/10 transition disabled:opacity-50"
          >
            <Drill className="text-primary block mx-auto mb-1 h-5 w-5" />
            {isUpgrading ? "Upgrading..." : "Upgrade"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isCollecting}
            onClick={collectTokens}
            className="bg-surface-light border border-primary/30 rounded-lg py-2 text-center text-sm font-medium hover:bg-primary/10 transition disabled:opacity-50"
          >
            <ShareIcon className="text-primary block mx-auto mb-1 h-5 w-5" />
            {isCollecting ? "Collecting..." : "Collect"}
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
};

export default MiningSection;
