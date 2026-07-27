import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import { verifyToken } from "@/app/lib/jwt";
import StatusLog from "@/models/StatusLog";

export async function GET(req){
    try {
        await connectDB();

        const token = req.cookies.get("token").value;
        if(!token){
            return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
          );
        }

        const admin = await verifyToken(token);
        if (!admin || admin.role !== "admin") {
          return NextResponse.json(
            { message: "Admin access required" },
            { status: 403 }
          );
        }

        const statusLogs = await StatusLog.find()
        .populate("complaint", "title")
        .populate("changedBy", "name email")
        .sort({ createAt: -1});
        return NextResponse.json({ statusLogs }, { status: 200 });
    } catch (error) {
        console.error("Error fetching status logs:", error);
        return NextResponse.json(
          { message: "Failed to fetch status logs" },
          { status: 500 }
        );
    }

}