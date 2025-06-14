import { useState, useEffect, useRef, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HiUser,
    HiShoppingCart,
    HiSearch,
    HiX,
    HiStar,
    HiClock,
    HiHome,
    HiOfficeBuilding,
    HiClipboardList,
    HiLogout,
    HiEye,
    HiPlus
} from 'react-icons/hi';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const HomePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, cartItems, cartCount, updateCart } = useContext(AuthContext);
    const { selectedCourt } = location.state || {};
    const [searchQuery, setSearchQuery] = useState(selectedCourt ? selectedCourt.name : '');
    const [itemSearchQuery, setItemSearchQuery] = useState('');
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [selectedFoodCourt, setSelectedFoodCourt] = useState(selectedCourt || null);
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [errorMessage, setErrorMessage] = useState('');
    const [userName, setUserName] = useState('');
    const errorMessageRef = useRef(null);

    const foodCourts = [
        {
            id: 1,
            name: 'CFC (Central Food Court)',
            image: 'https://media.istockphoto.com/id/828531982/photo/food-court-market.jpg?s=612x612&w=0&k=20&c=ftIm-Xc9MJ5xxz6xSHWSE42Fa8HbnudjzPPyep-EujI=',
            description: 'A vibrant dining hub offering a variety of delicious cuisines from multiple food vendors in one convenient location.'
        },
        {
            id: 2,
            name: 'FC (Food Court)',
            image: 'https://blogshalog.com/wp-content/uploads/2024/01/Food-Court-Journey-into-the-Flavorful-Cosmos.jpeg',
            description: 'A vibrant dining hub offering a variety of delicious cuisines from multiple food vendors in one convenient location.'
        },
        {
            id: 3,
            name: 'Yummmpys Food Court',
            image: 'https://aerohub.in/wp-content/uploads/2024/08/Aerohub-Food-Court.jpg',
            description: 'A vibrant dining hub offering a variety of delicious cuisines from multiple food vendors in one convenient location.'
        }
    ];

    const popularItems = [
        { name: 'Chicken Biryani', image: 'https://www.licious.in/blog/wp-content/uploads/2022/06/chicken-hyderabadi-biryani-01-750x750.jpg', court: 'FC (Food Court)', category: 'Biryanis & Meals', price: 150, description: 'Aromatic basmati rice cooked with tender chicken and spices.' },
        { name: 'Fried Rice', image: 'https://images.getrecipekit.com/20220904015448-veg-20fried-20rice.png?aspect_ratio=4:3&quality=90&', court: 'CFC (Central Food Court)', category: 'Noodles & Fried Rice', price: 120, description: 'Stir-fried rice with fresh vegetables and soy sauce.' },
        { name: 'Pizza', image: 'https://eggs.ca/wp-content/uploads/2024/06/EFC-pizza-with-eggs-1280x720-1.jpg', court: 'FC (Food Court)', category: 'Snacks / Sides', price: 200, description: 'Cheesy pizza with a variety of toppings.' },
        { name: 'Maggi', image: 'https://www.nestlerecipescaribbean.com/sites/default/files/styles/recipe_detail_desktop_new/public/srh_recipes/81f0d6debddc801fabebec956cd0312d.jpg?itok=l-7yNDL2', court: 'FC (Food Court)', category: 'Snacks / Sides', price: 80, description: 'Instant noodles with a mix of spices and veggies.' },
        { name: 'Parota', image: 'https://media.istockphoto.com/id/1205482203/photo/kerala-parotta-popularly-known-as-paratha-or-porotta-is-a-delicacy-from-the-state-of-kerala.jpg?s=612x612&w=0&k=20&c=Yv6GQkzNErLM7NUA4q6S27FnFMT7yuC6RSCij5e2m0Y=', court: 'CFC (Central Food Court)', category: 'Breakfast Items', price: 50, description: 'Flaky, layered flatbread best served with curry.' },
        { name: 'Chapati', image: 'https://img.freepik.com/premium-photo/indian-mixed-veg-containing-potato-beans-with-traditional-masala-curry-served-with-chapati-roti-indian-flat-bread_466689-48430.jpg', court: 'FC (Food Court)', category: 'Veg Specials & Curries', price: 40, description: 'Soft whole wheat flatbread, perfect with any curry.' },
        { name: 'Ice Cream', image: 'https://funcakes.com/content/uploads/2023/06/Ice-cream-recipe-600x450.webp', court: 'Yummmpys Food Court', category: 'Beverages', price: 70, description: 'Creamy dessert available in various flavors.' },
        { name: 'Dosa', image: 'https://vismaifood.com/storage/app/uploads/public/8b4/19e/427/thumb__1200_0_0_0_auto.jpg', court: 'CFC (Central Food Court)', category: 'Breakfast Items', price: 60, description: 'Crispy South Indian pancake served with chutney.' },
        { name: 'Chicken Noodles', image: 'https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg?auto=compress&cs=tinysrgb&w=300', court: 'CFC (Central Food Court)', category: 'Noodles & Fried Rice', price: 130, description: 'Noodles stir-fried with chicken and veggies.' },
        { name: 'Masala Maggi', image: 'https://images.pexels.com/photos/1907224/pexels-photo-1907224.jpeg?auto=compress&cs=tinysrgb&w=300', court: 'Yummmpys Food Court', category: 'Snacks / Sides', price: 90, description: 'Spicy instant noodles with a masala twist.' },
        { name: 'Veg Fried Rice', image: 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=300', court: 'Yummmpys Food Court', category: 'Noodles & Fried Rice', price: 110, description: 'Flavorful rice with mixed vegetables.' }
    ];

    const restaurants = [
        {
            id: 1,
            name: 'CFC (Central Food Court)',
            image: 'https://media.istockphoto.com/id/828531982/photo/food-court-market.jpg?s=612x612&w=0&k=20&c=ftIm-Xc9MJ5xxz6xSHWSE42Fa8HbnudjzPPyep-EujI=',
            isOpen: true,
            rating: 4.5,
            time: '20-30 min',
            court: 'CFC (Central Food Court)'
        },
        {
            id: 2,
            name: 'FC (Food Court)',
            image: 'https://blogshalog.com/wp-content/uploads/2024/01/Food-Court-Journey-into-the-Flavorful-Cosmos.jpeg',
            isOpen: true,
            rating: 4.3,
            time: '25-35 min',
            court: 'FC (Food Court)'
        },
        {
            id: 3,
            name: 'Yummmpys Food Court',
            image: 'https://aerohub.in/wp-content/uploads/2024/08/Aerohub-Food-Court.jpg',
            isOpen: true,
            rating: 4.7,
            time: '15-25 min',
            court: 'Yummmpys Food Court'
        }
    ];

    const categories = [
        'All Categories',
        'Beverages',
        'Breakfast Items',
        'Noodles & Fried Rice',
        'Biryanis & Meals',
        'Chicken Specials',
        'Veg Specials & Curries',
        'Egg Dishes',
        'Snacks / Sides'
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % foodCourts.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (errorMessage && errorMessageRef.current) {
            errorMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [errorMessage]);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/auth/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserName(response.data.name);
            } catch (error) {
                console.error('Failed to fetch user profile');
            }
        };
        fetchUserProfile();
    }, []);

    const handleItemClick = (itemName) => {
        setSearchQuery(itemName);
        setSelectedFoodCourt(null);
        setErrorMessage('');
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSelectedFoodCourt(null);
        setErrorMessage('');
    };

    const clearItemSearch = () => {
        setItemSearchQuery('');
        setErrorMessage('');
    };

    const handleFoodCourtClick = (court) => {
        setSelectedFoodCourt(court);
        setSearchQuery(court.name);
        setSelectedCategory('All Categories');
        setErrorMessage('');
    };

    const handleAddItem = async (item) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:5000/api/cart/add',
                {
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    image: item.image,
                    restaurant: item.court,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            updateCart(response.data.items);
            toast.success('Item added to cart');
        } catch (error) {
            setErrorMessage(error.response?.data.message || 'Failed to add item to cart');
            setTimeout(() => setErrorMessage(''), 3000);
        }
    };

    const handleHomeClick = () => {
        setSearchQuery('');
        setSelectedFoodCourt(null);
        setSelectedCategory('All Categories');
        setErrorMessage('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsProfileOpen(false);
    };

    const filteredRestaurants = selectedFoodCourt
        ? restaurants.filter(restaurant => restaurant.name === selectedFoodCourt.name)
        : searchQuery
            ? restaurants.filter(restaurant =>
                restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                popularItems.some(item =>
                    item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
                    item.court === restaurant.name
                )
            )
            : restaurants;

    const filteredPopularItems = selectedFoodCourt
        ? popularItems.filter(item =>
            item.court === selectedFoodCourt.name &&
            (itemSearchQuery ? item.name.toLowerCase().includes(itemSearchQuery.toLowerCase()) : true) &&
            (selectedCategory === 'All Categories' || item.category === selectedCategory)
        )
        : searchQuery
            ? popularItems.filter(item =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            : popularItems;

    return (
        <div className="min-h-screen bg-white">
            <nav className="bg-gradient-to-r from-primary-600 to-primary-700 text-white sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/home" className="flex items-center space-x-2">
                            <img
                                src="/ggu foodies.jpg"
                                alt="GGU Foodies Logo"
                                className="w-10 h-10 rounded-lg"
                            />
                            <span className="text-xl font-bold text-white">GGU Foodies</span>
                        </Link>
                        <div className="hidden md:flex items-center space-x-4">
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center space-x-2"
                                >
                                    <HiUser className="w-6 h-6 text-gray-600" />
                                    <span className="text-gray-600 text-sm font-medium">{userName}</span>
                                </button>
                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-md border border-gray-100 py-2"
                                        >
                                            <Link
                                                to="/profile"
                                                className="flex items-center px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                <HiEye className="w-4 h-4 mr-2" />
                                                View Profile
                                            </Link>
                                            <Link
                                                to="/orders"
                                                className="flex items-center px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                <HiClipboardList className="w-4 h-4 mr-2" />
                                                Orders
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600"
                                            >
                                                <HiLogout className="w-4 h-4 mr-2" />
                                                Logout
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            <Link to="/cart" className="relative p-2 text-white hover:text-gray-200 transition-colors">
                                <HiShoppingCart className="w-6 h-6" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        </div>
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center space-x-2"
                            >
                                <HiUser className="w-6 h-6 text-gray-600" />
                                <span className="text-gray-600 text-sm font-medium">{userName}</span>
                            </button>
                        </div>
                    </div>
                    <AnimatePresence>
                        {isProfileOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="md:hidden bg-white border-t border-gray-100 py-2"
                            >
                                <Link
                                    to="/profile"
                                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600"
                                    onClick={() => setIsProfileOpen(false)}
                                >
                                    <HiEye className="w-4 h-4 mr-2" />
                                    View Profile
                                </Link>
                                <Link
                                    to="/orders"
                                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600"
                                    onClick={() => setIsProfileOpen(false)}
                                >
                                    <HiClipboardList className="w-4 h-4 mr-2" />
                                    Orders
                                </Link>
                                <Link
                                    to="/cart"
                                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600"
                                    onClick={() => setIsProfileOpen(false)}
                                >
                                    <HiShoppingCart className="w-4 h-4 mr-2" />
                                    Cart ({cartCount})
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600"
                                >
                                    <HiLogout className="w-4 h-4 mr-2" />
                                    Logout
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pb-20 md:pb-6">
                <div className="mb-8">
                    <div className="relative max-w-md mx-auto">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <HiSearch className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search for food or food courts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                        />
                        {searchQuery && (
                            <button
                                onClick={clearSearch}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                <HiX className="h-5 w-5 text-gray-400 hover:text-red-600" />
                            </button>
                        )}
                    </div>
                </div>

                <AnimatePresence>
                    {errorMessage && (
                        <motion.div
                            ref={errorMessageRef}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center max-w-md mx-auto"
                        >
                            {errorMessage}
                        </motion.div>
                    )}
                </AnimatePresence>

                {selectedFoodCourt ? (
                    <>
                        <div className="mb-8">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                                <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                                    <button
                                        onClick={handleHomeClick}
                                        className="text-gray-600 hover:text-red-600 text-sm font-medium"
                                    >
                                        Home
                                    </button>
                                    <span className="text-gray-600">/</span>
                                    <h2 className="text-2xl font-extrabold text-gray-800">
                                        {selectedFoodCourt.name}
                                    </h2>
                                </div>
                                <div className="relative w-full sm:w-48">
                                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                        <HiSearch className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search items..."
                                        value={itemSearchQuery}
                                        onChange={(e) => setItemSearchQuery(e.target.value)}
                                        className="w-full pl-8 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm"
                                    />
                                    {itemSearchQuery && (
                                        <button
                                            onClick={clearItemSearch}
                                            className="absolute inset-y-0 right-0 pr-2 flex items-center"
                                        >
                                            <HiX className="h-4 w-4 text-gray-400 hover:text-red-600" />
                                        </button>
                                    )}
                                </div>
                            </div>
                            {filteredRestaurants.map((restaurant) => (
                                <div key={restaurant.id} className="text-center mb-4">
                                    <p className="text-gray-600">{restaurant.court}</p>
                                    <div className="flex justify-center items-center space-x-4">
                                        <div className="flex items-center space-x-1">
                                            <HiStar className="w-4 h-4 text-yellow-500" />
                                            <span className="text-sm font-medium">{restaurant.rating}</span>
                                        </div>
                                        <div className="flex items-center space-x-1 text-gray-600">
                                            <HiClock className="w-4 h-4" />
                                            <span className="text-sm">{restaurant.time}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mb-8">
                            <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center mb-4">
                                <h2 className="text-2xl font-bold text-gray-800 text-center sm:text-left">
                                    Items at {selectedFoodCourt.name}
                                </h2>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="mt-2 sm:mt-0 sm:ml-4 w-full sm:w-48 py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm"
                                >
                                    {categories.map((category, index) => (
                                        <option key={index} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {filteredPopularItems.length > 0 ? (
                                <div className="space-y-4">
                                    {filteredPopularItems.map((item, index) => (
                                        <motion.div
                                            key={index}
                                            whileHover={{ scale: 1.02 }}
                                            className="bg-white rounded-lg shadow-md flex overflow-hidden hover:shadow-lg transition-shadow"
                                        >
                                            <div className="flex-1 p-4 flex flex-col justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                                                    <p className="text-xs text-gray-600 mt-1">{item.category}</p>
                                                    <p className="text-sm font-semibold text-gray-800 mt-1">₹{item.price}</p>
                                                    <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                                                    <button
                                                        onClick={() => handleAddItem(item)}
                                                        className="mt-2 bg-red-600 text-white px-3 py-1 rounded-lg flex items-center space-x-1 hover:bg-red-700 transition-colors w-fit"
                                                    >
                                                        <HiPlus className="w-4 h-4" />
                                                        <span className="text-sm">Add</span>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0 w-1/3">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-32 object-cover rounded-r-lg"
                                                />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-600">No items available yet for this category.</p>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Our Food Courts</h2>
                            <div className="relative overflow-hidden rounded-xl">
                                <div
                                    className="flex transition-transform duration-500 ease-in-out"
                                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                                >
                                    {foodCourts.map((court) => (
                                        <div key={court.id} className="w-full flex-shrink-0 relative">
                                            <img
                                                src={court.image}
                                                alt={court.name}
                                                className="w-full h-64 md:h-80 object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end">
                                                <div className="p-6 text-white">
                                                    <h3 className="text-xl font-bold mb-2">{court.name}</h3>
                                                    <p className="text-sm opacity-90">{court.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                    {foodCourts.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentSlide(index)}
                                            className={`w-2 h-2 rounded-full transition-colors ${index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Popular Items</h2>
                            <div className="flex overflow-x-auto space-x-4 md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-3 md:space-x-0 scrollbar-hide">
                                {filteredPopularItems.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        whileHover={{ scale: 1.02 }}
                                        onClick={() => handleItemClick(item.name)}
                                        className="bg-white rounded-lg shadow-md flex flex-col items-center overflow-hidden hover:shadow-lg transition-shadow cursor-pointer p-4 flex-shrink-0 w-40 md:w-auto"
                                    >
                                        <p className="text-sm font-medium text-gray-800 mb-2 text-center">{item.name}</p>
                                        <div className="flex-shrink-0 w-[97%] md:w-1/2">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-24 object-cover rounded-lg"
                                            />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Available Food Courts</h2>
                            {filteredRestaurants.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredRestaurants.map((restaurant) => (
                                        <motion.div
                                            key={restaurant.id}
                                            whileHover={restaurant.isOpen ? { scale: 1.02 } : {}}
                                            className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ${restaurant.isOpen ? 'hover:shadow-lg cursor-pointer' : 'opacity-50 cursor-not-allowed grayscale'
                                                }`}
                                            onClick={() => restaurant.isOpen && handleFoodCourtClick(restaurant)}
                                        >
                                            <div className="relative">
                                                <img
                                                    src={restaurant.image}
                                                    alt={restaurant.name}
                                                    className="w-full h-40 object-cover"
                                                />
                                                <div
                                                    className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${restaurant.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                        }`}
                                                >
                                                    {restaurant.isOpen ? 'Open' : 'Closed'}
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-bold text-gray-800 mb-1">{restaurant.name}</h3>
                                                <p className="text-sm text-gray-600 mb-2">{restaurant.court}</p>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-1">
                                                        <HiStar className="w-4 h-4 text-yellow-500" />
                                                        <span className="text-sm font-medium">{restaurant.rating}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1 text-gray-600">
                                                        <HiClock className="w-4 h-4" />
                                                        <span className="text-sm">{restaurant.time}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-600">No food courts available for this item.</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
                <div className="flex justify-around items-center">
                    <Link to="/home" onClick={handleHomeClick} className="flex flex-col items-center py-2 text-red-600">
                        <HiHome className="w-6 h-6" />
                        <span className="text-xs mt-1">Home</span>
                    </Link>
                    <Link to="/food-courts" className="flex flex-col items-center py-2 text-gray-600">
                        <HiOfficeBuilding className="w-6 h-6" />
                        <span className="text-xs mt-1">Food Courts</span>
                    </Link>
                    <Link to="/orders" className="flex flex-col items-center py-2 text-gray-600">
                        <HiClipboardList className="w-6 h-4" />
                        <span className="text-xs mt-1">Orders</span>
                    </Link>
                    <Link to="/cart" className="flex flex-col items-center py-2 text-gray-600 relative">
                        <HiShoppingCart className="w-6 h-6" />
                        <span className="text-xs mt-1">Cart</span>
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>

            <style>
                {`
                    .scrollbar-hide::-webkit-scrollbar {
                        display: none;
                    }
                    .scrollbar-hide {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `}
            </style>
        </div>
    );
};

export default HomePage;