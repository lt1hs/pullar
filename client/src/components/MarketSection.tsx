import React from "react";
import { motion } from "framer-motion";
import { useCrypto } from "@/hooks/useCrypto";
import { Link } from "wouter";
import { ArrowRightIcon } from "lucide-react";

const MarketSection: React.FC = () => {
  const { cryptos, tradeCrypto } = useCrypto();
  
  return (
    <section className="px-4 py-3">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-rajdhani font-bold text-xl">Trading Market</h2>
        <Link href="/trade">
          <motion.div
            whileHover={{ x: 3 }}
            className="text-primary text-sm flex items-center cursor-pointer"
          >
            See all
            <ArrowRightIcon className="ml-1 h-4 w-4" />
          </motion.div>
        </Link>
      </div>
      
      <div className="flex overflow-x-auto pb-4 space-x-3 hide-scrollbar">
        {cryptos.map((crypto, index) => {
          const isPositive = crypto.change24h > 0;
          const changePercent = (crypto.change24h / 100).toFixed(1);
          const price = (crypto.currentPrice / 100).toFixed(2);
          
          return (
            <motion.div
              key={crypto.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="neon-border rounded-xl bg-surface p-3 min-w-[220px]"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full bg-${isPositive ? 'primary' : 'secondary'}/20 flex items-center justify-center mr-2`}>
                    <i className={crypto.iconClass + (isPositive ? ' text-primary' : ' text-secondary')}></i>
                  </div>
                  <div>
                    <div className="font-medium">{crypto.symbol}</div>
                    <div className="text-xs text-gray-400">{crypto.name}</div>
                  </div>
                </div>
                <div className={`text-${isPositive ? 'success' : 'error'} text-xs flex items-center`}>
                  <i className={`ri-arrow-${isPositive ? 'up' : 'down'}-line mr-1`}></i>
                  <span>{Math.abs(Number(changePercent))}%</span>
                </div>
              </div>
              
              <div className="h-16 w-full relative mb-2">
                <svg width="100%" height="100%" viewBox="0 0 200 60" preserveAspectRatio="none">
                  <path 
                    className="chart-line" 
                    style={{ stroke: isPositive ? 'hsl(var(--primary))' : 'hsl(var(--secondary))' }} 
                    d={isPositive 
                      ? "M0,40 C10,35 20,45 30,20 C40,10 50,30 60,25 C70,20 80,30 90,25 C100,20 110,30 120,15 C130,5 140,20 150,25 C160,30 170,20 180,15 C190,10 200,20 200,15"
                      : "M0,20 C10,25 20,15 30,25 C40,35 50,30 60,35 C70,40 80,30 90,35 C100,40 110,30 120,25 C130,20 140,30 150,35 C160,40 170,30 180,25 C190,20 200,30 200,35"
                    }
                  />
                </svg>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-lg font-bold font-rajdhani">${price}</div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => tradeCrypto(crypto)}
                  className={`bg-${isPositive ? 'primary' : 'secondary'}/10 hover:bg-${isPositive ? 'primary' : 'secondary'}/20 text-${isPositive ? 'primary' : 'secondary'} rounded-lg px-3 py-1 text-sm font-medium transition`}
                >
                  Trade
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default MarketSection;
