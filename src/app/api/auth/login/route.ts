import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import {
  getUserByEmail,
  generateJWT,
  apiLogger,
  validateAuthForm,
} from "@/utils/api-service";
import { ServiceResponse } from "@/utils/serviceResponse";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

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
        ServiceResponse.failure("User is not registered!", null),
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
        ServiceResponse.failure("Password is incorrect.", null),
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

    return Response.json(ServiceResponse.success("User now logged in!", data), {
      status: StatusCodes.OK,
    });
  } catch (error) {
    apiLogger.fatal(error);
    return Response.json(
      ServiceResponse.failure(
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
