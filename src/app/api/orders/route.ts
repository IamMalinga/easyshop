import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { getTokenFromRequest } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const user = getTokenFromRequest(req);
    if (!user) return errorResponse('Unauthorized', 401);

    await dbConnect();
    const orders = await Order.find({ user: user.userId }).sort({ createdAt: -1 }).lean();
    return successResponse(orders);
  } catch (err) {
    console.error(err);
    return errorResponse('Server error', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getTokenFromRequest(req);
    if (!user) return errorResponse('Unauthorized', 401);

    await dbConnect();
    const body = await req.json();
    const { items, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = body;

    if (!items || items.length === 0) return errorResponse('No items in order');

    const order = await Order.create({
      user: user.userId,
      items,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    return successResponse(order, 201);
  } catch (err) {
    console.error(err);
    return errorResponse('Server error', 500);
  }
}