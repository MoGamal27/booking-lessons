require('dotenv').config()
const Booking = require('../Model/bookingModel');
const Stripe = require('stripe');
const stripe = new Stripe('sk_test_51QCrAHE3MxiHn73kVDATgFJEuxfZbQmcFdWvLTy6qvbq34akLLCdwaSlHjml3xfpoLApdpvduUmHGRnK9atheuXQ00jXfwFQEy');

exports.createPayment = async (req, res) => {
    console.log("Request body:", req.body);
    const { payment_method, amount = 1000 } = req.body; // Default amount if not provided

    // Validate the payment_method and amount
    if (!payment_method) {
        return res.status(400).json({ error: { message: 'Payment method is required.' } });
    }
    if (amount <= 0) {
        return res.status(400).json({ error: { message: 'Amount must be greater than zero.' } });
    }

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount, // Use the amount from the request body
            currency: 'usd',
            payment_method,
            confirm: true,
        });

        res.json({ success: true, paymentIntent });
    } catch (error) {
        res.status(400).json({ error: { message: error.message } });
    }
}

    