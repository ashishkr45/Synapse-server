import { Request, Response, NextFunction } from "express";

type AsyncControllerFn = (
	req: Request,
	res: Response,
	next: NextFunction
) => Promise<void>;

export const asyncHandler = (fn: AsyncControllerFn) => 
	(req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	}