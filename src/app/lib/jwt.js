import { jwtVerify } from "jose";

// convert secret string → Uint8Array (required by jose)
const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

/**
 * Verify JWT token and return decoded payload
 * @param {string} token
 * @returns {object|null}
 */
export async function verifyToken(token) {
  try {
    if (!token) return null;

    // verify token
    const { payload } = await jwtVerify(token, SECRET_KEY);

    // payload contains userId, role, exp, iat
    return payload;

  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return null;
  }
}