import Razorpay from 'razorpay';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Razorpay outside of the request handler
const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY!,
    key_secret: process.env.RAZORPAY_API_SECRET_KEY!,
});

export async function POST(request: NextRequest) {
    try {
        const { amount, currency } = await request.json() as {
            amount: number;
            currency: string;
        };

        // Validate input
        if (!amount || !currency) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        const options = {
            amount: amount,
            currency: currency,
            receipt: 'receipt_' + Math.random().toString(36).substring(7),
        };

        const order = await razorpay.orders.create(options);
        console.log('Order created:', order);

        return NextResponse.json({ orderId: order.id }, { status: 200 });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}