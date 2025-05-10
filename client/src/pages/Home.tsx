import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import {
  Wallet as WalletIcon,
  TrendingUp,
  BarChart4,
  MessageCircle,
  Settings,
  CheckCircle,
  Bot,
  LayoutGrid,
  ChevronRight,
  GripHorizontal,
  X,
  Plus,
  BarChart,
  Diamond,
  Zap,
  Users,
  Gamepad2,
  ChevronLeft,
  Activity,
  ShoppingBag,
  Newspaper,
  UsersIcon,
  ShoppingBagIcon
} from "lucide-react";

// Widget components
import MiningSection from "@/components/MiningSection";
import SocialFeed from "@/components/SocialFeed";
import TradingBot from "@/components/TradingBot";
import Achievements from "@/components/Achievements";
import DailyTasks from "@/components/DailyTasks";
import Wallet from "@/components/Wallet";

// Widget configuration
const widgetLibrary: WidgetType[] = [
  { id: "portfolio", name: "Portfolio", icon: <BarChart className="h-5 w-5" />, height: "medium" },
  { id: "mining", name: "Mining", icon: <Zap className="h-5 w-5" />, height: "medium" },
  { id: "social", name: "Social Feed", icon: <MessageCircle className="h-5 w-5" />, height: "large" },
  { id: "bots", name: "Trading Bots", icon: <Bot className="h-5 w-5" />, height: "medium" },
  { id: "tasks", name: "Daily Tasks", icon: <CheckCircle className="h-5 w-5" />, height: "small" },
  { id: "achievements", name: "Achievements", icon: <Diamond className="h-5 w-5" />, height: "medium" },
  { id: "wallet", name: "Wallet", icon: <WalletIcon className="h-5 w-5" />, height: "large" },
];

type WidgetType = {
  id: string;
  name: string;
  icon: React.ReactNode;
  height: "small" | "medium" | "large";
};

// App icons with badges
const appIcons = [
  {
    name: "Trading Bots",
    icon: <Activity className="h-6 w-6" />,
    path: "/bots",
    badge: 2,
    color: "bg-cyan-400/10 text-cyan-400"
  },
  {
    name: "Mining",
    icon: <Zap className="h-6 w-6" />,
    path: "/mining",
    badge: 0,
    color: "bg-purple-400/10 text-purple-400"
  },
  {
    name: "Wallet",
    icon: <WalletIcon className="h-6 w-6" />,
    path: "/wallet",
    badge: 0,
    color: "bg-primary/10 text-primary"
  },
  {
    name: "Games",
    icon: <Gamepad2 className="h-6 w-6" />,
    path: "/games",
    badge: 3,
    color: "bg-green-400/10 text-green-400"
  },
  {
    name: "Social",
    icon: <MessageCircle className="h-6 w-6" />,
    path: "/social",
    badge: 5,
    color: "bg-purple-400/10 text-purple-400" 
  },
  {
    name: "Wallet",
    icon: <WalletIcon className="h-6 w-6" />,
    path: "/wallet",
    badge: 1,
    color: "bg-amber-400/10 text-amber-400"
  },
  {
    name: "Store",
    icon: <ShoppingBag className="h-6 w-6" />,
    path: "/store",
    badge: 0,
    color: "bg-green-400/10 text-green-400"
  },
  {
    name: "News",
    icon: <Newspaper className="h-6 w-6" />,
    path: "/news",
    badge: 4,
    color: "bg-red-400/10 text-red-400"
  },
  {
    name: "Clans",
    icon: <Users className="h-6 w-6" />,
    path: "/clans",
    badge: 2,
    color: "bg-indigo-400/10 text-indigo-400"
  },
  {
    name: "Tasks",
    icon: <CheckCircle className="h-6 w-6" />,
    path: "/tasks",
    badge: 6,
    color: "bg-pink-400/10 text-pink-400"
  },
  // {
  //   name: "Wallet",
  //   icon: <WalletIcon className="h-5 w-5" />,
  //   path: "/wallet",
  //   badge: 0,
  //   color: "bg-primary/20 text-primary"
  // },
];

// Widget component that renders different content based on widget.id
const Widget = ({ widget, isEditing, onRemove }: { widget: WidgetType, isEditing: boolean, onRemove: () => void }) => {
  // Height classes based on widget size - standardize height for slider
  const heightClass = "h-[350px]"; // Fixed height for all widgets in the slider
  
  const renderWidgetContent = () => {
    switch (widget.id) {
      case "portfolio":
        return (
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-bold">$24,561.85</h3>
              <Badge className="bg-green-600">+14.5%</Badge>
            </div>
            
            <div className="h-32 w-full flex items-end space-x-1">
              {Array.from({ length: 30 }).map((_, i) => {
                const height = 20 + Math.random() * 80;
                return (
                  <div
                    key={i}
                    className="flex-1 bg-primary/20 rounded-t"
                    style={{ height: `${height}%` }}
                  ></div>
                );
              })}
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
                <p className="text-sm font-medium">+$3,240.54 (14.5%)</p>
              </div>
              <Link href="/wallet">
                <a className="flex items-center text-sm text-primary">
                  <span className="mr-1">Details</span>
                  <ChevronRight className="h-4 w-4" />
                </a>
              </Link>
            </div>
          </div>
        );
      case "mining":
        return (
          <div className="p-4 h-full flex flex-col">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Current Mining Rate</p>
                <p className="text-2xl font-bold neon-text-primary">23.5 GCC/hr</p>
              </div>
              <div className="bg-primary/10 rounded-full p-2">
                <Zap className="h-6 w-6 text-primary" />
              </div>
            </div>
            
            <div className="mt-4 space-y-4 flex-grow">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Daily Target: 500 GCC</span>
                  <span className="font-medium">47%</span>
                </div>
                <div className="h-2 bg-surface-light rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "47%" }}></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-surface-light rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Total Mined</p>
                  <p className="text-lg font-semibold">1,245 GCC</p>
                </div>
                <div className="bg-surface-light rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Mining Power</p>
                  <p className="text-lg font-semibold">780 MH/s</p>
                </div>
              </div>
            </div>
            
            <Link href="/mining" className="block mt-auto">
              <button className="w-full py-2 mt-2 border border-primary/50 rounded-lg text-primary text-sm hover:bg-primary/10 transition">
                Manage Miners
              </button>
            </Link>
          </div>
        );
      case "social":
        return (
          <div className="p-4 overflow-auto">
            <div className="mb-3">
              <div className="bg-surface-light p-3 rounded-lg mb-3">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 mr-2 flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">CryptoTrader</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <p className="text-sm">Just bought more $BTC at this dip. The market looks promising for long-term investors!</p>
              </div>
              
              <div className="bg-surface-light p-3 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 mr-2 flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">BlockchainDev</p>
                    <p className="text-xs text-muted-foreground">5 hours ago</p>
                  </div>
                </div>
                <p className="text-sm">New mining rig is set up! Getting 780 MH/s on Ethereum. Really happy with the results.</p>
              </div>
            </div>
            
            <Link href="/social" className="flex items-center justify-center text-sm text-primary">
              <span className="mr-1">View All Posts</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        );
      case "bots":
        return (
          <div className="p-4 h-full flex flex-col">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Trading Bots</p>
                <p className="text-xl font-bold">2 Active Bots</p>
              </div>
              <div className="bg-primary/10 rounded-full p-2">
                <Bot className="h-6 w-6 text-primary" />
              </div>
            </div>
            
            <div className="mt-4 space-y-3 flex-grow">
              {[
                { name: "DCA Bitcoin", performance: 8.2, active: true },
                { name: "ETH Swing Trader", performance: -3.4, active: true },
                { name: "ADA Momentum", performance: 0, active: false }
              ].map((bot, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-surface-light rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${bot.active ? "bg-green-500" : "bg-gray-400"}`}></div>
                    <span className="font-medium">{bot.name}</span>
                  </div>
                  <span className={bot.performance > 0 ? "text-green-500" : (bot.performance < 0 ? "text-red-500" : "")}>
                    {bot.performance > 0 ? "+" : ""}{bot.performance}%
                  </span>
                </div>
              ))}
            </div>
            
            <Link href="/bots" className="block mt-auto">
              <button className="w-full py-2 mt-2 border border-primary/50 rounded-lg text-primary text-sm hover:bg-primary/10 transition">
                View All Bots
              </button>
            </Link>
          </div>
        );
      case "tasks":
        return (
          <div className="p-4 h-full flex flex-col">
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span>Daily Progress</span>
                <span className="font-medium">40%</span>
              </div>
              <div className="h-2 bg-surface-light rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: "40%" }}></div>
              </div>
            </div>
            
            <div className="space-y-2 flex-grow">
              {[
                { title: "Log in daily", completed: true },
                { title: "Trade crypto", completed: false },
                { title: "Mine tokens", completed: false },
                { title: "Check portfolio", completed: false }
              ].map((task, idx) => (
                <div key={idx} className="flex items-center p-2 bg-surface-light rounded-lg">
                  <div className={`w-5 h-5 mr-2 rounded-full flex items-center justify-center ${task.completed ? 'bg-primary text-white' : 'border border-primary/30'}`}>
                    {task.completed && <CheckCircle className="h-3 w-3" />}
                  </div>
                  <span className="text-sm">{task.title}</span>
                </div>
              ))}
            </div>
            
            <Link href="/tasks" className="mt-auto">
              <button className="w-full py-2 mt-2 border border-primary/50 rounded-lg text-primary text-sm hover:bg-primary/10 transition">
                View All Tasks
              </button>
            </Link>
          </div>
        );
      case "achievements":
        return (
          <div className="p-4 h-full flex flex-col">
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                { title: "First Trade", icon: <TrendingUp className="h-4 w-4 text-primary" />, unlocked: true },
                { title: "Mining Pro", icon: <Zap className="h-4 w-4 text-primary" />, unlocked: true },
                { title: "Social Star", icon: <MessageCircle className="h-4 w-4 text-primary" />, unlocked: false }
              ].map((achievement, idx) => (
                <div key={idx} className="flex flex-col items-center p-2 bg-surface-light rounded-lg">
                  <div className={`w-8 h-8 rounded-full mb-1 flex items-center justify-center ${achievement.unlocked ? 'bg-primary/20' : 'bg-gray-500/20'}`}>
                    {achievement.icon}
                  </div>
                  <span className="text-xs text-center">{achievement.title}</span>
                </div>
              ))}
            </div>
            
            <div className="bg-surface-light p-3 rounded-lg mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span>Daily Challenges</span>
                <span className="text-xs text-primary">2/5 completed</span>
              </div>
              
              <div className="flex items-center mb-2">
                <div className="w-4 h-4 rounded-full border border-primary flex items-center justify-center mr-2">
                  <CheckCircle className="h-2 w-2 text-primary" />
                </div>
                <span className="text-xs">Complete 3 trades</span>
              </div>
            </div>
            
            <Link href="/profile" className="mt-auto block">
              <button className="w-full py-2 border border-primary/50 rounded-lg text-primary text-sm hover:bg-primary/10 transition">
                View All Achievements
              </button>
            </Link>
          </div>
        );
      case "wallet":
        return (
          <div className="p-4 h-full flex flex-col">
            <div className="bg-gradient-to-r from-primary/30 to-secondary/30 p-4 rounded-lg mb-4">
              <div className="mb-2 text-sm text-primary-foreground/70">Total Balance</div>
              <div className="text-2xl font-bold">$24,561.85</div>
              <div className="mt-1 text-xs text-primary-foreground/70">+$3,240.54 (14.5%)</div>
            </div>
            
            <div className="space-y-2 flex-grow">
              {[
                { name: "Bitcoin", symbol: "BTC", amount: 0.85, value: 34250 },
                { name: "Ethereum", symbol: "ETH", amount: 7.2, value: 12800 },
                { name: "GameTokens", symbol: "GCC", amount: 1250, value: 1250 }
              ].map((coin, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-surface-light rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary/20 mr-2 flex items-center justify-center">
                      {coin.symbol === "BTC" ? "₿" : coin.symbol === "ETH" ? "Ξ" : "G"}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{coin.name}</div>
                      <div className="text-xs text-muted-foreground">{coin.amount} {coin.symbol}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">${coin.value.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <Link href="/wallet" className="mt-auto block">
              <button className="w-full py-2 mt-2 border border-primary/50 rounded-lg text-primary text-sm hover:bg-primary/10 transition">
                View Wallet
              </button>
            </Link>
          </div>
        );
      default:
        return (
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground">Widget Content</p>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-surface rounded-xl neon-border overflow-hidden ${heightClass} relative flex-shrink-0 w-[90vw] max-w-md mr-4`}
    >
      {isEditing && (
        <button 
          onClick={onRemove}
          className="absolute top-2 right-2 z-10 w-6 h-6 bg-error/90 rounded-full flex items-center justify-center"
        >
          <X className="h-4 w-4 text-white" />
        </button>
      )}
      
      <div className="bg-gradient-to-r from-primary to-secondary p-3 flex items-center">
        <div className="mr-2">{widget.icon}</div>
        <h2 className="text-lg font-bold text-primary-foreground">{widget.name}</h2>
        {isEditing && (
          <div className="ml-auto cursor-move">
            <GripHorizontal className="h-5 w-5 text-primary-foreground/70" />
          </div>
        )}
      </div>
      
      <div className="overflow-auto h-[calc(100%-48px)]">
        {renderWidgetContent()}
      </div>
    </motion.div>
  );
};

const Home: React.FC = () => {
  const { user, isLoading, achievements, challenges, userTradingBots, toggleTradingBot } = useUser();
  const { toast } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeWidgets, setActiveWidgets] = useState([
    widgetLibrary[0], // Portfolio
    widgetLibrary[1], // Mining
    widgetLibrary[2], // Social
    widgetLibrary[3], // Bots
  ]);
  const [currentWidgetIndex, setCurrentWidgetIndex] = useState(0);
  const widgetSliderRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    document.title = "CryptoVerse - Home";
  }, []);
  
  const handleAddWidget = (widget: any) => {
    setActiveWidgets([...activeWidgets, widget]);
    toast({
      title: "Widget Added",
      description: `Added ${widget.name} widget to your dashboard`,
    });
  };
  
  const handleRemoveWidget = (index: number) => {
    const newWidgets = [...activeWidgets];
    newWidgets.splice(index, 1);
    setActiveWidgets(newWidgets);
  };

  const scrollToWidget = (direction: 'next' | 'prev') => {
    if (!widgetSliderRef.current) return;
    
    let newIndex;
    if (direction === 'next') {
      newIndex = Math.min(currentWidgetIndex + 1, activeWidgets.length - 1);
    } else {
      newIndex = Math.max(currentWidgetIndex - 1, 0);
    }
    
    setCurrentWidgetIndex(newIndex);
    
    // Get the widget elements and scroll to the target one
    const widgets = widgetSliderRef.current.querySelectorAll('.snap-center');
    if (widgets[newIndex]) {
      widgets[newIndex].scrollIntoView({ 
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  };

  // Function to scroll to a specific widget by index
  const scrollToWidgetByIndex = (index: number) => {
    if (!widgetSliderRef.current) return;
    if (index < 0 || index >= activeWidgets.length) return;
    
    setCurrentWidgetIndex(index);
    
    const widgets = widgetSliderRef.current.querySelectorAll('.snap-center');
    if (widgets[index]) {
      widgets[index].scrollIntoView({ 
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  };

  const handleScroll = () => {
    if (!widgetSliderRef.current) return;
    
    // Using Intersection Observer would be better,
    // but for now we can estimate based on scroll position
    const containerWidth = widgetSliderRef.current.clientWidth;
    const scrollPosition = widgetSliderRef.current.scrollLeft;
    
    // Estimate which widget is most visible
    const estimatedIndex = Math.round(scrollPosition / containerWidth);
    const clampedIndex = Math.min(
      Math.max(0, estimatedIndex), 
      activeWidgets.length - 1
    );
    
    if (clampedIndex !== currentWidgetIndex) {
      setCurrentWidgetIndex(clampedIndex);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Spinner className="h-12 w-12 text-primary" />
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <h1 className="text-3xl font-bold text-center mb-4 neon-text-primary">CryptoVerse</h1>
        <p className="text-center mb-4">Please login to access your dashboard</p>
      </div>
    );
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background pb-20"
    >
      <TopBar />
      
      <main className="mt-16 px-0 pb-4">
        {/* Edit mode toggle */}
        <div className="flex justify-between items-center mt-4 mb-6 px-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button 
            onClick={() => setIsEditMode(!isEditMode)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              isEditMode 
                ? "bg-primary text-primary-foreground" 
                : "bg-surface text-primary border border-primary/30"
            }`}
          >
            {isEditMode ? "Done" : "Customize"}
          </button>
        </div>
        
        {/* Widgets Swiper Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center px-4 mb-3">
            <h2 className="text-lg font-medium">Widgets</h2>
            <div className="flex items-center space-x-1">
              <span className="text-sm text-muted-foreground">
                {currentWidgetIndex + 1}/{activeWidgets.length}
              </span>
              <div className="flex space-x-1">
                <button 
                  onClick={() => scrollToWidget('prev')}
                  disabled={currentWidgetIndex === 0}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentWidgetIndex === 0 ? 'text-muted-foreground/40' : 'bg-surface-light'
                  }`}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => scrollToWidget('next')}
                  disabled={currentWidgetIndex === activeWidgets.length - 1}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentWidgetIndex === activeWidgets.length - 1 ? 'text-muted-foreground/40' : 'bg-surface-light'
                  }`}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          
          <div 
            ref={widgetSliderRef}
            className="flex overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory"
            onScroll={handleScroll}
          >
            <div className="pl-4 flex items-center">
              {activeWidgets.map((widget, index) => (
                <div 
                  key={`${widget.id}-${index}`} 
                  className="snap-center"
                >
                  <Widget
                    widget={widget}
                    isEditing={isEditMode}
                    onRemove={() => handleRemoveWidget(index)}
                  />
                </div>
              ))}
              
              {/* Add widget button (only in edit mode) */}
              {isEditMode && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="border-2 border-dashed border-primary/30 rounded-xl h-[350px] flex-shrink-0 w-[90vw] max-w-md flex items-center justify-center cursor-pointer snap-center"
                  onClick={() => {
                    const remainingWidgets = widgetLibrary.filter(
                      w => !activeWidgets.some(aw => aw.id === w.id)
                    );
                    
                    if (remainingWidgets.length > 0) {
                      handleAddWidget(remainingWidgets[0]);
                    } else {
                      toast({
                        title: "No more widgets",
                        description: "You've added all available widgets",
                      });
                    }
                  }}
                >
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                      <Plus className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-primary font-medium">Add Widget</p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
          
          {/* Pagination dots */}
          <div className="flex justify-center space-x-1.5 mt-2">
            {activeWidgets.map((_, index) => (
              <button 
                key={index} 
                className={`w-2.5 h-2.5 rounded-full ${
                  currentWidgetIndex === index ? 'bg-primary' : 'bg-muted-foreground/30'
                } transition-all hover:scale-110`}
                onClick={() => scrollToWidgetByIndex(index)}
                aria-label={`Go to widget ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
        
        {/* App Icons Grid */}
        <div className="mb-6 px-4">
          <h2 className="text-lg font-medium mb-3">Apps</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {appIcons.map((app, index) => (
              <Link key={index} href={app.path} style={{textDecoration: "none"}}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: index * 0.05 } }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center justify-center p-3 bg-surface/80 backdrop-blur-sm rounded-xl neon-border cursor-pointer relative"
                >
                  <div className={`p-3 rounded-full mb-2 ${app.color}`}>
                    {app.icon}
                  </div>
                  <span className="text-xs font-medium line-clamp-1">{app.name}</span>
                  
                  {app.badge > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-primary text-primary-foreground text-xs font-bold rounded-full">
                      {app.badge}
                    </span>
                  )}
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      
      <BottomNav />
    </motion.div>
  );
};

export default Home;
