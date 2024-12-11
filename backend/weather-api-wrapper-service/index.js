import express from "express";
import dotenv from "dotenv";
import ratelimit from "express-rate-limit";
import { getWeatherData } from "./utils/apiClient.js";
import { getCache, setCache, redisClient } from "./utils/cache.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const apiKey = process.env.API_KEY;

const limiter = ratelimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
  message: "Too many requests, please try again later",
});

app.use(limiter);

app.get("/weather", async (req, res) => {
  const city = req.query.city;
  if (!city) {
    return res.status(400).json({ error: "City parameter is required!" });
  }

  try {
    const cacheData = await getCache(city);
    if (cacheData) {
      return res.json({ source: "cache", data: JSON.parse(cacheData) });
    }
    const weatherData = await getWeatherData(city, apiKey);
    if (weatherData) {
      await setCache(city, weatherData);
      return res.json({ source: "api", data: weatherData });
    }
    res.status(404).json({ error: "Weather data not found" });
  } catch (error) {
    console.error("Error fetching from weather data", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

process.on("SIGINT", () => {
  redisClient.quit();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
