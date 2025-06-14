import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { HiCheck, HiX, HiArrowLeft } from 'react-icons/hi';

const Payment = ({ orderType, cartItems, subtotal, serviceCharge, total, onClose }) => {
    const { updateCart } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);
    const navigate = useNavigate();

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        setLoading(true);
        try {
            // First create the order in our backend
            const res = await axios.post('http://localhost:5000/api/orders/create', {
                orderType,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const { order, razorpayOrder } = res.data;

            // Load Razorpay script
            const isLoaded = await loadRazorpay();
            if (!isLoaded) {
                toast.error('Razorpay SDK failed to load');
                return;
            }

            // Razorpay options
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                name: 'GGU Foodies',
                description: 'Order Payment',
                image: '/ggu foodies.jpg',
                order_id: razorpayOrder.id,
                handler: async function (response) {
                    try {
                        // Log the Razorpay response for debugging
                        console.log('Razorpay Response:', response);

                        // Verify payment with our backend
                        const verifyRes = await axios.post(
                            'http://localhost:5000/api/orders/verify',
                            {
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature,
                                order,
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                                },
                            }
                        );

                        setOrderDetails(verifyRes.data.order);
                        setPaymentSuccess(true);
                        updateCart([]);
                        toast.success('Payment successful!');
                    } catch (error) {
                        console.error('Verification error:', error);
                        toast.error('Payment verification failed');
                    }
                },
                prefill: {
                    name: 'Customer',
                    email: 'customer@example.com',
                    contact: '9999999999',
                },
                theme: {
                    color: '#EF4444',
                },
                modal: {
                    ondismiss: function () {
                        toast.error('Payment cancelled or failed');
                    }
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (error) {
            console.error('Payment error:', error);
            toast.error(error.response?.data.message || 'Payment failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (paymentSuccess && orderDetails) {
        return <OrderSuccess order={orderDetails} />;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Payment</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            disabled={loading}
                        >
                            <HiX className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>

                    <div className="space-y-4 mb-6">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="font-medium">₹{subtotal}</span>
                        </div>
                        {serviceCharge > 0 && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">Takeaway Charges:</span>
                                <span className="font-medium">₹{serviceCharge}</span>
                            </div>
                        )}
                        <div className="border-t border-gray-200 pt-2 flex justify-between">
                            <span className="text-gray-800 font-bold">Total:</span>
                            <span className="text-gray-800 font-bold">₹{total}</span>
                        </div>
                    </div>

                    <button
                        onClick={handlePayment}
                        disabled={loading}
                        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${loading ? 'bg-gray-300' : 'bg-red-600 hover:bg-red-700 text-white'
                            }`}
                    >
                        {loading ? 'Processing...' : 'Proceed to Payment'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const OrderSuccess = ({ order }) => {
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
    const [cancellable, setCancellable] = useState(true);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 0) {
                    clearInterval(timer);
                    setCancellable(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleCancel = async () => {
        try {
            await axios.post(
                `http://localhost:5000/api/orders/${order.orderId}/cancel`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            toast.success('Order cancelled successfully');
            navigate('/home');
        } catch (error) {
            toast.error(error.response?.data.message || 'Failed to cancel order');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
                <div className="text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <HiCheck className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2>
                    <p className="text-gray-600 mb-6">Your order ID: #{order.orderId}</p>
                </div>

                <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Order Type:</span>
                        <span className="font-medium capitalize">{order.orderType}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Estimated Time:</span>
                        <span className="font-medium">{formatTime(timeLeft)}</span>
                    </div>

                    <div className="border-t border-gray-200 pt-4 mt-4">
                        <h3 className="font-bold text-gray-800 mb-2">Order Details</h3>
                        {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between mb-2">
                                <span className="text-gray-600">
                                    {item.name} × {item.quantity}
                                </span>
                                <span className="font-medium">₹{item.price * item.quantity}</span>
                            </div>
                        ))}
                        {order.serviceCharge > 0 && (
                            <div className="flex justify-between text-gray-600">
                                <span>Takeaway Charges:</span>
                                <span>₹{order.serviceCharge}</span>
                            </div>
                        )}
                        <div className="border-t border-gray-200 pt-2 flex justify-between mt-2">
                            <span className="text-gray-800 font-bold">Total:</span>
                            <span className="text-gray-800 font-bold">₹{order.total}</span>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4 mt-4">
                        <h3 className="font-bold text-gray-800 mb-2">Order Status</h3>
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                    <HiCheck className="w-5 h-5" />
                                </div>
                                <span className="text-xs mt-1">Confirmed</span>
                            </div>
                            <div className="h-1 flex-1 bg-gray-200 mx-2"></div>
                            <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
                                    <span className="text-xs">2</span>
                                </div>
                                <span className="text-xs mt-1">Preparing</span>
                            </div>
                            <div className="h-1 flex-1 bg-gray-200 mx-2"></div>
                            <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
                                    <span className="text-xs">3</span>
                                </div>
                                <span className="text-xs mt-1">Ready</span>
                            </div>
                            <div className="h-1 flex-1 bg-gray-200 mx-2"></div>
                            <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
                                    <span className="text-xs">4</span>
                                </div>
                                <span className="text-xs mt-1">Completed</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex space-x-3">
                    <button
                        onClick={() => navigate('/home')}
                        className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                        Back to Home
                    </button>
                    {cancellable && (
                        <button
                            onClick={handleCancel}
                            className="flex-1 py-3 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                        >
                            Cancel Order
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Payment;