import {
  users, User, InsertUser,
  miningStations, MiningStation, InsertMiningStation,
  cryptos, Crypto, InsertCrypto,
  holdings, Holding, InsertHolding,
  posts, Post, InsertPost,
  achievements, Achievement, InsertAchievement,
  userAchievements, UserAchievement, InsertUserAchievement,
  tradingBots, TradingBot, InsertTradingBot,
  challenges, Challenge, InsertChallenge,
  userChallenges, UserChallenge, InsertUserChallenge
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  
  // Mining operations
  getMiningStation(userId: number): Promise<MiningStation | undefined>;
  createMiningStation(station: InsertMiningStation): Promise<MiningStation>;
  updateMiningStation(id: number, stationData: Partial<MiningStation>): Promise<MiningStation | undefined>;
  
  // Crypto operations
  getAllCryptos(): Promise<Crypto[]>;
  getCrypto(id: number): Promise<Crypto | undefined>;
  getCryptoBySymbol(symbol: string): Promise<Crypto | undefined>;
  createCrypto(crypto: InsertCrypto): Promise<Crypto>;
  updateCrypto(id: number, cryptoData: Partial<Crypto>): Promise<Crypto | undefined>;
  
  // Holdings operations
  getHoldings(userId: number): Promise<Holding[]>;
  getHolding(userId: number, cryptoId: number): Promise<Holding | undefined>;
  createHolding(holding: InsertHolding): Promise<Holding>;
  updateHolding(id: number, holdingData: Partial<Holding>): Promise<Holding | undefined>;
  
  // Posts operations
  getAllPosts(): Promise<Post[]>;
  getUserPosts(userId: number): Promise<Post[]>;
  getPost(id: number): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: number, postData: Partial<Post>): Promise<Post | undefined>;
  
  // Achievement operations
  getAllAchievements(): Promise<Achievement[]>;
  getAchievement(id: number): Promise<Achievement | undefined>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  
  // User Achievement operations
  getUserAchievements(userId: number): Promise<UserAchievement[]>;
  createUserAchievement(userAchievement: InsertUserAchievement): Promise<UserAchievement>;
  
  // Trading Bot operations
  getUserTradingBots(userId: number): Promise<TradingBot[]>;
  getTradingBot(id: number): Promise<TradingBot | undefined>;
  createTradingBot(bot: InsertTradingBot): Promise<TradingBot>;
  updateTradingBot(id: number, botData: Partial<TradingBot>): Promise<TradingBot | undefined>;
  
  // Challenge operations
  getAllChallenges(): Promise<Challenge[]>;
  getChallenge(id: number): Promise<Challenge | undefined>;
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;
  
  // User Challenge operations
  getUserChallenges(userId: number): Promise<UserChallenge[]>;
  getUserChallenge(userId: number, challengeId: number): Promise<UserChallenge | undefined>;
  createUserChallenge(userChallenge: InsertUserChallenge): Promise<UserChallenge>;
  updateUserChallenge(id: number, challengeData: Partial<UserChallenge>): Promise<UserChallenge | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private miningStations: Map<number, MiningStation>;
  private cryptos: Map<number, Crypto>;
  private holdings: Map<number, Holding>;
  private posts: Map<number, Post>;
  private achievements: Map<number, Achievement>;
  private userAchievements: Map<number, UserAchievement>;
  private tradingBots: Map<number, TradingBot>;
  private challenges: Map<number, Challenge>;
  private userChallenges: Map<number, UserChallenge>;
  
  private currentUserId: number;
  private currentMiningStationId: number;
  private currentCryptoId: number;
  private currentHoldingId: number;
  private currentPostId: number;
  private currentAchievementId: number;
  private currentUserAchievementId: number;
  private currentTradingBotId: number;
  private currentChallengeId: number;
  private currentUserChallengeId: number;

  constructor() {
    this.users = new Map();
    this.miningStations = new Map();
    this.cryptos = new Map();
    this.holdings = new Map();
    this.posts = new Map();
    this.achievements = new Map();
    this.userAchievements = new Map();
    this.tradingBots = new Map();
    this.challenges = new Map();
    this.userChallenges = new Map();
    
    this.currentUserId = 1;
    this.currentMiningStationId = 1;
    this.currentCryptoId = 1;
    this.currentHoldingId = 1;
    this.currentPostId = 1;
    this.currentAchievementId = 1;
    this.currentUserAchievementId = 1;
    this.currentTradingBotId = 1;
    this.currentChallengeId = 1;
    this.currentUserChallengeId = 1;
    
    // Initialize with some demo data
    this.initializeDemoData();
  }
  
  private initializeDemoData() {
    // Add demo cryptocurrencies
    const demoCryptos = [
      { symbol: "BTC", name: "Bitcoin", currentPrice: 2824763, change24h: 820, iconClass: "ri-bit-coin-line" },
      { symbol: "ETH", name: "Ethereum", currentPrice: 184729, change24h: 450, iconClass: "ri-ethereum-line" },
      { symbol: "SOL", name: "Solana", currentPrice: 8754, change24h: -210, iconClass: "ri-currency-line" },
      { symbol: "DOGE", name: "Dogecoin", currentPrice: 1050, change24h: 320, iconClass: "ri-coin-line" },
      { symbol: "ADA", name: "Cardano", currentPrice: 4321, change24h: -150, iconClass: "ri-vip-diamond-line" },
    ];
    
    demoCryptos.forEach(crypto => {
      this.createCrypto(crypto);
    });
    
    // Add demo achievements
    const demoAchievements = [
      { title: "First Trade", description: "Complete your first trade", iconClass: "ri-trophy-line" },
      { title: "Top Trader", description: "Achieve 10% profit in a day", iconClass: "ri-vip-crown-line" },
      { title: "Mining Pro", description: "Upgrade mining station to level 5", iconClass: "ri-rocket-line" },
    ];
    
    demoAchievements.forEach(achievement => {
      this.createAchievement(achievement);
    });
    
    // Add demo challenges
    const demoChallenges = [
      { title: "Complete 3 trades", description: "Make 3 trades in the market", rewardGameTokens: 50, rewardTradeTokens: 0 },
      { title: "Earn 50 mining tokens", description: "Mine and collect 50 tokens", rewardGameTokens: 10, rewardTradeTokens: 1 },
      { title: "Share 1 post", description: "Create and share a post", rewardGameTokens: 25, rewardTradeTokens: 0 },
    ];
    
    demoChallenges.forEach(challenge => {
      this.createChallenge(challenge);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      level: 1,
      levelProgress: 0,
      gameTokens: 100,
      tradeTokens: 10,
      profileImageUrl: ""
    };
    this.users.set(id, user);
    
    // Create a mining station for the user
    await this.createMiningStation({
      userId: id,
      level: 1,
      power: 5
    });
    
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Mining operations
  async getMiningStation(userId: number): Promise<MiningStation | undefined> {
    return Array.from(this.miningStations.values()).find(
      (station) => station.userId === userId,
    );
  }
  
  async createMiningStation(station: InsertMiningStation): Promise<MiningStation> {
    const id = this.currentMiningStationId++;
    const now = new Date();
    const miningStation: MiningStation = { ...station, id, lastCollectedAt: now };
    this.miningStations.set(id, miningStation);
    return miningStation;
  }
  
  async updateMiningStation(id: number, stationData: Partial<MiningStation>): Promise<MiningStation | undefined> {
    const station = this.miningStations.get(id);
    if (!station) return undefined;
    
    const updatedStation = { ...station, ...stationData };
    this.miningStations.set(id, updatedStation);
    return updatedStation;
  }
  
  // Crypto operations
  async getAllCryptos(): Promise<Crypto[]> {
    return Array.from(this.cryptos.values());
  }
  
  async getCrypto(id: number): Promise<Crypto | undefined> {
    return this.cryptos.get(id);
  }
  
  async getCryptoBySymbol(symbol: string): Promise<Crypto | undefined> {
    return Array.from(this.cryptos.values()).find(
      (crypto) => crypto.symbol === symbol,
    );
  }
  
  async createCrypto(cryptoData: InsertCrypto): Promise<Crypto> {
    const id = this.currentCryptoId++;
    const crypto: Crypto = { ...cryptoData, id };
    this.cryptos.set(id, crypto);
    return crypto;
  }
  
  async updateCrypto(id: number, cryptoData: Partial<Crypto>): Promise<Crypto | undefined> {
    const crypto = await this.getCrypto(id);
    if (!crypto) return undefined;
    
    const updatedCrypto = { ...crypto, ...cryptoData };
    this.cryptos.set(id, updatedCrypto);
    return updatedCrypto;
  }
  
  // Holdings operations
  async getHoldings(userId: number): Promise<Holding[]> {
    return Array.from(this.holdings.values()).filter(
      (holding) => holding.userId === userId,
    );
  }
  
  async getHolding(userId: number, cryptoId: number): Promise<Holding | undefined> {
    return Array.from(this.holdings.values()).find(
      (holding) => holding.userId === userId && holding.cryptoId === cryptoId,
    );
  }
  
  async createHolding(holdingData: InsertHolding): Promise<Holding> {
    const id = this.currentHoldingId++;
    const holding: Holding = { ...holdingData, id };
    this.holdings.set(id, holding);
    return holding;
  }
  
  async updateHolding(id: number, holdingData: Partial<Holding>): Promise<Holding | undefined> {
    const holding = this.holdings.get(id);
    if (!holding) return undefined;
    
    const updatedHolding = { ...holding, ...holdingData };
    this.holdings.set(id, updatedHolding);
    return updatedHolding;
  }
  
  // Posts operations
  async getAllPosts(): Promise<Post[]> {
    return Array.from(this.posts.values()).sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }
  
  async getUserPosts(userId: number): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter((post) => post.userId === userId)
      .sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }
  
  async getPost(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }
  
  async createPost(postData: InsertPost): Promise<Post> {
    const id = this.currentPostId++;
    const now = new Date();
    const post: Post = { 
      ...postData, 
      id, 
      createdAt: now,
      likes: 0,
      comments: 0,
      shares: 0
    };
    this.posts.set(id, post);
    return post;
  }
  
  async updatePost(id: number, postData: Partial<Post>): Promise<Post | undefined> {
    const post = await this.getPost(id);
    if (!post) return undefined;
    
    const updatedPost = { ...post, ...postData };
    this.posts.set(id, updatedPost);
    return updatedPost;
  }
  
  // Achievement operations
  async getAllAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievements.values());
  }
  
  async getAchievement(id: number): Promise<Achievement | undefined> {
    return this.achievements.get(id);
  }
  
  async createAchievement(achievementData: InsertAchievement): Promise<Achievement> {
    const id = this.currentAchievementId++;
    const achievement: Achievement = { ...achievementData, id };
    this.achievements.set(id, achievement);
    return achievement;
  }
  
  // User Achievement operations
  async getUserAchievements(userId: number): Promise<UserAchievement[]> {
    return Array.from(this.userAchievements.values()).filter(
      (userAchievement) => userAchievement.userId === userId,
    );
  }
  
  async createUserAchievement(userAchievementData: InsertUserAchievement): Promise<UserAchievement> {
    const id = this.currentUserAchievementId++;
    const now = new Date();
    const userAchievement: UserAchievement = { ...userAchievementData, id, unlockedAt: now };
    this.userAchievements.set(id, userAchievement);
    return userAchievement;
  }
  
  // Trading Bot operations
  async getUserTradingBots(userId: number): Promise<TradingBot[]> {
    return Array.from(this.tradingBots.values()).filter(
      (bot) => bot.userId === userId,
    );
  }
  
  async getTradingBot(id: number): Promise<TradingBot | undefined> {
    return this.tradingBots.get(id);
  }
  
  async createTradingBot(botData: InsertTradingBot): Promise<TradingBot> {
    const id = this.currentTradingBotId++;
    const bot: TradingBot = { 
      ...botData, 
      id,
      performance: 0,
      wins: 0,
      losses: 0
    };
    this.tradingBots.set(id, bot);
    return bot;
  }
  
  async updateTradingBot(id: number, botData: Partial<TradingBot>): Promise<TradingBot | undefined> {
    const bot = await this.getTradingBot(id);
    if (!bot) return undefined;
    
    const updatedBot = { ...bot, ...botData };
    this.tradingBots.set(id, updatedBot);
    return updatedBot;
  }
  
  // Challenge operations
  async getAllChallenges(): Promise<Challenge[]> {
    return Array.from(this.challenges.values());
  }
  
  async getChallenge(id: number): Promise<Challenge | undefined> {
    return this.challenges.get(id);
  }
  
  async createChallenge(challengeData: InsertChallenge): Promise<Challenge> {
    const id = this.currentChallengeId++;
    const challenge: Challenge = { ...challengeData, id };
    this.challenges.set(id, challenge);
    return challenge;
  }
  
  // User Challenge operations
  async getUserChallenges(userId: number): Promise<UserChallenge[]> {
    return Array.from(this.userChallenges.values()).filter(
      (userChallenge) => userChallenge.userId === userId,
    );
  }
  
  async getUserChallenge(userId: number, challengeId: number): Promise<UserChallenge | undefined> {
    return Array.from(this.userChallenges.values()).find(
      (userChallenge) => userChallenge.userId === userId && userChallenge.challengeId === challengeId,
    );
  }
  
  async createUserChallenge(userChallengeData: InsertUserChallenge): Promise<UserChallenge> {
    const id = this.currentUserChallengeId++;
    const userChallenge: UserChallenge = { 
      ...userChallengeData, 
      id,
      progress: 0,
      maxProgress: 100,
      completed: false
    };
    this.userChallenges.set(id, userChallenge);
    return userChallenge;
  }
  
  async updateUserChallenge(id: number, challengeData: Partial<UserChallenge>): Promise<UserChallenge | undefined> {
    const userChallenge = this.userChallenges.get(id);
    if (!userChallenge) return undefined;
    
    const updatedUserChallenge = { ...userChallenge, ...challengeData };
    this.userChallenges.set(id, updatedUserChallenge);
    return updatedUserChallenge;
  }
}

export const storage = new MemStorage();
