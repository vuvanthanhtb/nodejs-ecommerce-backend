"use strict";

const StatusCode = {
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
};

const ReasonStatusCode = {
  FORBIDDEN: "Forbidden resource",
  UNAUTHORIZED: "Unauthorized to access resource",
  NOT_FOUND: "Resource not found",
  CONFLICT: "Conflict request",
  UNPROCESSABLE_ENTITY: "Unprocessable entity",
  INTERNAL_SERVER_ERROR: "Internal server error",
};

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.CONFLICT,
    statusCode = StatusCode.CONFLICT
  ) {
    super(message, statusCode);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.CONFLICT,
    statusCode = StatusCode.FORBIDDEN
  ) {
    super(message, statusCode);
  }
}

module.exports = {
  ConflictRequestError,
  BadRequestError,
};
