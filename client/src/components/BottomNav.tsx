import React, { useState } from "react";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { 
  HomeIcon, 
  Wallet,
  Activity,
  LayoutGrid,
  PlusIcon,
  MinusIcon,
  Gamepad2Icon,
  Zap,
  Users,
  Settings,
  MessageCircle
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const BottomNav: React.FC = () => {
  const [location] = useLocation();
  const { t } = useLanguage();
  const [showMore, setShowMore] = useState(false);
  
  const mainLinks = [
    { path: "/", label: t('nav.home'), icon: HomeIcon },
    { path: "/wallet", label: t('nav.wallet'), icon: Wallet },
    { path: "", label: "", icon: showMore ? MinusIcon : PlusIcon },
    { path: "/mining", label: t('nav.mining'), icon: Zap },
    { path: "/social", label: t('nav.social'), icon: MessageCircle },
  ];
  
  const moreLinks = [
    { path: "/clans", label: t('nav.clans'), icon: Users },
    { path: "/games", label: t('nav.games'), icon: Gamepad2Icon },
    { path: "/bots", label: t('nav.bots'), icon: Activity },
    { path: "/profile", label: t('nav.profile'), icon: Users },
    { path: "/settings", label: t('nav.settings'), icon: Settings },
  ];
  
  return (
    <>
      <motion.nav
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-md border-t border-surface-light pt-2 pb-6 px-2 z-50"
      >
        <div className="flex justify-around items-center">
          {mainLinks.map((link, index) => {
            const isActive = link.path === location;
            const isMoreButton = index === 2;
            
            if (isMoreButton) {
              return (
                <motion.button
                  key={index}
                  onClick={() => setShowMore(!showMore)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary -mt-5 flex items-center justify-center mb-1 shadow-lg"
                >
                  {showMore ? <MinusIcon className="text-white h-7 w-7" /> : <PlusIcon className="text-white h-7 w-7" />}
                </motion.button>
              );
            }
            
            return (
              <Link key={index} href={link.path}>
                <motion.a 
                  className="flex flex-col items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div
                    className={`w-10 h-10 rounded-full ${
                      isActive ? "bg-primary/20 text-primary" : "bg-surface-light"
                    } flex items-center justify-center mb-1`}
                  >
                    <link.icon className="h-5 w-5" />
                  </div>
                  <span className={`text-xs ${isActive ? "neon-text-primary font-medium" : ""}`}>
                    {link.label}
                  </span>
                </motion.a>
              </Link>
            );
          })}
        </div>
      </motion.nav>
      
      {/* Extended Menu */}
      {showMore && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-24 left-0 right-0 z-40 px-4"
        >
          <div className="bg-surface/95 backdrop-blur-md rounded-xl border border-surface-light p-3 shadow-lg">
            <div className="grid grid-cols-5 gap-2">
              {moreLinks.map((link, index) => {
                const isActive = link.path === location;
                
                return (
                  <Link key={index} href={link.path}>
                    <motion.a 
                      className="flex flex-col items-center p-2" 
                      onClick={() => setShowMore(false)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div
                        className={`w-10 h-10 rounded-full ${
                          isActive ? "bg-primary/20 text-primary" : "bg-surface-light"
                        } flex items-center justify-center mb-1`}
                      >
                        <link.icon className="h-5 w-5" />
                      </div>
                      <span className={`text-xs ${isActive ? "neon-text-primary font-medium" : ""}`}>
                        {link.label}
                      </span>
                    </motion.a>
                  </Link>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default BottomNav;
