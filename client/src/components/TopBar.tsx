import React from "react";
import { useUser } from "@/hooks/useUser";
import { motion } from "framer-motion";
import { BellIcon } from "lucide-react";

const TopBar: React.FC = () => {
  const { user } = useUser();
  
  if (!user) return null;
  
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-surface-light flex justify-between items-center px-4 py-3"
    >
      <div className="flex items-center">
        <div className="relative w-9 h-9 rounded-full overflow-hidden bg-surface-light border border-primary/40">
          {user.profileImageUrl ? (
            <img src={user.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-primary">
              {user.username.substring(0, 1).toUpperCase()}
            </div>
          )}
        </div>
        <div className="ml-2">
          <p className="font-rajdhani font-semibold text-sm">{user.username}</p>
          <div className="flex items-center">
            <span className="text-xs text-primary font-medium">Level {user.level}</span>
            <div className="ml-2 h-1.5 w-12 bg-surface-light rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-primary to-secondary" 
                style={{ width: `${user.levelProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="flex items-center bg-surface px-2 py-1 rounded-full"
        >
          <i className="ri-coin-line text-warning mr-1"></i>
          <span className="text-xs font-medium">{user.gameTokens?.toLocaleString() || 0}</span>
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="flex items-center bg-surface px-2 py-1 rounded-full"
        >
          <i className="ri-vip-diamond-fill text-primary mr-1"></i>
          <span className="text-xs font-medium">{user.tradeTokens?.toLocaleString() || 0}</span>
        </motion.div>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-8 h-8 flex items-center justify-center rounded-full bg-surface-light"
        >
          <BellIcon className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-error flex items-center justify-center text-[10px] font-medium">3</span>
        </motion.button>
      </div>
    </motion.header>
  );
};

export default TopBar;
