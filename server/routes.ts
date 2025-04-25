import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws"; 
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertPostSchema,
  insertTradingBotSchema,
  insertUserChallengeSchema
} from "@shared/schema";

// Create a map to store WebSocket connections by userId
const userConnections = new Map<number, WebSocket>();

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Set up WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    let userId: number | null = null;
    
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === 'auth' && data.userId) {
          userId = data.userId;
          userConnections.set(userId, ws);
          
          // Send initial data to the client
          const user = await storage.getUser(userId);
          if (user) {
            ws.send(JSON.stringify({
              type: 'user_update',
              user
            }));
          }
        }
      } catch (error) {
        console.error('WebSocket error:', error);
      }
    });
    
    ws.on('close', () => {
      if (userId) {
        userConnections.delete(userId);
      }
    });
  });
  
  // Function to broadcast updates to specific user
  const broadcastToUser = (userId: number, data: any) => {
    const connection = userConnections.get(userId);
    if (connection && connection.readyState === WebSocket.OPEN) {
      connection.send(JSON.stringify(data));
    }
  };
  
  // Auth Routes
  app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username is taken
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
      }
      
      const user = await storage.createUser(userData);
      
      // Create initial challenges for the user
      const challenges = await storage.getAllChallenges();
      for (const challenge of challenges) {
        await storage.createUserChallenge({
          userId: user.id,
          challengeId: challenge.id
        });
      }
      
      // Create demo trading bots for the user
      await storage.createTradingBot({
        userId: user.id,
        name: "DCA Bitcoin",
        enabled: true,
        strategy: "dollar_cost_averaging"
      });
      
      await storage.createTradingBot({
        userId: user.id,
        name: "ETH Swing Trader",
        enabled: true,
        strategy: "swing_trading"
      });
      
      // Don't return password in response
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid input', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Server error' });
      }
    }
  });
  
  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
      
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Don't return password in response
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // User Routes
  app.get('/api/users/:id', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Don't return password in response
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Mining Station Routes
  app.get('/api/mining/:userId', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const station = await storage.getMiningStation(userId);
      
      if (!station) {
        return res.status(404).json({ message: 'Mining station not found' });
      }
      
      res.json(station);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.post('/api/mining/:userId/collect', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const station = await storage.getMiningStation(userId);
      
      if (!station) {
        return res.status(404).json({ message: 'Mining station not found' });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Calculate tokens mined since last collection
      const now = new Date();
      const lastCollected = new Date(station.lastCollectedAt);
      const hoursPassed = (now.getTime() - lastCollected.getTime()) / (1000 * 60 * 60);
      const tokensPerHour = station.power;
      const tokensMined = Math.floor(hoursPassed * tokensPerHour);
      
      // Update user's game tokens
      const updatedUser = await storage.updateUser(userId, {
        gameTokens: user.gameTokens + tokensMined
      });
      
      // Update mining station's last collected time
      const updatedStation = await storage.updateMiningStation(station.id, {
        lastCollectedAt: now
      });
      
      // Update challenges progress
      const miningChallenge = await storage.getUserChallenges(userId)
        .then(challenges => challenges.find(c => 
          c.challengeId === 2 && !c.completed
        ));
      
      if (miningChallenge) {
        const newProgress = Math.min(miningChallenge.progress + tokensMined, miningChallenge.maxProgress);
        const completed = newProgress >= miningChallenge.maxProgress;
        
        await storage.updateUserChallenge(miningChallenge.id, {
          progress: newProgress,
          completed
        });
        
        // If challenge completed, reward user
        if (completed) {
          const challenge = await storage.getChallenge(miningChallenge.challengeId);
          if (challenge && updatedUser) {
            await storage.updateUser(userId, {
              gameTokens: updatedUser.gameTokens + challenge.rewardGameTokens,
              tradeTokens: updatedUser.tradeTokens + challenge.rewardTradeTokens
            });
          }
        }
      }
      
      // Broadcast updates via WebSocket
      if (updatedUser) {
        const { password: _, ...userWithoutPassword } = updatedUser;
        broadcastToUser(userId, {
          type: 'user_update',
          user: userWithoutPassword
        });
        
        broadcastToUser(userId, {
          type: 'mining_update',
          station: updatedStation
        });
      }
      
      res.json({ 
        tokensMined,
        station: updatedStation
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.post('/api/mining/:userId/upgrade', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const station = await storage.getMiningStation(userId);
      
      if (!station) {
        return res.status(404).json({ message: 'Mining station not found' });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Calculate upgrade cost (increases with level)
      const upgradeCost = 50 * station.level;
      
      // Check if user has enough tokens
      if (user.gameTokens < upgradeCost) {
        return res.status(400).json({ message: 'Not enough tokens for upgrade' });
      }
      
      // Upgrade mining station
      const updatedStation = await storage.updateMiningStation(station.id, {
        level: station.level + 1,
        power: station.power + 2
      });
      
      // Deduct tokens from user
      const updatedUser = await storage.updateUser(userId, {
        gameTokens: user.gameTokens - upgradeCost
      });
      
      // Check if user unlocked mining achievement
      if (updatedStation && updatedStation.level >= 5) {
        const miningAchievement = await storage.getAllAchievements()
          .then(achievements => achievements.find(a => a.title === "Mining Pro"));
        
        if (miningAchievement) {
          const existingUserAchievement = await storage.getUserAchievements(userId)
            .then(achievements => achievements.find(a => a.achievementId === miningAchievement.id));
          
          if (!existingUserAchievement) {
            await storage.createUserAchievement({
              userId,
              achievementId: miningAchievement.id
            });
            
            broadcastToUser(userId, {
              type: 'achievement_unlocked',
              achievement: miningAchievement
            });
          }
        }
      }
      
      // Broadcast updates via WebSocket
      if (updatedUser) {
        const { password: _, ...userWithoutPassword } = updatedUser;
        broadcastToUser(userId, {
          type: 'user_update',
          user: userWithoutPassword
        });
        
        broadcastToUser(userId, {
          type: 'mining_update',
          station: updatedStation
        });
      }
      
      res.json({ 
        success: true,
        station: updatedStation
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Crypto Routes
  app.get('/api/cryptos', async (_req: Request, res: Response) => {
    try {
      const cryptos = await storage.getAllCryptos();
      res.json(cryptos);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.get('/api/cryptos/:id', async (req: Request, res: Response) => {
    try {
      const cryptoId = parseInt(req.params.id);
      const crypto = await storage.getCrypto(cryptoId);
      
      if (!crypto) {
        return res.status(404).json({ message: 'Crypto not found' });
      }
      
      res.json(crypto);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Holdings Routes
  app.get('/api/holdings/:userId', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const holdings = await storage.getHoldings(userId);
      
      // Fetch crypto details for each holding
      const holdingsWithDetails = await Promise.all(
        holdings.map(async (holding) => {
          const crypto = await storage.getCrypto(holding.cryptoId);
          return {
            ...holding,
            crypto
          };
        })
      );
      
      res.json(holdingsWithDetails);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.post('/api/trade', async (req: Request, res: Response) => {
    try {
      const { userId, cryptoId, action, amount } = req.body;
      
      if (!userId || !cryptoId || !action || !amount) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const crypto = await storage.getCrypto(cryptoId);
      if (!crypto) {
        return res.status(404).json({ message: 'Crypto not found' });
      }
      
      // Calculate token cost (1 trade token = $100 worth of crypto)
      const tokenCost = Math.ceil(amount * crypto.currentPrice / 10000) / 10;
      
      if (action === 'buy') {
        // Check if user has enough trade tokens
        if (user.tradeTokens < tokenCost) {
          return res.status(400).json({ message: 'Not enough trade tokens' });
        }
        
        // Get or create holding
        let holding = await storage.getHolding(userId, cryptoId);
        
        if (holding) {
          // Update existing holding
          holding = await storage.updateHolding(holding.id, {
            amount: holding.amount + amount
          });
        } else {
          // Create new holding
          holding = await storage.createHolding({
            userId,
            cryptoId,
            amount
          });
        }
        
        // Deduct tokens from user
        const updatedUser = await storage.updateUser(userId, {
          tradeTokens: user.tradeTokens - tokenCost
        });
        
        // Update trade challenge
        const tradeChallenge = await storage.getUserChallenges(userId)
          .then(challenges => challenges.find(c => 
            c.challengeId === 1 && !c.completed
          ));
        
        if (tradeChallenge) {
          const newProgress = Math.min(tradeChallenge.progress + 1, tradeChallenge.maxProgress);
          const completed = newProgress >= tradeChallenge.maxProgress;
          
          await storage.updateUserChallenge(tradeChallenge.id, {
            progress: newProgress,
            completed
          });
          
          // If challenge completed, reward user
          if (completed && updatedUser) {
            const challenge = await storage.getChallenge(tradeChallenge.challengeId);
            if (challenge) {
              await storage.updateUser(userId, {
                gameTokens: updatedUser.gameTokens + challenge.rewardGameTokens,
                tradeTokens: updatedUser.tradeTokens + challenge.rewardTradeTokens
              });
            }
          }
        }
        
        // Check if first trade achievement
        const firstTradeAchievement = await storage.getAllAchievements()
          .then(achievements => achievements.find(a => a.title === "First Trade"));
        
        if (firstTradeAchievement) {
          const existingUserAchievement = await storage.getUserAchievements(userId)
            .then(achievements => achievements.find(a => a.achievementId === firstTradeAchievement.id));
          
          if (!existingUserAchievement) {
            await storage.createUserAchievement({
              userId,
              achievementId: firstTradeAchievement.id
            });
            
            broadcastToUser(userId, {
              type: 'achievement_unlocked',
              achievement: firstTradeAchievement
            });
          }
        }
        
        // Broadcast updates via WebSocket
        if (updatedUser) {
          const { password: _, ...userWithoutPassword } = updatedUser;
          broadcastToUser(userId, {
            type: 'user_update',
            user: userWithoutPassword
          });
          
          broadcastToUser(userId, {
            type: 'holding_update',
            holding
          });
        }
        
        res.json({ 
          success: true,
          holding
        });
      } else if (action === 'sell') {
        // Get holding
        const holding = await storage.getHolding(userId, cryptoId);
        
        if (!holding || holding.amount < amount) {
          return res.status(400).json({ message: 'Not enough crypto to sell' });
        }
        
        // Update holding
        const updatedHolding = await storage.updateHolding(holding.id, {
          amount: holding.amount - amount
        });
        
        // Add tokens to user
        const updatedUser = await storage.updateUser(userId, {
          tradeTokens: user.tradeTokens + tokenCost
        });
        
        // Update trade challenge
        const tradeChallenge = await storage.getUserChallenges(userId)
          .then(challenges => challenges.find(c => 
            c.challengeId === 1 && !c.completed
          ));
        
        if (tradeChallenge) {
          const newProgress = Math.min(tradeChallenge.progress + 1, tradeChallenge.maxProgress);
          const completed = newProgress >= tradeChallenge.maxProgress;
          
          await storage.updateUserChallenge(tradeChallenge.id, {
            progress: newProgress,
            completed
          });
          
          // If challenge completed, reward user
          if (completed && updatedUser) {
            const challenge = await storage.getChallenge(tradeChallenge.challengeId);
            if (challenge) {
              await storage.updateUser(userId, {
                gameTokens: updatedUser.gameTokens + challenge.rewardGameTokens,
                tradeTokens: updatedUser.tradeTokens + challenge.rewardTradeTokens
              });
            }
          }
        }
        
        // Broadcast updates via WebSocket
        if (updatedUser) {
          const { password: _, ...userWithoutPassword } = updatedUser;
          broadcastToUser(userId, {
            type: 'user_update',
            user: userWithoutPassword
          });
          
          broadcastToUser(userId, {
            type: 'holding_update',
            holding: updatedHolding
          });
        }
        
        res.json({ 
          success: true,
          holding: updatedHolding
        });
      } else {
        res.status(400).json({ message: 'Invalid action' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Social Posts Routes
  app.get('/api/posts', async (_req: Request, res: Response) => {
    try {
      const posts = await storage.getAllPosts();
      
      // Get user info for each post
      const postsWithUsers = await Promise.all(
        posts.map(async (post) => {
          const user = await storage.getUser(post.userId);
          return {
            ...post,
            user: user ? {
              id: user.id,
              username: user.username,
              profileImageUrl: user.profileImageUrl
            } : null
          };
        })
      );
      
      res.json(postsWithUsers);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.post('/api/posts', async (req: Request, res: Response) => {
    try {
      const postData = insertPostSchema.parse(req.body);
      const post = await storage.createPost(postData);
      
      const user = await storage.getUser(post.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Update post challenge
      const postChallenge = await storage.getUserChallenges(post.userId)
        .then(challenges => challenges.find(c => 
          c.challengeId === 3 && !c.completed
        ));
      
      if (postChallenge) {
        const newProgress = Math.min(postChallenge.progress + 1, postChallenge.maxProgress);
        const completed = newProgress >= postChallenge.maxProgress;
        
        await storage.updateUserChallenge(postChallenge.id, {
          progress: newProgress,
          completed
        });
        
        // If challenge completed, reward user
        if (completed) {
          const challenge = await storage.getChallenge(postChallenge.challengeId);
          if (challenge) {
            await storage.updateUser(post.userId, {
              gameTokens: user.gameTokens + challenge.rewardGameTokens,
              tradeTokens: user.tradeTokens + challenge.rewardTradeTokens
            });
          }
        }
      }
      
      // Broadcast post to all connected users
      const postWithUser = {
        ...post,
        user: {
          id: user.id,
          username: user.username,
          profileImageUrl: user.profileImageUrl
        }
      };
      
      for (const [userId, connection] of userConnections.entries()) {
        if (connection.readyState === WebSocket.OPEN) {
          connection.send(JSON.stringify({
            type: 'new_post',
            post: postWithUser
          }));
        }
      }
      
      res.status(201).json(postWithUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid input', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Server error' });
      }
    }
  });
  
  app.post('/api/posts/:id/like', async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.id);
      const post = await storage.getPost(postId);
      
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      
      const updatedPost = await storage.updatePost(postId, {
        likes: post.likes + 1
      });
      
      // Broadcast update to all connected users
      for (const [userId, connection] of userConnections.entries()) {
        if (connection.readyState === WebSocket.OPEN) {
          connection.send(JSON.stringify({
            type: 'post_update',
            post: updatedPost
          }));
        }
      }
      
      res.json(updatedPost);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Achievement Routes
  app.get('/api/achievements/:userId', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Get all achievements
      const allAchievements = await storage.getAllAchievements();
      
      // Get user achievements
      const userAchievements = await storage.getUserAchievements(userId);
      
      // Mark which achievements the user has unlocked
      const achievements = allAchievements.map(achievement => {
        const userAchievement = userAchievements.find(ua => ua.achievementId === achievement.id);
        return {
          ...achievement,
          unlocked: !!userAchievement,
          unlockedAt: userAchievement?.unlockedAt
        };
      });
      
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Trading Bot Routes
  app.get('/api/trading-bots/:userId', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const bots = await storage.getUserTradingBots(userId);
      res.json(bots);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.post('/api/trading-bots', async (req: Request, res: Response) => {
    try {
      const botData = insertTradingBotSchema.parse(req.body);
      const bot = await storage.createTradingBot(botData);
      res.status(201).json(bot);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid input', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Server error' });
      }
    }
  });
  
  app.patch('/api/trading-bots/:id/toggle', async (req: Request, res: Response) => {
    try {
      const botId = parseInt(req.params.id);
      const bot = await storage.getTradingBot(botId);
      
      if (!bot) {
        return res.status(404).json({ message: 'Trading bot not found' });
      }
      
      const updatedBot = await storage.updateTradingBot(botId, {
        enabled: !bot.enabled
      });
      
      res.json(updatedBot);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Challenges Routes
  app.get('/api/challenges/:userId', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Get user challenges
      const userChallenges = await storage.getUserChallenges(userId);
      
      // Get challenge details for each user challenge
      const challengesWithDetails = await Promise.all(
        userChallenges.map(async (userChallenge) => {
          const challenge = await storage.getChallenge(userChallenge.challengeId);
          return {
            ...userChallenge,
            challenge
          };
        })
      );
      
      res.json(challengesWithDetails);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  return httpServer;
}
