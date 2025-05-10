import React, { useState, useEffect } from "react";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { useLanguage } from "@/context/LanguageContext";
import { useUser } from "@/hooks/useUser";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingCartIcon, 
  ShoppingBagIcon, 
  TagIcon, 
  PercentIcon,
  StarIcon,
  CrownIcon,
  CoinsIcon,
  WalletIcon,
  BoxIcon,
  BarChart3Icon,
  UsersIcon,
  StoreIcon,
  TruckIcon,
  CreditCardIcon,
  HeartIcon,
  SearchIcon,
  PlusCircleIcon,
  ImageIcon,
  TextIcon,
  SlidersHorizontalIcon,
  BadgeCheckIcon,
  PiggyBankIcon,
  GiftIcon,
  CheckIcon,
  XIcon,
  ShieldIcon,
  FlameIcon,
  TrophyIcon,
  CogIcon,
  BellIcon,
  MessageSquareIcon,
  TrendingUpIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";

// Types for our store system
type ProductCategory = 
  | "miner" 
  | "token" 
  | "subscription" 
  | "cosmetic" 
  | "physical" 
  | "service" 
  | "digital";

type StorefrontTheme = 
  | "default" 
  | "dark" 
  | "light" 
  | "crypto" 
  | "minimalist" 
  | "colorful";

type OrderStatus = 
  | "pending" 
  | "processing" 
  | "shipped" 
  | "delivered" 
  | "canceled" 
  | "refunded";

type StoreRank = 
  | "bronze" 
  | "silver" 
  | "gold" 
  | "platinum" 
  | "diamond";

type ProductCondition = 
  | "new" 
  | "used" 
  | "refurbished" 
  | "digital";

// Product interface
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  currency: "in-app" | "on-chain";
  category: ProductCategory;
  image: string;
  stock: number;
  autoReplenish?: boolean;
  replenishRate?: number;
  isLimited?: boolean;
  limitedQuantity?: number;
  limitedTimeOffer?: boolean;
  offerEndDate?: Date;
  tags: string[];
  rating?: number;
  reviews?: number;
  condition?: ProductCondition;
  storeId: string; // "admin" for app store
  featured?: boolean;
  bestSeller?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Store interface
interface Store {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  logo?: string;
  banner?: string;
  theme: StorefrontTheme;
  categories: ProductCategory[];
  products: string[]; // Product IDs
  sales: number;
  revenue: number;
  commission: number; // percentage
  rating?: number;
  reviews?: number;
  rank?: StoreRank;
  verified: boolean;
  createdAt: Date;
  followers: number;
  badges: string[]; // achievement badges
  featured?: boolean;
  socialLinks: {
    twitter?: string;
    instagram?: string;
    website?: string;
  };
}

// Order interface
interface Order {
  id: string;
  buyerId: string;
  storeId: string;
  products: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  totalPrice: number;
  status: OrderStatus;
  paymentMethod: "in-app" | "on-chain";
  createdAt: Date;
  updatedAt: Date;
  shipping?: {
    address: string;
    trackingNumber?: string;
    estimatedDelivery?: Date;
  };
  refundRequested?: boolean;
  disputeOpen?: boolean;
}

// Cart interface
interface CartItem {
  productId: string;
  storeId: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
}

// Mock data for the app store products
const appStoreProducts: Product[] = [
  {
    id: "product-1",
    name: "Super Miner Bundle",
    description: "Get 3 high-performance miners with 10% increased hash rate",
    price: 1000,
    discountedPrice: 900,
    currency: "in-app",
    category: "miner",
    image: "/assets/products/super-miner.png",
    stock: 50,
    autoReplenish: true,
    replenishRate: 10,
    tags: ["miner", "bundle", "limited"],
    rating: 4.8,
    reviews: 124,
    storeId: "admin",
    featured: true,
    bestSeller: true,
    createdAt: new Date(2023, 5, 15),
    updatedAt: new Date(2023, 5, 15)
  },
  {
    id: "product-2",
    name: "Token Booster Pack",
    description: "1,000 in-app tokens with 5% bonus",
    price: 950,
    currency: "in-app",
    category: "token",
    image: "/assets/products/token-pack.png",
    stock: 999,
    autoReplenish: true,
    tags: ["token", "booster", "value"],
    rating: 4.6,
    reviews: 89,
    storeId: "admin",
    createdAt: new Date(2023, 5, 1),
    updatedAt: new Date(2023, 5, 1)
  },
  {
    id: "product-3",
    name: "VIP Subscription - 1 Month",
    description: "Get premium features, no ads, and 10% more mining rewards",
    price: 2000,
    currency: "in-app",
    category: "subscription",
    image: "/assets/products/vip-subscription.png",
    stock: 999,
    autoReplenish: true,
    tags: ["subscription", "vip", "premium"],
    rating: 4.9,
    reviews: 256,
    storeId: "admin",
    createdAt: new Date(2023, 4, 20),
    updatedAt: new Date(2023, 4, 20)
  },
  {
    id: "product-4",
    name: "Golden Avatar Frame",
    description: "Exclusive golden frame for your profile picture",
    price: 500,
    currency: "in-app",
    category: "cosmetic",
    image: "/assets/products/golden-frame.png",
    stock: 100,
    isLimited: true,
    limitedQuantity: 100,
    tags: ["cosmetic", "profile", "exclusive"],
    rating: 4.7,
    reviews: 67,
    storeId: "admin",
    createdAt: new Date(2023, 6, 10),
    updatedAt: new Date(2023, 6, 10)
  },
  {
    id: "product-5",
    name: "Mining Efficiency Upgrade",
    description: "Increase your mining efficiency by 20% for all miners",
    price: 1500,
    currency: "in-app",
    category: "miner",
    image: "/assets/products/mining-upgrade.png",
    stock: 200,
    tags: ["miner", "upgrade", "efficiency"],
    rating: 4.5,
    reviews: 42,
    storeId: "admin",
    createdAt: new Date(2023, 6, 5),
    updatedAt: new Date(2023, 6, 5)
  },
  {
    id: "product-6",
    name: "Game Power-Up Bundle",
    description: "Get 10 extra lives, 5 time boosters, and 3 score multipliers",
    price: 750,
    discountedPrice: 600,
    currency: "in-app",
    category: "digital",
    image: "/assets/products/game-powerups.png",
    stock: 500,
    autoReplenish: true,
    tags: ["game", "power-up", "bundle"],
    rating: 4.4,
    reviews: 31,
    storeId: "admin",
    limitedTimeOffer: true,
    offerEndDate: new Date(2023, 8, 30),
    createdAt: new Date(2023, 7, 1),
    updatedAt: new Date(2023, 7, 1)
  }
];

// Mock data for user stores
const userStores: Store[] = [
  {
    id: "store-1",
    ownerId: "user-1",
    name: "Crypto Collectibles",
    description: "Rare physical crypto collectibles and merchandise",
    logo: "/assets/stores/crypto-collectibles-logo.png",
    banner: "/assets/stores/crypto-collectibles-banner.png",
    theme: "crypto",
    categories: ["physical", "cosmetic"],
    products: ["user-product-1", "user-product-2", "user-product-3"],
    sales: 342,
    revenue: 45600,
    commission: 5,
    rating: 4.8,
    reviews: 156,
    rank: "platinum",
    verified: true,
    createdAt: new Date(2023, 2, 15),
    followers: 1240,
    badges: ["top-seller", "fast-shipper", "trusted"],
    featured: true,
    socialLinks: {
      twitter: "cryptoCollect",
      instagram: "crypto_collectibles",
      website: "cryptoc.com"
    }
  },
  {
    id: "store-2",
    ownerId: "user-2",
    name: "Blockchain Services",
    description: "Professional blockchain development and consulting services",
    logo: "/assets/stores/blockchain-services-logo.png",
    banner: "/assets/stores/blockchain-services-banner.png",
    theme: "minimalist",
    categories: ["service", "digital"],
    products: ["user-product-4", "user-product-5"],
    sales: 126,
    revenue: 89000,
    commission: 5,
    rating: 4.9,
    reviews: 78,
    rank: "gold",
    verified: true,
    createdAt: new Date(2023, 4, 10),
    followers: 560,
    badges: ["top-rated", "expert"],
    socialLinks: {
      twitter: "blockchainservices",
      website: "bcs.io"
    }
  },
  {
    id: "store-3",
    ownerId: "user-3",
    name: "Mining Hardware",
    description: "New and used mining hardware at competitive prices",
    logo: "/assets/stores/mining-hardware-logo.png",
    banner: "/assets/stores/mining-hardware-banner.png",
    theme: "dark",
    categories: ["physical", "miner"],
    products: ["user-product-6", "user-product-7", "user-product-8"],
    sales: 215,
    revenue: 128000,
    commission: 5,
    rating: 4.6,
    reviews: 92,
    rank: "silver",
    verified: true,
    createdAt: new Date(2023, 3, 5),
    followers: 820,
    badges: ["hardware-specialist"],
    socialLinks: {
      instagram: "mining_hardware",
      website: "mininghw.net"
    }
  }
];

// Mock data for user products
const userProducts: Product[] = [
  {
    id: "user-product-1",
    name: "Limited Edition Bitcoin Medallion",
    description: "24k gold plated physical bitcoin medallion, collector's item",
    price: 350,
    currency: "in-app",
    category: "physical",
    image: "/assets/products/bitcoin-medallion.png",
    stock: 20,
    isLimited: true,
    limitedQuantity: 100,
    tags: ["collectible", "bitcoin", "limited"],
    rating: 4.9,
    reviews: 42,
    condition: "new",
    storeId: "store-1",
    createdAt: new Date(2023, 2, 20),
    updatedAt: new Date(2023, 2, 20)
  },
  {
    id: "user-product-2",
    name: "Ethereum Hoodie",
    description: "Premium quality hoodie with embroidered Ethereum logo",
    price: 120,
    currency: "in-app",
    category: "physical",
    image: "/assets/products/ethereum-hoodie.png",
    stock: 45,
    tags: ["clothing", "ethereum", "apparel"],
    rating: 4.7,
    reviews: 28,
    condition: "new",
    storeId: "store-1",
    createdAt: new Date(2023, 3, 5),
    updatedAt: new Date(2023, 3, 5)
  },
  {
    id: "user-product-6",
    name: "Antminer S19 Pro - Used",
    description: "Used Antminer S19 Pro, 110 TH/s, fully tested and working",
    price: 2800,
    currency: "in-app",
    category: "physical",
    image: "/assets/products/antminer.png",
    stock: 5,
    tags: ["miner", "hardware", "bitcoin"],
    rating: 4.6,
    reviews: 14,
    condition: "used",
    storeId: "store-3",
    createdAt: new Date(2023, 4, 12),
    updatedAt: new Date(2023, 4, 12)
  },
  {
    id: "user-product-4",
    name: "Blockchain Consultation - 1 Hour",
    description: "Professional blockchain consultation session with our experts",
    price: 500,
    currency: "in-app",
    category: "service",
    image: "/assets/products/consultation.png",
    stock: 999,
    tags: ["service", "consultation", "blockchain"],
    rating: 5.0,
    reviews: 36,
    storeId: "store-2",
    createdAt: new Date(2023, 5, 15),
    updatedAt: new Date(2023, 5, 15)
  }
];

// Mock data for user orders
const userOrders: Order[] = [
  {
    id: "order-1",
    buyerId: "current-user",
    storeId: "admin",
    products: [
      {
        productId: "product-1",
        quantity: 1,
        price: 900
      },
      {
        productId: "product-4",
        quantity: 1,
        price: 500
      }
    ],
    totalPrice: 1400,
    status: "delivered",
    paymentMethod: "in-app",
    createdAt: new Date(2023, 6, 10),
    updatedAt: new Date(2023, 6, 12)
  },
  {
    id: "order-2",
    buyerId: "current-user",
    storeId: "store-1",
    products: [
      {
        productId: "user-product-1",
        quantity: 1,
        price: 350
      }
    ],
    totalPrice: 350,
    status: "shipped",
    paymentMethod: "in-app",
    createdAt: new Date(2023, 7, 5),
    updatedAt: new Date(2023, 7, 6),
    shipping: {
      address: "123 Crypto St, Blockchain City, 12345",
      trackingNumber: "SHIP123456789",
      estimatedDelivery: new Date(2023, 7, 15)
    }
  }
];

// Main Store component
const Store: React.FC = () => {
  const { t, dir } = useLanguage();
  const { user } = useUser();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("marketplace");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCreateStore, setShowCreateStore] = useState(false);
  const [userHasStore, setUserHasStore] = useState(false);
  const [loadingCreateStore, setLoadingCreateStore] = useState(false);
  
  // Check if user has a store
  useEffect(() => {
    // In a real app, this would be an API call
    const hasStore = userStores.some(store => store.ownerId === "current-user");
    setUserHasStore(hasStore);
  }, []);
  
  // Filter products by search, category, price
  const filteredAppProducts = appStoreProducts.filter(product => {
    const matchesSearch = 
      searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesCategory = 
      !selectedCategory || 
      product.category === selectedCategory;
      
    const matchesPrice = 
      (product.discountedPrice || product.price) >= priceRange[0] &&
      (product.discountedPrice || product.price) <= priceRange[1];
      
    return matchesSearch && matchesCategory && matchesPrice;
  });
  
  const filteredUserProducts = userProducts.filter(product => {
    const matchesSearch = 
      searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesCategory = 
      !selectedCategory || 
      product.category === selectedCategory;
      
    const matchesPrice = 
      (product.discountedPrice || product.price) >= priceRange[0] &&
      (product.discountedPrice || product.price) <= priceRange[1];
      
    return matchesSearch && matchesCategory && matchesPrice;
  });
  
  // Add to cart
  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      // Update quantity if item already in cart
      setCart(
        cart.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        )
      );
    } else {
      // Add new item to cart
      setCart([
        ...cart,
        {
          productId: product.id,
          storeId: product.storeId,
          quantity: 1,
          price: product.discountedPrice || product.price,
          name: product.name,
          image: product.image
        }
      ]);
    }
    
    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart`,
      variant: "default",
    });
  };
  
  // Remove from cart
  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };
  
  // Update cart item quantity
  const updateCartItemQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCart(
      cart.map(item => 
        item.productId === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };
  
  // Calculate cart total
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity, 
    0
  );
  
  // Checkout function
  const checkout = () => {
    if (cart.length === 0) return;
    
    // In a real app, this would be an API call to process the order
    toast({
      title: "Order placed",
      description: `Your order has been placed successfully! Total: ${cartTotal} tokens`,
      variant: "default",
    });
    
    // Clear cart
    setCart([]);
    setShowCart(false);
  };
  
  // Create new store
  const createNewStore = (storeName: string, storeDescription: string) => {
    setLoadingCreateStore(true);
    
    // In a real app, this would be an API call to create the store
    setTimeout(() => {
      setLoadingCreateStore(false);
      setUserHasStore(true);
      setShowCreateStore(false);
      
      toast({
        title: "Store created",
        description: `Your store "${storeName}" has been created successfully!`,
        variant: "default",
      });
      
      // Switch to my store tab
      setActiveTab("mystore");
    }, 1500);
  };
  
  return (
    <div className="min-h-screen pb-20 bg-background" dir={dir()}>
      <TopBar />
      
      <main className="container max-w-md mx-auto pt-20 px-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-2xl font-bold"
            >
              {t('store.title')}
            </motion.h1>
            
            <div className="flex gap-2">
              {/* Balance Display */}
              <Link href="/wallet">
                <Button variant="outline" size="sm" className="gap-2">
                  <CoinsIcon className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">1,250</span>
                </Button>
              </Link>
              
              {/* Cart Button */}
              <Button 
                variant="outline" 
                size="icon" 
                className="relative"
                onClick={() => setShowCart(true)}
              >
                <ShoppingCartIcon className="h-4 w-4" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Button>
            </div>
          </div>
          
          {/* Search */}
          <div className="mt-4 relative">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products..."
              className="pr-10"
            />
            <SearchIcon className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>
        </div>
        
        {/* Tabs */}
        <Tabs defaultValue="marketplace" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 h-10">
            <TabsTrigger value="marketplace" className="text-xs">
              <ShoppingBagIcon className="h-4 w-4 mr-1" />
              Marketplace
            </TabsTrigger>
            <TabsTrigger value="stores" className="text-xs">
              <StoreIcon className="h-4 w-4 mr-1" />
              Stores
            </TabsTrigger>
            <TabsTrigger value="mystore" className="text-xs">
              <BoxIcon className="h-4 w-4 mr-1" />
              My Store
            </TabsTrigger>
            <TabsTrigger value="orders" className="text-xs">
              <TruckIcon className="h-4 w-4 mr-1" />
              Orders
            </TabsTrigger>
          </TabsList>
          
          {/* Marketplace Tab - App Store */}
          <TabsContent value="marketplace" className="space-y-4">
            {/* Categories Filter */}
            <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
              <Badge 
                variant={selectedCategory === null ? "default" : "outline"}
                className="cursor-pointer whitespace-nowrap"
                onClick={() => setSelectedCategory(null)}
              >
                All Categories
              </Badge>
              <Badge 
                variant={selectedCategory === "miner" ? "default" : "outline"}
                className="cursor-pointer whitespace-nowrap"
                onClick={() => setSelectedCategory("miner")}
              >
                Miners
              </Badge>
              <Badge 
                variant={selectedCategory === "token" ? "default" : "outline"}
                className="cursor-pointer whitespace-nowrap"
                onClick={() => setSelectedCategory("token")}
              >
                Tokens
              </Badge>
              <Badge 
                variant={selectedCategory === "subscription" ? "default" : "outline"}
                className="cursor-pointer whitespace-nowrap"
                onClick={() => setSelectedCategory("subscription")}
              >
                Subscriptions
              </Badge>
              <Badge 
                variant={selectedCategory === "cosmetic" ? "default" : "outline"}
                className="cursor-pointer whitespace-nowrap"
                onClick={() => setSelectedCategory("cosmetic")}
              >
                Cosmetics
              </Badge>
              <Badge 
                variant={selectedCategory === "digital" ? "default" : "outline"}
                className="cursor-pointer whitespace-nowrap"
                onClick={() => setSelectedCategory("digital")}
              >
                Digital Goods
              </Badge>
            </div>
            
            {/* Featured Product */}
            {appStoreProducts.filter(p => p.featured).map(product => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden"
              >
                <Card className="border-none bg-gradient-to-br from-primary/20 to-secondary/20">
                  <div className="absolute top-0 right-0">
                    <Badge className="m-3 bg-primary">Featured</Badge>
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-background/40 rounded-lg flex items-center justify-center overflow-hidden">
                        <img src={product.image} alt={product.name} className="w-16 h-16 object-contain" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{product.name}</CardTitle>
                        <CardDescription>{product.description}</CardDescription>
                        <div className="flex items-center mt-1">
                          <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm ml-1">{product.rating} ({product.reviews})</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex justify-between items-center">
                      <div>
                        {product.discountedPrice ? (
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold">{product.discountedPrice}</span>
                            <span className="text-sm line-through text-muted-foreground">{product.price}</span>
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                              {Math.round((1 - product.discountedPrice / product.price) * 100)}% OFF
                            </Badge>
                          </div>
                        ) : (
                          <span className="text-2xl font-bold">{product.price}</span>
                        )}
                        <span className="text-sm text-muted-foreground">tokens</span>
                      </div>
                      <Button onClick={() => addToCart(product)}>
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                  {product.limitedTimeOffer && product.offerEndDate && (
                    <CardFooter className="pt-0">
                      <div className="w-full bg-background/40 rounded-lg p-2 flex items-center justify-center">
                        <FlameIcon className="h-4 w-4 text-red-500 mr-2" />
                        <span className="text-sm">Limited offer ends in {formatDistanceToNow(product.offerEndDate)}</span>
                      </div>
                    </CardFooter>
                  )}
                </Card>
              </motion.div>
            ))}
            
            {/* Product Grid */}
            <div className="grid grid-cols-2 gap-3">
              {filteredAppProducts.filter(p => !p.featured).map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: index * 0.1 }
                  }}
                  className="relative"
                >
                  <Card className="overflow-hidden h-full flex flex-col">
                    {product.bestSeller && (
                      <div className="absolute top-0 left-0">
                        <Badge className="m-2 bg-yellow-500">Best Seller</Badge>
                      </div>
                    )}
                    {product.isLimited && (
                      <div className="absolute top-0 right-0">
                        <Badge variant="outline" className="m-2 bg-orange-500/10 text-orange-500 border-orange-500/30">
                          Limited
                        </Badge>
                      </div>
                    )}
                    <div className="h-32 bg-surface-light overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <CardHeader className="p-3 pb-2">
                      <CardTitle className="text-base truncate">{product.name}</CardTitle>
                      <div className="flex items-center">
                        <StarIcon className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs ml-1">{product.rating}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-3 pt-0 pb-2 flex-grow">
                      <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
                    </CardContent>
                    <CardFooter className="p-3 pt-0 flex justify-between items-center">
                      <div>
                        {product.discountedPrice ? (
                          <div>
                            <span className="font-bold">{product.discountedPrice}</span>
                            <span className="text-xs text-muted-foreground line-through ml-1">{product.price}</span>
                          </div>
                        ) : (
                          <span className="font-bold">{product.price}</span>
                        )}
                        <span className="text-xs text-muted-foreground">tokens</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => addToCart(product)}
                      >
                        <PlusCircleIcon className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
          
          {/* Stores Tab - User Stores */}
          <TabsContent value="stores" className="space-y-4">
            {/* Filters */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">User Stores</h3>
              <Select>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Store Spotlight */}
            {userStores.filter(store => store.featured).map(store => (
              <motion.div
                key={store.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
              >
                <Card className="overflow-hidden border-none bg-gradient-to-br from-primary/10 to-secondary/10">
                  <div className="h-32 overflow-hidden relative">
                    <img src={store.banner} alt={store.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
                    <div className="absolute bottom-3 left-3 flex items-center">
                      <div className="w-16 h-16 rounded-full bg-background/80 backdrop-blur-sm p-1 mr-3">
                        <img src={store.logo} alt={store.name} className="w-full h-full object-cover rounded-full" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white drop-shadow-md flex items-center">
                          {store.name}
                          {store.verified && (
                            <BadgeCheckIcon className="h-4 w-4 text-blue-500 ml-1" />
                          )}
                        </h3>
                        <div className="flex items-center">
                          <StarIcon className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-xs ml-1 text-white drop-shadow-md">{store.rating} · {store.reviews} reviews</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardContent className="pt-3 pb-2">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <Badge 
                          variant="outline" 
                          className={`
                            ${store.rank === 'bronze' ? 'bg-amber-700/20 text-amber-700 border-amber-700/50' : 
                              store.rank === 'silver' ? 'bg-slate-400/20 text-slate-400 border-slate-400/50' : 
                              store.rank === 'gold' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50' : 
                              store.rank === 'platinum' ? 'bg-cyan-400/20 text-cyan-400 border-cyan-400/50' : 
                              'bg-violet-500/20 text-violet-500 border-violet-500/50'}
                          `}
                        >
                          {store.rank?.charAt(0).toUpperCase() + store.rank?.slice(1)}
                        </Badge>
                        <span className="text-xs text-muted-foreground ml-2">{store.categories.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ')}</span>
                      </div>
                      <div className="flex items-center">
                        <UsersIcon className="h-3 w-3 mr-1" />
                        <span className="text-xs">{store.followers}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{store.description}</p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <div className="w-full">
                      <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
                        {store.badges.map(badge => (
                          <Badge key={badge} variant="outline" className="whitespace-nowrap">
                            {badge.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </Badge>
                        ))}
                      </div>
                      <Button className="w-full">Visit Store</Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
            
            {/* Store Grid */}
            <div className="grid grid-cols-1 gap-3">
              {userStores.filter(store => !store.featured).map((store, index) => (
                <motion.div
                  key={store.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: index * 0.1 }
                  }}
                >
                  <Card className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-full bg-surface-light overflow-hidden">
                          <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-base flex items-center">
                            {store.name}
                            {store.verified && (
                              <BadgeCheckIcon className="h-4 w-4 text-blue-500 ml-1" />
                            )}
                          </CardTitle>
                          <div className="flex items-center">
                            <StarIcon className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs ml-1">{store.rating} · {store.reviews} reviews</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{store.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex justify-between items-center">
                        <Badge 
                          variant="outline" 
                          className={`
                            ${store.rank === 'bronze' ? 'bg-amber-700/20 text-amber-700 border-amber-700/50' : 
                              store.rank === 'silver' ? 'bg-slate-400/20 text-slate-400 border-slate-400/50' : 
                              store.rank === 'gold' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50' : 
                              store.rank === 'platinum' ? 'bg-cyan-400/20 text-cyan-400 border-cyan-400/50' : 
                              'bg-violet-500/20 text-violet-500 border-violet-500/50'}
                          `}
                        >
                          {store.rank?.charAt(0).toUpperCase() + store.rank?.slice(1)}
                        </Badge>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <ShoppingBagIcon className="h-3 w-3 mr-1" />
                          <span>{store.sales} sales</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button className="w-full">Visit Store</Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            {/* Create Store Button */}
            {!userHasStore && (
              <div className="mt-6">
                <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <StoreIcon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">Create Your Store</h3>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      Start selling products or services and earn tokens
                    </p>
                    <Button onClick={() => setShowCreateStore(true)}>
                      Create Store
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* My Store Tab */}
          <TabsContent value="mystore" className="space-y-4">
            {userHasStore ? (
              <>
                {/* Store Dashboard */}
                <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl p-4 mb-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold">My Crypto Store</h3>
                      <p className="text-sm text-muted-foreground">Dashboard Overview</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <CogIcon className="h-4 w-4 mr-1" />
                      Settings
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-background/50 backdrop-blur-sm rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Total Sales</p>
                      <p className="text-lg font-bold">125</p>
                      <div className="flex items-center text-xs text-green-500">
                        <TrendingUpIcon className="h-3 w-3 mr-1" />
                        <span>+12% this week</span>
                      </div>
                    </div>
                    
                    <div className="bg-background/50 backdrop-blur-sm rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Revenue</p>
                      <p className="text-lg font-bold">12,500</p>
                      <div className="flex items-center text-xs text-green-500">
                        <TrendingUpIcon className="h-3 w-3 mr-1" />
                        <span>+8% this week</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-background/50 backdrop-blur-sm rounded-lg p-3 mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-xs text-muted-foreground">Store Rank Progress</p>
                      <Badge variant="outline" className="bg-yellow-500/20 text-yellow-500 border-yellow-500/50">
                        Gold
                      </Badge>
                    </div>
                    <Progress value={75} className="h-2 mb-1" />
                    <p className="text-xs text-right">75% to Platinum</p>
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <Button variant="outline" className="flex flex-col h-auto py-3">
                    <PlusCircleIcon className="h-5 w-5 mb-1" />
                    <span className="text-xs">Add Product</span>
                  </Button>
                  
                  <Button variant="outline" className="flex flex-col h-auto py-3">
                    <BarChart3Icon className="h-5 w-5 mb-1" />
                    <span className="text-xs">Analytics</span>
                  </Button>
                  
                  <Button variant="outline" className="flex flex-col h-auto py-3">
                    <BellIcon className="h-5 w-5 mb-1" />
                    <span className="text-xs">Promotions</span>
                  </Button>
                </div>
                
                {/* Store Products */}
                <h3 className="text-lg font-medium mb-3">My Products</h3>
                <div className="space-y-3">
                  {userProducts.slice(0, 2).map(product => (
                    <Card key={product.id} className="overflow-hidden">
                      <div className="flex">
                        <div className="w-20 h-20 bg-surface-light overflow-hidden">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 p-3">
                          <h4 className="font-medium text-sm">{product.name}</h4>
                          <div className="flex justify-between items-center mt-1">
                            <span className="font-bold">{product.price} tokens</span>
                            <span className="text-xs text-muted-foreground">Stock: {product.stock}</span>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <div className="flex items-center text-xs">
                              <StarIcon className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
                              <span>{product.rating}</span>
                            </div>
                            <Button size="sm" variant="outline" className="h-7">
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                  
                  <Button variant="outline" className="w-full">
                    View All Products
                  </Button>
                </div>
                
                {/* Recent Orders */}
                <h3 className="text-lg font-medium mb-3 mt-6">Recent Orders</h3>
                <div className="space-y-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-base">Order #38291</CardTitle>
                        <Badge>Processing</Badge>
                      </div>
                      <CardDescription>July 15, 2023 • 1 item</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex justify-between text-sm">
                        <span>Customer: CryptoFan123</span>
                        <span className="font-bold">600 tokens</span>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-base">Order #38245</CardTitle>
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                          Completed
                        </Badge>
                      </div>
                      <CardDescription>July 12, 2023 • 2 items</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex justify-between text-sm">
                        <span>Customer: BlockchainMaster</span>
                        <span className="font-bold">1,250 tokens</span>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <StoreIcon className="h-16 w-16 text-primary/40" />
                </div>
                <h3 className="text-xl font-bold mb-2">Create Your Store</h3>
                <p className="text-muted-foreground text-center mb-6 max-w-xs">
                  Start selling products or services and earn tokens. Set up your store in minutes.
                </p>
                <Button 
                  onClick={() => setShowCreateStore(true)}
                  className="bg-gradient-to-r from-primary to-secondary text-white"
                >
                  Create Your Store
                </Button>
              </div>
            )}
          </TabsContent>
          
          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">My Orders</h3>
              <Select defaultValue="all">
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {userOrders.map(order => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-base">Order #{order.id.slice(-5)}</CardTitle>
                    <Badge 
                      variant={order.status === "delivered" ? "outline" : "default"}
                      className={order.status === "delivered" ? 
                        "bg-green-500/10 text-green-500 border-green-500/30" : undefined}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                  <CardDescription>
                    {order.createdAt.toLocaleDateString()} • {order.products.length} {order.products.length === 1 ? 'item' : 'items'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    {order.products.map((product, index) => {
                      const productData = [...appStoreProducts, ...userProducts].find(p => p.id === product.productId);
                      return productData ? (
                        <div key={index} className="flex items-center text-sm">
                          <div className="w-8 h-8 bg-surface-light rounded-md overflow-hidden mr-2">
                            <img src={productData.image} alt={productData.name} className="w-full h-full object-cover" />
                          </div>
                          <span className="flex-1">{productData.name}</span>
                          <span className="text-muted-foreground">x{product.quantity}</span>
                          <span className="font-medium ml-2">{product.price * product.quantity}</span>
                        </div>
                      ) : (
                        <div key={index} className="flex items-center text-sm">
                          <div className="w-8 h-8 bg-surface-light rounded-md overflow-hidden mr-2"></div>
                          <span className="flex-1">Product {product.productId.slice(-4)}</span>
                          <span className="text-muted-foreground">x{product.quantity}</span>
                          <span className="font-medium ml-2">{product.price * product.quantity}</span>
                        </div>
                      );
                    })}
                  </div>
                  
                  <Separator className="my-3" />
                  
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>{order.totalPrice} tokens</span>
                  </div>
                  
                  {order.shipping && (
                    <div className="mt-3 bg-surface-light p-2 rounded-lg">
                      <div className="flex items-start text-xs">
                        <TruckIcon className="h-4 w-4 mr-2 mt-0.5" />
                        <div>
                          <p>Shipping to: {order.shipping.address}</p>
                          {order.shipping.trackingNumber && (
                            <p className="mt-1">Tracking: {order.shipping.trackingNumber}</p>
                          )}
                          {order.shipping.estimatedDelivery && (
                            <p className="mt-1">Estimated delivery: {order.shipping.estimatedDelivery.toLocaleDateString()}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="w-full flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <MessageSquareIcon className="h-4 w-4 mr-1" />
                      Contact
                    </Button>
                    <Button size="sm" className="flex-1">
                      View Details
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
        
        {/* Shopping Cart Modal */}
        <AnimatePresence>
          {showCart && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50 flex items-end md:items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="bg-background rounded-t-xl md:rounded-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col"
              >
                <div className="flex justify-between items-center p-4 border-b">
                  <h2 className="text-xl font-bold">Your Cart</h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setShowCart(false)}
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
                
                {cart.length === 0 ? (
                  <div className="p-10 text-center">
                    <div className="w-16 h-16 mx-auto bg-surface-light rounded-full flex items-center justify-center mb-4">
                      <ShoppingCartIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
                    <p className="text-muted-foreground mb-4">Add some items to get started</p>
                    <Button onClick={() => setShowCart(false)}>
                      Continue Shopping
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {cart.map(item => {
                        const product = [...appStoreProducts, ...userProducts].find(p => p.id === item.productId);
                        return (
                          <div key={item.productId} className="flex items-center">
                            <div className="w-16 h-16 bg-surface-light rounded-lg overflow-hidden mr-3">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{item.name}</h4>
                              <div className="flex justify-between items-center mt-1">
                                <div className="flex items-center">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="h-7 w-7 p-0"
                                    onClick={() => updateCartItemQuantity(item.productId, item.quantity - 1)}
                                  >
                                    <span>-</span>
                                  </Button>
                                  <span className="mx-2">{item.quantity}</span>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="h-7 w-7 p-0"
                                    onClick={() => updateCartItemQuantity(item.productId, item.quantity + 1)}
                                  >
                                    <span>+</span>
                                  </Button>
                                </div>
                                <div className="text-right">
                                  <div className="font-bold">{item.price * item.quantity}</div>
                                  <button 
                                    className="text-xs text-red-500"
                                    onClick={() => removeFromCart(item.productId)}
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="p-4 border-t">
                      <div className="flex justify-between mb-2">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">{cartTotal} tokens</span>
                      </div>
                      <div className="flex justify-between mb-4">
                        <span className="text-muted-foreground">Platform fee (5%)</span>
                        <span className="font-medium">{Math.round(cartTotal * 0.05)} tokens</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold mb-4">
                        <span>Total</span>
                        <span>{cartTotal + Math.round(cartTotal * 0.05)} tokens</span>
                      </div>
                      <Button 
                        className="w-full bg-gradient-to-r from-primary to-secondary text-white"
                        onClick={checkout}
                      >
                        Checkout
                      </Button>
                    </div>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Create Store Modal */}
        <AnimatePresence>
          {showCreateStore && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-background rounded-xl w-full max-w-md overflow-hidden"
              >
                <div className="p-4 border-b">
                  <h2 className="text-xl font-bold">Create Your Store</h2>
                  <p className="text-sm text-muted-foreground">Fill in the details to start selling</p>
                </div>
                
                <div className="p-4 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Store Name</label>
                    <Input placeholder="e.g., Crypto Collectibles" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Store Description</label>
                    <textarea 
                      className="w-full min-h-[100px] p-3 rounded-md border bg-background"
                      placeholder="Describe what you'll be selling..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Store Theme</label>
                    <Select defaultValue="default">
                      <SelectTrigger>
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="crypto">Crypto</SelectItem>
                        <SelectItem value="minimalist">Minimalist</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="colorful">Colorful</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="bg-surface-light p-4 rounded-lg">
                    <div className="flex items-start">
                      <div className="bg-primary/20 p-2 rounded-md mr-3">
                        <CoinsIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Store Creation Fee</h4>
                        <p className="text-sm text-muted-foreground">50 on-chain tokens will be deducted from your wallet</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border-t flex justify-end gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => setShowCreateStore(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => createNewStore("My Crypto Store", "Selling crypto collectibles and merchandise")}
                    disabled={loadingCreateStore}
                  >
                    {loadingCreateStore ? "Creating..." : "Create Store"}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default Store; 