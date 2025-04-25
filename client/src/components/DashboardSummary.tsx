import React from "react";
import { motion } from "framer-motion";
import { useUser } from "@/hooks/useUser";
import { useCrypto } from "@/hooks/useCrypto";
import CryptoChart from "./CryptoChart";

const DashboardSummary: React.FC = () => {
  const { user } = useUser();
  const { portfolioValue, portfolioChange } = useCrypto();
  
  const isPositive = portfolioChange >= 0;
  
  return (
    <section className="px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="neon-border rounded-2xl bg-surface p-4 mb-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-rajdhani font-bold text-xl">Portfolio Value</h2>
          <div className={`flex items-center text-${isPositive ? 'success' : 'error'} text-sm`}>
            <i className={`ri-arrow-${isPositive ? 'up' : 'down'}-line mr-1`}></i>
            <span>{Math.abs(portfolioChange).toFixed(1)}%</span>
          </div>
        </div>
        
        <div className="text-2xl font-bold font-rajdhani neon-text-primary mb-2">
          ${portfolioValue.toLocaleString()}
        </div>
        
        {/* Chart */}
        <div className="h-36 w-full relative">
          <CryptoChart />
        </div>
        
        <div className="flex justify-between text-xs text-gray-400 px-1">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="neon-border rounded-xl bg-surface p-3"
        >
          <div className="text-xs text-gray-400 mb-1">Game Tokens</div>
          <div className="flex items-center">
            <i className="ri-coin-line text-warning text-xl mr-2"></i>
            <span className="text-lg font-bold font-rajdhani">{user?.gameTokens?.toLocaleString() || 0}</span>
          </div>
          <div className="flex items-center mt-1 text-xs text-success">
            <i className="ri-arrow-up-line mr-1"></i>
            <span>+128 today</span>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="neon-border rounded-xl bg-surface p-3"
        >
          <div className="text-xs text-gray-400 mb-1">Trade Tokens</div>
          <div className="flex items-center">
            <i className="ri-vip-diamond-fill text-primary text-xl mr-2"></i>
            <span className="text-lg font-bold font-rajdhani">{user?.tradeTokens?.toLocaleString() || 0}</span>
          </div>
          <div className="flex items-center mt-1 text-xs text-error">
            <i className="ri-arrow-down-line mr-1"></i>
            <span>-4.2 today</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DashboardSummary;
