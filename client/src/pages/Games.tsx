import React, { useState, useEffect } from "react";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { useLanguage } from "@/context/LanguageContext";
import { useUser } from "@/hooks/useUser";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrophyIcon, 
  Gamepad2Icon, 
  CoinsIcon, 
  ClockIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  XIcon,
  HelpCircleIcon,
  StarIcon,
  UsersIcon,
  GiftIcon,
  PlusIcon,
  FlameIcon,
  ShieldIcon,
  Share2Icon,
  BadgeIcon,
  LightbulbIcon,
  WalletIcon,
  BarChart2,
  CalendarIcon,
  HeartIcon,
  MessageCircleIcon,
  SparklesIcon,
  ShoppingBagIcon,
  BoxIcon,
  TagIcon,
  CrownIcon
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
import { Progress } from "@/components/ui/progress";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

// CSS Animations are now defined in global.css
// Define animation classes that can be applied to components
// .float-animation { animation: float 3s ease-in-out infinite; }
// .pulse-animation { animation: pulse 2s ease-in-out infinite; }
// .glow-animation { animation: glow 2s ease-in-out infinite; }

// Define types for our enhanced gaming system
type Rank = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
type GameDifficulty = 'easy' | 'medium' | 'hard' | 'expert';
type RewardTier = 'common' | 'rare' | 'epic' | 'legendary';
type ChallengeStatus = 'active' | 'completed' | 'locked';
type TokenType = 'game' | 'crypto';

interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: number;
  rewardType: TokenType;
  status: ChallengeStatus;
  progress?: number;
  total?: number;
  expires?: number; // timestamp
  icon: React.ReactNode;
  tier: RewardTier;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  date?: Date;
  reward: number;
  tier: RewardTier;
}

interface GameStats {
  bestScore: number;
  gamesPlayed: number;
  winRate: number;
  tokensEarned: number;
  rank: Rank;
  rankProgress: number;
  currentStreak: number;
}

interface Game {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  iconText?: string;
  reward: number;
  rewardType: TokenType;
  difficulty: GameDifficulty;
  color: string;
  unlocked: boolean;
  comingSoon?: boolean;
  featured?: boolean;
}

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar?: string;
  score: number;
  rank: number;
  isPlayer?: boolean;
}

interface PowerUp {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  price: number;
  duration: string;
  owned: number;
}

interface StoreItem {
  id: string;
  name: string;
  description: string;
  type: 'powerup' | 'cosmetic' | 'booster';
  icon: React.ReactNode;
  price: number;
  priceType: TokenType;
  rarity: RewardTier;
  owned: boolean;
  discount?: number;
  limited?: boolean;
}

// Create our mock data for the enhanced game system
const challenges: Challenge[] = [
  {
    id: 'daily-challenge-1',
    title: 'Daily Login',
    description: 'Log in to the app today',
    reward: 10,
    rewardType: 'game',
    status: 'completed',
    progress: 1,
    total: 1,
    icon: <CalendarIcon />,
    tier: 'common'
  },
  {
    id: 'daily-challenge-2',
    title: 'Crypto Expert',
    description: 'Answer 10 logo quiz questions correctly',
    reward: 25,
    rewardType: 'game',
    status: 'active',
    progress: 6,
    total: 10,
    icon: <LightbulbIcon />,
    tier: 'rare'
  },
  {
    id: 'daily-challenge-3',
    title: 'Social Butterfly',
    description: 'Invite 3 friends to play games',
    reward: 50,
    rewardType: 'game',
    status: 'active',
    progress: 1,
    total: 3,
    icon: <Share2Icon />,
    tier: 'epic'
  },
  {
    id: 'weekly-challenge-1',
    title: 'Weekly Champion',
    description: 'Win 5 games in a row',
    reward: 100,
    rewardType: 'game',
    status: 'active',
    progress: 3,
    total: 5,
    expires: Date.now() + 3 * 24 * 60 * 60 * 1000, // 3 days
    icon: <FlameIcon />,
    tier: 'legendary'
  },
  {
    id: 'special-challenge-1',
    title: 'Crypto Season',
    description: 'Earn 1000 points in the new season of crypto games',
    reward: 0.01,
    rewardType: 'crypto',
    status: 'locked',
    progress: 0,
    total: 1000,
    icon: <TrophyIcon />,
    tier: 'legendary'
  }
];

const achievements: Achievement[] = [
  {
    id: 'achievement-1',
    title: 'First Victory',
    description: 'Win your first game',
    icon: <TrophyIcon />,
    unlocked: true,
    date: new Date(2023, 5, 15),
    reward: 25,
    tier: 'common'
  },
  {
    id: 'achievement-2',
    title: 'Quiz Master',
    description: 'Score 100 points in Logo Quiz',
    icon: <BadgeIcon />,
    unlocked: true,
    date: new Date(2023, 6, 22),
    reward: 50,
    tier: 'rare'
  },
  {
    id: 'achievement-3',
    title: 'Perfect Game',
    description: 'Complete a game without any wrong answers',
    icon: <CheckIcon />,
    unlocked: false,
    reward: 75,
    tier: 'epic'
  },
  {
    id: 'achievement-4',
    title: 'Crypto Legend',
    description: 'Reach Diamond rank in any game',
    icon: <CrownIcon />,
    unlocked: false,
    reward: 250,
    tier: 'legendary'
  }
];

const gamesList: Game[] = [
  {
    id: "logo-quiz",
    name: "Crypto Logo Quiz",
    description: "Test your knowledge of crypto logos and earn tokens",
    icon: <LightbulbIcon />,
    iconText: "₿",
    reward: 25,
    rewardType: 'game',
    difficulty: "easy",
    color: "from-primary to-secondary",
    unlocked: true,
    featured: true
  },
  {
    id: "price-guess",
    name: "Price Predictor",
    description: "Guess if crypto prices will go up or down",
    icon: <BarChart2 />,
    iconText: "📊",
    reward: 40,
    rewardType: 'game',
    difficulty: "medium",
    color: "from-blue-500 to-cyan-500",
    unlocked: true
  },
  {
    id: "memory-match",
    name: "Crypto Pairs",
    description: "Match pairs of crypto cards before time runs out",
    icon: <Gamepad2Icon />,
    iconText: "🎮",
    reward: 60,
    rewardType: 'game',
    difficulty: "hard",
    color: "from-green-500 to-teal-500",
    unlocked: true
  },
  {
    id: "blockchain-puzzle",
    name: "Blockchain Puzzle",
    description: "Connect the blocks to form the longest chain",
    icon: <BoxIcon />,
    reward: 75,
    rewardType: 'game',
    difficulty: "hard",
    color: "from-orange-500 to-red-500",
    unlocked: false
  },
  {
    id: "crypto-millionaire",
    name: "Crypto Millionaire",
    description: "Trade virtual assets to become a millionaire",
    icon: <TrophyIcon />,
    reward: 100,
    rewardType: 'crypto',
    difficulty: "expert",
    color: "from-violet-500 to-purple-500",
    unlocked: false,
    comingSoon: true
  }
];

const leaderboard: LeaderboardEntry[] = [
  { id: 'user1', name: 'CryptoKing', score: 9850, rank: 1, avatar: '/assets/avatar1.png' },
  { id: 'user2', name: 'BlockchainMaster', score: 8920, rank: 2, avatar: '/assets/avatar2.png' },
  { id: 'user3', name: 'TokenHunter', score: 8750, rank: 3, avatar: '/assets/avatar3.png' },
  { id: 'user4', name: 'CryptoBull', score: 7600, rank: 4 },
  { id: 'currentUser', name: 'You', score: 7200, rank: 5, isPlayer: true, avatar: '/assets/avatar-user.png' },
  { id: 'user6', name: 'CoinCollector', score: 6800, rank: 6 },
  { id: 'user7', name: 'MoonBot', score: 6500, rank: 7 },
  { id: 'user8', name: 'SatoshiFan', score: 6200, rank: 8 },
  { id: 'user9', name: 'CryptoNinja', score: 5900, rank: 9 },
  { id: 'user10', name: 'EtherExpert', score: 5600, rank: 10 }
];

const storeItems: StoreItem[] = [
  {
    id: 'item1',
    name: 'Extra Lives',
    description: 'Get 3 additional lives in any game',
    type: 'powerup',
    icon: <HeartIcon />,
    price: 50,
    priceType: 'game',
    rarity: 'common',
    owned: false
  },
  {
    id: 'item2',
    name: 'Time Booster',
    description: 'Get 30 extra seconds in timed games',
    type: 'powerup',
    icon: <ClockIcon />,
    price: 75,
    priceType: 'game',
    rarity: 'rare',
    owned: true,
    discount: 25
  },
  {
    id: 'item3',
    name: 'Golden Theme',
    description: 'Premium gold theme for your game boards',
    type: 'cosmetic',
    icon: <SparklesIcon />,
    price: 200,
    priceType: 'game',
    rarity: 'epic',
    owned: false
  },
  {
    id: 'item4',
    name: 'Tournament Entry',
    description: 'Enter the weekly high-stakes tournament',
    type: 'booster',
    icon: <TrophyIcon />,
    price: 0.01,
    priceType: 'crypto',
    rarity: 'legendary',
    owned: false,
    limited: true
  }
];

// Logo game configuration (unchanged)
const logoOptions = [
  { name: "Bitcoin", logo: "₿" },
  { name: "Ethereum", logo: "Ξ" },
  { name: "Litecoin", logo: "Ł" },
  { name: "Ripple", logo: "✗" },
  { name: "Monero", logo: "ɱ" },
  { name: "Binance", logo: "Ƀ" },
  { name: "Dogecoin", logo: "Ð" },
  { name: "Cardano", logo: "₳" },
  { name: "Polkadot", logo: "●" },
  { name: "Tether", logo: "₮" }
];

const Games: React.FC = () => {
  const { t, dir } = useLanguage();
  const { user } = useUser();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("games");
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [showGameOver, setShowGameOver] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showRewardAnimation, setShowRewardAnimation] = useState(false);
  const [earnedReward, setEarnedReward] = useState({ amount: 0, type: 'game' as TokenType });
  
  // Game stats for the current user
  const [gameStats, setGameStats] = useState<GameStats>({
    bestScore: 860,
    gamesPlayed: 42,
    winRate: 68,
    tokensEarned: 1250,
    rank: 'gold',
    rankProgress: 75,
    currentStreak: 3
  });
  
  // State for the logo game
  const [logoGameState, setLogoGameState] = useState({
    score: 0,
    round: 0,
    maxRounds: 10,
    timeLeft: 10,
    isActive: false,
    currentLogo: { name: "", logo: "" },
    options: [] as string[],
    correct: 0,
    incorrect: 0,
    streak: 0
  });
  
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Get rank icon based on rank
  const getRankIcon = (rank: Rank) => {
    switch (rank) {
      case 'bronze': return <Badge variant="outline" className="bg-amber-700/20 text-amber-700 border-amber-700/50">Bronze</Badge>;
      case 'silver': return <Badge variant="outline" className="bg-slate-400/20 text-slate-400 border-slate-400/50">Silver</Badge>;
      case 'gold': return <Badge variant="outline" className="bg-yellow-500/20 text-yellow-500 border-yellow-500/50">Gold</Badge>;
      case 'platinum': return <Badge variant="outline" className="bg-cyan-400/20 text-cyan-400 border-cyan-400/50">Platinum</Badge>;
      case 'diamond': return <Badge variant="outline" className="bg-violet-500/20 text-violet-500 border-violet-500/50">Diamond</Badge>;
      default: return <Badge variant="outline" className="bg-slate-500/20 text-slate-500 border-slate-500/50">Unranked</Badge>;
    }
  };
  
  // Get color for reward tier
  const getTierColor = (tier: RewardTier) => {
    switch (tier) {
      case 'common': return 'text-slate-400';
      case 'rare': return 'text-blue-500';
      case 'epic': return 'text-purple-500';
      case 'legendary': return 'text-orange-500';
      default: return 'text-slate-400';
    }
  };
  
  // Prepare a new logo quiz round
  const prepareLogoRound = () => {
    const randomIndex = Math.floor(Math.random() * logoOptions.length);
    const correctLogo = logoOptions[randomIndex];
    
    // Generate 3 random options excluding the correct one
    const shuffled = logoOptions
      .filter(logo => logo.name !== correctLogo.name)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(logo => logo.name);
    
    // Add correct answer and shuffle
    shuffled.push(correctLogo.name);
    shuffled.sort(() => 0.5 - Math.random());
    
    setLogoGameState(prev => ({
      ...prev,
      currentLogo: correctLogo,
      options: shuffled,
      timeLeft: 10
    }));
  };

  // Start the logo game
  const startLogoGame = () => {
    setLogoGameState({
      score: 0,
      round: 1,
      maxRounds: 10,
      timeLeft: 10,
      isActive: true,
      currentLogo: { name: "", logo: "" },
      options: [],
      correct: 0,
      incorrect: 0,
      streak: 0
    });
    
    setActiveGame("logo-quiz");
    setShowGameOver(false);
    prepareLogoRound();

    // Start timer
    const interval = setInterval(() => {
      setLogoGameState(prev => {
        if (prev.timeLeft <= 1) {
          // Time's up, move to next round or end game
          handleAnswer("");
          return prev;
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
    
    setTimerInterval(interval);
  };

  // Handle user answer
  const handleAnswer = (answer: string) => {
    if (!logoGameState.isActive) return;
    
    const isCorrect = answer === logoGameState.currentLogo.name;
    const newStreak = isCorrect ? logoGameState.streak + 1 : 0;
    const streakBonus = Math.floor(newStreak / 3) * 5;
    const pointsEarned = isCorrect ? 10 + streakBonus : 0;
    
    if (isCorrect) {
      toast({
        title: t('games.correct'),
        description: `+${pointsEarned} ${t('games.points')}`,
        variant: "default",
      });
    } else if (answer !== "") { // Only show wrong answer toast if they actually selected (not timeout)
      toast({
        title: t('games.wrong'),
        description: t('games.correct.answer', { answer: logoGameState.currentLogo.name }),
        variant: "destructive",
      });
    }
    
    // Check if game is over
    if (logoGameState.round >= logoGameState.maxRounds) {
      endGame();
      return;
    }
    
    // Prepare next round
    setLogoGameState(prev => ({
      ...prev,
      score: prev.score + pointsEarned,
      round: prev.round + 1,
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      incorrect: isCorrect ? prev.incorrect : prev.incorrect + 1,
      streak: newStreak
    }));
    
    prepareLogoRound();
  };

  // End the game
  const endGame = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    setLogoGameState(prev => ({
      ...prev,
      isActive: false
    }));
    
    setShowGameOver(true);
    
    // Convert score to tokens and update achievements/challenges
    const tokensEarned = Math.floor(logoGameState.score / 10);
    setEarnedReward({ amount: tokensEarned, type: 'game' });
    
    // Show reward animation
    if (tokensEarned > 0) {
      setShowRewardAnimation(true);
      setTimeout(() => {
        setShowRewardAnimation(false);
      }, 3000);
    }
    
    // Update game stats
    setGameStats(prev => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
      tokensEarned: prev.tokensEarned + tokensEarned,
      bestScore: Math.max(prev.bestScore, logoGameState.score)
    }));
    
    // Update challenges progress
    // This would typically be handled by your state management system
    
    toast({
      title: t('games.rewards.earned'),
      description: `${tokensEarned} ${t('games.tokens')}`,
      variant: "default",
    });
  };

  // Exit current game
  const exitGame = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setActiveGame(null);
    setShowGameOver(false);
  };
  
  // Claim a reward from a challenge
  const claimChallengeReward = (challenge: Challenge) => {
    if (challenge.status !== 'completed') return;
    
    setEarnedReward({ 
      amount: challenge.reward, 
      type: challenge.rewardType 
    });
    setShowRewardAnimation(true);
    
    setTimeout(() => {
      setShowRewardAnimation(false);
    }, 3000);
    
    toast({
      title: "Reward Claimed!",
      description: `You earned ${challenge.reward} ${challenge.rewardType === 'game' ? 'Game Tokens' : 'Crypto Tokens'}`,
      variant: "default",
    });
    
    // In a real app, you would update the challenge state in your database
  };
  
  // Buy an item from the store
  const buyStoreItem = (item: StoreItem) => {
    if (item.owned) {
      toast({
        title: "Item Already Owned",
        description: "You already own this item",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, you would check the user's balance and complete the transaction
    toast({
      title: "Item Purchased!",
      description: `You bought ${item.name}`,
      variant: "default",
    });
  };

  useEffect(() => {
    return () => {
      // Cleanup timer when component unmounts
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);
  
  // Main games dashboard view
  return (
    <div className="min-h-screen pb-20 bg-background" dir={dir()}>
      <TopBar />
      
      <main className="container max-w-md mx-auto pt-20 px-4">
        {/* Header with player stats */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-2xl font-bold neon-text-primary"
            >
              {t('games.title')}
            </motion.h1>
            
            <Link href="/wallet">
              <Button variant="outline" size="sm" className="gap-2">
                <CoinsIcon className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">{gameStats.tokensEarned}</span>
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center mt-2">
            {getRankIcon(gameStats.rank)}
            <div className="ml-2 flex-1">
              <div className="h-2 bg-surface-light rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-secondary"
                  style={{ width: `${gameStats.rankProgress}%` }}
                ></div>
              </div>
            </div>
            <span className="text-xs text-muted-foreground ml-2">{gameStats.rankProgress}%</span>
          </div>
        </div>
        
        {/* Tabs Interface */}
        <Tabs defaultValue="games" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 h-10">
            <TabsTrigger value="games" className="text-xs">
              <Gamepad2Icon className="h-4 w-4 mr-1" />
              Games
            </TabsTrigger>
            <TabsTrigger value="challenges" className="text-xs">
              <TrophyIcon className="h-4 w-4 mr-1" />
              Challenges
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="text-xs">
              <BarChart2 className="h-4 w-4 mr-1" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="store" className="text-xs">
              <ShoppingBagIcon className="h-4 w-4 mr-1" />
              Store
            </TabsTrigger>
          </TabsList>
          
          {/* Games Tab */}
          <TabsContent value="games" className="space-y-4">
            {/* Featured Game Card */}
            {gamesList.filter(game => game.featured).map(game => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => game.id === "logo-quiz" ? startLogoGame() : {}}
                className="relative overflow-hidden"
              >
                <Card className="border-none bg-transparent">
                  <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-20 rounded-xl`}></div>
                  <CardHeader className="pb-2">
                    <Badge className="w-fit mb-2 bg-background/30 backdrop-blur-sm">Featured</Badge>
                    <CardTitle className="text-xl flex items-center gap-2">
                      {game.iconText && (
                        <span className="bg-background/25 w-8 h-8 flex items-center justify-center rounded-lg text-lg backdrop-blur-sm">
                          {game.iconText}
                        </span>
                      )}
                      {game.name}
                    </CardTitle>
                    <CardDescription>{game.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <div className="bg-background/25 backdrop-blur-sm p-2 rounded-lg text-center">
                        <p className="text-xs text-muted-foreground">Difficulty</p>
                        <p className="text-sm font-medium capitalize">{game.difficulty}</p>
                      </div>
                      <div className="bg-background/25 backdrop-blur-sm p-2 rounded-lg text-center">
                        <p className="text-xs text-muted-foreground">Reward</p>
                        <p className="text-sm font-medium">{game.reward} {game.rewardType === 'game' ? 'GT' : 'CT'}</p>
                      </div>
                      <div className="bg-background/25 backdrop-blur-sm p-2 rounded-lg text-center">
                        <p className="text-xs text-muted-foreground">Best Score</p>
                        <p className="text-sm font-medium">{gameStats.bestScore}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-gradient-to-r from-primary to-secondary">
                      {game.id === "logo-quiz" ? "Play Now" : "Coming Soon"}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
            
            {/* Game Grid */}
            <div className="grid grid-cols-2 gap-3">
              {gamesList.filter(game => !game.featured).map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: index * 0.1 } }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => game.unlocked && game.id === "logo-quiz" ? startLogoGame() : {}}
                  className={`relative overflow-hidden ${!game.unlocked ? 'opacity-70' : ''}`}
                >
                  <Card className="border-none">
                    <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-10 rounded-xl`}></div>
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${game.color} flex items-center justify-center`}>
                          {game.iconText ? (
                            <span className="text-lg text-white">{game.iconText}</span>
                          ) : (
                            <div className="text-white">{game.icon}</div>
                          )}
                        </div>
                        {game.comingSoon && (
                          <Badge variant="outline" className="text-xs bg-orange-500/10 text-orange-500 border-orange-500/30">
                            Soon
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-base mt-2">{game.name}</CardTitle>
                    </CardHeader>
                    <CardFooter className="pt-0 pb-4 px-4">
                      <div className="flex items-center justify-between w-full text-xs">
                        <Badge variant="outline" className="font-normal capitalize">
                          {game.difficulty}
                        </Badge>
                        <span className="flex items-center">
                          <CoinsIcon className="h-3 w-3 mr-1 text-yellow-500" />
                          {game.reward}
                        </span>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
          
          {/* Challenges Tab */}
          <TabsContent value="challenges" className="space-y-4">
            {/* Daily Challenges */}
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2 text-primary" />
                Daily Challenges
              </h3>
              
              <div className="space-y-3">
                {challenges.filter(c => !c.expires || c.expires > Date.now()).map((challenge) => (
                  <Card key={challenge.id} className="overflow-hidden">
                    <CardHeader className="pb-2 flex flex-row items-start gap-4">
                      <div className={`rounded-lg w-12 h-12 flex items-center justify-center ${
                        challenge.tier === 'common' ? 'bg-slate-500/20' :
                        challenge.tier === 'rare' ? 'bg-blue-500/20' :
                        challenge.tier === 'epic' ? 'bg-purple-500/20' :
                        'bg-orange-500/20'
                      } ${getTierColor(challenge.tier)}`}>
                        {challenge.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <CardTitle className="text-base">{challenge.title}</CardTitle>
                          <Badge className={`
                            ${challenge.status === 'completed' ? 'bg-green-500/20 text-green-500 border-green-500/30' : 
                              challenge.status === 'active' ? 'bg-blue-500/20 text-blue-500 border-blue-500/30' : 
                              'bg-slate-500/20 text-slate-500 border-slate-500/30'}
                          `}>
                            {challenge.status === 'completed' ? 'Completed' : 
                             challenge.status === 'active' ? 'Active' : 
                             'Locked'}
                          </Badge>
                        </div>
                        <CardDescription>{challenge.description}</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      {(challenge.progress !== undefined && challenge.total !== undefined) && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Progress</span>
                            <span>{challenge.progress}/{challenge.total}</span>
                          </div>
                          <Progress value={(challenge.progress / challenge.total) * 100} className="h-1.5" />
                        </div>
                      )}
                      
                      {challenge.expires && (
                        <p className="text-xs text-muted-foreground mt-2">
                          <ClockIcon className="inline-block h-3 w-3 mr-1" />
                          Expires in {Math.ceil((challenge.expires - Date.now()) / (1000 * 60 * 60 * 24))} days
                        </p>
                      )}
                    </CardContent>
                    <CardFooter className="pt-0">
                      <div className="flex justify-between items-center w-full">
                        <div className="flex items-center">
                          <CoinsIcon className="h-4 w-4 mr-1 text-yellow-500" />
                          <span className="font-medium">{challenge.reward}</span>
                          <span className="text-xs text-muted-foreground ml-1">
                            {challenge.rewardType === 'game' ? 'Game Tokens' : 'Crypto Tokens'}
                          </span>
                        </div>
                        
                        <Button
                          size="sm"
                          variant={challenge.status === 'completed' ? 'default' : 'outline'}
                          disabled={challenge.status !== 'completed'}
                          onClick={() => challenge.status === 'completed' && claimChallengeReward(challenge)}
                        >
                          {challenge.status === 'completed' ? 'Claim' : 'In Progress'}
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
            
            {/* Achievement System */}
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <BadgeIcon className="h-5 w-5 mr-2 text-primary" />
                Achievements
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {achievements.map((achievement) => (
                  <Card 
                    key={achievement.id} 
                    className={`overflow-hidden ${!achievement.unlocked ? 'opacity-60' : ''}`}
                  >
                    <CardHeader className="p-4 text-center">
                      <div className={`mx-auto rounded-full w-16 h-16 flex items-center justify-center ${
                        achievement.unlocked 
                          ? `${achievement.tier === 'common' ? 'bg-slate-500/20' : 
                             achievement.tier === 'rare' ? 'bg-blue-500/20' : 
                             achievement.tier === 'epic' ? 'bg-purple-500/20' : 
                             'bg-orange-500/20'} ${getTierColor(achievement.tier)}`
                          : 'bg-surface-light'
                      }`}>
                        {achievement.icon}
                      </div>
                      <CardTitle className="mt-2 text-base">{achievement.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pt-0 pb-4 text-center">
                      <p className="text-xs text-muted-foreground mb-3">{achievement.description}</p>
                      {achievement.unlocked ? (
                        <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                          Unlocked {achievement.date && achievement.date.toLocaleDateString()}
                        </Badge>
                      ) : (
                        <Badge variant="outline">Locked</Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
          
          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <TrophyIcon className="h-5 w-5 mr-2 text-yellow-500" />
                  Crypto Logo Quiz Leaderboard
                </CardTitle>
                <CardDescription>This week's top players</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="py-1">
                  {leaderboard.map((entry, index) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: entry.isPlayer ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center p-3 ${entry.isPlayer ? 'bg-primary/5 border-l-2 border-primary' : ''}`}
                    >
                      <div className="w-8 text-center font-bold">
                        {entry.rank === 1 && <span className="text-yellow-500">🥇</span>}
                        {entry.rank === 2 && <span className="text-slate-300">🥈</span>}
                        {entry.rank === 3 && <span className="text-amber-700">🥉</span>}
                        {entry.rank > 3 && <span className="text-muted-foreground">{entry.rank}</span>}
                      </div>
                      
                      <div className="w-8 h-8 rounded-full bg-surface-light overflow-hidden flex items-center justify-center mr-3">
                        {entry.avatar ? (
                          <img src={entry.avatar} alt={entry.name} className="w-full h-full object-cover" />
                        ) : (
                          <UsersIcon className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <p className={`font-medium ${entry.isPlayer ? 'text-primary' : ''}`}>
                          {entry.name}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold">{entry.score}</p>
                        <p className="text-xs text-muted-foreground">points</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pb-4">
                <div className="w-full">
                  <p className="text-xs text-muted-foreground text-center mb-3">
                    Win rewards by reaching the top 10!
                  </p>
                  <Button variant="outline" className="w-full">
                    <Share2Icon className="h-4 w-4 mr-2" />
                    Share Your Score
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Store Tab */}
          <TabsContent value="store" className="space-y-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium">Game Shop</h3>
              <Link href="/wallet">
                <Button variant="outline" size="sm" className="gap-2">
                  <CoinsIcon className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">{gameStats.tokensEarned}</span>
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {storeItems.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative"
                >
                  <Card className={`overflow-hidden ${item.owned ? 'border-green-500/50' : ''}`}>
                    {item.discount && (
                      <div className="absolute -right-2 -top-2 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-full rotate-12">
                        -{item.discount}%
                      </div>
                    )}
                    
                    {item.limited && (
                      <div className="absolute left-2 top-2 bg-orange-500/80 text-white text-xs py-0.5 px-2 rounded-full">
                        Limited
                      </div>
                    )}
                    
                    <CardHeader className="p-3 text-center pb-0">
                      <div className={`mx-auto rounded-lg w-14 h-14 flex items-center justify-center ${
                        item.rarity === 'common' ? 'bg-slate-500/20' :
                        item.rarity === 'rare' ? 'bg-blue-500/20' :
                        item.rarity === 'epic' ? 'bg-purple-500/20' :
                        'bg-orange-500/20'
                      } ${getTierColor(item.rarity)}`}>
                        {item.icon}
                      </div>
                      <CardTitle className="mt-2 text-base">{item.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0 pb-2">
                      <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                    </CardContent>
                    <CardFooter className="p-3 pt-0 flex justify-between">
                      <div className="flex items-center">
                        {item.priceType === 'game' ? (
                          <CoinsIcon className="h-4 w-4 mr-1 text-yellow-500" />
                        ) : (
                          <WalletIcon className="h-4 w-4 mr-1 text-primary" />
                        )}
                        <span className="font-medium">{item.price}</span>
                      </div>
                      
                      <Button
                        size="sm"
                        variant={item.owned ? 'outline' : 'default'}
                        disabled={item.owned}
                        onClick={() => !item.owned && buyStoreItem(item)}
                      >
                        {item.owned ? 'Owned' : 'Buy'}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Reward Animation Overlay */}
      <AnimatePresence>
        {showRewardAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ 
                scale: [0.5, 1.2, 1],
                opacity: [0, 1, 1]
              }}
              transition={{ duration: 0.8, times: [0, 0.6, 1] }}
              className="bg-gradient-to-r from-primary to-secondary p-10 rounded-2xl flex flex-col items-center"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0] 
                }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
              >
                <GiftIcon className="h-16 w-16 text-white mb-4" />
              </motion.div>
              <motion.h2
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                className="text-2xl font-bold text-white mb-2"
              >
                Reward Earned!
              </motion.h2>
              <p className="text-white/90 mb-4">You've earned:</p>
              <div className="flex items-center bg-white/20 px-6 py-3 rounded-lg">
                <span className="text-3xl font-bold text-white mr-2">+{earnedReward.amount}</span>
                <span className="text-white/90">{earnedReward.type === 'game' ? 'Game Tokens' : 'Crypto Tokens'}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <BottomNav />
    </div>
  );
};

export default Games;