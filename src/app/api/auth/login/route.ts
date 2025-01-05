import { prisma } from "@/lib/prisma";
import { AuthForm, AuthFormSchema } from "@/schema/auth";
import { generateJWT } from "../../utils";
import { cookies } from "next/headers";
import { users } from "@prisma/client";
import bcrypt from "bcrypt";

const checkPassword = async (payload: AuthForm, dbResponse: users) => {
  try {
    const { password } = payload;
    const { password: dbPassword } = dbResponse;
    return await bcrypt.compare(password, dbPassword);
  } catch (error) {
    throw error;
  }
};

// const loginUser = async (payload: AuthForm, dbResponse: users) => {
// };

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
    status: 200,
    data: null,
    errors: null,
    message: "user logged in!",
  };

  try {
    const result: users[] = await prisma.$queryRaw`
      SELECT email, password
      FROM users
      WHERE email = ${payload.email};
    `;

    console.log(result, "result");
    // user present
    if (result.length !== 0) {
      const dbResponse = result[0];
      const verified = await checkPassword(payload, dbResponse);

      if (verified) {
        const jwt = await generateJWT(payload);
        const cookieStore = cookies();
        cookieStore.set("jwt", jwt);
      } else {
        responseObj = {
          status: 400,
          data: null,
          errors: [
            {
              code: "ERR_WRONG_PASSWORD",
              message: "invalid password",
            },
          ],
          message: null,
        };
      }
    } else {
      responseObj = {
        status: 400,
        data: null,
        errors: [
          {
            code: "ERR_USER_NOT_PRESENT",
            message: "user does not exists",
          },
        ],
        message: null,
      };
    }
  } catch (error) {
    console.error(error);
    responseObj = {
      status: 500,
      data: null,
      errors: [
        {
          code: "ERR_LOGIN_FAILED",
          message: "user login failed!",
        },
      ],
      message: null,
    };
  }

  return Response.json(responseObj, { status: responseObj.status });
}
