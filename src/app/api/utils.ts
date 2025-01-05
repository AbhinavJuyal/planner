import "server-only";
import jwt from "jsonwebtoken";

export async function generateJWT(payload: { email: string }) {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpiry = Number(process.env.JWT_EXPIRY);
  if (!jwtSecret) throw new Error("JWT_SECRET not present");
  if (!jwtExpiry) throw new Error("JWT_EXPIRY not present");
  return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiry });
}
