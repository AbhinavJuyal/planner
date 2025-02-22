import { JWTPayload, SignJWT, jwtVerify } from "jose";
import { Logger } from "tslog";

const jwtLogger = new Logger({ name: "jwt" });

if (!process.env.JWT_SECRET) {
  jwtLogger.error("JWT_SECRET not found");
}

const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET ?? "");

export async function generateJWT<T extends JWTPayload>(payload: T) {
  const jwtExpiry = Number(process.env.JWT_EXPIRY);
  if (!jwtExpiry) throw new Error("JWT_EXPIRY not present");
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("urn:example:issuer")
    .setAudience("urn:example:audience")
    .setExpirationTime("2h")
    .sign(jwtSecret);

  return jwt;
}

export async function verifyJWT<T>(token: string): Promise<T | undefined> {
  try {
    const { payload } = await jwtVerify(token, jwtSecret);
    return payload as T;
  } catch (error) {
    jwtLogger.error(error);
    return;
  }
}
