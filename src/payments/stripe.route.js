const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Payment route to create a payment intent
router.post("/create-payment-intent", async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        // Create a Stripe PaymentIntent for card payments
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Stripe works in cents
            currency: "usd",
            payment_method_types: ["card"], // Only allow card payments
        });

        res.status(200).json({
            success: true,
            message: "Payment successful",
            clientSecret: paymentIntent.client_secret, // Send client secret to the client
        });
    } catch (error) {
        console.error("Stripe Payment Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;