import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import Complaint from "@/models/Complaint";
import User from "@/models/User"; // ⭐ REQUIRED for populate
import { verifyToken } from "@/app/lib/jwt";

export async function GET(req, { params }) {
  try {
    await connectDB();

    // =============================
    // 1️⃣ Get token from cookie
    // =============================
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - No token" },
        { status: 401 }
      );
    }

    // =============================
    // 2️⃣ Verify token
    // =============================
    const user = await verifyToken(token);
    console.log("Decoded user:", user);

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Access denied (Admin only)" },
        { status: 403 }
      );
    }

    // =============================
    // 3️⃣ Get Complaint ID
    // =============================
    const { id:complaintId } = await params;

    // =============================
    // 4️⃣ Find complaint + user
    // =============================
    const complaint = await Complaint.findById(complaintId).populate("user");
    //   .select("title description status user createdAt");

    if (!complaint) {
      return NextResponse.json(
        { message: "Complaint not found" },
        { status: 404 }
      );
    }

    // =============================
    // 5️⃣ Success response
    // =============================
    return NextResponse.json(
      {
        message: "Complaint fetched successfully",
        complaint,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("GET complaint error:", error);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}