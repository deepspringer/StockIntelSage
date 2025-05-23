import { 
  AnalysisResult, 
  CompanyInfo, 
  SentimentAnalysis, 
  FinancialIndicators, 
  PricePrediction, 
  NewsItem, 
  FinancialMetric 
} from "@shared/schema";

// API response types
export interface AnalyzeCompanyResponse {
  success: boolean;
  data: AnalysisResult | null;
  error?: string;
}

export interface GetSearchHistoryResponse {
  success: boolean;
  data: string[];
  error?: string;
}

// State types
export interface AppState {
  searchQuery: string;
  isLoading: boolean;
  hasResults: boolean;
  analysisResult: AnalysisResult | null;
  error: string | null;
}
