import React, { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BellIcon, 
  SearchIcon,
  SunIcon,
  MoonIcon
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

const TopBar: React.FC = () => {
  const { user } = useUser();
  const { t } = useLanguage();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  if (!user) return null;
  
  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-surface-light"
      >
        <div className="flex justify-between items-center px-4 py-3">
          {/* Left section - Logo and user info */}
          <div className="flex items-center">
            <div className="hidden md:block font-rajdhani text-xl font-bold mr-4 text-primary">
              CryptoVerse<span className="text-secondary">.</span>
            </div>
            
            <div className="flex items-center">
              <div className="relative w-9 h-9 rounded-full overflow-hidden bg-surface-light border border-primary/40 drop-shadow-md">
                {user.profileImageUrl ? (
                  <img src={user.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary font-medium">
                    {user.username.substring(0, 1).toUpperCase()}
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-background"></div>
              </div>
              <div className="ml-2">
                <p className="font-rajdhani font-semibold text-sm line-clamp-1">{user.username}</p>
                <div className="flex items-center">
                  <span className="text-xs text-primary font-medium">{t('dashboard.level')} {user.level}</span>
                  <div className="ml-2 h-1.5 w-12 bg-surface-light rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-primary to-secondary" 
                      style={{ width: `${user.levelProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right section - Actions, tokens, notifications */}
          <div className="flex items-center space-x-2">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center bg-surface/80 backdrop-blur-md px-2 py-1 rounded-full border border-surface-light"
            >
              <i className="ri-coin-line text-yellow-400 mr-1"></i>
              <span className="text-xs font-medium">{user.gameTokens?.toLocaleString() || 0}</span>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center bg-surface/80 backdrop-blur-md px-2 py-1 rounded-full border border-surface-light"
            >
              <i className="ri-vip-diamond-fill text-primary mr-1"></i>
              <span className="text-xs font-medium">{user.tradeTokens?.toLocaleString() || 0}</span>
            </motion.div>

            {/* Search button */}
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-light border border-surface-light"
            >
              <SearchIcon className="h-4 w-4" />
            </motion.button>

            {/* Notification bell */}
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-8 h-8 flex items-center justify-center rounded-full bg-surface-light border border-surface-light"
            >
              <BellIcon className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-error flex items-center justify-center text-[10px] font-medium text-white">3</span>
            </motion.button>
            
            <LanguageSwitcher />
          </div>
        </div>
      </motion.header>
      
      {/* Search overlay (conditionally rendered) */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-[57px] left-0 right-0 z-40 bg-background/95 backdrop-blur-xl border-b border-surface-light shadow-lg"
          >
            <div className="container mx-auto px-4 py-3">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder={t('topbar.search')}
                  className="w-full bg-surface/60 rounded-full px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-1 focus:ring-primary/60 border border-surface-light"
                  autoFocus
                />
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                
                <button 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <span className="text-xs font-medium">ESC</span>
                </button>
              </div>
              
              <div className="mt-4 pb-2">
                <p className="text-xs text-muted-foreground mb-2">Popular Searches</p>
                <div className="flex flex-wrap gap-2">
                  {["Bitcoin", "Mining", "Trading Bots", "Social Feed"].map((term, idx) => (
                    <span 
                      key={idx} 
                      className="text-xs bg-surface px-2 py-1 rounded-full cursor-pointer hover:bg-primary/20"
                    >
                      {term}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TopBar;
