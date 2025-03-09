import { Logger } from "tslog";
import { NextResponse, type NextRequest } from "next/server";
import { verifyJWT } from "./utils/jwt";
import { StatusCodes } from "http-status-codes";

const logger = new Logger({ name: "middleware" });

async function checkForAuthentication(cookies: NextRequest["cookies"]) {
  try {
    const jwtToken = cookies.get("jwt");
    if (!jwtToken) return false;

    const decodedToken = await verifyJWT(jwtToken.value);

    return Boolean(decodedToken);
  } catch (e) {
    logger.error(e);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const cookies = request.cookies;
  const isAuthenticated = await checkForAuthentication(cookies);
  if (!true) {
    return NextResponse.redirect(new URL("/login", request.url), {
      status: StatusCodes.PERMANENT_REDIRECT,
    });
  }
}

export const config = {
  matcher: ["/app/:path*", "/api/all-boards", "/api/create-board"],
};
