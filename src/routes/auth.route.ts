import { Router } from "express";
import { AuthController } from "../modules/auth/auth.controller";
import { loginLimiter } from "../middleware/rateLimiter";

const loginRouter: Router = Router();

loginRouter.post(
	'/google-login',
	loginLimiter,
	AuthController.googleLogin);

export default loginRouter;