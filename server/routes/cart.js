import express from 'express';
import Cart from '../models/Cart.js';
import authMiddleware from '../middleware/auth.js'; // We'll create this middleware

const router = express.Router();

// Middleware to verify JWT and attach user to request
router.use(authMiddleware);

// Get user's cart
router.get('/', async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.userId });
        if (!cart) {
            return res.status(200).json({ items: [] });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch cart' });
    }
});

// Add item to cart
router.post('/add', async (req, res) => {
    const { name, description, price, image, restaurant } = req.body;

    try {
        let cart = await Cart.findOne({ userId: req.user.userId });

        if (!cart) {
            cart = new Cart({
                userId: req.user.userId,
                items: [{ name, description, price, image, restaurant, quantity: 1 }],
            });
        } else {
            // Check if item from same restaurant
            if (cart.items.length > 0 && cart.items[0].restaurant !== restaurant) {
                return res.status(400).json({ message: 'Please add items from the same food court.' });
            }

            // Check if item already exists
            const itemIndex = cart.items.findIndex(item => item.name === name);
            if (itemIndex >= 0) {
                cart.items[itemIndex].quantity += 1;
            } else {
                cart.items.push({ name, description, price, image, restaurant, quantity: 1 });
            }
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Failed to add item to cart' });
    }
});

// Update item quantity
router.put('/update/:itemName', async (req, res) => {
    const { quantity } = req.body;
    const { itemName } = req.params;

    try {
        const cart = await Cart.findOne({ userId: req.user.userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item.name === itemName);
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        if (quantity === 0) {
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update cart' });
    }
});

// Remove item from cart
router.delete('/remove/:itemName', async (req, res) => {
    const { itemName } = req.params;

    try {
        const cart = await Cart.findOne({ userId: req.user.userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item.name !== itemName);
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Failed to remove item from cart' });
    }
});

export default router;