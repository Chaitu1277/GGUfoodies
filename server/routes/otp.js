const express = require('express');
const router = express.Router();
const { sendOTPEmail } = require('../services/emailService');
const { sendOTPSMS } = require('../services/smsService');

// In-memory OTP storage (use Redis or MongoDB in production)
const otps = {};

// Generate OTP (4 digits)
const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

// Route to generate and send OTP
router.post('/generate-otp', async (req, res) => {
    const { email, phone, method } = req.body;

    if (!method || (method !== 'email' && method !== 'phone')) {
        return res.status(400).json({ message: 'Invalid OTP method' });
    }

    const otp = generateOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

    otps[email || phone] = { otp, expiresAt };

    try {
        if (method === 'email') {
            await sendOTPEmail(email, otp);
        } else {
            await sendOTPSMS(phone, otp);
        }
        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to verify OTP
router.post('/verify-otp', (req, res) => {
    const { identifier, otp } = req.body; // identifier is email or phone

    const storedOTP = otps[identifier];

    if (!storedOTP) {
        return res.status(400).json({ message: 'OTP not found or expired' });
    }

    if (Date.now() > storedOTP.expiresAt) {
        delete otps[identifier];
        return res.status(400).json({ message: 'OTP has expired' });
    }

    if (storedOTP.otp !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
    }

    delete otps[identifier]; // Clear OTP after successful verification
    res.status(200).json({ message: 'OTP verified successfully' });
});

module.exports = router;