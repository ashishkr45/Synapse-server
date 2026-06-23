import { NextFunction, Request, RequestHandler, Response } from "express";
import { AuthService } from "./auth.service";
import { z } from "zod"
import { ValidationError } from "../../utils/errors";

const GoogleLoginSchema = z.object({
	token: z.
		string({ required_error: "Google token is required" })
		.trim()
		.min(1 ,"Google token is required")
    .max(2048, "Google token is too long"),
});

export const AuthController = {
	googleLogin: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const result = GoogleLoginSchema.safeParse(req.body);

			if(!result.success) {
				throw new ValidationError("Invalid token provided", result.error.flatten());
			}

			const { token } = result.data;
			const appToken = await AuthService.processGoogleLogin(token)

			res.status(200).json({ token: appToken });
			return;
		} catch (error) {
			console.error("Error in Auth", error);
			next(error);
		}
	}
}