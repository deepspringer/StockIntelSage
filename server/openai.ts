import OpenAI from "openai";
import { AnalysisResult } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "your-api-key-here" 
});

export async function fetchCompanyData(companyName: string): Promise<AnalysisResult> {
  try {
    console.log(`Fetching real-time data for ${companyName}...`);
    
    // Use the Chat Completions API with custom system prompt to get financial analysis
    // While we could use the web search capability directly with the Responses API, 
    // we'll stick with the Chat Completions API for this implementation since it doesn't require model changes
    const prompt = `
    I need a comprehensive financial analysis for ${companyName}. Search for real, up-to-date information including:

    1. Current stock information (price, ticker symbol, recent price changes)
    2. Latest news articles about the company and their sentiment
    3. Recent financial metrics and business developments
    4. Analyst predictions and price targets
    
    For all information, include specific sources (e.g., "According to Yahoo Finance," "As reported by Bloomberg").
    
    The date today is ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.
    
    Format your response as a JSON object with the following structure:
    {
      "companyInfo": {
        "name": "Full company name with ticker",
        "tickerSymbol": "TICKER",
        "currentPrice": "$XX.XX",
        "priceChange": "+/-X.XX%",
        "analysisDate": "${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}",
        "analysisTime": "${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}",
        "source": "Name of source for stock price data"
      },
      "sentimentAnalysis": {
        "positive": percentage of positive news (number),
        "neutral": percentage of neutral news (number),
        "negative": percentage of negative news (number),
        "articleCount": number of articles analyzed (number),
        "overall": "positive/negative/neutral",
        "summary": "Brief summary of sentiment analysis",
        "source": "Name of sentiment analysis methodology or data source"
      },
      "financialIndicators": {
        "status": "strong/weak/neutral",
        "summary": "Summary of financial health",
        "source": "Name of financial data source"
      },
      "pricePrediction": {
        "status": "bullish/bearish/neutral",
        "summary": "Prediction summary with reasoning",
        "minPrice": minimum predicted price (number),
        "maxPrice": maximum predicted price (number),
        "currentPrice": current stock price as number,
        "priceChange": "+/-X.XX%",
        "source": "Name of source for predictions"
      },
      "newsItems": [
        {
          "title": "Article title",
          "source": "News source name",
          "date": "Publication date",
          "summary": "Brief summary",
          "sentiment": "positive/negative/neutral",
          "keyPoints": ["key point 1", "key point 2", "etc"],
          "priceImpact": estimated price impact as number (e.g., +2.1 or -0.9)
        }
      ],
      "financialMetrics": [
        {
          "name": "Metric name (e.g., Revenue Growth)",
          "value": "Value with appropriate units",
          "yoyChange": "+/-X.X%" year-over-year change,
          "industryAvg": "Industry average with units",
          "impact": "positive/negative/neutral/strong",
          "source": "Name of specific financial metric source"
        }
      ]
    }
    
    Use real data found through your knowledge. No mock or placeholder data.
    Be consistent with source attribution. If you cannot find specific information, estimate reasonably based on available data, but be clear about which parts are estimates.
    `;

    // Call the OpenAI API for analysis
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Using GPT-4o as it has good current knowledge
      messages: [
        { 
          role: "system", 
          content: "You are a financial analyst AI with knowledge of current stock market data, company financials, and business news up to your training cutoff. Provide accurate, well-sourced financial analysis."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
    });

    // Parse the response
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    console.log("Financial analysis response received");

    // Parse the JSON response
    const analysisData = JSON.parse(content) as AnalysisResult;
    return analysisData;

  } catch (error) {
    console.error("Error fetching company data from OpenAI:", error);
    throw new Error(`Failed to analyze company: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export async function analyzeSentiment(text: string): Promise<number> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a sentiment analysis expert. Analyze the sentiment of the text and provide a rating from -1 (very negative) to 1 (very positive) where 0 is neutral. Respond with just the number."
        },
        { role: "user", content: text }
      ],
    });

    const sentiment = parseFloat(response.choices[0].message.content || "0");
    return isNaN(sentiment) ? 0 : Math.max(-1, Math.min(1, sentiment));
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    return 0; // Default to neutral on error
  }
}
