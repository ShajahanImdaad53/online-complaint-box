import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

/**
 * Verify JWT token from cookies
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded token with userId and role, or null if invalid
 */
export async function verifyToken(token) {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload;
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return null;
  }
}

/**
 * Check if user is authenticated
 * @param {Object} request - Next.js request object
 * @returns {Object|null} User data {userId, role} or null
 */
export async function getAuthUser(request) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) return null;

    return await verifyToken(token);
  } catch (error) {
    console.error("Auth check error:", error);
    return null;
  }
}
