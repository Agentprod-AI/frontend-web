import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
    key_id: "rzp_live_v0sNIuiCIceCva",
    key_secret: "wAvTRTV4h3Cug4whnIimfUFw",
});

export async function POST(request: NextRequest) {
    try {
        const { amount, currency } = await request.json();

        if (!amount || !currency) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
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