import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import connectDB from '@/app/lib/mongodb';
import User from '@/models/User';
import { getAuthUser } from '@/lib/auth';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(req) {
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

    // Get the current user to retrieve the image URL
    const currentUser = await User.findById(user.userId);
    if (!currentUser) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // If user has a profile image, delete it from Cloudinary
    if (currentUser.profileImage) {
      try {
        // Extract public_id from the Cloudinary URL
        const urlParts = currentUser.profileImage.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const publicId = `public-complaint/profiles/${fileName.split('.')[0]}`;

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error('Error deleting image from Cloudinary:', err);
        // Continue even if Cloudinary deletion fails
      }
    }

    // Update user profile image in database to null
    const updatedUser = await User.findByIdAndUpdate(
      user.userId,
      { profileImage: null },
      { new: true }
    );

    return NextResponse.json(
      {
        message: 'Profile image removed successfully',
        profileImage: null,
        user: {
          id: updatedUser._id,
          username: updatedUser.username,
          email: updatedUser.email,
          profileImage: updatedUser.profileImage,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Remove profile image error:', error);
    return NextResponse.json(
      { message: 'Failed to remove image' },
      { status: 500 }
    );
  }
}
