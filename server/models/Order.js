import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    restaurant: {
        type: String,
        required: true,
    },
});

const orderSchema = new mongoose.Schema({
    orderId: {
        type: Number,
        unique: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [orderItemSchema],
    orderType: {
        type: String,
        enum: ['dining', 'takeaway'],
        required: true,
    },
    subtotal: {
        type: Number,
        required: true,
    },
    serviceCharge: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'],
        default: 'pending',
    },
    estimatedTime: {
        type: Number, // in minutes
        default: 15,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    cancelledAt: {
        type: Date,
    },
});

// Auto-increment orderId
orderSchema.pre('save', async function (next) {
    // Always set orderId if it's not already set
    if (!this.orderId) {
        try {
            const lastOrder = await Order.findOne().sort({ orderId: -1 }).limit(1);
            this.orderId = lastOrder ? lastOrder.orderId + 1 : 1;
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

const Order = mongoose.model('Order', orderSchema);
export default Order;