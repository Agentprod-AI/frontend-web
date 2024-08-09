// @/lib/razorpay.ts

import Razorpay from 'razorpay';

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY!,
    key_secret: process.env.RAZORPAY_API_SECRET_KEY!,
});

export async function createRazorpayOrder(amount: number, currency: string) {
    try {
        const options = {
            amount: amount,
            currency: currency,
            receipt: 'receipt_' + Math.random().toString(36).substring(7),
        };

        const order = await razorpay.orders.create(options);
        console.log('Order created:', order);

        return { orderId: order.id };
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        throw new Error('Failed to create Razorpay order');
    }
}