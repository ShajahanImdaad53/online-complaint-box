import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/app/lib/mongodb';
import User from '@/models/User';
import Complaint from '@/models/Complaint';

export async function GET(req) {
  try {
    // Check authentication
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify token and check admin role
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Connect to database
    await connectDB();

    // Check if user is admin
    const admin = await User.findById(decoded.userId);
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Get pagination parameters from query
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    // Fetch users (excluding admin users and passwords)
    const users = await User.find({ role: 'citizen' })
      .select('username email address createdAt _id')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Get complaint count for each user
    const usersWithComplaints = await Promise.all(
      users.map(async (user) => {
        const complaintCount = await Complaint.countDocuments({ user: user._id });
        return {
          _id: user._id,
          username: user.username,
          email: user.email,
          address: user.address || 'N/A',
          createdAt: user.createdAt,
          complaintCount: complaintCount
        };
      })
    );

    // Get total count
    const total = await User.countDocuments({ role: 'citizen' });
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      users: usersWithComplaints,
      total,
      page,
      limit,
      totalPages,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
