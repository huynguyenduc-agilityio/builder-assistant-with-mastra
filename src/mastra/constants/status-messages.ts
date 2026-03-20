import { STATUS_CODE } from "./status-code";

export const STATUS_MESSAGES: Partial<Record<STATUS_CODE, string>> = {
  [STATUS_CODE.BAD_REQUEST]: 'Bad request. Please check your input.',
  [STATUS_CODE.UNAUTHORIZED]: 'Unauthorized. Please provide valid credentials.',
  [STATUS_CODE.NO_PERMISSION]: `You don't have permission to take this action.`,
  [STATUS_CODE.FORBIDDEN]: "Forbidden. You don't have access to this resource.",
  [STATUS_CODE.NOT_FOUND]: 'Resource not found.',
  [STATUS_CODE.METHOD_NOT_ALLOWED]: 'Method not allowed on this endpoint.',
  [STATUS_CODE.TOO_MANY_REQUESTS]: 'Too many requests. Please try again later.',
  [STATUS_CODE.INTERNAL_SERVER_ERROR]:
    'Internal server error. Please try again later.',
  [STATUS_CODE.SERVICE_UNAVAILABLE]:
    'Service is currently unavailable. Please try again later.',
};

