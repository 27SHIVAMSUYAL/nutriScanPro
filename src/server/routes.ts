import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertScanHistorySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/product/:barcode", async (req, res) => {
    try {
      const { barcode } = req.params;
      
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      );
      
      if (!response.ok) {
        return res.status(response.status).json({
          status: 0,
          status_verbose: "Product not found",
        });
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({
        status: 0,
        status_verbose: "Failed to fetch product data",
      });
    }
  });

  app.get("/api/history", async (_req, res) => {
    try {
      const history = await storage.getScanHistory();
      res.json(history);
    } catch (error) {
      console.error("Error fetching scan history:", error);
      res.status(500).json({ error: "Failed to fetch scan history" });
    }
  });

  app.post("/api/history", async (req, res) => {
    try {
      const validatedData = insertScanHistorySchema.parse(req.body);
      const scan = await storage.addToHistory(validatedData);
      res.json(scan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error adding to scan history:", error);
      res.status(500).json({ error: "Failed to add to scan history" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
