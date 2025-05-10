import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/context/LanguageContext";
import NotFound from "@/pages/not-found";
import { lazy, Suspense, useState, useEffect } from "react";
import { useUser, useUserStore } from "./hooks/useUser";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

// Lazy loading all the pages
const Home = lazy(() => import("./pages/Home"));
const Profile = lazy(() => import("./pages/Profile"));
const Wallet = lazy(() => import("./pages/Wallet"));
const Games = lazy(() => import("./pages/Games"));
const Mining = lazy(() => import("./pages/Mining"));
const Social = lazy(() => import("./pages/Social"));
const BotSettings = lazy(() => import("./pages/BotSettings"));
const TradingBots = lazy(() => import("./pages/TradingBots"));
const Store = lazy(() => import("./pages/Store"));
const Settings = lazy(() => import("./pages/Settings"));

function Router() {
  const { user, login } = useUser();
  const { t } = useLanguage();
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
            <h1 className="text-3xl mb-6 text-center neon-text-primary">{t('app.name')}</h1>
            <div className="space-y-4">
              <button 
                onClick={() => {
                  // Auto-login for demo purposes
                  login("CryptoWizard", "password123");
                }} 
                className="w-full py-3 bg-gradient-to-r from-primary to-secondary rounded-lg text-white font-medium"
              >
                {t('app.demo.login')}
              </button>
              <button 
                onClick={() => setShowLogin(false)} 
                className="w-full py-3 text-center text-primary font-medium border border-primary/30 rounded-lg hover:bg-primary/10 transition"
              >
                {t('app.continue.guest')}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/games" component={Games} />
        <Route path="/profile" component={Profile} />
        <Route path="/settings" component={Settings} />
        <Route path="/bot-settings" component={BotSettings} />
        <Route path="/trading-bots" component={TradingBots} />
        <Route path="/store" component={Store} />
        <Route path="/mining" component={Mining} />
        <Route path="/social" component={Social} />
        <Route path="/wallet" component={Wallet} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <LanguageProvider>
        <Router />
      </LanguageProvider>
    </TooltipProvider>
  );
}

export default App;
