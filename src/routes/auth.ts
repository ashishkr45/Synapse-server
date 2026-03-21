import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import { User } from "../database/db"; 
import { OAuth2Client } from 'google-auth-library';

const loginRouter: Router = Router();

if (!process.env.JWT_SECRET || !process.env.GOOGLE_CLIENT_ID) {
  throw new Error("FATAL ERROR: JWT_SECRET or GOOGLE_CLIENT_ID is not defined.");
}

const JWT_SECRET = process.env.JWT_SECRET as string;
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

loginRouter.post('/google-login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;

    if (!token || typeof token !== 'string') {
      res.status(400).json({ message: "Google ID token is required" });
      return;
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      res.status(401).json({ message: "Invalid or incomplete Google token" });
      return;
    }

    const { email, name, picture, sub } = payload;

    let user = await User.findOne({ email });
    
    if (!user) {
      user = await User.create({
        email,
        username: name || email.split('@')[0],
        googleId: sub,
      });
    }

    const appToken = jwt.sign(
      { id: user._id.toString() }, 
      JWT_SECRET,
      { expiresIn: '7d' } 
    );

    res.status(200).json({ token: appToken });

  } catch (error) {
    console.error("[Auth Error] Failed to verify Google token:", error instanceof Error ? error.message : "Unknown error");
    res.status(500).json({ message: "Authentication failed. Please try again later." });
  }
});

export default loginRouter;