import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { signToken } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    if (!email || !password) return errorResponse('Email and password are required');

    const user = await User.findOne({ email });
    if (!user) return errorResponse('Invalid credentials', 401);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return errorResponse('Invalid credentials', 401);

    const token = signToken({ userId: user._id.toString(), email: user.email, name: user.name, role: user.role });

    return successResponse({
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, address: user.address },
      token,
    });
  } catch (err) {
    console.error(err);
    return errorResponse('Server error', 500);
  }
}