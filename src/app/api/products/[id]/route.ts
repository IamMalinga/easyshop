import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { getTokenFromRequest } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const product = await Product.findById(params.id).lean();
    if (!product) return errorResponse('Product not found', 404);
    return successResponse(product);
  } catch (err) {
    console.error(err);
    return errorResponse('Server error', 500);
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getTokenFromRequest(req);
    if (!user || user.role !== 'admin') return errorResponse('Unauthorized', 401);

    await dbConnect();
    const body = await req.json();
    const product = await Product.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
    if (!product) return errorResponse('Product not found', 404);
    return successResponse(product);
  } catch (err) {
    console.error(err);
    return errorResponse('Server error', 500);
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const product = await Product.findByIdAndDelete(params.id);
    if (!product) return errorResponse('Product not found', 404);
    return successResponse({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    return errorResponse('Server error', 500);
  }
}