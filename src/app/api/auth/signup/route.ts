import { prisma } from "@/lib/prisma";
import {
  ApiErrorMapping,
  createErrorResponse,
  createSuccessResponse,
  generateJWT,
  getUserByEmail,
  logger,
  validateAuthForm,
} from "@/utils/api-service";
import { ApiErrorCodes } from "@/utils/constants";
import { users } from "@prisma/client";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

const saltRounds = Number(process.env.HASH_SALT_ROUNDS) || 10;

const createUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const result: users[] = await prisma.$queryRaw`
      INSERT INTO users (email, password)
      VALUES (${email}, ${hashedPassword})
      RETURNING email, username;
    `;
    return result[0];
  } catch (error) {
    throw error;
  }
};

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { valid, errors, data } = validateAuthForm(payload);

    if (!valid) {
      return Response.json(errors, {
        status: 400,
      });
    }

    const { email } = data;

    const user = await getUserByEmail({ email });

    // user already exists
    if (user) {
      const error = ApiErrorMapping[ApiErrorCodes.ERR_USER_PRESENT];
      return Response.json(createErrorResponse([{ ...error }]), {
        status: 400,
      });
    }

    // no existing user
    const newUser = await createUser(payload);
    const jwt = await generateJWT({
      email: newUser.email,
      fullname: newUser.fullname,
    });
    const cookieStore = cookies();
    cookieStore.set("jwt", jwt, {
      httpOnly: true,
      maxAge: Number(process.env.JWT_EXPIRY || 86400),
    });

    return Response.json(
      createSuccessResponse("user created successfully", null, 201),
      { status: 201 },
    );
  } catch (error) {
    logger.fatal(error);
    const errorToSend = ApiErrorMapping[ApiErrorCodes.ERR_SERVER_FAIL];
    return Response.json(createErrorResponse([{ ...errorToSend }]), {
      status: 500,
    });
  }
}
