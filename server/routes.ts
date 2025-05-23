import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { fetchCompanyData } from "./openai";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint to analyze a company
  app.post("/api/analyze-company", async (req, res) => {
    try {
      // Validate request body
      const schema = z.object({
        companyName: z.string().min(1, "Company name is required")
      });

      const validationResult = schema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          error: validationResult.error.message
        });
      }

      const { companyName } = validationResult.data;

      // Store the search in history
      await storage.addSearchToHistory({ companyName });

      // Get cached analysis if available
      const cachedAnalysis = await storage.getCompanyAnalysisByName(companyName);
      
      if (cachedAnalysis) {
        // Return cached analysis if less than 24 hours old
        const analysisAge = Date.now() - cachedAnalysis.analysisDate.getTime();
        const twentyFourHours = 24 * 60 * 60 * 1000;
        
        if (analysisAge < twentyFourHours) {
          return res.json({
            success: true,
            data: storage.formatAnalysisForAPI(cachedAnalysis)
          });
        }
      }

      // Fetch fresh data from OpenAI
      const analysisData = await fetchCompanyData(companyName);
      
      // Store the new analysis
      await storage.saveCompanyAnalysis(analysisData);

      // Return the analysis
      return res.json({
        success: true,
        data: analysisData
      });
    } catch (error) {
      console.error("Error analyzing company:", error);
      return res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "An unknown error occurred"
      });
    }
  });

  // API endpoint to get search history
  app.get("/api/search-history", async (req, res) => {
    try {
      const history = await storage.getSearchHistory();
      
      return res.json({
        success: true,
        data: history
      });
    } catch (error) {
      console.error("Error fetching search history:", error);
      return res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "An unknown error occurred"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
