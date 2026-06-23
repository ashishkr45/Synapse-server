import { Request, Response, NextFunction, RequestHandler } from "express";
import { AppError } from "../utils/errors";
import { ZodError } from 'zod';

interface ErrorResponse {
	success: false;
	error: {
		code: string;
		message: string;
		statusCode: number;
		details?: unknown;
		timestamp: string;
	};
}

export const errorHandler = (
	error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
	const timestamp = new Date().toISOString();

	let statusCode = 500;
  let errorCode = "INTERNAL_SERVER_ERROR";
  let message = "Internal server error";
  let details: unknown = undefined;

	if(error instanceof AppError) {
		statusCode = error.statusCode;
		errorCode = error.errorCode;
		message = error.message;
		details = error.details;

		if (!error.isOperational && process.env.NODE_ENV === "production") {
      message = "An unexpected error occurred. Please try again later.";
      details = undefined;
    }
	} else if (error instanceof ZodError) {
    statusCode = 400;
    errorCode = "VALIDATION_ERROR";
    message = "Validation failed";
    details = error.flatten();
  }
  // Handle Generic Errors
  else if (error instanceof Error) {
    if (process.env.NODE_ENV === "development") {
      message = error.message;
    }
  }

	const errorResponse: ErrorResponse = {
		success: false,
		error: {
			code: errorCode,
			message,
			statusCode,
			...(details !== undefined ? { details } : {}),
			timestamp
		},
	};

	res.status(statusCode).json(errorResponse);
};

export const notFoundHandler: RequestHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: `Route ${req.path} not found`,
      statusCode: 404,
      timestamp: new Date().toISOString(),
    },
  });
};