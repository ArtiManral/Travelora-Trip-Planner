import express from "express";
import { generateItinerary } from "../services/aiService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const itinerary = await generateItinerary(req.body);
    return res.json(itinerary);
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Failed to generate itinerary",
    });
  }
});

export default router;
