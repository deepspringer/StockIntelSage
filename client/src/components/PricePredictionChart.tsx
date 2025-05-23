import React from "react";
import { PricePrediction } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PricePredictionChartProps {
  prediction: PricePrediction;
}

export default function PricePredictionChart({ prediction }: PricePredictionChartProps) {
  // Calculate dates for x-axis
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);
  
  const thirtyDaysFromNow = new Date(today);
  thirtyDaysFromNow.setDate(today.getDate() + 30);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card className="border border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Price Prediction (30 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="chart-container h-[200px]">
          <div className="relative h-full w-full">
            {/* Historical trend line (solid) */}
            <div className="absolute bottom-0 left-0 w-1/2 h-full flex items-end">
              <div className="relative w-full h-2/3">
                <div className="absolute bottom-0 left-0 w-full h-1/2 border-b border-gray-300"></div>
                <div className="absolute bottom-0 left-0 w-full h-full">
                  <svg viewBox="0 0 100 60" preserveAspectRatio="none" className="w-full h-full">
                    <path d="M0,40 L10,35 L20,37 L30,30 L40,25 L50,20" fill="none" stroke="#1A237E" strokeWidth="2"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Prediction area (gradient + dashed lines) */}
            <div className="absolute bottom-0 right-0 w-1/2 h-full flex items-end">
              <div className="relative w-full h-2/3">
                <div className="absolute bottom-0 left-0 w-full h-1/2 border-b border-gray-300"></div>
                <div className="absolute bottom-0 left-0 w-full h-full">
                  <svg viewBox="0 0 100 60" preserveAspectRatio="none" className="w-full h-full">
                    {/* Prediction area with gradient */}
                    <defs>
                      <linearGradient id="predictionGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(76, 175, 80, 0.2)" />
                        <stop offset="100%" stopColor="rgba(76, 175, 80, 0)" />
                      </linearGradient>
                    </defs>
                    {/* Upper prediction line */}
                    <path d="M0,20 L10,15 L20,12 L30,10 L40,5 L50,0" fill="none" stroke="#4CAF50" strokeWidth="1.5" strokeDasharray="4,2"></path>
                    {/* Lower prediction line */}
                    <path d="M0,20 L10,22 L20,18 L30,20 L40,15 L50,10" fill="none" stroke="#4CAF50" strokeWidth="1.5" strokeDasharray="4,2"></path>
                    {/* Prediction area */}
                    <path d="M0,20 L10,15 L20,12 L30,10 L40,5 L50,0 L50,10 L40,15 L30,20 L20,18 L10,22 L0,20 Z" fill="url(#predictionGradient)"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Price markers */}
            <div className="absolute left-0 h-full flex flex-col justify-between py-2 text-xs text-gray-500">
              <div>${prediction.maxPrice}</div>
              <div>${prediction.currentPrice}</div>
              <div>${prediction.minPrice}</div>
            </div>
            
            {/* Date markers */}
            <div className="absolute bottom-0 w-full flex justify-between px-8 text-xs text-gray-500">
              <div>{formatDate(thirtyDaysAgo)}</div>
              <div>Today</div>
              <div>{formatDate(thirtyDaysFromNow)}</div>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="flex items-center mr-3">
                <div className="w-3 h-0.5 bg-secondary mr-1"></div>
                <span className="text-xs text-gray-500">Historical</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-0.5 bg-status-positive border-b border-dashed mr-1"></div>
                <span className="text-xs text-gray-500">Predicted</span>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Predicted range: <span className="font-medium">${prediction.minPrice}-${prediction.maxPrice}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
