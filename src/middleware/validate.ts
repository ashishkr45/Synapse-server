import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { ValidationError } from "../utils/errors";

export const Validate = (
	schema: ZodSchema,
	source: 'body' | 'params' | 'query' = 'body'
) => {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			const result = schema.safeParse(req[source]);

			if(!result.success) {
				const errors = result.error.flatten();
				throw new ValidationError('Validation failed', errors);
			}

			req[source] = result.data;
			next();
		} catch(error) {
			next(error);
		}
	}
}