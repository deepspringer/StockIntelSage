import React, { useState } from "react";
import { NewsItem } from "@shared/schema";
import { Button } from "@/components/ui/button";

interface NewsFeedSectionProps {
  newsItems: NewsItem[];
}

export default function NewsFeedSection({ newsItems }: NewsFeedSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const displayedItems = showAll ? newsItems : newsItems.slice(0, 3);

  // Helper function to get sentiment badge color
  const getSentimentBadgeColor = (sentiment: string) => {
    switch(sentiment.toLowerCase()) {
      case 'positive':
        return 'bg-status-positive';
      case 'negative':
        return 'bg-status-negative';
      default:
        return 'bg-status-neutral';
    }
  };

  // Helper function to get price impact color
  const getPriceImpactColor = (impact: number) => {
    return impact >= 0 
      ? 'text-status-positive' 
      : 'text-status-negative';
  };

  // Format price impact with sign
  const formatPriceImpact = (impact: number) => {
    const sign = impact >= 0 ? '+' : '';
    return `${sign}${impact.toFixed(1)}%`;
  };

  return (
    <div className="mb-6">
      <h3 className="font-medium text-lg mb-3">Recent News Analysis</h3>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {displayedItems.map((item, index) => (
          <div 
            key={index} 
            className="border-b border-gray-200 last:border-b-0"
          >
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <span className={`${getSentimentBadgeColor(item.sentiment)} text-white text-xs px-2 py-0.5 rounded mr-2`}>
                      {item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1)}
                    </span>
                    <span className="text-gray-500 text-xs">{item.source} • {item.date}</span>
                  </div>
                  <h4 className="font-medium mb-1">
                    {item.url ? (
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:text-primary transition-colors hover:underline flex items-center"
                      >
                        {item.title}
                        <span className="material-icons text-sm ml-1">open_in_new</span>
                      </a>
                    ) : (
                      item.title
                    )}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">{item.summary}</p>
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">Key points:</span> {item.keyPoints.join(', ')}
                  </div>
                </div>
                <div className="ml-4 flex flex-col items-end">
                  <div className={`font-medium ${getPriceImpactColor(item.priceImpact)} text-sm`}>
                    {formatPriceImpact(item.priceImpact)}
                  </div>
                  <div className="text-xs text-gray-500">Price impact</div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {newsItems.length > 3 && (
          <div className="p-3 bg-[#F5F7FA] border-t border-gray-200 text-center">
            <Button 
              variant="link" 
              className="text-primary hover:text-primary/80 text-sm font-medium"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Show less" : `View all ${newsItems.length} news articles`}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
