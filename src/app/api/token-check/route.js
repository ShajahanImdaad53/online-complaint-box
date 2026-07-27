import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/app/lib/mongodb";
import User from "@/models/User";

export async function GET(request) {
  try {
    await connectDB();
    
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "No token provided", isAuthenticated: false },
        { status: 401 }
      );
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user data
    const user = await User.findById(decoded.userId).select("-password");
    
    if (!user) {
      return NextResponse.json(
        { message: "User not found", isAuthenticated: false },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        message: "Token is valid",
        isAuthenticated: true,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json(
      { message: "Invalid or expired token", isAuthenticated: false },
      { status: 401 }
    );
  }
}