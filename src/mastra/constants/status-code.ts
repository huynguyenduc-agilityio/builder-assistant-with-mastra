export enum STATUS_CODE {
  // Successful responses
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,

  // Client error responses
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NO_PERMISSION = 407,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  TOO_MANY_REQUESTS = 429,

  // Server error responses
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503
}
