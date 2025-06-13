import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import CartPage from './pages/CartPage';
import ForgotPassword from './pages/auth/ForgotPassword';
import AdminPanel from './pages/admin/AdminPanel';
import RestaurantLogin from './pages/admin/RestaurantLogin';
import AdminLogin from './pages/admin/AdminLogin';
import UserDashboard from './pages/UserDashboard';
import HomePage from './pages/HomePage';
import About from './pages/About';
import './index.css';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="App">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/about" element={<About />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/admin-panel" element={<AdminPanel />} />
            <Route path="/restaurant-login" element={<RestaurantLogin />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/dashboard" element={<UserDashboard />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;