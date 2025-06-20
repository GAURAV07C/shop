export class AppError extends Error {

  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(message: string, statusCode: number, isOperational = true, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    // Set the error name to the class name.
    Error.captureStackTrace(this, this.constructor);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}


// Not Found Error
export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
    
  }
}

// validation Error(use for joi/zod/reaxct-hook-form validation errors)

export class ValidationError extends AppError {
  constructor(message: string = 'Invalid request data', details?: any) {
    super(message, 400, true, details);
  }
}

//authentication Error
export class AuthError extends AppError {
  constructor(message: string = 'Unauthorizes') {
    super(message, 401);
  }
}

//Forbidden Error
export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden access') {
    super(message, 403);
  }
}

// Database Error (For example, MongoDB, PostgreSQL errors)

export class DatabaseError extends AppError {
  constructor(message: string = 'Database error', details?: any) {
    super(message, 500, true, details);
  }
}


// rate limit error
export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests') {
    super(message, 429);
  }
}

