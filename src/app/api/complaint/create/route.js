import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import Complaint from "@/models/Complaint";
import cloudinary from "@/app/lib/cloudinary";
import { verifyToken } from "@/app/lib/jwt";

export async function POST(req) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;

    if (!token) {
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

    // ✅ Get form data
    const formData = await req.formData();

    const title = formData.get("title");
    const description = formData.get("description");
    const category = formData.get("category");
    const address = formData.get("address");
    const lat = formData.get("lat");
    const lng = formData.get("lng");

    const files = formData.getAll("images");

    if (!title || !description || !category || !lat || !lng) {
      return NextResponse.json(
        { message: "Please fill all required fields" },
        { status: 400 }
      );
    }

    // ✅ Upload images to Cloudinary
    const uploadedImages = [];

    for (const file of files) {
      if (!file || !file.name) continue;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { folder: "complaints" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(buffer);
      });

      uploadedImages.push(result.secure_url);
    }

    // ✅ Create complaint with images
    const newComplaint = new Complaint({
      user: user.userId,
      title,
      description,
      category,
      address,
      location: {
        lat: Number(lat),
        lng: Number(lng),
      },
      images: uploadedImages,
    });

    await newComplaint.save();

    return NextResponse.json(
      {
        message: "Complaint created successfully",
        complaint: newComplaint,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}