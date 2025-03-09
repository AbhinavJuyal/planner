import { StatusCodes } from "http-status-codes";

export interface ApiResponseType<T> {
  message: string;
  success: boolean;
  data: T;
  statusCode: number;
}

export class ApiResponse<T = null> {
  readonly message: string;
  readonly success: boolean;
  readonly data: T;
  readonly statusCode: number;

  constructor(
    success: boolean,
    message: string,
    data: T,
    statusCode: number = StatusCodes.OK,
  ) {
    this.message = message;
    this.success = success;
    this.data = data;
    this.statusCode = statusCode;
  }

  static success<T>(
    message: string,
    data: T,
    statusCode: number = StatusCodes.OK,
  ) {
    return new ApiResponse<T>(true, message, data, statusCode);
  }

  static failure<T>(
    message: string,
    data: T,
    statusCode: number = StatusCodes.BAD_REQUEST,
  ) {
    return new ApiResponse<T>(false, message, data, statusCode);
  }
}
