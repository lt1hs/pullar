import React from "react";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { HomeIcon, BarChart2Icon, UserIcon, SettingsIcon, PlusIcon } from "lucide-react";

const BottomNav: React.FC = () => {
  const [location] = useLocation();
  
  const links = [
    { path: "/", label: "Home", icon: HomeIcon },
    { path: "/trade", label: "Trade", icon: BarChart2Icon },
    { path: "", label: "", icon: PlusIcon },
    { path: "/profile", label: "Profile", icon: UserIcon },
    { path: "/settings", label: "Settings", icon: SettingsIcon },
  ];
  
  return (
    <motion.nav
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-md border-t border-surface-light pt-2 pb-6 px-2 z-50"
    >
      <div className="flex justify-around items-center">
        {links.map((link, index) => {
          const isActive = link.path === location;
          const isAddButton = index === 2;
          
          if (isAddButton) {
            return (
              <motion.button
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary -mt-5 flex items-center justify-center mb-1 shadow-lg"
              >
                <PlusIcon className="text-white h-7 w-7" />
              </motion.button>
            );
          }
          
          return (
            <Link key={index} href={link.path}>
              <a className="flex flex-col items-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-10 h-10 rounded-full ${
                    isActive ? "bg-primary/10" : "bg-surface-light"
                  } flex items-center justify-center mb-1 ${
                    isActive ? "text-primary" : ""
                  }`}
                >
                  <link.icon className="h-5 w-5" />
                </motion.div>
                <span className={`text-xs ${isActive ? "neon-text-primary" : ""}`}>
                  {link.label}
                </span>
              </a>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default BottomNav;
