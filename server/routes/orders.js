import express from 'express';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import authMiddleware from '../middleware/auth.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const router = express.Router();
router.use(authMiddleware);

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order and payment
router.post('/create', async (req, res) => {
    const { orderType } = req.body;

    try {
        // Get user's cart
        const cart = await Cart.findOne({ userId: req.user.userId });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Calculate amounts
        const subtotal = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        const serviceCharge = orderType === 'takeaway' ?
            cart.items.reduce((total, item) => total + (10 * item.quantity), 0) : 0;
        const total = subtotal + serviceCharge;

        // Create Razorpay order
        const razorpayOrder = await razorpay.orders.create({
            amount: total * 100, // in paise
            currency: 'INR',
            receipt: `order_${Date.now()}`,
        });

        // Create our order (but don't save yet)
        const order = new Order({
            userId: req.user.userId,
            items: cart.items,
            orderType,
            subtotal,
            serviceCharge,
            total,
            status: 'pending',
        });

        res.status(200).json({
            message: 'Order created successfully',
            order: order.toObject(),
            razorpayOrder,
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create order', error: error.message });
    }
});

// Verify payment and save order
router.post('/verify', async (req, res) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, order } = req.body;

    try {
        // Log the incoming data for debugging
        console.log('Verification Request Body:', req.body);
        console.log('RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET);

        // Verify payment
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const generated_signature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex');

        console.log('Generated Signature:', generated_signature);
        console.log('Razorpay Signature:', razorpay_signature);

        if (generated_signature !== razorpay_signature) {
            console.log('Signature mismatch!');
            return res.status(400).json({ message: 'Payment verification failed' });
        }

        // Remove the _id field from the order object to ensure it's treated as a new document
        delete order._id;

        // Create and save the order
        const newOrder = new Order(order);
        newOrder.status = 'confirmed';
        await newOrder.save();

        // Clear the cart
        await Cart.deleteOne({ userId: req.user.userId });

        res.status(200).json({
            message: 'Payment successful and order confirmed',
            order: newOrder,
        });
    } catch (error) {
        console.error('Verification Error:', error);
        res.status(500).json({ message: 'Failed to verify payment', error: error.message });
    }
});

// Get user's orders
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.userId })
            .sort({ createdAt: -1 })
            .limit(10);
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
});

// Cancel order (within 1 minute)
router.post('/:orderId/cancel', async (req, res) => {
    try {
        const order = await Order.findOne({
            orderId: req.params.orderId,
            userId: req.user.userId,
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if order was created more than 1 minute ago
        const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
        if (order.createdAt < oneMinuteAgo) {
            return res.status(400).json({ message: 'Order can only be cancelled within 1 minute' });
        }

        if (order.status === 'cancelled') {
            return res.status(400).json({ message: 'Order is already cancelled' });
        }

        order.status = 'cancelled';
        order.cancelledAt = new Date();
        await order.save();

        res.status(200).json({ message: 'Order cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to cancel order' });
    }
});

export default router;