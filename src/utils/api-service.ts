import "server-only";
import jwt from "jsonwebtoken";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { AuthFormType, AuthFormSchema } from "@/schema/auth";
import { User } from "@prisma/client";
import { Logger } from "tslog";

export const getUserByEmail = async ({
  email,
}: Omit<AuthFormType, "password">) => {
  try {
    const result: User[] = await prisma.$queryRaw`
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

export async function verifyJWT<T>(token: string): Promise<T | undefined> {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) throw new Error("JWT_SECRET not present");
  try {
    return jwt.verify(token, jwtSecret) as T;
  } catch {
    return;
  }
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

export const apiLogger = new Logger({ name: "api" });

export const validateAuthForm = (payload: AuthFormType) => {
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
