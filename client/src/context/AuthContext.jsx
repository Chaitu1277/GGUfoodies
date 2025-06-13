import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [cartCount, setCartCount] = useState(0);

    const fetchCart = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await axios.get('http://localhost:5000/api/cart', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCartItems(response.data.items || []);
            setCartCount(response.data.items?.reduce((total, item) => total + item.quantity, 0) || 0);
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            fetchCart(); // Fetch cart on mount if logged in
        }
    }, []);

    const login = async (token) => {
        localStorage.setItem('token', token);
        setIsLoggedIn(true);
        await fetchCart(); // Fetch cart after login
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setCartItems([]); // Clear cart on logout
        setCartCount(0);
    };

    const updateCart = (newItems) => {
        setCartItems(newItems);
        setCartCount(newItems.reduce((total, item) => total + item.quantity, 0));
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, cartItems, cartCount, updateCart }}>
            {children}
        </AuthContext.Provider>
    );
};