import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import {
  getUserByEmail,
  apiLogger,
  validateAuthForm,
} from "@/utils/api-helpers";
import { ApiResponse } from "@/utils/api-response";
import { generateJWT } from "@/utils/jwt";

const checkPassword = async (userPassword: string, dbPassword: string) => {
  try {
    return await bcrypt.compare(userPassword, dbPassword);
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

    // user not registerd
    if (!user) {
      return Response.json(
        ApiResponse.failure("User is not registered!", null),
        {
          status: StatusCodes.BAD_REQUEST,
        },
      );
    }

    // user is registered
    const verified = await checkPassword(payload.password, user.password);

    // password is invalid
    if (!verified) {
      return Response.json(
        ApiResponse.failure("Password is incorrect.", null),
        {
          status: StatusCodes.BAD_REQUEST,
        },
      );
    }

    // password is valid
    const jwt = await generateJWT({
      email: user.email,
      fullname: user.fullName,
    });

    const cookieStore = cookies();

    cookieStore.set("jwt", jwt, {
      httpOnly: true,
      maxAge: Number(process.env.JWT_EXPIRY || 86400),
    });

    return Response.json(ApiResponse.success("User now logged in!", null), {
      status: StatusCodes.OK,
    });
  } catch (error) {
    apiLogger.fatal(error);
    return Response.json(
      ApiResponse.failure(
        ReasonPhrases.INTERNAL_SERVER_ERROR,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      ),
      {
        status: 500,
      },
    );
  }
}
