import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();

        const data = await req.json();
        const { Body } = data;

        if (!Body || !Body.stkCallback) {
            console.error("Invalid M-Pesa Callback Data:", data);
            return NextResponse.json({ error: 'Invalid Data' }, { status: 400 });
        }

        const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = Body.stkCallback;

        const order = await Order.findOne({ 'mpesaDetails.checkoutRequestId': CheckoutRequestID });

        if (!order) {
            console.error(`Order not found for CheckoutRequestID: ${CheckoutRequestID}`);
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        if (ResultCode === 0) {
            // Success
            // Extract receipt number if available
            const items = CallbackMetadata?.Item || [];
            const receiptItem = items.find((item: any) => item.Name === 'MpesaReceiptNumber');
            const receiptNumber = receiptItem?.Value?.toString();
            const dateItem = items.find((item: any) => item.Name === 'TransactionDate');
            const transDate = dateItem?.Value?.toString(); // YYYYMMDDHHmmss

            order.paymentStatus = 'Completed';
            order.status = 'Processing'; // Move to processing
            if (receiptNumber) order.mpesaDetails!.receiptNumber = receiptNumber;
            // Parse date if needed, or just store string

            await order.save();
            console.log(`Order ${order._id} payment successful. Receipt: ${receiptNumber}`);
        } else {
            // Failed/Cancelled
            order.paymentStatus = 'Failed';
            // order.status stays Pending or could be Cancelled
            console.warn(`Order ${order._id} payment failed: ${ResultDesc}`);
            await order.save();
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Callback Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
