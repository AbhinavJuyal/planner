import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import {
  createErrorResponse,
  getUserByEmail,
  ApiErrorMapping,
  generateJWT,
  createSuccessResponse,
  logger,
  validateAuthForm,
} from "@/utils/api-service";
import { ApiErrorCodes } from "@/utils/constants";

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
      const error = ApiErrorMapping[ApiErrorCodes.ERR_USER_NOT_PRESENT];
      return Response.json(createErrorResponse([{ ...error }]), {
        status: 400,
      });
    }

    // user is registered
    const verified = await checkPassword(payload.password, user.password);

    // password is invalid
    if (!verified) {
      const error = ApiErrorMapping[ApiErrorCodes.ERR_WRONG_PASSWORD];
      return Response.json(createErrorResponse([{ ...error }]), {
        status: 400,
      });
    }

    // password is valid
    const jwt = await generateJWT({
      email: user.email,
      fullname: user.fullname,
    });
    const cookieStore = cookies();
    cookieStore.set("jwt", jwt, {
      httpOnly: true,
      maxAge: Number(process.env.JWT_EXPIRY || 86400),
    });

    return Response.json(createSuccessResponse("User logged in!"), {
      status: 200,
    });
  } catch (error) {
    logger.fatal(error);
    const errorToSend = ApiErrorMapping[ApiErrorCodes.ERR_SERVER_FAIL];
    return Response.json(createErrorResponse([{ ...errorToSend }]), {
      status: 500,
    });
  }
}
