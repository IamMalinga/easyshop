import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { signToken } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return errorResponse('Name, email and password are required');
    }

    const existing = await User.findOne({ email });
    if (existing) return errorResponse('Email already in use', 409);

    const user = await User.create({ name, email, password });
    const token = signToken({ userId: user._id.toString(), email: user.email, name: user.name, role: user.role });

    return successResponse({
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    }, 201);
  } catch (err) {
    console.error(err);
    return errorResponse('Server error', 500);
  }
}