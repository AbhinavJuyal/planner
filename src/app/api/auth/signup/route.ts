import { prisma } from "@/lib/prisma";
import { AuthFormSchema } from "@/schema/auth";
import bcrypt from "bcrypt";
import { generateJWT } from "../../utils";
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
    await prisma.$queryRaw`
      INSERT INTO users (email, password)
      VALUES (${email}, ${hashedPassword})
    `;
  } catch (error) {
    throw error;
  }
};

export async function POST(request: Request) {
  const payload = await request.json();

  const validationResult = AuthFormSchema.safeParse(payload);

  if (!validationResult.success) {
    return Response.json(
      {
        message: "validation error",
        error: validationResult.error,
      },
      { status: 400 },
    );
  }

  let responseObj: ApiResponseType = {
    status: 201,
    data: null,
    errors: null,
    message: "user created successfully!",
  };

  try {
    const result: unknown[] = await prisma.$queryRaw`
      SELECT email
      FROM users
      WHERE email = ${payload.email};
    `;

    // no existing user
    // create new user
    if (result.length === 0) {
      await createUser(payload);
      const jwt = await generateJWT(payload);
      const cookieStore = cookies();
      cookieStore.set("jwt", jwt);
    } else {
      responseObj = {
        status: 400,
        data: null,
        errors: [
          {
            code: "ERR_USER_PRESENT",
            message: "user already exists",
          },
        ],
        message: null,
      };
    }
  } catch {
    responseObj = {
      status: 500,
      data: null,
      errors: [
        {
          code: "ERR_SIGNUP_FAILED",
          message: "user creation failed!",
        },
      ],
      message: null,
    };
  }

  return Response.json(responseObj, { status: responseObj.status });
}
