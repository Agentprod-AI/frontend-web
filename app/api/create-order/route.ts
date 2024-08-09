import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY!,
    key_secret: process.env.RAZORPAY_API_SECRET_KEY!,
});

export async function POST(request: NextRequest) {
    try {
        const { amount, currency } = await request.json();

        if (!amount || !currency) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        if (!process.env.NEXT_PUBLIC_RAZORPAY_API_KEY || !process.env.RAZORPAY_API_SECRET_KEY) {
            console.error('Razorpay API keys are not set');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const options = {
            amount: amount,
            currency: currency,
            receipt: 'receipt_' + Math.random().toString(36).substring(7),
        };

        const order = await razorpay.orders.create(options);
        return NextResponse.json({ orderId: order.id }, { status: 200 });
    } catch (error: any) {
        console.error('Error creating Razorpay order:', error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}