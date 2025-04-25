import React from "react";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Bot } from "lucide-react";

interface TradingBotProps {
  performance: number;
  wins: number;
  losses: number;
  isEnabled: boolean;
  onToggle: () => void;
  strategies: Array<{
    id: number;
    name: string;
    performance: number;
    icon: string;
  }>;
  onConfigure: () => void;
}

const TradingBot: React.FC<TradingBotProps> = ({
  performance,
  wins,
  losses,
  isEnabled,
  onToggle,
  strategies,
  onConfigure
}) => {
  return (
    <section className="px-4 py-3">
      <h2 className="font-rajdhani font-bold text-xl mb-4">Trading Bot</h2>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="neon-border rounded-2xl bg-surface p-4 mb-4"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-rajdhani font-semibold text-lg">AutoTrader Pro</h3>
            <p className="text-xs text-gray-400">AI-powered trading assistant</p>
          </div>
          <div className="relative">
            <Switch checked={isEnabled} onCheckedChange={onToggle} />
          </div>
        </div>
        
        <div className="bg-background/60 rounded-xl p-3 mb-4">
          <div className="text-xs text-gray-400 mb-1">Bot Performance (30d)</div>
          <div className="flex items-center justify-between">
            <div className={`text-${performance >= 0 ? 'success' : 'error'} text-lg font-bold font-rajdhani`}>
              {performance >= 0 ? '+' : ''}{performance.toFixed(1)}%
            </div>
            <div className="flex items-center">
              <div className="flex items-center mr-3">
                <div className="w-2 h-2 bg-success rounded-full mr-1"></div>
                <span className="text-xs">Wins: {wins}</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-error rounded-full mr-1"></div>
                <span className="text-xs">Losses: {losses}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Active Strategies</div>
          <div className="space-y-2">
            {strategies.map((strategy) => (
              <motion.div
                key={strategy.id}
                whileHover={{ x: 2 }}
                className="flex items-center justify-between bg-surface-light rounded-lg p-2"
              >
                <div className="flex items-center">
                  <i className={`${strategy.icon} text-${strategy.id % 2 === 0 ? 'primary' : 'secondary'} mr-2`}></i>
                  <span className="text-sm">{strategy.name}</span>
                </div>
                <div className={`text-xs text-${strategy.performance >= 0 ? 'success' : 'error'}`}>
                  {strategy.performance >= 0 ? '+' : ''}{strategy.performance.toFixed(1)}%
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onConfigure}
          className="w-full py-2 text-center text-sm bg-gradient-to-r from-primary to-secondary rounded-lg text-white font-medium"
        >
          Configure Bot
        </motion.button>
      </motion.div>
    </section>
  );
};

export default TradingBot;
