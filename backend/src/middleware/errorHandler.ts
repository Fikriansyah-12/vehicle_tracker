import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

// Custom error classes
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public details?: any) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, public originalError?: any) {
    super(message, 500);
    this.name = 'DatabaseError';
  }
}

// Error handler middleware
export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('💥 Error:', {
    message: error.message,
    name: error.name,
    stack: error.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params
  });

  // Default error response
  let statusCode = 500;
  let message = 'Internal server error';
  let details: any = undefined;

  // Handle different error types
  if (error instanceof ZodError) {
    statusCode = 400;
    message = 'Validation failed';
    details = error.issues.map((err: { path: any[]; message: any; }) => ({
      field: err.path.join('.'),
      message: err.message
    }));
  }
  else if (error instanceof JsonWebTokenError) {
    statusCode = 401;
    message = 'Invalid token';
  }
  else if (error instanceof TokenExpiredError) {
    statusCode = 401;
    message = 'Token expired';
  }
  else if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    
    if (error instanceof ValidationError) {
      details = error.details;
    }
    else if (error instanceof DatabaseError) {
      // Log database errors but don't expose details to client
      console.error('Database error:', error.originalError);
      message = 'Database operation failed';
    }
  }
  else if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
  }
  else if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }
  else if (error.name === 'MongoServerError') {
    statusCode = 400;
    message = 'Database error occurred';
  }

  // Development vs production error response
  const errorResponse: any = {
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && {
        stack: error.stack,
        type: error.name
      })
    }
  };

  if (details) {
    errorResponse.error.details = details;
  }

  res.status(statusCode).json(errorResponse);
};

// Async error wrapper (untuk menghindari try-catch di setiap controller)
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 404 handler (harus di akhir routes)
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
};