import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 5,
	message: "Server exhausted, please try again in 15 min",
	standardHeaders: true,
	legacyHeaders: false,
	skipFailedRequests: false,
});

export const contentCreationLimiter = rateLimit({
	windowMs: 15 * 60 * 100,
	limit: 50,
	message: "Server exhausted, please try again in 15 min",
	standardHeaders: true,
  legacyHeaders: false,
});

export const contentSharingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: 'Too many share requests, please slow down',
  standardHeaders: true,
  legacyHeaders: false,
});

export const readOnlyLimiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	limit: 500,
	message: "Server exhausted, please try again in 15 min",
	standardHeaders: true,
  legacyHeaders: false,
});

export const apiLimiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	limit: 1000,
	message: "Server exhausted, please try again in 15 min",
	standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
		return req.path === '/health';
	},
});