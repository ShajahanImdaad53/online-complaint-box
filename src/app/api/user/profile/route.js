import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import User from '@/models/User';
import { getAuthUser } from '@/lib/auth';

export async function GET(req) {
  try {
    await connectDB();

    // Check authentication
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user profile
    const userProfile = await User.findById(user.userId).select('-password');

    if (!userProfile) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        user: {
          id: userProfile._id,
          username: userProfile.username,
          email: userProfile.email,
          nic: userProfile.nic,
          profileImage: userProfile.profileImage,
          role: userProfile.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await connectDB();

    // Check authentication
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { username, email } = body;

    // Update user profile (only username and email, not NIC)
    const updatedUser = await User.findByIdAndUpdate(
      user.userId,
      { username, email },
      { new: true }
    ).select('-password');

    return NextResponse.json(
      {
        message: 'Profile updated successfully',
        user: {
          id: updatedUser._id,
          username: updatedUser.username,
          email: updatedUser.email,
          nic: updatedUser.nic,
          profileImage: updatedUser.profileImage,
          role: updatedUser.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { message: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
