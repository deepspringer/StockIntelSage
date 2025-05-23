import OpenAI from "openai";
import { AnalysisResult } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "your-api-key-here",
});

export async function fetchCompanyData(
  companyName: string,
): Promise<AnalysisResult> {
  try {
    console.log(
      `Fetching real-time data for ${companyName} using web search...`,
    );

    // First, use the Responses API with web search to get up-to-date information
    const webSearchResponse = await openai.responses.create({
      model: "gpt-4.1",
      tools: [{
        type: "web_search_preview",
        search_context_size: "high", // Using high context for comprehensive financial data
      }],
      input: `Search for the latest financial information and news about ${companyName}, including:
      
      1. Current stock price and recent performance
      2. Latest financial metrics and earnings information
      3. Recent news coverage and sentiment
      4. Analyst ratings and price predictions
      
      Be specific about the sources of the information.`,
    });

    // Extract web search results and citations
    console.log("Web search completed, processing results...");
    
    const messageContent = webSearchResponse.output[1]?.content[0];
    if (!messageContent) {
      throw new Error("Could not extract web search results from response");
    }
    
    const webSearchResults = messageContent.text;
    const citations = messageContent.annotations?.map(citation => {
      console.log("[Server] Original citation URL:", citation.url);
      return {
        title: citation.title,
        url: citation.url,
        startIndex: citation.start_index,
        endIndex: citation.end_index
      };
    }) || [];
    
    console.log("Web search results:", webSearchResults);
    console.log("Citations:", citations);

    // Now format the data into our required JSON structure
    const prompt = `
    Based on this recent web search information about ${companyName}:
    
    ${webSearchResults}
    
    Format the data into this JSON structure:
    {
      "companyInfo": {
        "name": "Full company name with ticker",
        "tickerSymbol": "TICKER",
        "currentPrice": "$XX.XX",
        "priceChange": "+/-X.XX%",
        "analysisDate": "${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}",
        "analysisTime": "${new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}",
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
    
    Use only real data found in the web search results. Include specific source attribution for all data points. 
    If you cannot find specific information, indicate that in the relevant field rather than making up data.
    `;

    // Format the web search results into our JSON structure
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a financial data processor that accurately formats real financial information from web searches into structured JSON for financial analysis.",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3, // Lower temperature for more factual formatting
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
    throw new Error(
      `Failed to analyze company: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

export async function analyzeSentiment(text: string): Promise<number> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a sentiment analysis expert. Analyze the sentiment of the text and provide a rating from -1 (very negative) to 1 (very positive) where 0 is neutral. Respond with just the number.",
        },
        { role: "user", content: text },
      ],
    });

    const sentiment = parseFloat(response.choices[0].message.content || "0");
    return isNaN(sentiment) ? 0 : Math.max(-1, Math.min(1, sentiment));
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    return 0; // Default to neutral on error
  }
}
