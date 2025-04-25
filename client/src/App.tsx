import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Trade from "@/pages/Trade";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import BotSettings from "@/pages/BotSettings";
import Mining from "@/pages/Mining";
import Social from "@/pages/Social";
import { useState, useEffect } from "react";
import { useUser, useUserStore } from "./hooks/useUser";
import { motion, AnimatePresence } from "framer-motion";

function Router() {
  const { user, login } = useUser();
  const [showLogin, setShowLogin] = useState(true);
  
  useEffect(() => {
    if (user) {
      setShowLogin(false);
    }
  }, [user]);
  
  if (showLogin && !user) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen flex flex-col items-center justify-center p-4"
        >
          <div className="w-full max-w-md neon-border bg-surface rounded-2xl p-6">
            <h1 className="text-3xl mb-6 text-center neon-text-primary">CryptoVerse</h1>
            <div className="space-y-4">
              <button 
                onClick={() => {
                  // Auto-login for demo purposes
                  login("CryptoWizard", "password123");
                }} 
                className="w-full py-3 bg-gradient-to-r from-primary to-secondary rounded-lg text-white font-medium"
              >
                Demo Login
              </button>
              <button 
                onClick={() => setShowLogin(false)} 
                className="w-full py-3 text-center text-primary font-medium border border-primary/30 rounded-lg hover:bg-primary/10 transition"
              >
                Continue as Guest
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }
  
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/trade" component={Trade} />
      <Route path="/profile" component={Profile} />
      <Route path="/settings" component={Settings} />
      <Route path="/bots" component={BotSettings} />
      <Route path="/mining" component={Mining} />
      <Route path="/social" component={Social} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}

export default App;
