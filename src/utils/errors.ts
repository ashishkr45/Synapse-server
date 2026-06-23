export interface AppErrorOptions {
	message: string;
	statusCode: number;
	errorCode: string;
	details?: unknown;
	isOperational?: boolean
}

export class AppError extends Error {
	public readonly statusCode: number;
	public readonly errorCode: string;
  public readonly details?: unknown;
  public readonly isOperational: boolean;
  public readonly timestamp: Date;

	constructor(options: AppErrorOptions) {
		super(options.message);
		Object.setPrototypeOf(this, AppError.prototype);
		this.statusCode = options.statusCode;
		this.errorCode = options.errorCode;
		this.details = options.details;
		this.isOperational = options.isOperational ?? false;
		this.timestamp = new Date();

		Error.captureStackTrace(this, this.constructor);
	}
}

export class ValidationError extends AppError {
	constructor(message: string, details?: unknown) {
		super({
			message,
			statusCode: 400,
			errorCode: "VALIDATION_ERROR",
			details,
			isOperational: true
		});
		Object.setPrototypeOf(this, ValidationError.prototype);
	}
}

export class AuthenticationError extends AppError {
  constructor(message = "Authentication failed") {
    super({
      message,
      statusCode: 401,
      errorCode: "AUTHENTICATION_ERROR",
      isOperational: true,
    });
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "Unauthorized access") {
    super({
      message,
      statusCode: 403,
      errorCode: "AUTHORIZATION_ERROR",
      isOperational: true,
    });
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super({
      message: `${resource} not found`,
      statusCode: 404,
      errorCode: "NOT_FOUND",
      isOperational: true,
    });
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super({
      message,
      statusCode: 409,
      errorCode: "CONFLICT",
      isOperational: true,
    });
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

export class DatabaseError extends AppError {
  constructor(message = "Database operation failed", details?: unknown) {
    super({
      message,
      statusCode: 500,
      errorCode: "DATABASE_ERROR",
      details,
      isOperational: false,
    });
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}

export class InternalServerError extends AppError {
  constructor(message = "Internal server error") {
    super({
      message,
      statusCode: 500,
      errorCode: "INTERNAL_SERVER_ERROR",
      isOperational: false,
    });
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}