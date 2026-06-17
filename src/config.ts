import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
	PORT: z.string().default('8000'),
	MONGO_URL: z.string(),
	JWT_SECRET: z.string().min(10).max(50),
	CORS_URL: z.string().min(10).max(80),
	GOOGLE_CLIENT_ID: z.string().min(10).max(80),
	GOOGLE_CLIENT_SECRET: z.string().min(10).max(100),
	GOOGLE_REDIRECT_URI: z.string()
});

const parsed = envSchema.safeParse(process.env);

if(!parsed.success) {
	console.error("Invalid enviroment variables");
	console.error(parsed.error);
	process.exit(1);
}

export const port = parsed.data.PORT;
export const mongoUrl = parsed.data.MONGO_URL;
export const jwtSecret = parsed.data.JWT_SECRET;
export const corsUrl = parsed.data.CORS_URL;
export const googleClientSecret = parsed.data.GOOGLE_CLIENT_SECRET;
export const googleClientId = parsed.data.GOOGLE_CLIENT_ID;
export const googleRedirectUrl = parsed.data.GOOGLE_REDIRECT_URI;