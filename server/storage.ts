import { 
  users, type User, type InsertUser,
  companyAnalyses, type CompanyAnalysis, type InsertCompanyAnalysis,
  searchHistory, type SearchHistory, type InsertSearchHistory,
  AnalysisResult
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Company analysis methods
  saveCompanyAnalysis(analysis: AnalysisResult): Promise<CompanyAnalysis>;
  getCompanyAnalysisByName(companyName: string): Promise<CompanyAnalysis | undefined>;
  formatAnalysisForAPI(analysis: CompanyAnalysis): AnalysisResult;
  
  // Search history methods
  addSearchToHistory(search: { companyName: string }): Promise<SearchHistory>;
  getSearchHistory(limit?: number): Promise<string[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private companies: Map<string, CompanyAnalysis>;
  private searches: SearchHistory[];
  private userId: number;
  private companyId: number;
  private searchId: number;

  constructor() {
    this.users = new Map();
    this.companies = new Map();
    this.searches = [];
    this.userId = 1;
    this.companyId = 1;
    this.searchId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Company analysis methods
  async saveCompanyAnalysis(analysisData: AnalysisResult): Promise<CompanyAnalysis> {
    const { companyInfo, sentimentAnalysis, financialIndicators, pricePrediction, newsItems, financialMetrics } = analysisData;
    
    const companyName = companyInfo.name;
    const normalizedName = companyName.toLowerCase();
    
    // Check if analysis already exists
    const existingAnalysis = this.companies.get(normalizedName);
    
    const analysis: CompanyAnalysis = {
      id: existingAnalysis?.id || this.companyId++,
      companyName: companyInfo.name,
      tickerSymbol: companyInfo.tickerSymbol,
      currentPrice: companyInfo.currentPrice,
      priceChange: companyInfo.priceChange,
      analysisDate: new Date(),
      sentimentAnalysis: sentimentAnalysis as any,
      financialAnalysis: {
        financialIndicators,
        financialMetrics,
      } as any,
      newsSummary: { newsItems } as any,
      prediction: pricePrediction as any,
    };
    
    this.companies.set(normalizedName, analysis);
    return analysis;
  }

  async getCompanyAnalysisByName(companyName: string): Promise<CompanyAnalysis | undefined> {
    const normalizedName = companyName.toLowerCase();
    return this.companies.get(normalizedName);
  }

  formatAnalysisForAPI(analysis: CompanyAnalysis): AnalysisResult {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    
    return {
      companyInfo: {
        name: analysis.companyName,
        tickerSymbol: analysis.tickerSymbol || "",
        currentPrice: analysis.currentPrice || "",
        priceChange: analysis.priceChange || "",
        analysisDate: dateStr,
        analysisTime: timeStr
      },
      sentimentAnalysis: analysis.sentimentAnalysis as any,
      financialIndicators: (analysis.financialAnalysis as any).financialIndicators,
      pricePrediction: analysis.prediction as any,
      newsItems: (analysis.newsSummary as any).newsItems,
      financialMetrics: (analysis.financialAnalysis as any).financialMetrics,
    };
  }

  // Search history methods
  async addSearchToHistory(search: { companyName: string }): Promise<SearchHistory> {
    const id = this.searchId++;
    const newSearch: SearchHistory = {
      id,
      companyName: search.companyName,
      searchDate: new Date(),
    };
    
    this.searches.push(newSearch);
    return newSearch;
  }

  async getSearchHistory(limit = 10): Promise<string[]> {
    // Get unique company names, sorted by most recent search
    const uniqueSearches = Array.from(
      new Map(
        this.searches
          .sort((a, b) => b.searchDate.getTime() - a.searchDate.getTime())
          .map(search => [search.companyName.toLowerCase(), search.companyName])
      ).values()
    );
    
    return uniqueSearches.slice(0, limit);
  }
}

export const storage = new MemStorage();
