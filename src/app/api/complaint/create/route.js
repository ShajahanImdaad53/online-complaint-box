import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import Complaint from "@/models/Complaint";
import cloudinary from "@/app/lib/cloudinary";
import { verifyToken } from "@/app/lib/jwt";
import { appendToSheet } from "@/app/lib/googleSheets";
import User from "@/models/User";
import { sendEmail } from "@/app/lib/mailer";

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

    // ✅ Append to Google Sheets
    // Await this so Vercel doesn't kill the function before it finishes
    const sheetData = [
      newComplaint._id.toString(),
      new Date().toLocaleString(),
      user.userId.toString(),
      title,
      category,
      address,
      description,
      `${lat}, ${lng}`,
      uploadedImages.join('\n')
    ];
    await appendToSheet(sheetData);

    // ✅ Send Email Notification
    try {
      const fullUser = await User.findById(user.userId);
      if (fullUser && fullUser.email) {
        const emailHtml = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <h2 style="color: #2563eb;">Complaint Received</h2>
            <p>Dear ${fullUser.username || 'Citizen'},</p>
            <p>We have successfully received your complaint regarding <strong>${title}</strong>.</p>
            <p><strong>Complaint ID:</strong> ${newComplaint._id}</p>
            <p><strong>Category:</strong> ${category}</p>
            <p>Our team will review your submission and take necessary actions. You can track the status of your complaint in your dashboard.</p>
            <br/>
            <p>Thank you,</p>
            <p>Pradeshiya Sabha Administration</p>
          </div>
        `;

        await sendEmail({
          to: fullUser.email,
          subject: 'Complaint Submission Confirmation',
          html: emailHtml,
        });
      }
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // We don't want to fail the whole request if just the email fails
    }

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