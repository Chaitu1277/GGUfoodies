import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiPhone, HiMail, HiLockClosed } from 'react-icons/hi';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Phone/Email, 2: OTP, 3: New Password
    const [contactMethod, setContactMethod] = useState('phone'); // 'phone' or 'email'
    const [formData, setFormData] = useState({
        contact: '',
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // API call to send OTP
            console.log('Sending OTP to:', formData.contact, 'via', contactMethod);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast.success(`OTP sent to your ${contactMethod}`);
            setStep(2);
        } catch (error) {
            toast.error('Failed to send OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // API call to verify OTP
            console.log('Verifying OTP:', formData.otp);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast.success('OTP verified successfully');
            setStep(3);
        } catch (error) {
            toast.error('Invalid OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            setIsLoading(false);
            return;
        }

        if (formData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            setIsLoading(false);
            return;
        }

        try {
            // API call to reset password
            console.log('Resetting password');

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast.success('Password reset successful! You can now login.');
            // Redirect to login
            // navigate('/login');
        } catch (error) {
            toast.error('Failed to reset password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Link to="/" className="flex justify-center">
                        <div className="flex items-center space-x-2">
                            <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-2xl">GF</span>
                            </div>
                            <span className="text-2xl font-bold text-gray-800">GGU Foodies</span>
                        </div>
                    </Link>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Forgot Password
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {step === 1 && 'Enter your phone number or email to receive OTP'}
                        {step === 2 && 'Enter the OTP sent to your contact'}
                        {step === 3 && 'Create a new password for your account'}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="mt-8 bg-white p-8 rounded-xl shadow-lg"
                >
                    {/* Step 1: Contact Information */}
                    {step === 1 && (
                        <form onSubmit={handleSendOTP} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-4">
                                    How would you like to receive the OTP?
                                </label>
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="contactMethod"
                                            value="phone"
                                            checked={contactMethod === 'phone'}
                                            onChange={(e) => setContactMethod(e.target.value)}
                                            className="mr-2"
                                        />
                                        Phone Number
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="contactMethod"
                                            value="email"
                                            checked={contactMethod === 'email'}
                                            onChange={(e) => setContactMethod(e.target.value)}
                                            className="mr-2"
                                        />
                                        Email Address
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">
                                    {contactMethod === 'phone' ? 'Phone Number' : 'Email Address'}
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        {contactMethod === 'phone' ? (
                                            <HiPhone className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <HiMail className="h-5 w-5 text-gray-400" />
                                        )}
                                    </div>
                                    <input
                                        id="contact"
                                        name="contact"
                                        type={contactMethod === 'phone' ? 'tel' : 'email'}
                                        required
                                        className="input-field pl-10"
                                        placeholder={contactMethod === 'phone' ? 'Enter your phone number' : 'Enter your email address'}
                                        value={formData.contact}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full btn-primary py-3"
                            >
                                {isLoading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
                                ) : (
                                    'Send OTP'
                                )}
                            </button>
                        </form>
                    )}

                    {/* Step 2: OTP Verification */}
                    {step === 2 && (
                        <form onSubmit={handleVerifyOTP} className="space-y-6">
                            <div>
                                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                                    Enter OTP
                                </label>
                                <input
                                    id="otp"
                                    name="otp"
                                    type="text"
                                    required
                                    maxLength="6"
                                    className="input-field text-center text-2xl tracking-widest"
                                    placeholder="000000"
                                    value={formData.otp}
                                    onChange={handleChange}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full btn-primary py-3"
                            >
                                {isLoading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
                                ) : (
                                    'Verify OTP'
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full text-primary-600 hover:text-primary-500 font-medium"
                            >
                                Back to Contact Information
                            </button>
                        </form>
                    )}

                    {/* Step 3: New Password */}
                    {step === 3 && (
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <HiLockClosed className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="newPassword"
                                        name="newPassword"
                                        type="password"
                                        required
                                        className="input-field pl-10"
                                        placeholder="Enter new password"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <HiLockClosed className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        className="input-field pl-10"
                                        placeholder="Confirm new password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full btn-primary py-3"
                            >
                                {isLoading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
                                ) : (
                                    'Reset Password'
                                )}
                            </button>
                        </form>
                    )}

                    <div className="text-center mt-6">
                        <Link
                            to="/login"
                            className="text-primary-600 hover:text-primary-500 font-medium"
                        >
                            Back to Login
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ForgotPassword;