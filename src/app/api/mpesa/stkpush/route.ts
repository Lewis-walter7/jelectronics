import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';
import { getAccessToken, generatePassword } from '@/lib/mpesa';
import { MpesaPaymentSchema } from '@/lib/validators';

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();

        const body = await req.json();

        // Validate with Zod
        const validation = MpesaPaymentSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({
                error: 'Validation failed',
                details: validation.error.format()
            }, { status: 400 });
        }

        const { customer, items, totalAmount } = validation.data;

        // 1. Create Order in Pending State
        const newOrder = new Order({
            customer,
            items,
            totalAmount: totalAmount, // Ensure this includes shipping if passed
            paymentMethod: 'M-Pesa',
            paymentStatus: 'Pending',
            status: 'Pending'
        });

        await newOrder.save();

        // 2. Initiate STK Push
        const accessToken = await getAccessToken();
        const { password, timestamp } = generatePassword();
        const shortcode = process.env.MPESA_SHORTCODE;
        const callbackUrl = process.env.MPESA_CALLBACK_URL || 'https://example.com/api/mpesa/callback'; // Need real URL

        const phone = customer.phone.replace('+', '').replace(/^0/, '254'); // format to 254...

        const stkPushBody = {
            BusinessShortCode: shortcode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: Math.ceil(totalAmount), // Amount must be integer? Usually yes.
            PartyA: phone,
            PartyB: shortcode,
            PhoneNumber: phone,
            CallBackURL: callbackUrl,
            AccountReference: "JElectronics",
            TransactionDesc: `Payment for Order ${newOrder._id}`
        };

        const response = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(stkPushBody)
        });

        const data = await response.json();

        if (data.ResponseCode === "0") {
            // Success
            newOrder.mpesaDetails = {
                checkoutRequestId: data.CheckoutRequestID,
                merchantRequestId: data.MerchantRequestID,
                phoneNumber: phone
            };
            await newOrder.save();

            return NextResponse.json({
                success: true,
                message: 'STK Push initiated',
                orderId: newOrder._id,
                checkoutRequestId: data.CheckoutRequestID
            });
        } else {
            console.error("STK Push Failed:", data);
            return NextResponse.json({ error: 'STK Push failed', details: data }, { status: 500 });
        }

    } catch (error: any) {
        console.error("Payment Error:", error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
