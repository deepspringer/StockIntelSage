import React from "react";
import { SentimentAnalysis, FinancialIndicators, PricePrediction } from "@shared/schema";

interface AnalysisSummaryCardProps {
  sentimentAnalysis: SentimentAnalysis;
  financialIndicators: FinancialIndicators;
  pricePrediction: PricePrediction;
}

export default function AnalysisSummaryCard({
  sentimentAnalysis,
  financialIndicators,
  pricePrediction
}: AnalysisSummaryCardProps) {
  // Helper function to get status badge color
  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'positive':
      case 'strong':
      case 'bullish':
        return 'bg-status-positive/10 text-status-positive';
      case 'negative':
      case 'weak':
      case 'bearish':
        return 'bg-status-negative/10 text-status-negative';
      default:
        return 'bg-status-neutral/10 text-status-neutral';
    }
  };

  // Capitalize first letter
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div className="bg-[#F5F7FA] p-4 rounded-lg mb-6">
      <h3 className="font-medium text-lg mb-2">Analysis Summary</h3>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 p-4 bg-white rounded-md shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-gray-500">SENTIMENT ANALYSIS</h4>
            <span className={`text-sm px-2 py-0.5 ${getStatusColor(sentimentAnalysis.overall)} rounded-full`}>
              {capitalize(sentimentAnalysis.overall)}
            </span>
          </div>
          <p className="text-sm text-gray-600">{sentimentAnalysis.summary}</p>
          {sentimentAnalysis.source && (
            <div className="mt-2">
              <span className="text-xs text-primary inline-flex items-center">
                <span className="material-icons text-xs mr-1">source</span>
                Source: {sentimentAnalysis.source}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex-1 p-4 bg-white rounded-md shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-gray-500">FINANCIAL INDICATORS</h4>
            <span className={`text-sm px-2 py-0.5 ${getStatusColor(financialIndicators.status)} rounded-full`}>
              {capitalize(financialIndicators.status)}
            </span>
          </div>
          <p className="text-sm text-gray-600">{financialIndicators.summary}</p>
          {financialIndicators.source && (
            <div className="mt-2">
              <span className="text-xs text-primary inline-flex items-center">
                <span className="material-icons text-xs mr-1">source</span>
                Source: {financialIndicators.source}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex-1 p-4 bg-white rounded-md shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-gray-500">PRICE PREDICTION</h4>
            <span className={`text-sm px-2 py-0.5 ${getStatusColor(pricePrediction.status)} rounded-full`}>
              {capitalize(pricePrediction.status)}
            </span>
          </div>
          <p className="text-sm text-gray-600">{pricePrediction.summary}</p>
          {pricePrediction.source && (
            <div className="mt-2">
              <span className="text-xs text-primary inline-flex items-center">
                <span className="material-icons text-xs mr-1">source</span>
                Source: {pricePrediction.source}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
