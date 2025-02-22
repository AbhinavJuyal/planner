import { verifyJWT } from "@/utils/api-service";
import { StatusCodes } from "http-status-codes";
import { NextResponse, type NextRequest } from "next/server";
import { Logger } from "tslog";

const logger = new Logger({ name: "middleware" });
async function checkForAuthentication(cookies: NextRequest["cookies"]) {
  try {
    const jwtToken = cookies.get("jwt");
    if (!jwtToken) return false;

    const decodedToken = await verifyJWT(jwtToken.value);

    logger.info(jwtToken.value, decodedToken);
    return Boolean(decodedToken);
  } catch (e) {
    logger.error(e);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const cookies = request.cookies;
  const isAuthenticated = await checkForAuthentication(cookies);
  logger.info(request.url, isAuthenticated);
  // if (!isAuthenticated) {
  //   return NextResponse.redirect(new URL("/login", request.url), {
  //     status: StatusCodes.PERMANENT_REDIRECT,
  //   });
  // }
}

export const config = {
  matcher: ["/app/:path*", "/api/all-boards", "/api/create-board"],
};
