import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { getTokenFromRequest } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getTokenFromRequest(req);
    if (!user) return errorResponse('Unauthorized', 401);

    await dbConnect();
    const { rating, comment } = await req.json();

    if (!rating || !comment) return errorResponse('Rating and comment are required');

    const product = await Product.findById(params.id);
    if (!product) return errorResponse('Product not found', 404);

    const alreadyReviewed = product.reviews.some(r => r.user.toString() === user.userId);
    if (alreadyReviewed) return errorResponse('You have already reviewed this product', 400);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    product.reviews.push({ user: user.userId as any, name: user.name, rating: Number(rating), comment } as any);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

    await product.save();
    return successResponse(product, 201);
  } catch (err) {
    console.error(err);
    return errorResponse('Server error', 500);
  }
}