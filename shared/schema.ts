import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  level: integer("level").notNull().default(1),
  levelProgress: integer("level_progress").notNull().default(0),
  gameTokens: integer("game_tokens").notNull().default(100),
  tradeTokens: integer("trade_tokens").notNull().default(10),
  profileImageUrl: text("profile_image_url").default(""),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  level: true,
  levelProgress: true,
  gameTokens: true,
  tradeTokens: true,
  profileImageUrl: true,
});

// Mining stations table
export const miningStations = pgTable("mining_stations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  level: integer("level").notNull().default(1),
  power: integer("power").notNull().default(5),
  lastCollectedAt: timestamp("last_collected_at").notNull().defaultNow(),
});

export const insertMiningStationSchema = createInsertSchema(miningStations).omit({
  id: true,
  lastCollectedAt: true,
});

// Virtual cryptocurrencies
export const cryptos = pgTable("cryptos", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull().unique(),
  name: text("name").notNull(),
  currentPrice: integer("current_price").notNull(), // Store price in cents
  change24h: integer("change_24h").notNull(), // Store as basis points (1/100 of a percent)
  iconClass: text("icon_class").notNull(),
});

export const insertCryptoSchema = createInsertSchema(cryptos).omit({
  id: true,
});

// User portfolio (holdings)
export const holdings = pgTable("holdings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  cryptoId: integer("crypto_id").notNull().references(() => cryptos.id),
  amount: integer("amount").notNull(),
});

export const insertHoldingSchema = createInsertSchema(holdings).omit({
  id: true,
});

// Social posts
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  likes: integer("likes").notNull().default(0),
  comments: integer("comments").notNull().default(0),
  shares: integer("shares").notNull().default(0),
});

export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  createdAt: true,
  likes: true,
  comments: true,
  shares: true,
});

// Achievements
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  iconClass: text("icon_class").notNull(),
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
});

// User achievements
export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  achievementId: integer("achievement_id").notNull().references(() => achievements.id),
  unlockedAt: timestamp("unlocked_at").notNull().defaultNow(),
});

export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({
  id: true,
  unlockedAt: true,
});

// Trading bots
export const tradingBots = pgTable("trading_bots", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  enabled: boolean("enabled").notNull().default(false),
  strategy: text("strategy").notNull(),
  performance: integer("performance").notNull().default(0), // Store as basis points
  wins: integer("wins").notNull().default(0),
  losses: integer("losses").notNull().default(0),
});

export const insertTradingBotSchema = createInsertSchema(tradingBots).omit({
  id: true,
  performance: true,
  wins: true,
  losses: true,
});

// Daily challenges
export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  rewardGameTokens: integer("reward_game_tokens").notNull().default(0),
  rewardTradeTokens: integer("reward_trade_tokens").notNull().default(0),
});

export const insertChallengeSchema = createInsertSchema(challenges).omit({
  id: true,
});

// User challenges
export const userChallenges = pgTable("user_challenges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  challengeId: integer("challenge_id").notNull().references(() => challenges.id),
  progress: integer("progress").notNull().default(0),
  maxProgress: integer("max_progress").notNull().default(100),
  completed: boolean("completed").notNull().default(false),
});

export const insertUserChallengeSchema = createInsertSchema(userChallenges).omit({
  id: true,
  completed: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertMiningStation = z.infer<typeof insertMiningStationSchema>;
export type MiningStation = typeof miningStations.$inferSelect;

export type InsertCrypto = z.infer<typeof insertCryptoSchema>;
export type Crypto = typeof cryptos.$inferSelect;

export type InsertHolding = z.infer<typeof insertHoldingSchema>;
export type Holding = typeof holdings.$inferSelect;

export type InsertPost = z.infer<typeof insertPostSchema>;
export type Post = typeof posts.$inferSelect;

export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Achievement = typeof achievements.$inferSelect;

export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;
export type UserAchievement = typeof userAchievements.$inferSelect;

export type InsertTradingBot = z.infer<typeof insertTradingBotSchema>;
export type TradingBot = typeof tradingBots.$inferSelect;

export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
export type Challenge = typeof challenges.$inferSelect;

export type InsertUserChallenge = z.infer<typeof insertUserChallengeSchema>;
export type UserChallenge = typeof userChallenges.$inferSelect;
