import connectDB from "@/app/lib/mongodb";
import { verifyToken } from "@/app/lib/jwt";
import { NextResponse } from "next/server";
import StatusLog from "@/models/StatusLog";
import Complaint from "@/models/Complaint";

export async function PATCH(req, {params}){

try {
    await connectDB();

    //verify admin
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

    //get complaint id from params
     const { id: complaintId } = await params;

   //get new status from request body
   const {status} = await req.json(); 

   const allowedStatus = ["pending", "approved", "rejected"];

    if (!allowedStatus.includes(status)) {
      return NextResponse.json(
        { message: "Invalid status value" },
        { status: 400 }
      );
    }

    //find complaint by id
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return NextResponse.json(
        { message: "Complaint not found" },
        { status: 404 }
      );
    }

    //update complaint status
    complaint.status = status;
    await complaint.save();

    //create status log
    await StatusLog.create(
        {
            complaint: complaint._id,
            changedBy: admin.userId,
            status: status,
        }
    );

    //return success response
    return NextResponse.json(
        { message: "Complaint status updated successfully", complaint, },
        { status: 200 }
      );

} catch (error) {
    console.error("Error updating complaint status:", error);
    return NextResponse.json(
        { message: "Error updating complaint status" },
        { status: 500 }
      );
}
    
} 