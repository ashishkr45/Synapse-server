import { NextFunction, Request, Response } from "express";
import { jwtSecret } from "../config";
import jwt from "jsonwebtoken";

declare module "express-serve-static-core" {
    interface Request {
        userId?: string;
    }
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            res.status(401).json({ message: "authentication token missing!" });
            return;
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, jwtSecret as string) as { id: string };

        req.userId = decoded.id;

        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};
