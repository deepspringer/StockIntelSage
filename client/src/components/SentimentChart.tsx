import React from "react";
import { SentimentAnalysis } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SentimentChartProps {
  sentimentAnalysis: SentimentAnalysis;
}

export default function SentimentChart({ sentimentAnalysis }: SentimentChartProps) {
  const { positive, neutral, negative, articleCount } = sentimentAnalysis;

  return (
    <Card className="border border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">News Sentiment Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="chart-container h-[200px]">
          <div className="flex flex-col h-full justify-center">
            <div className="mb-6">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-500">Positive</span>
                <span className="text-sm font-medium">{positive}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-status-positive h-4 rounded-full" 
                  style={{ width: `${positive}%` }}
                ></div>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-500">Neutral</span>
                <span className="text-sm font-medium">{neutral}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-status-neutral h-4 rounded-full" 
                  style={{ width: `${neutral}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-500">Negative</span>
                <span className="text-sm font-medium">{negative}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-status-negative h-4 rounded-full" 
                  style={{ width: `${negative}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <p className="text-xs text-gray-500">
            Based on analysis of {articleCount} news articles from the past 30 days
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
