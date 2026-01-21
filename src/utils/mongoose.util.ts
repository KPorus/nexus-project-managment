import { HTTP_STATUS_CODES } from "./http-status-codes";
import mongoose from "mongoose";
// import { MongoServerError } from "mongodb";

type TMongooseErrorType =
  | "CastError"
  | "ValidationError"
  | "DocumentNotFoundError"
  | "MongoServerError";

type TMongooseErrorMap = {
  [key in TMongooseErrorType]: {
    code: number;
    message: string;
  };
};

export const MONGOOSE_ERROR_MAP: TMongooseErrorMap = {
  CastError: {
    code: HTTP_STATUS_CODES.BAD_REQUEST,
    message: "Invalid data format",
  },
  ValidationError: {
    code: HTTP_STATUS_CODES.BAD_REQUEST,
    message: "Validation failed",
  },
  DocumentNotFoundError: {
    code: HTTP_STATUS_CODES.NOT_FOUND,
    message: "Document not found",
  },
  MongoServerError: {
    code: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
    message: "Database operation failed",
  },
};

export const DEFAULT_MONGOOSE_ERROR = {
  code: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
  message: "An unexpected database error occurred",
};

// export type TMongooseError =
//   | MongooseError.CastError
//   | MongooseError.ValidationError
//   | MongooseError.DocumentNotFoundError
//   | MongoServerError;

export const MONGO_SERVER_ERROR_CODE_MAP: Record<
  number,
  { code: number; message: string }
> = {
  11000: {
    code: HTTP_STATUS_CODES.CONFLICT,
    message: "Duplicate value violates unique constraint E11000",
  },
  13: {
    code: HTTP_STATUS_CODES.UNAUTHORIZED,
    message: "Unauthorized database access",
  },
};

export const DEFAULT_MONGOOSE_SERVER_ERROR = {
  code: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
  message: "An unexpected database error occurred",
};

export function isAnyMongoError(
  error: unknown,
): error is mongoose.Error | mongoose.mongo.MongoServerError {
  return (
    error instanceof mongoose.Error ||
    error instanceof mongoose.mongo.MongoServerError
  );
}


