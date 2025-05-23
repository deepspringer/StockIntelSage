import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Company analysis schema
export const companyAnalyses = pgTable("company_analyses", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull(),
  tickerSymbol: text("ticker_symbol"),
  currentPrice: text("current_price"),
  priceChange: text("price_change"),
  analysisDate: timestamp("analysis_date").notNull().defaultNow(),
  sentimentAnalysis: jsonb("sentiment_analysis").notNull(),
  financialAnalysis: jsonb("financial_analysis").notNull(),
  newsSummary: jsonb("news_summary").notNull(),
  prediction: jsonb("prediction").notNull(),
});

export const insertCompanyAnalysisSchema = createInsertSchema(companyAnalyses).omit({
  id: true,
  analysisDate: true,
});

export type InsertCompanyAnalysis = z.infer<typeof insertCompanyAnalysisSchema>;
export type CompanyAnalysis = typeof companyAnalyses.$inferSelect;

// Search history schema
export const searchHistory = pgTable("search_history", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull(),
  searchDate: timestamp("search_date").notNull().defaultNow(),
});

export const insertSearchHistorySchema = createInsertSchema(searchHistory).omit({
  id: true,
  searchDate: true,
});

export type InsertSearchHistory = z.infer<typeof insertSearchHistorySchema>;
export type SearchHistory = typeof searchHistory.$inferSelect;

// Define analytics types for frontend
export const newsItemSchema = z.object({
  title: z.string(),
  source: z.string(),
  date: z.string(),
  summary: z.string(),
  sentiment: z.enum(["positive", "negative", "neutral"]),
  keyPoints: z.array(z.string()),
  priceImpact: z.number(),
});

export type NewsItem = z.infer<typeof newsItemSchema>;

export const financialMetricSchema = z.object({
  name: z.string(),
  value: z.string(),
  yoyChange: z.string(),
  industryAvg: z.string(),
  impact: z.enum(["positive", "negative", "neutral", "strong"]),
  source: z.string().optional(),
});

export type FinancialMetric = z.infer<typeof financialMetricSchema>;

export const sentimentAnalysisSchema = z.object({
  positive: z.number(),
  neutral: z.number(),
  negative: z.number(),
  articleCount: z.number(),
  overall: z.enum(["positive", "negative", "neutral"]),
  summary: z.string(),
  source: z.string().optional(),
});

export type SentimentAnalysis = z.infer<typeof sentimentAnalysisSchema>;

export const financialIndicatorsSchema = z.object({
  status: z.enum(["strong", "weak", "neutral"]),
  summary: z.string(),
  source: z.string().optional(),
});

export type FinancialIndicators = z.infer<typeof financialIndicatorsSchema>;

export const pricePredictionSchema = z.object({
  status: z.enum(["bullish", "bearish", "neutral"]),
  summary: z.string(),
  minPrice: z.number(),
  maxPrice: z.number(),
  currentPrice: z.number(),
  priceChange: z.string(),
  source: z.string().optional(),
});

export type PricePrediction = z.infer<typeof pricePredictionSchema>;

export const companyInfoSchema = z.object({
  name: z.string(),
  tickerSymbol: z.string(),
  currentPrice: z.string(),
  priceChange: z.string(),
  analysisDate: z.string(),
  analysisTime: z.string(),
  source: z.string().optional(),
});

export type CompanyInfo = z.infer<typeof companyInfoSchema>;

export const analysisResultSchema = z.object({
  companyInfo: companyInfoSchema,
  sentimentAnalysis: sentimentAnalysisSchema,
  financialIndicators: financialIndicatorsSchema,
  pricePrediction: pricePredictionSchema,
  newsItems: z.array(newsItemSchema),
  financialMetrics: z.array(financialMetricSchema),
});

export type AnalysisResult = z.infer<typeof analysisResultSchema>;
