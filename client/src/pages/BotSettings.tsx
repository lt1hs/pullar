import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { useUser } from "@/hooks/useUser";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { 
  BarChart2, 
  Bot, 
  Settings, 
  Sliders, 
  BookOpen, 
  PlusCircle, 
  Trash2, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Lock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const STRATEGY_DESCRIPTIONS = {
  "dollar_cost_averaging": "Automatically buys a fixed amount of a cryptocurrency at regular intervals, regardless of price.",
  "swing_trading": "Aims to capture gains by holding positions for a period of days to weeks to profit from expected upward or downward market movements.",
  "trend_following": "Takes long positions in assets with upward trending prices and short positions in assets with downward trending prices.",
  "arbitrage": "Seeks to profit from price differences of the same asset on different exchanges.",
  "market_making": "Provides liquidity to the market by placing buy and sell orders around the current market price."
};

interface NewBotFormData {
  name: string;
  strategy: string;
  riskLevel: number;
  targetCrypto: string;
}

const BotSettings: React.FC = () => {
  const { user } = useUser();
  const { toast } = useToast();
  
  const [bots, setBots] = useState([
    {
      id: 1,
      name: "DCA Bitcoin",
      strategy: "dollar_cost_averaging",
      enabled: true,
      userId: 1
    },
    {
      id: 2,
      name: "ETH Trader",
      strategy: "swing_trading",
      enabled: false,
      userId: 1
    }
  ]);
  
  const [newBotDialog, setNewBotDialog] = useState(false);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false);
  const [selectedBot, setSelectedBot] = useState<number | null>(null);
  const [formData, setFormData] = useState<NewBotFormData>({
    name: "New Trading Bot",
    strategy: "dollar_cost_averaging",
    riskLevel: 5,
    targetCrypto: "BTC"
  });
  
  useEffect(() => {
    document.title = "CryptoVerse - Bot Settings";
  }, []);
  
  const handleCreateBot = () => {
    if (!user) return;
    
    const newBot = {
      id: bots.length + 1,
      name: formData.name,
      strategy: formData.strategy,
      enabled: true,
      userId: user.id
    };
    
    setBots([...bots, newBot]);
    setNewBotDialog(false);
    
    toast({
      title: "Bot created",
      description: "Your new trading bot has been created"
    });
    
    // Reset form
    setFormData({
      name: "New Trading Bot",
      strategy: "dollar_cost_averaging",
      riskLevel: 5,
      targetCrypto: "BTC"
    });
  };
  
  const handleDeleteBot = () => {
    if (selectedBot === null) return;
    
    setBots(bots.filter(bot => bot.id !== selectedBot));
    
    toast({
      title: "Bot deleted",
      description: "Your trading bot has been deleted"
    });
    
    setDeleteConfirmDialog(false);
    setSelectedBot(null);
  };
  
  const toggleBot = (botId: number) => {
    setBots(bots.map(bot => {
      if (bot.id === botId) {
        return { ...bot, enabled: !bot.enabled };
      }
      return bot;
    }));
    
    toast({
      title: "Bot status updated",
      description: "The bot has been toggled successfully"
    });
  };
  
  const groupedBots = bots.reduce((groups, bot) => {
    const status = bot.enabled ? 'active' : 'inactive';
    if (!groups[status]) {
      groups[status] = [];
    }
    groups[status].push(bot);
    return groups;
  }, {} as Record<string, typeof bots>);
  
  const activeBots = groupedBots.active || [];
  const inactiveBots = groupedBots.inactive || [];
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background pb-20"
    >
      <TopBar />
      
      <main className="mt-16 px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-rajdhani font-bold text-2xl">Trading Bots</h1>
          <Button
            size="sm"
            onClick={() => setNewBotDialog(true)}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            New Bot
          </Button>
        </div>
        
        <Card className="bg-surface border-none neon-border mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Bot Overview</CardTitle>
            <CardDescription>Your automated trading assistants</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold neon-text-primary">{bots.length}</div>
                <div className="text-xs text-muted-foreground">Total Bots</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-500">{activeBots.length}</div>
                <div className="text-xs text-muted-foreground">Active</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-500">{Math.floor(Math.random() * 50) + 30}%</div>
                <div className="text-xs text-muted-foreground">Win Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="active" className="mb-6">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="active" className="data-[state=active]:neon-text-primary">
              <Sparkles className="mr-2 h-4 w-4" />
              Active
            </TabsTrigger>
            <TabsTrigger value="inactive" className="data-[state=active]:neon-text-primary">
              <Lock className="mr-2 h-4 w-4" />
              Inactive
            </TabsTrigger>
            <TabsTrigger value="strategies" className="data-[state=active]:neon-text-primary">
              <BookOpen className="mr-2 h-4 w-4" />
              Strategies
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            {activeBots.length === 0 ? (
              <div className="text-center py-8 bg-surface rounded-xl neon-border">
                <Bot className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground mb-4">No active trading bots</p>
                <Button 
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  onClick={() => setNewBotDialog(true)}
                >
                  Create Bot
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {activeBots.map((bot) => {
                  // Generate some random stats for the demo
                  const performance = Math.random() * 30 - 10;
                  const isPositive = performance > 0;
                  const trades = Math.floor(Math.random() * 50) + 10;
                  const wins = Math.floor(trades * (Math.random() * 0.4 + 0.3));
                  const losses = trades - wins;
                  
                  return (
                    <motion.div
                      key={bot.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-surface rounded-xl neon-border p-4"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-medium text-base">{bot.name}</h3>
                          <div className="flex items-center mt-1">
                            <Badge variant="outline" className="mr-2 text-xs">
                              {bot.strategy}
                            </Badge>
                            <Badge variant={isPositive ? "default" : "secondary"} className="text-xs">
                              {isPositive ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                              {isPositive ? "+" : ""}{performance.toFixed(1)}%
                            </Badge>
                          </div>
                        </div>
                        <Switch 
                          checked={bot.enabled}
                          onCheckedChange={() => toggleBot(bot.id)}
                        />
                      </div>
                      
                      <div className="grid grid-cols-3 bg-background/50 rounded-lg p-3 text-center text-xs">
                        <div>
                          <div className="font-medium">{trades}</div>
                          <div className="text-muted-foreground">Trades</div>
                        </div>
                        <div>
                          <div className="font-medium text-green-500">{wins}</div>
                          <div className="text-muted-foreground">Wins</div>
                        </div>
                        <div>
                          <div className="font-medium text-red-500">{losses}</div>
                          <div className="text-muted-foreground">Losses</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between mt-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs"
                          onClick={() => {
                            setSelectedBot(bot.id);
                            setDeleteConfirmDialog(true);
                          }}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                        <Button 
                          size="sm" 
                          className="text-xs bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                        >
                          <Settings className="h-3 w-3 mr-1" />
                          Configure
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="inactive">
            {inactiveBots.length === 0 ? (
              <div className="text-center py-8 bg-surface rounded-xl neon-border">
                <Lock className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground mb-4">No inactive trading bots</p>
              </div>
            ) : (
              <div className="space-y-4">
                {inactiveBots.map((bot) => (
                  <motion.div
                    key={bot.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-surface rounded-xl border border-muted p-4 opacity-70"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-medium text-base">{bot.name}</h3>
                        <div className="flex items-center mt-1">
                          <Badge variant="outline" className="mr-2 text-xs">
                            {bot.strategy}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Inactive
                          </Badge>
                        </div>
                      </div>
                      <Switch 
                        checked={bot.enabled}
                        onCheckedChange={() => toggleBot(bot.id)}
                      />
                    </div>
                    
                    <div className="flex justify-between mt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs"
                        onClick={() => {
                          setSelectedBot(bot.id);
                          setDeleteConfirmDialog(true);
                        }}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-xs"
                      >
                        <Settings className="h-3 w-3 mr-1" />
                        Configure
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="strategies">
            <div className="space-y-4">
              <div className="bg-surface rounded-xl neon-border p-4">
                <h3 className="font-medium">Dollar Cost Averaging</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-3">
                  {STRATEGY_DESCRIPTIONS.dollar_cost_averaging}
                </p>
                <Badge className="bg-primary/20 text-primary hover:bg-primary/30">Beginner Friendly</Badge>
              </div>
              
              <div className="bg-surface rounded-xl neon-border p-4">
                <h3 className="font-medium">Swing Trading</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-3">
                  {STRATEGY_DESCRIPTIONS.swing_trading}
                </p>
                <Badge className="bg-secondary/20 text-secondary hover:bg-secondary/30">Intermediate</Badge>
              </div>
              
              <div className="bg-surface rounded-xl neon-border p-4">
                <h3 className="font-medium">Trend Following</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-3">
                  {STRATEGY_DESCRIPTIONS.trend_following}
                </p>
                <Badge className="bg-secondary/20 text-secondary hover:bg-secondary/30">Intermediate</Badge>
              </div>
              
              <div className="bg-surface rounded-xl border border-muted p-4 opacity-70">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Arbitrage</h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-3">
                      {STRATEGY_DESCRIPTIONS.arbitrage}
                    </p>
                    <Badge className="bg-accent/20 text-accent hover:bg-accent/30">Advanced</Badge>
                  </div>
                  <Badge variant="outline">Premium</Badge>
                </div>
              </div>
              
              <div className="bg-surface rounded-xl border border-muted p-4 opacity-70">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Market Making</h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-3">
                      {STRATEGY_DESCRIPTIONS.market_making}
                    </p>
                    <Badge className="bg-accent/20 text-accent hover:bg-accent/30">Advanced</Badge>
                  </div>
                  <Badge variant="outline">Premium</Badge>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <BottomNav />
      
      {/* Create New Bot Dialog */}
      <Dialog open={newBotDialog} onOpenChange={setNewBotDialog}>
        <DialogContent className="bg-surface border-none neon-border">
          <DialogHeader>
            <DialogTitle className="font-rajdhani text-xl">Create New Trading Bot</DialogTitle>
            <DialogDescription>
              Configure your automated trading assistant
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Bot Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-background"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="strategy">Trading Strategy</Label>
              <Select
                value={formData.strategy}
                onValueChange={(value) => setFormData({ ...formData, strategy: value })}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select a strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dollar_cost_averaging">Dollar Cost Averaging</SelectItem>
                  <SelectItem value="swing_trading">Swing Trading</SelectItem>
                  <SelectItem value="trend_following">Trend Following</SelectItem>
                  <SelectItem value="arbitrage" disabled>Arbitrage (Premium)</SelectItem>
                  <SelectItem value="market_making" disabled>Market Making (Premium)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                {STRATEGY_DESCRIPTIONS[formData.strategy as keyof typeof STRATEGY_DESCRIPTIONS]}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="risk">Risk Level ({formData.riskLevel}/10)</Label>
              <Slider
                id="risk"
                min={1}
                max={10}
                step={1}
                value={[formData.riskLevel]}
                onValueChange={(value) => setFormData({ ...formData, riskLevel: value[0] })}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Conservative</span>
                <span>Aggressive</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="crypto">Target Cryptocurrency</Label>
              <Select
                value={formData.targetCrypto}
                onValueChange={(value) => setFormData({ ...formData, targetCrypto: value })}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select a crypto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                  <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                  <SelectItem value="SOL">Solana (SOL)</SelectItem>
                  <SelectItem value="DOGE">Dogecoin (DOGE)</SelectItem>
                  <SelectItem value="AVAX">Avalanche (AVAX)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNewBotDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateBot}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              Create Bot
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmDialog} onOpenChange={setDeleteConfirmDialog}>
        <DialogContent className="bg-surface border-none neon-border max-w-sm">
          <DialogHeader>
            <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-2" />
            <DialogTitle className="text-center">Delete Bot?</DialogTitle>
            <DialogDescription className="text-center">
              This action cannot be undone. The bot will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteBot}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default BotSettings;
