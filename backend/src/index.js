import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chalk from "chalk";

import generateItineraryRoute from "./routes/generateItinerary.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : '*',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/generate-itinerary", generateItineraryRoute);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/", (_req, res) => {
  res.status(200).json({ 
    message: "Travelora API",
    status: "ok",
    endpoints: {
      health: "/health",
      generateItinerary: "/api/generate-itinerary"
    }
  });
});

// Only start server if not in Vercel serverless environment
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(
      chalk.green.bold("🚀 Server running!") +
        "\n" +
        chalk.blue(`➡  http://localhost:${PORT}`) +
        "\n" +
        chalk.gray(`ENV: ${process.env.NODE_ENV || "development"}`)
    );
  });
}

export default app;
