import OpenAI from "openai";
import { AnalysisResult } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "your-api-key-here" 
});

export async function fetchCompanyData(companyName: string): Promise<AnalysisResult> {
  try {
    // Create a detailed prompt for the OpenAI API
    const prompt = `
    I need a comprehensive financial analysis for ${companyName}. Please provide:

    1. Basic company information including ticker symbol and current stock price with recent price change percentage
    2. Recent news sentiment analysis with percentages for positive, neutral, and negative coverage
    3. Key financial indicators and metrics with year-over-year changes and industry comparisons
    4. Stock price prediction for the next 30 days with predicted range
    5. Detailed analysis of 3-5 recent news articles that impact the stock price

    IMPORTANT: Today's date is May 23, 2025. All news articles, financial data, and other information should be from 2025 (primarily) or late 2024. Do not include any news or data from before 2024.

    Format the response as a JSON object with the following structure:
    {
      "companyInfo": {
        "name": "Full company name with ticker",
        "tickerSymbol": "TICKER",
        "currentPrice": "$XX.XX",
        "priceChange": "+/-X.XX%",
        "analysisDate": "Current date in format 'Month Day, Year'",
        "analysisTime": "Current time in format 'H:MM AM/PM'"
      },
      "sentimentAnalysis": {
        "positive": percentage of positive news (number),
        "neutral": percentage of neutral news (number),
        "negative": percentage of negative news (number),
        "articleCount": number of articles analyzed (number),
        "overall": "positive/negative/neutral",
        "summary": "Brief summary of sentiment analysis"
      },
      "financialIndicators": {
        "status": "strong/weak/neutral",
        "summary": "Summary of financial health"
      },
      "pricePrediction": {
        "status": "bullish/bearish/neutral",
        "summary": "Prediction summary with reasoning",
        "minPrice": minimum predicted price (number),
        "maxPrice": maximum predicted price (number),
        "currentPrice": current stock price as number,
        "priceChange": "+/-X.XX%"
      },
      "newsItems": [
        {
          "title": "Article title",
          "source": "News source",
          "date": "Publication date from 2025 only",
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
          "impact": "positive/negative/neutral/strong"
        }
      ]
    }
    
    Do not include the word "mock" or "example" in any text. Provide realistic data based on current information about the company, but make sure all dates are from 2025 or very late 2024.
    `;

    // Call the OpenAI API for analysis
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Using the latest model
      messages: [
        { role: "system", content: "You are a financial analyst AI with access to current market data and news. Provide accurate, detailed analysis of companies and their stock performance." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    // Parse the response
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }

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
