import express from "express";
import cors from "cors";
import helmet from "helmet";
import router from "./routes/index.route";
import { corsUrl } from "./config";
import connectDB from "./database/db";

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors({
  origin: corsUrl
})); 

connectDB();
app.use("/api", router); 

export default app;