import express from "express";
import cors from "cors";
import helmet from "helmet";
import router from "./routes/index.route";
import { corsUrl } from "./config";
import connectDB from "./database/db";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { apiLimiter } from "./middleware/rateLimiter";

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors({ origin: corsUrl })); 

connectDB();

app.use("/api", apiLimiter);

app.use("/api", router); 

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is Good",
    timestamp: new Date().toISOString,
  })
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;