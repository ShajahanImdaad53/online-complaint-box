import connectDB from "@/app/lib/mongodb";
import { verifyToken } from "@/app/lib/jwt"; 
import Complaint from "@/models/Complaint";

export async function GET(request) {
    try {
        await connectDB();
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const user = await verifyToken(token);
        console.log("Decoded user from token:", user);
     
        if(user == null || user.role !== "admin"){
            return new Response(JSON.stringify({ error: "Invalid or expired token" }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Get pagination parameters from query string
        const { searchParams } = new URL(request.url);
        const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
        const limit = Math.max(1, parseInt(searchParams.get('limit') || '10', 10));
        const skip = (page - 1) * limit;

        // Get total count and paginated complaints
        const total = await Complaint.countDocuments();
        const complaints = await Complaint.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return new Response(JSON.stringify({
            complaints,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

}