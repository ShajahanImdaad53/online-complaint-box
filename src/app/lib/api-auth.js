import { NextResponse } from "next/server";
import { verifyToken } from "@/app/lib/jwt";

/**
 * Middleware to check if user is authenticated
 * Returns user data if authenticated, otherwise returns error response
 */
export async function checkAuth(request) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return {
        isAuthorized: false,
        response: NextResponse.json(
          { message: "Unauthorized - No token provided" },
          { status: 401 }
        ),
        user: null,
      };
    }

    const user = await verifyToken(token);

    if (!user) {
      return {
        isAuthorized: false,
        response: NextResponse.json(
          { message: "Unauthorized - Invalid token" },
          { status: 401 }
        ),
        user: null,
      };
    }

    return {
      isAuthorized: true,
      response: null,
      user,
    };
  } catch (error) {
    console.error("Auth check error:", error);
    return {
      isAuthorized: false,
      response: NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      ),
      user: null,
    };
  }
}

/**
 * Middleware to check if user is admin
 * Returns error if user is not admin
 */
export async function checkAdminAuth(request) {
  const authCheck = await checkAuth(request);

  if (!authCheck.isAuthorized) {
    return authCheck;
  }

  if (authCheck.user.role !== "admin") {
    return {
      isAuthorized: false,
      response: NextResponse.json(
        { message: "Forbidden - Admin access required" },
        { status: 403 }
      ),
      user: null,
    };
  }

  return authCheck;
}

/**
 * Middleware to validate request body
 */
export function validateRequestBody(body, requiredFields) {
  const errors = [];

  for (const field of requiredFields) {
    if (!body[field]) {
      errors.push(`${field} is required`);
    }
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      response: NextResponse.json(
        { message: "Validation error", errors },
        { status: 400 }
      ),
    };
  }

  return { isValid: true, response: null };
}
