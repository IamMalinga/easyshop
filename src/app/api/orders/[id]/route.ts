import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { getTokenFromRequest } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getTokenFromRequest(req);
    if (!user) return errorResponse('Unauthorized', 401);

    await dbConnect();
    const order = await Order.findById(params.id).lean();
    if (!order) return errorResponse('Order not found', 404);

    // Users can only see their own orders; admins see all
    if (user.role !== 'admin' && order.user.toString() !== user.userId) {
      return errorResponse('Forbidden', 403);
    }

    return successResponse(order);
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
    const { status, isPaid, isDelivered } = await req.json();
    const update: Record<string, unknown> = {};
    if (status) update.status = status;
    if (isPaid !== undefined) { update.isPaid = isPaid; if (isPaid) update.paidAt = new Date(); }
    if (isDelivered !== undefined) { update.isDelivered = isDelivered; if (isDelivered) update.deliveredAt = new Date(); }

    const order = await Order.findByIdAndUpdate(params.id, update, { new: true });
    if (!order) return errorResponse('Order not found', 404);
    return successResponse(order);
  } catch (err) {
    console.error(err);
    return errorResponse('Server error', 500);
  }
}