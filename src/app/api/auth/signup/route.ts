import { prisma } from "@/lib/prisma";
import {
  getUserByEmail,
  apiLogger,
  validateAuthForm,
} from "@/utils/api-service";
import { generateJWT } from "@/utils/jwt";
import { ApiResponse } from "@/utils/api-response";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { cookies } from "next/headers";

const saltRounds = Number(process.env.HASH_SALT_ROUNDS) || 10;

const createUser = async ({
  email,
  password,
}: Pick<User, "email" | "password" | "fullName">) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const result: User[] = await prisma.$queryRaw`
      INSERT INTO users (email, password)
      VALUES (${email}, ${hashedPassword})
      RETURNING email, username, fullname;
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
      return Response.json(ApiResponse.failure("User already exists!", null), {
        status: StatusCodes.BAD_REQUEST,
      });
    }

    // no existing user
    const newUser = await createUser(payload);
    const jwt = await generateJWT({
      email: newUser.email,
      fullname: newUser.fullName,
    });

    const cookieStore = cookies();

    cookieStore.set("jwt", jwt, {
      httpOnly: true,
      maxAge: Number(process.env.JWT_EXPIRY || 86400),
    });

    return Response.json(
      ApiResponse.success(
        "User created successfully!",
        null,
        StatusCodes.CREATED,
      ),
      { status: 201 },
    );
  } catch (error) {
    apiLogger.fatal(error);
    return Response.json(
      ApiResponse.failure(ReasonPhrases.INTERNAL_SERVER_ERROR, null),
      {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      },
    );
  }
}
