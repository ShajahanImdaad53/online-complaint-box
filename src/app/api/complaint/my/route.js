import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import { verifyToken } from "@/app/lib/jwt";
import Complaint from "@/models/Complaint";


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


    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }


    const complaints = await Complaint.find({
        user: user.userId,
    })
    .sort({ createdAt: -1 });


    return NextResponse.json({
        message: "My complaints fetched succesfully",
        complaints,
    },
    {status: 200}

);
 } catch (error) {
     console.error("My complaints error:", error);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
 }
}