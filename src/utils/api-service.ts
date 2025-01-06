import "server-only";
import jwt from "jsonwebtoken";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { AuthForm, AuthFormSchema } from "@/schema/auth";
import { users } from "@prisma/client";
import { ApiErrorCodes } from "@/utils/constants";
import { Logger } from "tslog";

export const ApiErrorMapping: Record<
  ApiErrorCodes,
  { status: number; code: ApiErrorCodes; message: string }
> = {
  // signup errors
  [ApiErrorCodes.ERR_USER_PRESENT]: {
    status: 400,
    code: ApiErrorCodes.ERR_USER_PRESENT,
    message: "User is already registered",
  },

  // login errors
  [ApiErrorCodes.ERR_USER_NOT_PRESENT]: {
    status: 400,
    code: ApiErrorCodes.ERR_USER_NOT_PRESENT,
    message: "User is not registered",
  },
  [ApiErrorCodes.ERR_WRONG_PASSWORD]: {
    status: 400,
    code: ApiErrorCodes.ERR_WRONG_PASSWORD,
    message: "Password is incorrect.",
  },

  // server error
  [ApiErrorCodes.ERR_SERVER_FAIL]: {
    status: 500,
    code: ApiErrorCodes.ERR_SERVER_FAIL,
    message: "Unable to perform action. Try again later",
  },
} as const;

export const getUserByEmail = async ({ email }: Omit<AuthForm, "password">) => {
  try {
    const result: users[] = await prisma.$queryRaw`
      SELECT email, password, fullname
      FROM users
      WHERE email = ${email};
    `;

    return result[0];
  } catch (error) {
    throw error;
  }
};

export async function generateJWT(payload: {
  email: string;
  fullname: string;
}) {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpiry = Number(process.env.JWT_EXPIRY);
  if (!jwtSecret) throw new Error("JWT_SECRET not present");
  if (!jwtExpiry) throw new Error("JWT_EXPIRY not present");
  return jwt.sign(payload, jwtSecret, {
    expiresIn: jwtExpiry,
  });
}

export function createSuccessResponse(
  message: ApiResponse["message"],
  data: ApiResponse["data"] = null,
  status: ApiResponse["status"] = 200,
): ApiResponse {
  return {
    status,
    data: data,
    errors: null,
    message,
  };
}

export function createErrorResponse(
  errors: ApiError[],
  status: ApiResponse["status"] = 400,
): ApiResponse {
  return {
    status,
    data: null,
    errors,
    message: null,
  };
}

export function formatValidationErrors(zodError: ZodError): ApiError[] {
  return zodError.errors.map((error) => ({
    code: `ERR_VALIDATION_${error.path.join("_").toUpperCase()}`,
    message: error.message,
  }));
}

export const logger = new Logger({ name: "api-service" });

export const validateAuthForm = (payload: AuthForm) => {
  const validationResult = AuthFormSchema.safeParse(payload);

  if (!validationResult.success) {
    return {
      valid: false,
      errors: formatValidationErrors(validationResult.error),
      data: payload,
    };
  }

  return { valid: true, errors: [], data: payload };
};
