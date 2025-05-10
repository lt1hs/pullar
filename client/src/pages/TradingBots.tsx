import React, { useEffect } from "react";
import { useLocation } from "wouter";

// Simple redirect component from TradingBots to BotSettings
const TradingBots: React.FC = () => {
  const [location, setLocation] = useLocation();
  
  useEffect(() => {
    // Redirect to the bots page
    setLocation("/bots");
  }, [setLocation]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-medium mb-2">Redirecting to Trading Bots</h2>
        <div className="flex space-x-1 justify-center">
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.1s" }}></div>
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        </div>
      </div>
    </div>
  );
};

export default TradingBots; 