import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  CreditCard, 
  Send, 
  Wallet as WalletIcon, 
  RefreshCw, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight, 
  Copy, 
  CheckCheck, 
  ChevronRight, 
  Plus, 
  AlertTriangle,
  Sparkles,
  DollarSign
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: number;
  type: 'send' | 'receive' | 'exchange' | 'reward' | 'mining';
  amount: number;
  currency: string;
  date: Date;
  recipient?: string;
  sender?: string;
  status: 'completed' | 'pending' | 'failed';
}

const Wallet: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [showExchangeDialog, setShowExchangeDialog] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Sample balances
  const [balances, setBalances] = useState({
    gcc: 1250.75, // GameCryptoCoin
    gp: 5000.50,  // GamePoints
  });
  
  // Sample card data
  const [cardDetails, setCardDetails] = useState({
    number: "**** **** **** 4295",
    name: "CRYPTO WIZARD",
    expiry: "09/28",
    balance: 500.25,
    enabled: true,
  });
  
  // Sample transaction history
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 1,
      type: 'receive',
      amount: 250,
      currency: 'GCC',
      date: new Date(2023, 3, 24, 14, 30),
      sender: 'CryptoKing',
      status: 'completed'
    },
    {
      id: 2,
      type: 'send',
      amount: 100,
      currency: 'GCC',
      date: new Date(2023, 3, 23, 10, 15),
      recipient: 'BlockMaster',
      status: 'completed'
    },
    {
      id: 3,
      type: 'exchange',
      amount: 500,
      currency: 'GP',
      date: new Date(2023, 3, 22, 16, 45),
      status: 'completed'
    },
    {
      id: 4,
      type: 'mining',
      amount: 75,
      currency: 'GCC',
      date: new Date(2023, 3, 21, 9, 20),
      status: 'completed'
    },
    {
      id: 5,
      type: 'reward',
      amount: 30,
      currency: 'GCC',
      date: new Date(2023, 3, 20, 19, 10),
      status: 'completed'
    },
  ]);
  
  // Form states
  const [sendForm, setSendForm] = useState({
    recipient: '',
    amount: '',
    currency: 'GCC',
  });
  
  const [exchangeForm, setExchangeForm] = useState({
    fromCurrency: 'GCC',
    toCurrency: 'GP',
    amount: '',
    estimatedReceive: '0',
  });
  
  // Exchange rate: 1 GCC = 4 GP
  const exchangeRates = {
    GCC_TO_GP: 4,
    GP_TO_GCC: 0.25,
  };
  
  const handleCopyAddress = () => {
    // In a real app, this would copy the wallet address to clipboard
    setCopied(true);
    toast({
      title: "Address copied",
      description: "Wallet address copied to clipboard",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleSendSubmit = () => {
    if (!sendForm.recipient || !sendForm.amount) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    const amount = parseFloat(sendForm.amount);
    
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }
    
    if (amount > balances[sendForm.currency === 'GCC' ? 'gcc' : 'gp']) {
      toast({
        title: "Insufficient funds",
        description: `You don't have enough ${sendForm.currency}`,
        variant: "destructive",
      });
      return;
    }
    
    // Update balances
    setBalances(prev => ({
      ...prev,
      [sendForm.currency === 'GCC' ? 'gcc' : 'gp']: prev[sendForm.currency === 'GCC' ? 'gcc' : 'gp'] - amount,
    }));
    
    // Add transaction
    setTransactions(prev => [
      {
        id: Date.now(),
        type: 'send',
        amount,
        currency: sendForm.currency,
        date: new Date(),
        recipient: sendForm.recipient,
        status: 'completed',
      },
      ...prev,
    ]);
    
    toast({
      title: "Transaction submitted",
      description: `${amount} ${sendForm.currency} sent to ${sendForm.recipient}`,
    });
    
    // Reset form and close dialog
    setSendForm({
      recipient: '',
      amount: '',
      currency: 'GCC',
    });
    
    setShowSendDialog(false);
  };
  
  const handleExchangeSubmit = () => {
    if (!exchangeForm.amount) {
      toast({
        title: "Missing information",
        description: "Please enter an amount",
        variant: "destructive",
      });
      return;
    }
    
    const amount = parseFloat(exchangeForm.amount);
    
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }
    
    if (amount > balances[exchangeForm.fromCurrency === 'GCC' ? 'gcc' : 'gp']) {
      toast({
        title: "Insufficient funds",
        description: `You don't have enough ${exchangeForm.fromCurrency}`,
        variant: "destructive",
      });
      return;
    }
    
    // Calculate exchange amount
    const rate = exchangeForm.fromCurrency === 'GCC' ? exchangeRates.GCC_TO_GP : exchangeRates.GP_TO_GCC;
    const exchangedAmount = amount * rate;
    
    // Update balances
    setBalances(prev => ({
      ...prev,
      [exchangeForm.fromCurrency === 'GCC' ? 'gcc' : 'gp']: prev[exchangeForm.fromCurrency === 'GCC' ? 'gcc' : 'gp'] - amount,
      [exchangeForm.toCurrency === 'GCC' ? 'gcc' : 'gp']: prev[exchangeForm.toCurrency === 'GCC' ? 'gcc' : 'gp'] + exchangedAmount,
    }));
    
    // Add transaction
    setTransactions(prev => [
      {
        id: Date.now(),
        type: 'exchange',
        amount,
        currency: exchangeForm.fromCurrency,
        date: new Date(),
        status: 'completed',
      },
      ...prev,
    ]);
    
    toast({
      title: "Exchange completed",
      description: `${amount} ${exchangeForm.fromCurrency} exchanged for ${exchangedAmount.toFixed(2)} ${exchangeForm.toCurrency}`,
    });
    
    // Reset form and close dialog
    setExchangeForm({
      fromCurrency: 'GCC',
      toCurrency: 'GP',
      amount: '',
      estimatedReceive: '0',
    });
    
    setShowExchangeDialog(false);
  };
  
  const handleToggleCard = () => {
    setCardDetails(prev => ({
      ...prev,
      enabled: !prev.enabled,
    }));
    
    toast({
      title: cardDetails.enabled ? "Card disabled" : "Card enabled",
      description: cardDetails.enabled ? "Your virtual card has been deactivated" : "Your virtual card is now active",
    });
  };
  
  const handleExchangeAmountChange = (amount: string) => {
    setExchangeForm(prev => {
      const numAmount = parseFloat(amount) || 0;
      const rate = prev.fromCurrency === 'GCC' ? exchangeRates.GCC_TO_GP : exchangeRates.GP_TO_GCC;
      const estimatedReceive = (numAmount * rate).toFixed(2);
      
      return {
        ...prev,
        amount,
        estimatedReceive,
      };
    });
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'send':
        return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      case 'receive':
        return <ArrowDownRight className="h-4 w-4 text-green-500" />;
      case 'exchange':
        return <RefreshCw className="h-4 w-4 text-blue-500" />;
      case 'reward':
        return <Sparkles className="h-4 w-4 text-yellow-500" />;
      case 'mining':
        return <WalletIcon className="h-4 w-4 text-primary" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };
  
  const getTransactionTitle = (transaction: Transaction) => {
    switch (transaction.type) {
      case 'send':
        return `Sent to ${transaction.recipient}`;
      case 'receive':
        return `Received from ${transaction.sender}`;
      case 'exchange':
        return 'Currency Exchange';
      case 'reward':
        return 'Task Reward';
      case 'mining':
        return 'Mining Reward';
      default:
        return 'Transaction';
    }
  };

  return (
    <Card className="bg-surface border-none neon-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium flex items-center">
          <WalletIcon className="mr-2 h-5 w-5 text-primary" />
          Wallet
        </CardTitle>
        <CardDescription>Manage your tokens and transactions</CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="history" className="text-xs">History</TabsTrigger>
            <TabsTrigger value="exchange" className="text-xs">Exchange</TabsTrigger>
            <TabsTrigger value="card" className="text-xs">Card</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="space-y-4">
              {/* GCC Balance */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl overflow-hidden"
              >
                <div className="bg-gradient-to-r from-primary to-secondary p-4 rounded-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 bottom-0 left-0 bg-black opacity-20 rounded-xl"></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-xs font-semibold text-black/70 mb-1">GCC Balance</div>
                        <div className="text-2xl font-bold text-black">{balances.gcc.toFixed(2)} GCC</div>
                      </div>
                      <div className="p-2 rounded-full bg-black/20">
                        <WalletIcon className="h-5 w-5 text-black" />
                      </div>
                    </div>
                    
                    <div className="flex mt-6 space-x-2">
                      <Button 
                        size="sm" 
                        className="h-8 bg-white text-primary hover:bg-white/90 px-3 py-0" 
                        onClick={() => setShowSendDialog(true)}
                      >
                        <Send className="h-3 w-3 mr-1" />
                        Send
                      </Button>
                      <Button 
                        size="sm" 
                        className="h-8 bg-white text-primary hover:bg-white/90 px-3 py-0" 
                        onClick={() => setShowExchangeDialog(true)}
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Exchange
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Game Points Balance */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
                className="rounded-xl overflow-hidden"
              >
                <div className="bg-surface-light p-4 rounded-xl border border-muted">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground mb-1">Game Points</div>
                      <div className="text-xl font-bold">{balances.gp.toFixed(2)} GP</div>
                    </div>
                    <div className="p-2 rounded-full bg-background">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Wallet address */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
                className="bg-surface-light p-3 rounded-xl"
              >
                <div className="flex justify-between items-center">
                  <div className="text-xs text-muted-foreground">Wallet Address</div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 text-xs"
                    onClick={handleCopyAddress}
                  >
                    {copied ? (
                      <CheckCheck className="h-3 w-3 text-green-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
                <div className="text-xs font-mono mt-1 truncate">0x7F5Ec6E95D8711DEFF4b8F1d791C3b5F26b2892a</div>
              </motion.div>
              
              {/* Recent Transactions */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">Recent Transactions</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 text-xs"
                    onClick={() => setActiveTab("history")}
                  >
                    View All
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {transactions.slice(0, 3).map(transaction => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-surface-light p-3 rounded-lg flex justify-between items-center"
                    >
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-background mr-3">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{getTransactionTitle(transaction)}</div>
                          <div className="text-xs text-muted-foreground">{formatDate(transaction.date)}</div>
                        </div>
                      </div>
                      <div className={`text-sm font-medium ${
                        transaction.type === 'send' ? 'text-red-500' : 'text-green-500'
                      }`}>
                        {transaction.type === 'send' ? '-' : '+'}{transaction.amount} {transaction.currency}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <div className="space-y-1">
              <ScrollArea className="h-[300px] pr-4">
                {transactions.map(transaction => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-surface-light p-3 rounded-lg flex justify-between items-center mb-2"
                  >
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-background mr-3">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{getTransactionTitle(transaction)}</div>
                        <div className="text-xs text-muted-foreground">{formatDate(transaction.date)}</div>
                      </div>
                    </div>
                    <div className={`text-sm font-medium ${
                      transaction.type === 'send' ? 'text-red-500' : 'text-green-500'
                    }`}>
                      {transaction.type === 'send' ? '-' : '+'}{transaction.amount} {transaction.currency}
                    </div>
                  </motion.div>
                ))}
              </ScrollArea>
            </div>
          </TabsContent>
          
          <TabsContent value="exchange">
            <div className="bg-surface-light p-4 rounded-xl">
              <h3 className="text-base font-medium mb-4">Exchange Tokens</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="from-currency">From</Label>
                  <div className="flex space-x-2">
                    <select
                      id="from-currency"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                      value={exchangeForm.fromCurrency}
                      onChange={(e) => {
                        const newFromCurrency = e.target.value as 'GCC' | 'GP';
                        setExchangeForm(prev => ({
                          ...prev,
                          fromCurrency: newFromCurrency,
                          toCurrency: newFromCurrency === 'GCC' ? 'GP' : 'GCC',
                        }));
                      }}
                    >
                      <option value="GCC">GCC</option>
                      <option value="GP">GP</option>
                    </select>
                    
                    <Input
                      id="from-amount"
                      type="number"
                      placeholder="Amount"
                      value={exchangeForm.amount}
                      onChange={(e) => handleExchangeAmountChange(e.target.value)}
                      className="bg-background"
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Balance: {exchangeForm.fromCurrency === 'GCC' ? balances.gcc.toFixed(2) : balances.gp.toFixed(2)} {exchangeForm.fromCurrency}
                  </div>
                </div>
                
                <div className="relative">
                  <Separator />
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-1 bg-surface-light rounded-full">
                    <RefreshCw className="h-4 w-4 text-primary" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="to-currency">To</Label>
                  <div className="flex space-x-2">
                    <select
                      id="to-currency"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                      value={exchangeForm.toCurrency}
                      onChange={(e) => {
                        const newToCurrency = e.target.value as 'GCC' | 'GP';
                        setExchangeForm(prev => ({
                          ...prev,
                          toCurrency: newToCurrency,
                          fromCurrency: newToCurrency === 'GCC' ? 'GP' : 'GCC',
                        }));
                      }}
                    >
                      <option value="GP">GP</option>
                      <option value="GCC">GCC</option>
                    </select>
                    
                    <Input
                      id="to-amount"
                      type="number"
                      placeholder="Amount"
                      value={exchangeForm.estimatedReceive}
                      className="bg-background"
                      disabled
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Exchange Rate: 1 {exchangeForm.fromCurrency} = {exchangeForm.fromCurrency === 'GCC' ? exchangeRates.GCC_TO_GP : exchangeRates.GP_TO_GCC} {exchangeForm.toCurrency}
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-secondary" 
                  onClick={handleExchangeSubmit}
                >
                  Exchange Tokens
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="card">
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-surface to-muted p-6 rounded-xl">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center">
                    <CreditCard className="text-primary h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">CryptoVerse Card</span>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    cardDetails.enabled 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {cardDetails.enabled ? 'Active' : 'Inactive'}
                  </div>
                </div>
                
                <div className="text-lg font-mono mb-6">{cardDetails.number}</div>
                
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Card Holder</div>
                    <div className="text-sm font-medium">{cardDetails.name}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Expires</div>
                    <div className="text-sm font-medium">{cardDetails.expiry}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-surface-light p-4 rounded-xl">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium">Card Balance</span>
                  <span className="text-lg font-medium">${cardDetails.balance.toFixed(2)}</span>
                </div>
                
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Funds
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant={cardDetails.enabled ? "outline" : "default"}
                    className={`w-full justify-between ${
                      !cardDetails.enabled ? 'bg-gradient-to-r from-primary to-secondary' : ''
                    }`}
                    onClick={handleToggleCard}
                  >
                    <span className="flex items-center">
                      {cardDetails.enabled ? (
                        <>
                          <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
                          Disable Card
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Enable Card
                        </>
                      )}
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {/* Send Dialog */}
      <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
        <DialogContent className="bg-surface border-none neon-border">
          <DialogHeader>
            <DialogTitle>Send Tokens</DialogTitle>
            <DialogDescription>Send tokens to another wallet address</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Address</Label>
              <Input
                id="recipient"
                placeholder="0x..."
                value={sendForm.recipient}
                onChange={(e) => setSendForm({ ...sendForm, recipient: e.target.value })}
                className="bg-background"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="flex space-x-2">
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={sendForm.amount}
                  onChange={(e) => setSendForm({ ...sendForm, amount: e.target.value })}
                  className="bg-background"
                />
                
                <select
                  id="currency"
                  className="flex h-10 w-28 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  value={sendForm.currency}
                  onChange={(e) => setSendForm({ ...sendForm, currency: e.target.value })}
                >
                  <option value="GCC">GCC</option>
                  <option value="GP">GP</option>
                </select>
              </div>
              <div className="text-xs text-muted-foreground">
                Balance: {sendForm.currency === 'GCC' ? balances.gcc.toFixed(2) : balances.gp.toFixed(2)} {sendForm.currency}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSendDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendSubmit}
              className="bg-gradient-to-r from-primary to-secondary"
            >
              Send Tokens
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Exchange Dialog */}
      <Dialog open={showExchangeDialog} onOpenChange={setShowExchangeDialog}>
        <DialogContent className="bg-surface border-none neon-border">
          <DialogHeader>
            <DialogTitle>Exchange Tokens</DialogTitle>
            <DialogDescription>Convert between GCC and GP tokens</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="from-currency-dialog">From</Label>
              <div className="flex space-x-2">
                <select
                  id="from-currency-dialog"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  value={exchangeForm.fromCurrency}
                  onChange={(e) => {
                    const newFromCurrency = e.target.value as 'GCC' | 'GP';
                    setExchangeForm(prev => ({
                      ...prev,
                      fromCurrency: newFromCurrency,
                      toCurrency: newFromCurrency === 'GCC' ? 'GP' : 'GCC',
                    }));
                  }}
                >
                  <option value="GCC">GCC</option>
                  <option value="GP">GP</option>
                </select>
                
                <Input
                  id="from-amount-dialog"
                  type="number"
                  placeholder="Amount"
                  value={exchangeForm.amount}
                  onChange={(e) => handleExchangeAmountChange(e.target.value)}
                  className="bg-background"
                />
              </div>
              <div className="text-xs text-muted-foreground">
                Balance: {exchangeForm.fromCurrency === 'GCC' ? balances.gcc.toFixed(2) : balances.gp.toFixed(2)} {exchangeForm.fromCurrency}
              </div>
            </div>
            
            <div className="relative">
              <Separator />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-1 bg-surface rounded-full">
                <RefreshCw className="h-4 w-4 text-primary" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="to-currency-dialog">To</Label>
              <div className="flex space-x-2">
                <select
                  id="to-currency-dialog"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  value={exchangeForm.toCurrency}
                  onChange={(e) => {
                    const newToCurrency = e.target.value as 'GCC' | 'GP';
                    setExchangeForm(prev => ({
                      ...prev,
                      toCurrency: newToCurrency,
                      fromCurrency: newToCurrency === 'GCC' ? 'GP' : 'GCC',
                    }));
                  }}
                >
                  <option value="GP">GP</option>
                  <option value="GCC">GCC</option>
                </select>
                
                <Input
                  id="to-amount-dialog"
                  type="number"
                  placeholder="Amount"
                  value={exchangeForm.estimatedReceive}
                  className="bg-background"
                  disabled
                />
              </div>
              <div className="text-xs text-muted-foreground">
                Exchange Rate: 1 {exchangeForm.fromCurrency} = {exchangeForm.fromCurrency === 'GCC' ? exchangeRates.GCC_TO_GP : exchangeRates.GP_TO_GCC} {exchangeForm.toCurrency}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowExchangeDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleExchangeSubmit}
              className="bg-gradient-to-r from-primary to-secondary"
            >
              Exchange Tokens
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default Wallet;
