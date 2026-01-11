import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chalk from "chalk";

import generateItineraryRoute from "./routes/generateItinerary.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration for production
const allowedOrigins = [
  'https://traveloraa.vercel.app',
  'http://localhost:5173',
  'http://localhost:5000'
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
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
