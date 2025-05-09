import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { useCrypto } from "@/hooks/useCrypto";
import { useUser } from "@/hooks/useUser";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NeonButton } from "@/components/ui/neon-button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// Replace QR code library with a simple component for now
interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

const QRCode: React.FC<QRCodeProps> = ({ value, size = 200, className = "" }) => (
  <div 
    className={`bg-surface-light border border-primary/30 flex items-center justify-center ${className}`} 
    style={{ width: size, height: size }}
  >
    <div className="text-xs text-center p-2">
      <p className="text-primary font-bold mb-2">QR Code</p>
      <p className="text-muted-foreground break-all">{value.substring(0, 16)}...</p>
    </div>
  </div>
);

import { 
  WalletIcon, 
  ArrowUpIcon, 
  ArrowDownIcon, 
  BarChart2Icon, 
  RefreshCwIcon, 
  MoreHorizontalIcon,
  SendIcon,
  ArrowDownToLineIcon as ReceiveIcon,
  ArrowUpDownIcon as SwapIcon, // Correct icon name
  HistoryIcon,
  PlusIcon,
  QrCodeIcon,
  DollarSignIcon,
  CreditCardIcon,
  ExternalLinkIcon,
  CopyIcon,
  CheckIcon,
  UsersIcon,
  SettingsIcon,
  ShieldIcon,
  BellIcon,
  TrendingUpIcon,
  PercentIcon,
  EyeIcon,
  EyeOffIcon,
  ScanIcon,
  BuildingIcon as BankIcon,
  GlobeIcon,
  BadgePercentIcon,
  FingerprintIcon,
  ChevronRightIcon,
  LockIcon,
  BookmarkIcon,
  StarIcon,
  VolumeXIcon,
  AlertTriangleIcon,
  UnlockIcon,
  ShareIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Enhanced wallet types
type Currency = "GCC" | "ETH" | "USDT" | "BTC";
type ContactType = "friend" | "exchange" | "merchant";
type TransactionType = "send" | "receive" | "swap" | "stake" | "unstake" | "fee" | "reward";
type SecurityLevel = "standard" | "enhanced" | "maximum";

interface Contact {
  id: string;
  name: string;
  address: string;
  type: ContactType;
  notes?: string;
  avatar?: string;
}

interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: Currency;
  timestamp: Date;
  recipient?: string;
  recipientName?: string;
  sender?: string;
  senderName?: string;
  feeAmount?: number;
  feeCurrency?: Currency;
  status: "pending" | "completed" | "failed";
  hash?: string;
  note?: string;
}

interface CryptoAsset {
  id: string;
  name: string;
  symbol: Currency;
  balance: number;
  fiatValue: number;
  priceChange24h: number;
  isHidden?: boolean;
  iconUrl?: string;
  isStakingAvailable?: boolean;
  stakingAPY?: number;
  isOnChain: boolean;
}

interface StakingPool {
  id: string;
  asset: Currency;
  name: string;
  apy: number;
  lockPeriod: number; // in days
  minAmount: number;
  stakedAmount?: number;
  rewards?: number;
  remainingLockTime?: number; // in days
}

interface NFTAsset {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  collection: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  acquiredDate: Date;
}

interface PriceAlert {
  id: string;
  currency: Currency;
  targetPrice: number;
  targetType: "above" | "below";
  isActive: boolean;
  createdAt: Date;
}

interface WalletSecuritySettings {
  biometricEnabled: boolean;
  twoFactorEnabled: boolean;
  notificationsEnabled: boolean;
  autoLockTimeout: number; // minutes
  transactionPinEnabled: boolean;
  whitelistedAddresses: string[];
  securityLevel: SecurityLevel;
}

const Wallet: React.FC = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const { cryptos, portfolioValue, portfolioChange, useHoldings } = useCrypto();
  
  // Default wallet address to use if user is null
  const walletAddress = user?.walletAddress || "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
  
  // Assets state
  const [assets, setAssets] = useState<CryptoAsset[]>([
    {
      id: "gcc-token",
      name: "GameCoin",
      symbol: "GCC",
      balance: 15000,
      fiatValue: 1500,
      priceChange24h: 5.2,
      isOnChain: false,
      isStakingAvailable: true,
      stakingAPY: 8.5,
      iconUrl: "/assets/gcc-icon.png"
    },
    {
      id: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      balance: 1.245,
      fiatValue: 3050,
      priceChange24h: -2.3,
      isOnChain: true,
      isStakingAvailable: true,
      stakingAPY: 4.2,
      iconUrl: "/assets/eth-icon.png"
    },
    {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      balance: 0.032,
      fiatValue: 1980,
      priceChange24h: 1.7,
      isOnChain: true,
      isStakingAvailable: false,
      iconUrl: "/assets/btc-icon.png"
    },
    {
      id: "usdt",
      name: "Tether",
      symbol: "USDT",
      balance: 750,
      fiatValue: 750,
      priceChange24h: 0.01,
      isOnChain: true,
      isStakingAvailable: false,
      iconUrl: "/assets/usdt-icon.png"
    }
  ]);
  
  // UI state
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showBalances, setShowBalances] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>("GCC");
  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset | null>(null);
  
  // Transaction state
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([
    {
      id: "tx1",
      type: "receive",
      amount: 500,
      currency: "GCC",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      sender: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      senderName: "MiningRewards",
      status: "completed",
      note: "Daily mining reward"
    },
    {
      id: "tx2",
      type: "send",
      amount: 0.5,
      currency: "ETH",
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      recipient: "0x8f7F92e0660DD92ecA1faD5F285C4Dca556E433e",
      recipientName: "NFT Marketplace",
      feeAmount: 0.002,
      feeCurrency: "ETH",
      status: "completed"
    },
    {
      id: "tx3",
      type: "swap",
      amount: 1000,
      currency: "GCC",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      recipient: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      recipientName: "Internal Wallet",
      feeAmount: 1.5,
      feeCurrency: "GCC",
      status: "completed",
      note: "Swapped GCC to ETH"
    },
    {
      id: "tx4",
      type: "receive",
      amount: 0.25,
      currency: "ETH",
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      sender: "0x9B8E8F7C67518Ffd50C0D1400a9E7B4F971900cB",
      senderName: "CryptoTrader",
      status: "completed"
    }
  ]);
  
  // Contacts state
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "contact1",
      name: "Alex Crypto",
      address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      type: "friend",
      notes: "Trading buddy"
    },
    {
      id: "contact2",
      name: "Mining Pool",
      address: "0x8f7F92e0660DD92ecA1faD5F285C4Dca556E433e",
      type: "exchange",
      notes: "Primary mining pool"
    },
    {
      id: "contact3",
      name: "NFT Marketplace",
      address: "0x9B8E8F7C67518Ffd50C0D1400a9E7B4F971900cB",
      type: "merchant"
    }
  ]);
  
  // Staking state
  const [stakingPools, setStakingPools] = useState<StakingPool[]>([
    {
      id: "pool1",
      asset: "GCC",
      name: "GameCoin Flexible Staking",
      apy: 8.5,
      lockPeriod: 0,
      minAmount: 1000,
      stakedAmount: 5000,
      rewards: 23.45
    },
    {
      id: "pool2",
      asset: "ETH",
      name: "Ethereum 30-Day Staking",
      apy: 4.2,
      lockPeriod: 30,
      minAmount: 0.1,
      stakedAmount: 0.5,
      rewards: 0.005,
      remainingLockTime: 12
    }
  ]);
  
  // NFT assets
  const [nftAssets, setNftAssets] = useState<NFTAsset[]>([
    {
      id: "nft-1",
      name: "Crypto Adventurer #1337",
      description: "A legendary adventurer from the Crypto Realm collection. This NFT grants special powers in the game.",
      imageUrl: "/assets/nft-adventurer.png",
      collection: "Crypto Realm",
      rarity: "legendary",
      acquiredDate: new Date(2023, 2, 15)
    },
    {
      id: "nft-2",
      name: "Game Token #42",
      description: "A special edition game token that provides in-game benefits.",
      imageUrl: "/assets/nft-token.png",
      collection: "Game Tokens",
      rarity: "rare",
      acquiredDate: new Date(2023, 5, 22)
    },
    {
      id: "nft-3",
      name: "Virtual Land Plot #765",
      description: "A plot of virtual land in the Crypto Realm metaverse.",
      imageUrl: "/assets/nft-land.png",
      collection: "Virtual Land",
      rarity: "uncommon",
      acquiredDate: new Date(2023, 7, 10)
    }
  ]);
  
  // Price alerts
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([
    {
      id: "alert-1",
      currency: "BTC",
      targetPrice: 70000,
      targetType: "above",
      isActive: true,
      createdAt: new Date(2023, 4, 10)
    },
    {
      id: "alert-2",
      currency: "ETH",
      targetPrice: 2000,
      targetType: "below",
      isActive: true,
      createdAt: new Date(2023, 4, 15)
    }
  ]);
  
  // Security settings
  const [securitySettings, setSecuritySettings] = useState<WalletSecuritySettings>({
    biometricEnabled: false,
    twoFactorEnabled: false,
    notificationsEnabled: true,
    autoLockTimeout: 5,
    transactionPinEnabled: true,
    whitelistedAddresses: [],
    securityLevel: "standard"
  });
  
  // Modal states
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showQrScannerModal, setShowQrScannerModal] = useState(false);
  const [showAssetDetailsModal, setShowAssetDetailsModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showPriceAlertModal, setShowPriceAlertModal] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const [pinCode, setPinCode] = useState("");
  const [confirmingTransaction, setConfirmingTransaction] = useState(false);
  const [transactionToConfirm, setTransactionToConfirm] = useState<null | {
    type: string;
    amount: number;
    currency: Currency;
    recipient?: string;
  }>(null);
  
  // Form states
  const [sendForm, setSendForm] = useState({
    recipient: "",
    amount: "",
    asset: "GCC" as Currency,
    memo: "",
    gasOption: "standard",
    saveContact: false
  });
  
  const [swapForm, setSwapForm] = useState({
    fromAsset: "GCC" as Currency,
    toAsset: "ETH" as Currency,
    amount: "",
    slippage: "0.5",
    showAdvanced: false
  });
  
  const [contactForm, setContactForm] = useState({
    name: "",
    address: "",
    type: "friend" as ContactType,
    notes: ""
  });
  
  const [stakeForm, setStakeForm] = useState({
    asset: "GCC" as Currency,
    amount: "",
    period: "flexible"
  });
  
  const [alertForm, setAlertForm] = useState({
    asset: "ETH" as Currency,
    price: "",
    type: "above" as "above" | "below"
  });
  
  // Exchange rates with proper typing
  const exchangeRates: Record<string, number> = {
    GCC_TO_ETH: 0.0001,
    ETH_TO_GCC: 10000,
    BTC_TO_ETH: 15.5,
    ETH_TO_BTC: 0.065,
    USDT_TO_GCC: 0.1,
    GCC_TO_USDT: 10
  };
  
  // Calculated values
  const totalFiatBalance = assets.reduce((total, asset) => total + asset.fiatValue, 0);
  const onChainBalance = assets
    .filter(asset => asset.isOnChain)
    .reduce((total, asset) => total + asset.fiatValue, 0);
  const inAppBalance = assets
    .filter(asset => !asset.isOnChain)
    .reduce((total, asset) => total + asset.fiatValue, 0);
  const totalStakedBalance = stakingPools.reduce((total, pool) => {
    const asset = assets.find(a => a.symbol === pool.asset);
    if (asset && pool.stakedAmount) {
      return total + (asset.fiatValue / asset.balance) * pool.stakedAmount;
    }
    return total;
  }, 0);

  // State for price alerts modal and new alert creation
  const [showAlertsModal, setShowAlertsModal] = useState(false);
  const [newAlert, setNewAlert] = useState({
    currency: "ETH" as Currency,
    targetPrice: "",
    targetType: "above" as "above" | "below"
  });
  
  // Toggle alert active status
  const toggleAlertStatus = (alertId: string) => {
    setPriceAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId
          ? { ...alert, isActive: !alert.isActive }
          : alert
      )
    );
    toast({
      title: "Alert updated",
      description: "Price alert status has been updated"
    });
  };

  // Delete an alert
  const deleteAlert = (alertId: string) => {
    setPriceAlerts(prev => prev.filter(alert => alert.id !== alertId));
    toast({
      title: "Alert removed",
      description: "Price alert has been deleted"
    });
  };

  // Create a new price alert
  const handleCreateAlert = () => {
    if (!newAlert.targetPrice || parseFloat(newAlert.targetPrice) <= 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid target price",
        variant: "destructive"
      });
      return;
    }

    const newAlertItem: PriceAlert = {
      id: `alert-${Date.now()}`,
      currency: newAlert.currency,
      targetPrice: parseFloat(newAlert.targetPrice),
      targetType: newAlert.targetType,
      isActive: true,
      createdAt: new Date()
    };

    setPriceAlerts(prev => [newAlertItem, ...prev]);
    setNewAlert({
      currency: "ETH" as Currency,
      targetPrice: "",
      targetType: "above" as "above" | "below"
    });
    
    toast({
      title: "Alert created",
      description: `Alert set for ${newAlert.currency} ${newAlert.targetType} $${newAlert.targetPrice}`
    });
    
    setShowAlertsModal(false);
  };

  // Handlers will be implemented here
  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simulate API request
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Wallet refreshed",
        description: "Your wallet balances have been updated",
      });
    }, 1500);
  };

  // Handle biometric authentication
  const handleBiometricAuth = async () => {
    try {
      setAuthenticating(true);
      // In a real app, this would use the Web Authentication API or a native plugin
      // Simulating authentication success after delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "Authentication successful",
        description: "Biometric authentication completed"
      });
      setAuthenticating(false);
      
      if (transactionToConfirm) {
        // Process the transaction that needed authentication
        processAuthenticatedTransaction(transactionToConfirm);
      }
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: "Biometric verification failed. Please try again.",
        variant: "destructive"
      });
      setAuthenticating(false);
    }
  };

  // Toggle biometric authentication
  const toggleBiometricAuth = async () => {
    if (!securitySettings.biometricEnabled) {
      // Verify biometric capability before enabling
      try {
        await handleBiometricAuth();
        setSecuritySettings(prev => ({
          ...prev,
          biometricEnabled: true
        }));
        toast({
          title: "Biometric authentication enabled",
          description: "You can now use your fingerprint or face to authorize transactions"
        });
      } catch (error) {
        toast({
          title: "Setup failed",
          description: "Could not enable biometric authentication",
          variant: "destructive"
        });
      }
    } else {
      setSecuritySettings(prev => ({
        ...prev,
        biometricEnabled: false
      }));
      toast({
        title: "Biometric authentication disabled",
        description: "PIN code will be required for transactions"
      });
    }
  };

  // Process transaction after authentication
  const processAuthenticatedTransaction = (transaction: {
    type: string;
    amount: number;
    currency: Currency;
    recipient?: string;
  }) => {
    // In a real app, this would process the actual blockchain transaction
    toast({
      title: "Transaction initiated",
      description: `${transaction.amount} ${transaction.currency} ${transaction.type} transaction submitted`
    });
    
    // Add to transactions
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: transaction.type as TransactionType,
      amount: transaction.amount,
      currency: transaction.currency,
      timestamp: new Date(),
      recipient: transaction.recipient,
      recipientName: transaction.recipient?.substring(0, 8) + '...',
      status: "pending",
    };
    
    setRecentTransactions(prev => [newTransaction, ...prev]);
    
    // Reset confirmation state
    setTransactionToConfirm(null);
    setConfirmingTransaction(false);
    
    // Simulate transaction completion after 2 seconds
    setTimeout(() => {
      setRecentTransactions(prev => 
        prev.map(tx => 
          tx.id === newTransaction.id
            ? { ...tx, status: "completed" }
            : tx
        )
      );
      
      // Update balances
      if (transaction.type === "send") {
        setAssets(prev => 
          prev.map(asset => 
            asset.symbol === transaction.currency
              ? { 
                  ...asset, 
                  balance: asset.balance - transaction.amount,
                  fiatValue: asset.fiatValue - transaction.amount * (asset.fiatValue / asset.balance)
                }
              : asset
          )
        );
      }
      
      toast({
        title: "Transaction completed",
        description: `${transaction.amount} ${transaction.currency} ${transaction.type} confirmed`
      });
    }, 2000);
  };

  // Verify transaction security
  const verifyTransactionSecurity = (transaction: {
    type: string;
    amount: number;
    currency: Currency;
    recipient?: string;
  }) => {
    setTransactionToConfirm(transaction);
    
    // Check if amount exceeds threshold for extra security
    const asset = assets.find(a => a.symbol === transaction.currency);
    const transactionValue = asset ? transaction.amount * (asset.fiatValue / asset.balance) : 0;
    
    if (transactionValue > 1000 || securitySettings.securityLevel === "maximum") {
      // High value transaction needs biometric
      setConfirmingTransaction(true);
      return false;
    } else if (securitySettings.biometricEnabled) {
      // Security settings require biometric
      setConfirmingTransaction(true);
      return false;
    }
    
    // No additional security needed
    processAuthenticatedTransaction(transaction);
    return true;
  };

  // Render methods will be implemented below
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background pb-20"
    >
      <TopBar />
      
      <main className="mt-16 px-4 py-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="font-rajdhani font-bold text-3xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Wallet</h1>
            <p className="text-muted-foreground text-sm">Manage your digital assets and transactions</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCwIcon className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full"
              onClick={() => setShowBalances(!showBalances)}
            >
              {showBalances ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full"
              onClick={() => setShowSecurityModal(true)}
            >
              <ShieldIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Main wallet content will go here */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-6 bg-surface-light p-1 rounded-xl">
            <TabsTrigger value="dashboard" className="data-[state=active]:neon-text-primary data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/10 data-[state=active]:to-surface-light data-[state=active]:shadow-sm py-3 rounded-lg">
              <BarChart2Icon className="mr-2 h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="assets" className="data-[state=active]:neon-text-primary data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/10 data-[state=active]:to-surface-light data-[state=active]:shadow-sm py-3 rounded-lg">
              <WalletIcon className="mr-2 h-4 w-4" />
              Assets
            </TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:neon-text-primary data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/10 data-[state=active]:to-surface-light data-[state=active]:shadow-sm py-3 rounded-lg">
              <HistoryIcon className="mr-2 h-4 w-4" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="exchange" className="data-[state=active]:neon-text-primary data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/10 data-[state=active]:to-surface-light data-[state=active]:shadow-sm py-3 rounded-lg">
              <SwapIcon className="mr-2 h-4 w-4" />
              Exchange
            </TabsTrigger>
            <TabsTrigger value="earn" className="data-[state=active]:neon-text-primary data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/10 data-[state=active]:to-surface-light data-[state=active]:shadow-sm py-3 rounded-lg">
              <PercentIcon className="mr-2 h-4 w-4" />
              Earn
            </TabsTrigger>
          </TabsList>
          
          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Balance Overview Card */}
            <Card className="bg-surface border-none neon-border shadow-glow overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Balance</p>
                      <h2 className="text-3xl font-bold mt-1">
                        {showBalances ? `$${totalFiatBalance.toLocaleString()}` : '••••••'}
                      </h2>
                      <div className="flex items-center mt-1">
                        <Badge className={`bg-background/20 ${portfolioChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {portfolioChange >= 0 ? '+' : ''}{portfolioChange.toFixed(2)}%
                        </Badge>
                        <span className="text-xs text-muted-foreground ml-2">24h change</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-sm flex items-center gap-1">
                        <GlobeIcon className="h-3.5 w-3.5 text-primary/70" />
                        <span className="text-muted-foreground">On-chain:</span>
                        <span className="font-medium">{showBalances ? `$${onChainBalance.toLocaleString()}` : '••••'}</span>
                      </div>
                      <div className="text-sm flex items-center gap-1 mt-1">
                        <DollarSignIcon className="h-3.5 w-3.5 text-primary/70" />
                        <span className="text-muted-foreground">In-app:</span>
                        <span className="font-medium">{showBalances ? `$${inAppBalance.toLocaleString()}` : '••••'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex gap-2">
                    <Button className="flex-1 bg-primary/90 hover:bg-primary text-white" onClick={() => setShowSendModal(true)}>
                      <SendIcon className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                    <Button className="flex-1 bg-primary/90 hover:bg-primary text-white" onClick={() => setShowReceiveModal(true)}>
                      <ReceiveIcon className="h-4 w-4 mr-2" />
                      Receive
                    </Button>
                    <Button className="flex-1 bg-primary/90 hover:bg-primary text-white" onClick={() => setShowSwapModal(true)}>
                      <SwapIcon className="h-4 w-4 mr-2" />
                      Swap
                    </Button>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-sm font-medium mb-3">Quick Actions</h3>
                  <div className="grid grid-cols-4 gap-3">
                    <Button variant="outline" size="sm" className="flex-col h-auto py-3 gap-1 text-xs" onClick={() => setShowQrScannerModal(true)}>
                      <QrCodeIcon className="h-4 w-4 text-primary" />
                      Scan
                    </Button>
                    <Button variant="outline" size="sm" className="flex-col h-auto py-3 gap-1 text-xs" onClick={() => setActiveTab("assets")}>
                      <PlusIcon className="h-4 w-4 text-primary" />
                      Buy
                    </Button>
                    <Button variant="outline" size="sm" className="flex-col h-auto py-3 gap-1 text-xs" onClick={() => setActiveTab("earn")}>
                      <PercentIcon className="h-4 w-4 text-primary" />
                      Stake
                    </Button>
                    <Button variant="outline" size="sm" className="flex-col h-auto py-3 gap-1 text-xs" onClick={() => setShowAlertsModal(true)}>
                      <BellIcon className="h-4 w-4 text-primary" />
                      Alerts
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Recent Transactions */}
            <Card className="bg-surface border-none neon-border shadow-glow">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                  <CardDescription>Your latest transactions</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab("transactions")}
                >
                  View All
                  <ChevronRightIcon className="ml-1 h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/10">
                  {recentTransactions.slice(0, 3).map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-surface-light transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`rounded-full p-2 ${
                          tx.type === 'send' ? 'bg-red-500/10 text-red-500' :
                          tx.type === 'receive' ? 'bg-green-500/10 text-green-500' :
                          tx.type === 'swap' ? 'bg-blue-500/10 text-blue-500' :
                          tx.type === 'stake' ? 'bg-purple-500/10 text-purple-500' :
                          'bg-primary/10 text-primary'
                        }`}>
                          {tx.type === 'send' && <ArrowUpIcon className="h-5 w-5" />}
                          {tx.type === 'receive' && <ArrowDownIcon className="h-5 w-5" />}
                          {tx.type === 'swap' && <SwapIcon className="h-5 w-5" />}
                          {tx.type === 'stake' && <LockIcon className="h-5 w-5" />}
                          {tx.type === 'unstake' && <UnlockIcon className="h-5 w-5" />}
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {tx.type === 'send' ? `Sent to ${tx.recipientName || tx.recipient?.substring(0, 8) + '...'}` :
                             tx.type === 'receive' ? `Received from ${tx.senderName || tx.sender?.substring(0, 8) + '...'}` :
                             tx.type === 'swap' ? `Swapped to ${tx.currency}` :
                             tx.type === 'stake' ? `Staked ${tx.currency}` :
                             tx.type === 'unstake' ? `Unstaked ${tx.currency}` :
                             'Transaction'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {tx.timestamp.toLocaleDateString()} • {tx.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <div className={`text-right ${
                        tx.type === 'send' ? 'text-red-500' :
                        tx.type === 'receive' ? 'text-green-500' :
                        ''
                      }`}>
                        <p className="font-medium">
                          {tx.type === 'send' ? '-' : tx.type === 'receive' ? '+' : ''}
                          {tx.amount} {tx.currency}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {tx.status === 'pending' ? 'Pending' : 
                           tx.status === 'completed' ? 'Completed' : 
                           'Failed'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Top Assets */}
            <Card className="bg-surface border-none neon-border shadow-glow">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Top Assets</CardTitle>
                  <CardDescription>Your highest value holdings</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab("assets")}
                >
                  View All
                  <ChevronRightIcon className="ml-1 h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/10">
                  {assets.slice(0, 3).map((asset) => (
                    <div key={asset.id} className="flex items-center justify-between p-4 hover:bg-surface-light transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          {asset.iconUrl ? (
                            <img src={asset.iconUrl} alt={asset.name} className="w-6 h-6" />
                          ) : (
                            <WalletIcon className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{asset.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {asset.isOnChain ? 'On-chain' : 'In-app'} • {showBalances ? asset.balance : '••••'} {asset.symbol}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ${showBalances ? asset.fiatValue.toLocaleString() : '••••'}
                        </p>
                        <p className={`text-xs ${
                          asset.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {asset.priceChange24h >= 0 ? '+' : ''}{asset.priceChange24h}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* More tabs will be added later */}
          
          {/* Assets Tab */}
          <TabsContent value="assets" className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Input
                type="text"
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-surface-light"
              />
              <Select value={selectedCurrency} onValueChange={(value) => setSelectedCurrency(value as Currency)}>
                <SelectTrigger className="w-[180px] bg-surface-light">
                  <SelectValue placeholder="Display currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="BTC">BTC (₿)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card className="bg-surface border-none neon-border shadow-glow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <GlobeIcon className="h-5 w-5 text-primary" />
                    On-Chain Assets
                  </CardTitle>
                  <CardDescription>Blockchain-based tokens</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[300px]">
                    <div className="divide-y divide-border/10">
                      {assets
                        .filter(asset => asset.isOnChain)
                        .filter(asset => 
                          asset.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          asset.symbol.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((asset) => (
                          <div 
                            key={asset.id} 
                            className="flex items-center justify-between p-4 hover:bg-surface-light transition-colors cursor-pointer"
                            onClick={() => {
                              setSelectedAsset(asset);
                              setShowAssetDetailsModal(true);
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                {asset.iconUrl ? (
                                  <img src={asset.iconUrl} alt={asset.name} className="w-6 h-6" />
                                ) : (
                                  <WalletIcon className="h-5 w-5 text-primary" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{asset.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {showBalances ? asset.balance.toLocaleString() : '••••'} {asset.symbol}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                ${showBalances ? asset.fiatValue.toLocaleString() : '••••'}
                              </p>
                              <p className={`text-xs ${
                                asset.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'
                              }`}>
                                {asset.priceChange24h >= 0 ? '+' : ''}{asset.priceChange24h}%
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
              
              <Card className="bg-surface border-none neon-border shadow-glow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSignIcon className="h-5 w-5 text-primary" />
                    In-App Assets
                  </CardTitle>
                  <CardDescription>Platform-native tokens</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[300px]">
                    <div className="divide-y divide-border/10">
                      {assets
                        .filter(asset => !asset.isOnChain)
                        .filter(asset => 
                          asset.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          asset.symbol.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((asset) => (
                          <div 
                            key={asset.id} 
                            className="flex items-center justify-between p-4 hover:bg-surface-light transition-colors cursor-pointer"
                            onClick={() => {
                              setSelectedAsset(asset);
                              setShowAssetDetailsModal(true);
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                {asset.iconUrl ? (
                                  <img src={asset.iconUrl} alt={asset.name} className="w-6 h-6" />
                                ) : (
                                  <WalletIcon className="h-5 w-5 text-primary" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{asset.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {showBalances ? asset.balance.toLocaleString() : '••••'} {asset.symbol}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                ${showBalances ? asset.fiatValue.toLocaleString() : '••••'}
                              </p>
                              <p className={`text-xs ${
                                asset.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'
                              }`}>
                                {asset.priceChange24h >= 0 ? '+' : ''}{asset.priceChange24h}%
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
            
            <Card className="bg-surface border-none neon-border shadow-glow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookmarkIcon className="h-5 w-5 text-primary" />
                  NFT Assets
                </CardTitle>
                <CardDescription>Non-fungible tokens in your wallet</CardDescription>
              </CardHeader>
              <CardContent>
                {nftAssets.length === 0 ? (
                  <div className="text-center py-8">
                    <BookmarkIcon className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground mb-4">You don't own any NFTs yet</p>
                    <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                      Browse NFT Marketplace
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {nftAssets.map((nft) => (
                      <div key={nft.id} className="border border-border/20 rounded-lg overflow-hidden hover:border-primary/30 transition-colors cursor-pointer">
                        <div className="h-40 bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
                          {nft.imageUrl ? (
                            <img src={nft.imageUrl} alt={nft.name} className="w-full h-full object-cover" />
                          ) : (
                            <BookmarkIcon className="h-16 w-16 text-primary/50" />
                          )}
                        </div>
                        <div className="p-3">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-medium text-sm">{nft.name}</h3>
                            <Badge className={`
                              ${nft.rarity === 'common' ? 'bg-gray-500/20 text-gray-500' : 
                                nft.rarity === 'uncommon' ? 'bg-green-500/20 text-green-500' : 
                                nft.rarity === 'rare' ? 'bg-blue-500/20 text-blue-500' : 
                                nft.rarity === 'epic' ? 'bg-purple-500/20 text-purple-500' : 
                                'bg-yellow-500/20 text-yellow-500'}
                              text-xs px-1.5 py-0 h-5
                            `}>
                              {nft.rarity.charAt(0).toUpperCase() + nft.rarity.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{nft.collection}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* More tabs will be added later */}
          
          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card className="bg-surface border-none neon-border shadow-glow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Transaction History</CardTitle>
                <CardDescription>Your recent financial activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-6">
                  <Button variant="outline" size="sm" className="h-8">
                    All
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 bg-green-500/10 text-green-500 border-green-500/20">
                    <ArrowDownIcon className="h-3.5 w-3.5 mr-1.5" />
                    Received
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 bg-red-500/10 text-red-500 border-red-500/20">
                    <ArrowUpIcon className="h-3.5 w-3.5 mr-1.5" />
                    Sent
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 bg-blue-500/10 text-blue-500 border-blue-500/20">
                    <SwapIcon className="h-3.5 w-3.5 mr-1.5" />
                    Swaps
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 bg-purple-500/10 text-purple-500 border-purple-500/20">
                    <LockIcon className="h-3.5 w-3.5 mr-1.5" />
                    Staking
                  </Button>
                  <Select>
                    <SelectTrigger className="h-8 w-[140px] bg-surface-light text-xs">
                      <SelectValue placeholder="Filter by token" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All tokens</SelectItem>
                      <SelectItem value="GCC">GCC</SelectItem>
                      <SelectItem value="ETH">ETH</SelectItem>
                      <SelectItem value="BTC">BTC</SelectItem>
                      <SelectItem value="USDT">USDT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="divide-y divide-border/10 rounded-lg border border-border/20">
                  {recentTransactions.map((tx) => (
                    <div key={tx.id} className="p-4 hover:bg-surface-light transition-colors cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`rounded-full p-2 ${
                            tx.type === 'send' ? 'bg-red-500/10 text-red-500' :
                            tx.type === 'receive' ? 'bg-green-500/10 text-green-500' :
                            tx.type === 'swap' ? 'bg-blue-500/10 text-blue-500' :
                            tx.type === 'stake' ? 'bg-purple-500/10 text-purple-500' :
                            'bg-primary/10 text-primary'
                          }`}>
                            {tx.type === 'send' && <ArrowUpIcon className="h-5 w-5" />}
                            {tx.type === 'receive' && <ArrowDownIcon className="h-5 w-5" />}
                            {tx.type === 'swap' && <SwapIcon className="h-5 w-5" />}
                            {tx.type === 'stake' && <LockIcon className="h-5 w-5" />}
                            {tx.type === 'unstake' && <UnlockIcon className="h-5 w-5" />}
                          </div>
                          <div>
                            <p className="font-medium">
                              {tx.type === 'send' ? `Sent to ${tx.recipientName || tx.recipient?.substring(0, 8) + '...'}` :
                              tx.type === 'receive' ? `Received from ${tx.senderName || tx.sender?.substring(0, 8) + '...'}` :
                              tx.type === 'swap' ? `Swapped to ${tx.currency}` :
                              tx.type === 'stake' ? `Staked ${tx.currency}` :
                              tx.type === 'unstake' ? `Unstaked ${tx.currency}` :
                              'Transaction'}
                            </p>
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-muted-foreground">
                                {tx.timestamp.toLocaleDateString()} • {tx.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                              <Badge className={`
                                ${tx.status === 'completed' ? 'bg-green-500/10 text-green-500' : 
                                  tx.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : 
                                  'bg-red-500/10 text-red-500'}
                                text-xs px-1.5 py-0 h-5
                              `}>
                                {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className={`text-right ${
                          tx.type === 'send' ? 'text-red-500' :
                          tx.type === 'receive' ? 'text-green-500' :
                          ''
                        }`}>
                          <p className="font-medium">
                            {tx.type === 'send' ? '-' : tx.type === 'receive' ? '+' : ''}
                            {tx.amount} {tx.currency}
                          </p>
                          {tx.feeAmount && (
                            <p className="text-xs text-muted-foreground">
                              Fee: {tx.feeAmount} {tx.feeCurrency}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {tx.note && (
                        <div className="text-xs text-muted-foreground bg-surface-light p-2 rounded-lg mt-2">
                          Note: {tx.note}
                        </div>
                      )}
                      
                      {tx.hash && (
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-border/10">
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <p className="font-mono">Tx: {tx.hash.substring(0, 8)}...{tx.hash.substring(tx.hash.length - 4)}</p>
                            <Button variant="ghost" size="icon" className="h-5 w-5">
                              <CopyIcon className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button variant="ghost" size="sm" className="h-6 text-xs">
                            View on Explorer
                            <ExternalLinkIcon className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-center mt-6">
                  <Button variant="outline">
                    Load More Transactions
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-surface border-none neon-border shadow-glow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart2Icon className="h-5 w-5 text-primary" />
                  Transaction Analytics
                </CardTitle>
                <CardDescription>Visualize your financial activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-surface-light p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Top Spending</p>
                    <h3 className="text-lg font-medium mb-2">Trading (43%)</h3>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Trading</span>
                          <span>43%</span>
                        </div>
                        <Progress value={43} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Gaming</span>
                          <span>27%</span>
                        </div>
                        <Progress value={27} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>NFTs</span>
                          <span>18%</span>
                        </div>
                        <Progress value={18} className="h-1.5" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-surface-light p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Top Recipients</p>
                    <div className="space-y-3 mt-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">MP</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">Mining Pool</p>
                            <p className="text-xs text-muted-foreground">3 transactions</p>
                          </div>
                        </div>
                        <p className="text-sm font-medium">0.5 ETH</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">NM</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">NFT Market</p>
                            <p className="text-xs text-muted-foreground">2 transactions</p>
                          </div>
                        </div>
                        <p className="text-sm font-medium">1250 GCC</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-surface-light p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Top Income</p>
                    <h3 className="text-lg font-medium mb-2">Mining (65%)</h3>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Mining</span>
                          <span>65%</span>
                        </div>
                        <Progress value={65} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Staking</span>
                          <span>22%</span>
                        </div>
                        <Progress value={22} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Referrals</span>
                          <span>13%</span>
                        </div>
                        <Progress value={13} className="h-1.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* More tabs will be added later */}
          
          {/* Exchange Tab */}
          <TabsContent value="exchange" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Token Swap Card */}
              <Card className="bg-surface border-none neon-border shadow-glow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <SwapIcon className="h-5 w-5 text-primary" />
                    Token Swap
                  </CardTitle>
                  <CardDescription>Exchange between in-app and on-chain tokens</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* From Asset */}
                    <div className="space-y-2">
                      <Label>From</Label>
                      <div className="flex gap-2">
                        <Select value={swapForm.fromAsset} onValueChange={(value) => setSwapForm({ ...swapForm, fromAsset: value as Currency })}>
                          <SelectTrigger className="bg-surface-light flex-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {assets.map((asset) => (
                              <SelectItem key={asset.id} value={asset.symbol}>
                                <div className="flex items-center gap-2">
                                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                                    {asset.iconUrl ? (
                                      <img src={asset.iconUrl} alt={asset.name} className="w-3 h-3" />
                                    ) : (
                                      <WalletIcon className="h-3 w-3 text-primary" />
                                    )}
                                  </div>
                                  <span>{asset.symbol}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Input
                          type="number"
                          placeholder="0.00"
                          className="bg-surface-light"
                          value={swapForm.amount}
                          onChange={(e) => setSwapForm({ ...swapForm, amount: e.target.value })}
                        />
                      </div>
                      
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>
                          Balance: {assets.find(a => a.symbol === swapForm.fromAsset)?.balance.toLocaleString() || 0} {swapForm.fromAsset}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 text-xs"
                          onClick={() => {
                            const asset = assets.find(a => a.symbol === swapForm.fromAsset);
                            if (asset) {
                              setSwapForm({ ...swapForm, amount: asset.balance.toString() });
                            }
                          }}
                        >
                          Max
                        </Button>
                      </div>
                    </div>
                    
                    {/* Swap Direction */}
                    <div className="flex justify-center">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => {
                          setSwapForm({
                            ...swapForm,
                            fromAsset: swapForm.toAsset,
                            toAsset: swapForm.fromAsset,
                            amount: ""
                          });
                        }}
                      >
                        <SwapIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* To Asset */}
                    <div className="space-y-2">
                      <Label>To (Estimated)</Label>
                      <div className="flex gap-2">
                        <Select value={swapForm.toAsset} onValueChange={(value) => setSwapForm({ ...swapForm, toAsset: value as Currency })}>
                          <SelectTrigger className="bg-surface-light flex-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {assets
                              .filter(asset => asset.symbol !== swapForm.fromAsset)
                              .map((asset) => (
                                <SelectItem key={asset.id} value={asset.symbol}>
                                  <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                                      {asset.iconUrl ? (
                                        <img src={asset.iconUrl} alt={asset.name} className="w-3 h-3" />
                                      ) : (
                                        <WalletIcon className="h-3 w-3 text-primary" />
                                      )}
                                    </div>
                                    <span>{asset.symbol}</span>
                                  </div>
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        
                        <Input
                          type="number"
                          placeholder="0.00"
                          className="bg-surface-light"
                          value={
                            swapForm.amount && 
                            (() => {
                              // Calculate exchange rate
                              const amount = parseFloat(swapForm.amount);
                              if (isNaN(amount)) return "";
                              
                              let rate = 1;
                              const pair = `${swapForm.fromAsset}_TO_${swapForm.toAsset}`;
                              if (exchangeRates[pair]) {
                                rate = exchangeRates[pair];
                              } else if (exchangeRates[`${swapForm.toAsset}_TO_${swapForm.fromAsset}`]) {
                                rate = 1 / exchangeRates[`${swapForm.toAsset}_TO_${swapForm.fromAsset}`];
                              }
                              
                              return (amount * rate).toFixed(6);
                            })()
                          }
                          readOnly
                        />
                      </div>
                      
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>
                          Balance: {assets.find(a => a.symbol === swapForm.toAsset)?.balance.toLocaleString() || 0} {swapForm.toAsset}
                        </span>
                        <span>
                          Rate: 1 {swapForm.fromAsset} = {(() => {
                            let rate = 1;
                            const pair = `${swapForm.fromAsset}_TO_${swapForm.toAsset}`;
                            if (exchangeRates[pair]) {
                              rate = exchangeRates[pair];
                            } else if (exchangeRates[`${swapForm.toAsset}_TO_${swapForm.fromAsset}`]) {
                              rate = 1 / exchangeRates[`${swapForm.toAsset}_TO_${swapForm.fromAsset}`];
                            }
                            return rate.toFixed(6);
                          })()} {swapForm.toAsset}
                        </span>
                      </div>
                    </div>
                    
                    {/* Advanced Options Toggle */}
                    <div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-between text-sm h-8"
                        onClick={() => setSwapForm({ ...swapForm, showAdvanced: !swapForm.showAdvanced })}
                      >
                        <span>Advanced Options</span>
                        <ChevronRightIcon className={`h-4 w-4 transition-transform ${swapForm.showAdvanced ? 'rotate-90' : ''}`} />
                      </Button>
                      
                      {swapForm.showAdvanced && (
                        <div className="mt-3 space-y-3 p-3 bg-surface-light rounded-lg">
                          <div className="space-y-2">
                            <Label className="text-sm">Slippage Tolerance</Label>
                            <Select value={swapForm.slippage} onValueChange={(value) => setSwapForm({ ...swapForm, slippage: value })}>
                              <SelectTrigger className="bg-surface h-8 text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0.1">0.1%</SelectItem>
                                <SelectItem value="0.5">0.5%</SelectItem>
                                <SelectItem value="1.0">1.0%</SelectItem>
                                <SelectItem value="3.0">3.0%</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Network Fee</span>
                            <span>~$1.25</span>
                          </div>
                          
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Exchange Fee (0.3%)</span>
                            <span>~$1.85</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Submit Button */}
                    <Button 
                      className="w-full bg-gradient-to-r from-primary to-secondary" 
                      disabled={!swapForm.amount || parseFloat(swapForm.amount) <= 0}
                      onClick={() => {
                        toast({
                          title: "Swap successful",
                          description: `Swapped ${swapForm.amount} ${swapForm.fromAsset} to ${swapForm.toAsset}`,
                        });
                        setSwapForm({
                          ...swapForm,
                          amount: ""
                        });
                      }}
                    >
                      Swap Tokens
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <div className="space-y-6">
                {/* Exchange Rates Card */}
                <Card className="bg-surface border-none neon-border shadow-glow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUpIcon className="h-5 w-5 text-primary" />
                      Exchange Rates
                    </CardTitle>
                    <CardDescription>Current market rates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { from: "ETH", to: "GCC", rate: 10000, change: 1.2 },
                        { from: "BTC", to: "ETH", rate: 15.5, change: -2.1 },
                        { from: "GCC", to: "USDT", rate: 0.1, change: 0.5 }
                      ].map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-surface-light rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center z-10">
                                <span className="text-sm font-medium">{item.from}</span>
                              </div>
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center -ml-2 z-0">
                                <span className="text-sm font-medium">{item.to}</span>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                1 {item.from} = {item.rate} {item.to}
                              </p>
                              <p className={`text-xs ${item.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {item.change >= 0 ? '+' : ''}{item.change}% (24h)
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="h-8 text-xs">
                            Swap
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Price Alerts Card */}
                <Card className="bg-surface border-none neon-border shadow-glow">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <BellIcon className="h-5 w-5 text-primary" />
                        Price Alerts
                      </CardTitle>
                      <CardDescription>Get notified on price changes</CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPriceAlertModal(true)}
                    >
                      <PlusIcon className="h-4 w-4 mr-1.5" />
                      Add Alert
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {priceAlerts.length === 0 ? (
                      <div className="text-center py-8">
                        <BellIcon className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                        <p className="text-muted-foreground mb-4">No price alerts set</p>
                        <Button 
                          className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                          onClick={() => setShowPriceAlertModal(true)}
                        >
                          Create Alert
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {priceAlerts.map((alert) => (
                          <div key={alert.id} className="flex justify-between items-center p-3 bg-surface-light rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-sm font-medium">{alert.currency}</span>
                              </div>
                              <div>
                                <p className="text-sm">
                                  Alert when {alert.currency} goes {alert.targetType === 'above' ? 'above' : 'below'} ${alert.targetPrice.toLocaleString()}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Created {alert.createdAt.toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <Switch
                              checked={alert.isActive}
                              onCheckedChange={(checked) => {
                                setPriceAlerts(priceAlerts.map(a => 
                                  a.id === alert.id ? { ...a, isActive: checked } : a
                                ));
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* More tabs will be added later */}
          
        </Tabs>
      </main>
      
      <BottomNav />

      {/* QR Scanner Modal */}
      <Dialog open={showQrScannerModal} onOpenChange={setShowQrScannerModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Scan QR Code</DialogTitle>
            <DialogDescription>Scan a QR code to get wallet address</DialogDescription>
          </DialogHeader>
          <div className="p-6 flex flex-col items-center justify-center">
            <div className="w-full aspect-square bg-surface-light rounded-lg mb-4 flex items-center justify-center">
              {/* In a real app, this would use camera access and QR scanning functionality */}
              <ScanIcon className="h-24 w-24 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Position the QR code in the center of the screen
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Transaction Security Confirmation Modal */}
      <Dialog open={confirmingTransaction} onOpenChange={setConfirmingTransaction}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Authorize Transaction</DialogTitle>
            <DialogDescription>Please verify your identity to continue</DialogDescription>
          </DialogHeader>
          <div className="p-6 flex flex-col items-center justify-center">
            {transactionToConfirm && (
              <div className="bg-surface-light p-4 rounded-lg mb-6 w-full">
                <h4 className="text-sm font-medium mb-2">Transaction Details</h4>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium">{transactionToConfirm.type}</span>
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-medium">{transactionToConfirm.amount} {transactionToConfirm.currency}</span>
                  {transactionToConfirm.recipient && (
                    <>
                      <span className="text-muted-foreground">Recipient:</span>
                      <span className="font-medium truncate">{transactionToConfirm.recipient}</span>
                    </>
                  )}
                </div>
              </div>
            )}
            
            {securitySettings.biometricEnabled && (
              <div className="mb-6 flex flex-col items-center">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="h-24 w-24 rounded-full mb-4"
                  disabled={authenticating}
                  onClick={handleBiometricAuth}
                >
                  {authenticating ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <RefreshCwIcon className="h-8 w-8 text-primary" />
                    </motion.div>
                  ) : (
                    <FingerprintIcon className="h-12 w-12 text-primary" />
                  )}
                </Button>
                <p className="text-sm text-center text-muted-foreground">
                  {authenticating 
                    ? "Verifying..." 
                    : "Use your fingerprint or face to authenticate"}
                </p>
              </div>
            )}
            
            {!securitySettings.biometricEnabled && (
              <div className="mb-6 w-full">
                <Label htmlFor="pin" className="mb-2 block">Enter PIN Code</Label>
                <Input 
                  id="pin"
                  type="password" 
                  value={pinCode} 
                  onChange={(e) => setPinCode(e.target.value)} 
                  className="text-center text-lg font-mono"
                  placeholder="• • • •"
                  maxLength={6}
                />
              </div>
            )}
          </div>
          <DialogFooter className="flex-col space-y-2">
            {!securitySettings.biometricEnabled && (
              <Button 
                disabled={pinCode.length < 4} 
                onClick={() => {
                  if (transactionToConfirm) {
                    processAuthenticatedTransaction(transactionToConfirm);
                  }
                  setPinCode("");
                }}
              >
                Confirm
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={() => {
                setConfirmingTransaction(false);
                setTransactionToConfirm(null);
                setPinCode("");
              }}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Security Settings Modal */}
      <Dialog open={showSecurityModal} onOpenChange={setShowSecurityModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Security Settings</DialogTitle>
            <DialogDescription>Configure your wallet security preferences</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Biometric Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Use fingerprint or face ID for transactions
                </p>
              </div>
              <Switch 
                checked={securitySettings.biometricEnabled}
                onCheckedChange={toggleBiometricAuth}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Transaction Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive alerts for all wallet activity
                </p>
              </div>
              <Switch 
                checked={securitySettings.notificationsEnabled}
                onCheckedChange={(checked) => 
                  setSecuritySettings(prev => ({
                    ...prev,
                    notificationsEnabled: checked
                  }))
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Auto-Lock Timeout</Label>
                <p className="text-sm text-muted-foreground">
                  Lock wallet after period of inactivity
                </p>
              </div>
              <Select 
                value={securitySettings.autoLockTimeout.toString()}
                onValueChange={(value) => 
                  setSecuritySettings(prev => ({
                    ...prev,
                    autoLockTimeout: parseInt(value)
                  }))
                }
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 min</SelectItem>
                  <SelectItem value="5">5 min</SelectItem>
                  <SelectItem value="15">15 min</SelectItem>
                  <SelectItem value="30">30 min</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Security Level</Label>
                <p className="text-sm text-muted-foreground">
                  Set verification requirements for transactions
                </p>
              </div>
              <Select 
                value={securitySettings.securityLevel}
                onValueChange={(value) => 
                  setSecuritySettings(prev => ({
                    ...prev,
                    securityLevel: value as SecurityLevel
                  }))
                }
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="enhanced">Enhanced</SelectItem>
                  <SelectItem value="maximum">Maximum</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowSecurityModal(false)}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Price Alerts Modal */}
      <Dialog open={showAlertsModal} onOpenChange={setShowAlertsModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Price Alerts</DialogTitle>
            <DialogDescription>Get notified when prices hit your targets</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Current Alerts */}
            {priceAlerts.length > 0 ? (
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Your Alerts</h4>
                {priceAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between bg-surface-light p-3 rounded-lg">
                    <div>
                      <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-full mr-2 ${alert.isActive ? 'bg-green-500' : 'bg-muted'}`}></div>
                        <span className="font-medium">{alert.currency}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {alert.targetType === "above" ? "Goes above" : "Falls below"} ${alert.targetPrice.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={alert.isActive}
                        onCheckedChange={() => toggleAlertStatus(alert.id)}
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => deleteAlert(alert.id)}
                      >
                        <VolumeXIcon className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-surface-light rounded-lg p-4 text-center">
                <BellIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">You don't have any price alerts yet</p>
              </div>
            )}
            
            {/* Create New Alert */}
            <div>
              <h4 className="text-sm font-medium mb-3">Create New Alert</h4>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="alert-currency" className="text-xs mb-1 block">Currency</Label>
                    <Select
                      value={newAlert.currency}
                      onValueChange={(value) => setNewAlert(prev => ({ ...prev, currency: value as Currency }))}
                    >
                      <SelectTrigger id="alert-currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                        <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                        <SelectItem value="USDT">Tether (USDT)</SelectItem>
                        <SelectItem value="GCC">GameCoin (GCC)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="alert-condition" className="text-xs mb-1 block">Condition</Label>
                    <Select
                      value={newAlert.targetType}
                      onValueChange={(value) => setNewAlert(prev => ({ ...prev, targetType: value as "above" | "below" }))}
                    >
                      <SelectTrigger id="alert-condition">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="above">Goes above</SelectItem>
                        <SelectItem value="below">Falls below</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="alert-price" className="text-xs mb-1 block">Target Price ($)</Label>
                  <Input
                    id="alert-price"
                    type="number"
                    value={newAlert.targetPrice}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, targetPrice: e.target.value }))}
                    placeholder="0.00"
                    className="bg-surface-light"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowAlertsModal(false)}
              className="sm:order-first order-last"
            >
              Cancel
            </Button>
            <Button onClick={handleCreateAlert}>
              Create Alert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Modal */}
      <Dialog open={showSendModal} onOpenChange={setShowSendModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Assets</DialogTitle>
            <DialogDescription>Transfer tokens to another wallet address</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Address</Label>
              <div className="flex gap-2">
                <Input
                  id="recipient"
                  className="flex-1 bg-surface-light"
                  placeholder="0x..."
                  value={sendForm.recipient}
                  onChange={(e) => setSendForm({ ...sendForm, recipient: e.target.value })}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowQrScannerModal(true)}
                >
                  <QrCodeIcon className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start h-8 px-0 text-xs"
                onClick={() => setShowContactModal(true)}
              >
                <UsersIcon className="h-3.5 w-3.5 mr-1.5" />
                Select from contacts
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="asset">Asset</Label>
              <Select
                value={sendForm.asset}
                onValueChange={(value) => setSendForm({ ...sendForm, asset: value as Currency })}
              >
                <SelectTrigger id="asset" className="bg-surface-light">
                  <SelectValue placeholder="Select asset" />
                </SelectTrigger>
                <SelectContent>
                  {assets.map((asset) => (
                    <SelectItem key={asset.id} value={asset.symbol}>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                          {asset.iconUrl ? (
                            <img src={asset.iconUrl} alt={asset.name} className="w-3 h-3" />
                          ) : (
                            <WalletIcon className="h-3 w-3 text-primary" />
                          )}
                        </div>
                        <span>
                          {asset.symbol} • {showBalances ? asset.balance.toLocaleString() : '••••'}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="amount">Amount</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs"
                  onClick={() => {
                    const asset = assets.find(a => a.symbol === sendForm.asset);
                    if (asset) {
                      setSendForm({ ...sendForm, amount: asset.balance.toString() });
                    }
                  }}
                >
                  MAX
                </Button>
              </div>
              <div className="flex gap-2">
                <Input
                  id="amount"
                  className="bg-surface-light"
                  placeholder="0.00"
                  type="number"
                  value={sendForm.amount}
                  onChange={(e) => setSendForm({ ...sendForm, amount: e.target.value })}
                />
                <div className="w-[80px] bg-surface-light border border-border rounded-md flex items-center justify-center">
                  <span className="font-medium">{sendForm.asset}</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>
                  Available: {assets.find(a => a.symbol === sendForm.asset)?.balance.toLocaleString() || 0} {sendForm.asset}
                </span>
                <span>
                  ~${(() => {
                    const asset = assets.find(a => a.symbol === sendForm.asset);
                    const amount = parseFloat(sendForm.amount);
                    if (asset && !isNaN(amount)) {
                      return ((amount * asset.fiatValue) / asset.balance).toFixed(2);
                    }
                    return '0.00';
                  })()}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="memo">Memo (Optional)</Label>
              <Textarea
                id="memo"
                className="bg-surface-light resize-none"
                placeholder="Add a note to this transaction"
                value={sendForm.memo}
                onChange={(e) => setSendForm({ ...sendForm, memo: e.target.value })}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="save-contact"
                checked={sendForm.saveContact}
                onCheckedChange={(checked) => setSendForm({ ...sendForm, saveContact: checked })}
              />
              <Label htmlFor="save-contact">Save recipient to contacts</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              className="w-full bg-gradient-to-r from-primary to-secondary"
              disabled={
                !sendForm.recipient ||
                !sendForm.amount ||
                parseFloat(sendForm.amount) <= 0 ||
                parseFloat(sendForm.amount) > (assets.find(a => a.symbol === sendForm.asset)?.balance || 0)
              }
              onClick={() => {
                // Close the modal
                setShowSendModal(false);
                
                // Verify transaction security
                verifyTransactionSecurity({
                  type: "send",
                  amount: parseFloat(sendForm.amount),
                  currency: sendForm.asset,
                  recipient: sendForm.recipient
                });
                
                // Reset form
                setSendForm({
                  ...sendForm,
                  amount: "",
                  memo: ""
                });
              }}
            >
              Review Transaction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Receive Modal */}
      <Dialog open={showReceiveModal} onOpenChange={setShowReceiveModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Receive Assets</DialogTitle>
            <DialogDescription>Get your wallet address to receive funds</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center py-4">
            <Select defaultValue="GCC">
              <SelectTrigger className="w-[200px] bg-surface-light mb-4">
                <SelectValue placeholder="Select asset" />
              </SelectTrigger>
              <SelectContent>
                {assets.map((asset) => (
                  <SelectItem key={asset.id} value={asset.symbol}>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                        {asset.iconUrl ? (
                          <img src={asset.iconUrl} alt={asset.name} className="w-3 h-3" />
                        ) : (
                          <WalletIcon className="h-3 w-3 text-primary" />
                        )}
                      </div>
                      <span>{asset.symbol}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="bg-white p-4 rounded-lg w-full max-w-[240px] mx-auto mb-4">
              <QRCode 
                value={walletAddress} 
                size={200}
                className="mx-auto"
              />
            </div>
            
            <div className="w-full bg-surface-light p-3 rounded-lg mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Your address:</span>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => {
                    navigator.clipboard.writeText(walletAddress);
                    toast({
                      title: "Address copied",
                      description: "Wallet address copied to clipboard"
                    });
                  }}>
                    <CopyIcon className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <ExternalLinkIcon className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <p className="text-sm font-mono mt-1 break-all">
                {walletAddress}
              </p>
            </div>
            
            <Alert className="bg-warning/10 border-warning text-warning">
              <AlertTriangleIcon className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                Only send compatible assets to this address. Sending incompatible assets may result in permanent loss.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button className="w-full" variant="outline" onClick={() => {
              navigator.clipboard.writeText(walletAddress);
              toast({
                title: "Address copied",
                description: "Wallet address copied to clipboard"
              });
            }}>
              <CopyIcon className="h-4 w-4 mr-2" />
              Copy Address
            </Button>
            <Button className="w-full bg-gradient-to-r from-primary to-secondary">
              <ShareIcon className="h-4 w-4 mr-2" />
              Share Address
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Asset Details Modal */}
      <Dialog open={showAssetDetailsModal} onOpenChange={setShowAssetDetailsModal}>
        <DialogContent className="sm:max-w-md">
          {selectedAsset && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {selectedAsset.iconUrl ? (
                      <img src={selectedAsset.iconUrl} alt={selectedAsset.name} className="w-6 h-6" />
                    ) : (
                      <WalletIcon className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <DialogTitle>{selectedAsset.name}</DialogTitle>
                    <DialogDescription>
                      {selectedAsset.isOnChain ? 'On-chain asset' : 'In-app token'}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="bg-surface-light p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Balance</p>
                      <p className="text-2xl font-medium">
                        {showBalances ? selectedAsset.balance.toLocaleString() : '••••'} <span className="text-base">{selectedAsset.symbol}</span>
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        ${showBalances ? selectedAsset.fiatValue.toLocaleString() : '••••'}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-sm text-muted-foreground mb-1">Price Change (24h)</p>
                      <p className={`text-lg font-medium ${
                        selectedAsset.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {selectedAsset.priceChange24h >= 0 ? '+' : ''}{selectedAsset.priceChange24h}%
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Price: ${(selectedAsset.fiatValue / selectedAsset.balance).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button className="flex-1 bg-primary/90 hover:bg-primary text-white" onClick={() => {
                    setSendForm(prev => ({
                      ...prev,
                      asset: selectedAsset.symbol
                    }));
                    setShowAssetDetailsModal(false);
                    setShowSendModal(true);
                  }}>
                    <SendIcon className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                  <Button className="flex-1 bg-primary/90 hover:bg-primary text-white" onClick={() => {
                    setShowAssetDetailsModal(false);
                    setShowReceiveModal(true);
                  }}>
                    <ReceiveIcon className="h-4 w-4 mr-2" />
                    Receive
                  </Button>
                  {selectedAsset.isStakingAvailable && (
                    <Button className="flex-1 bg-primary/90 hover:bg-primary text-white" onClick={() => {
                      setStakeForm(prev => ({
                        ...prev,
                        asset: selectedAsset.symbol
                      }));
                      setShowAssetDetailsModal(false);
                      setShowStakeModal(true);
                    }}>
                      <PercentIcon className="h-4 w-4 mr-2" />
                      Stake
                    </Button>
                  )}
                </div>
                
                {selectedAsset.isStakingAvailable && (
                  <div className="bg-surface-light p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">Staking Information</h4>
                        <p className="text-sm text-muted-foreground">Earn passive income</p>
                      </div>
                      <Badge className="bg-primary/10 text-primary">
                        {selectedAsset.stakingAPY}% APY
                      </Badge>
                    </div>
                    <p className="text-sm mb-3">
                      Stake your {selectedAsset.symbol} to earn rewards over time.
                    </p>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => {
                      setStakeForm(prev => ({
                        ...prev,
                        asset: selectedAsset.symbol
                      }));
                      setShowAssetDetailsModal(false);
                      setShowStakeModal(true);
                    }}>
                      View Staking Options
                    </Button>
                  </div>
                )}
                
                <div className="bg-surface-light p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Transaction History</h4>
                  <div className="space-y-2">
                    {recentTransactions
                      .filter(tx => tx.currency === selectedAsset.symbol)
                      .slice(0, 3)
                      .map((tx) => (
                        <div key={tx.id} className="flex justify-between items-center py-2">
                          <div className="flex items-center gap-2">
                            <div className={`rounded-full p-1.5 ${
                              tx.type === 'send' ? 'bg-red-500/10 text-red-500' :
                              tx.type === 'receive' ? 'bg-green-500/10 text-green-500' :
                              'bg-primary/10 text-primary'
                            }`}>
                              {tx.type === 'send' && <ArrowUpIcon className="h-3.5 w-3.5" />}
                              {tx.type === 'receive' && <ArrowDownIcon className="h-3.5 w-3.5" />}
                              {tx.type === 'swap' && <SwapIcon className="h-3.5 w-3.5" />}
                            </div>
                            <div>
                              <p className="text-sm">
                                {tx.type === 'send' ? 'Sent' : 
                                 tx.type === 'receive' ? 'Received' : 
                                 tx.type === 'swap' ? 'Swapped' : 
                                 'Transaction'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {tx.timestamp.toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <p className={`text-sm ${
                            tx.type === 'send' ? 'text-red-500' :
                            tx.type === 'receive' ? 'text-green-500' :
                            ''
                          }`}>
                            {tx.type === 'send' ? '-' : tx.type === 'receive' ? '+' : ''}
                            {tx.amount} {tx.currency}
                          </p>
                        </div>
                      ))}
                      
                    {recentTransactions.filter(tx => tx.currency === selectedAsset.symbol).length === 0 && (
                      <div className="text-center py-2">
                        <p className="text-sm text-muted-foreground">No transaction history</p>
                      </div>
                    )}
                  </div>
                  
                  {recentTransactions.filter(tx => tx.currency === selectedAsset.symbol).length > 0 && (
                    <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => {
                      setShowAssetDetailsModal(false);
                      setActiveTab("transactions");
                    }}>
                      View All Transactions
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default Wallet;