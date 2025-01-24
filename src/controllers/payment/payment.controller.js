import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Replace with your secret key

const processPayment = async (req, res) => {
    const { amount, currency = "usd", description, tokenId } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Amount in smallest currency unit
            currency,
            payment_method: tokenId,
            confirm: true,
            description,
        });

        res.status(200).json({ success: true, paymentIntent });
    } catch (error) {
        console.error("Payment Error:", error.message);
        res.status(500).json({ success: false, message: "Payment failed", error: error.message });
    }
};

export const PaymentController = {
    processPayment
};
