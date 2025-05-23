import React from "react";
import { AnalysisResult } from "@shared/schema";
import AnalysisSummaryCard from "./AnalysisSummaryCard";
import SentimentChart from "./SentimentChart";
import PricePredictionChart from "./PricePredictionChart";
import NewsFeedSection from "./NewsFeedSection";
import FinancialMetricsSection from "./FinancialMetricsSection";

interface ResultsSectionProps {
  analysisResult: AnalysisResult;
}

export default function ResultsSection({ analysisResult }: ResultsSectionProps) {
  const { 
    companyInfo, 
    sentimentAnalysis, 
    financialIndicators, 
    pricePrediction, 
    newsItems, 
    financialMetrics 
  } = analysisResult;
  
  // Determine price trend icon and color
  const isPricePositive = companyInfo.priceChange.includes('+');
  const trendIconName = isPricePositive ? "trending_up" : "trending_down";
  const trendColorClass = isPricePositive ? "text-status-positive" : "text-status-negative";

  return (
    <section className="mb-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-medium text-neutral-dark">
              {companyInfo.name}
            </h2>
            <p className="text-gray-500 text-sm">
              Analysis completed on {companyInfo.analysisDate} at {companyInfo.analysisTime}
            </p>
          </div>
          <div className="flex items-center">
            <span className={`material-icons ${trendColorClass} mr-1`}>
              {trendIconName}
            </span>
            <span className={`font-mono font-medium ${trendColorClass}`}>
              {companyInfo.currentPrice} ({companyInfo.priceChange})
            </span>
          </div>
        </div>

        <AnalysisSummaryCard 
          sentimentAnalysis={sentimentAnalysis} 
          financialIndicators={financialIndicators} 
          pricePrediction={pricePrediction} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <SentimentChart sentimentAnalysis={sentimentAnalysis} />
          <PricePredictionChart prediction={pricePrediction} />
        </div>

        <NewsFeedSection newsItems={newsItems} />
        
        <FinancialMetricsSection financialMetrics={financialMetrics} />
      </div>
    </section>
  );
}
