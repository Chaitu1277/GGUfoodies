import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { HiStar, HiClock, HiShoppingBag } from 'react-icons/hi';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext

const LandingPage = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();
    const { isLoggedIn } = useContext(AuthContext); // Access auth state

    const foodCourts = [
        {
            id: 1,
            name: 'CFC (Central Food Court)',
            description: 'A vibrant dining hub offering a variety of delicious cuisines from multiple food vendors in one convenient location.',
            image: 'https://media.istockphoto.com/id/828531982/photo/food-court-market.jpg?s=612x612&w=0&k=20&c=ftIm-Xc9MJ5xxz6xSHWSE42Fa8HbnudjzPPyep-EujI=',
            rating: 4.5,
            specialties: ['Chapathi', 'Bread Omlette', 'Parota', 'Chicken Noddles']
        },
        {
            id: 2,
            name: 'FC (Food Court)',
            description: 'A vibrant dining hub offering a variety of delicious cuisines from multiple food vendors in one convenient location.',
            image: 'https://blogshalog.com/wp-content/uploads/2024/01/Food-Court-Journey-into-the-Flavorful-Cosmos.jpeg',
            rating: 4.3,
            specialties: ['Chicken Biryani', 'Bread Omlette', 'Panner Fried Rice', 'Mughalai Biryani']
        },
        {
            id: 3,
            name: 'Yummmpys Food Court',
            description: 'A vibrant dining hub offering a variety of delicious cuisines from multiple food vendors in one convenient location.',
            image: 'https://aerohub.in/wp-content/uploads/2024/08/Aerohub-Food-Court.jpg',
            rating: 4.7,
            specialties: ['Chicken Biryani', 'Masala Maggi', 'Ice Cream', 'Veg Fried Rice']
        }
    ];

    const popularItems = [
        {
            name: 'Chicken Biryani',
            image: 'https://www.licious.in/blog/wp-content/uploads/2022/06/chicken-hyderabadi-biryani-01-750x750.jpg',
            court: 'FC',
            category: 'Biryanis & Meals'
        },
        {
            name: 'Fried Rice',
            image: 'https://images.getrecipekit.com/20220904015448-veg-20fried-20rice.png?aspect_ratio=4:3&quality=90&',
            court: 'CFC',
            category: 'Noodles & Fried Rice'
        },
        {
            name: 'Pizza',
            image: 'https://eggs.ca/wp-content/uploads/2024/06/EFC-pizza-with-eggs-1280x720-1.jpg',
            court: 'FC',
            category: 'Snacks / Sides'
        },
        {
            name: 'Maggi',
            image: 'https://www.nestlerecipescaribbean.com/sites/default/files/styles/recipe_detail_desktop_new/public/srh_recipes/81f0d6debddc801fabebec956cd0312d.jpg?itok=l-7yNDL2',
            court: 'FC',
            category: 'Snacks / Sides'
        },
        {
            name: 'Parota',
            image: 'https://media.istockphoto.com/id/1205482203/photo/kerala-parotta-popularly-known-as-paratha-or-porotta-is-a-delicacy-from-the-state-of-kerala.jpg?s=612x612&w=0&k=20&c=Yv6GQkzNErLM7NUA4q6S27FnFMT7yuC6RSCij5e2m0Y=',
            court: 'CFC',
            category: 'Breakfast Items'
        },
        {
            name: 'Chapati',
            image: 'https://img.freepik.com/premium-photo/indian-mixed-veg-containing-potato-beans-with-traditional-masala-curry-served-with-chapati-roti-indian-flat-bread_466689-48430.jpg',
            court: 'FC',
            category: 'Veg Specials & Curries'
        },
        {
            name: 'Ice Cream',
            image: 'https://funcakes.com/content/uploads/2023/06/Ice-cream-recipe-600x450.webp',
            court: 'Yummmpys',
            category: 'Beverages'
        },
        {
            name: 'Dosa',
            image: 'https://vismaifood.com/storage/app/uploads/public/8b4/19e/427/thumb__1200_0_0_0_auto.jpg',
            court: 'CFC',
            category: 'Breakfast Items'
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % foodCourts.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const handleViewMenu = (court) => {
        if (isLoggedIn) {
            navigate('/home', { state: { selectedCourt: court } });
        } else {
            navigate('/login', { state: { from: '/home', selectedCourt: court } });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero Section */}
            <section id="top" className="relative bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h1 className="text-4xl md:text-6xl font-bold mb-6">
                                Skip the Wait,<br />
                                <span className="text-accent-400">Order Ahead!</span>
                            </h1>
                            <p className="text-xl mb-8 text-blue-100">
                                Pre-order your favorite meals from GGU's top food courts.
                                Choose dine-in or takeaway, and enjoy your food without the hassle.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/signup" className="bg-white text-red-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200">
                                    Get Started
                                </Link>
                                <button
                                    onClick={() => {
                                        if (isLoggedIn) {
                                            navigate('/home');
                                        } else {
                                            navigate('/login', { state: { from: '/home' } });
                                        }
                                    }}
                                    className="px-6 py-2 border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-primary-600 transition-colors duration-200"
                                >
                                    Explore Food Courts
                                </button>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative"
                        >
                            <img
                                src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600"
                                alt="GGU Foodies Logo"
                                className="rounded-2xl shadow-2xl w-full h-auto"
                            />
                            <div className="absolute -bottom-6 -left-6 bg-white text-gray-800 p-4 rounded-xl shadow-lg">
                                <div className="flex items-center space-x-2">
                                    <HiStar className="w-5 h-5 text-yellow-500" />
                                    <span className="font-semibold">4.8 Rating</span>
                                </div>
                                <p className="text-sm text-gray-600">1000+ Happy Customers</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Restaurants Section */}
            <section id="food-courts" className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">
                            Food Courts
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Discover the diverse culinary landscape at GGU with our three premier food courts,
                            each offering unique flavors and experiences.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {foodCourts.map((court, index) => (
                            <motion.div
                                key={court.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                className="card overflow-hidden group hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className="relative overflow-hidden">
                                    <img
                                        src={court.image}
                                        alt={court.name}
                                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full flex items-center space-x-1">
                                        <HiStar className="w-4 h-4 text-yellow-500" />
                                        <span className="text-sm font-semibold">{court.rating}</span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                                        {court.name}
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        {court.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {court.specialties.map((specialty) => (
                                            <span
                                                key={specialty}
                                                className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm"
                                            >
                                                {specialty}
                                            </span>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => handleViewMenu(court)}
                                        className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 text-center block"
                                    >
                                        View Menu
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Popular Items Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">
                            Popular Items
                        </h2>
                        <p className="text-xl text-gray-600">
                            Most loved dishes across all our food courts
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {popularItems.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="card w-full h-[300px] flex flex-col justify-between overflow-hidden group hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="relative w-full h-[200px] flex-shrink-0">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover transition-transform duration-300"
                                    />
                                    <div className="absolute top-2 left-2 bg-primary-600 text-white px-2 py-1 rounded text-xs">
                                        {item.court}
                                    </div>
                                </div>

                                <div className="p-4 flex flex-col items-center justify-center">
                                    <h3 className="font-semibold text-gray-800 text-center">
                                        {item.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {item.category}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">
                            Why Choose GGU Foodies?
                        </h2>
                        <p className="text-xl text-gray-600">
                            Experience the convenience of pre-ordering with these amazing features
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <HiClock className="w-8 h-8 text-primary-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-4">
                                Skip the Wait
                            </h3>
                            <p className="text-gray-600">
                                Pre-order your meals and skip the long queues. Your food will be ready when you arrive.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <HiShoppingBag className="w-8 h-8 text-primary-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-4">
                                Flexible Options
                            </h3>
                            <p className="text-gray-600">
                                Choose between dine-in or takeaway options based on your preference and schedule.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <HiStar className="w-8 h-8 text-primary-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-4">
                                Quality Assured
                            </h3>
                            <p className="text-gray-600">
                                All our food courts maintain the highest quality standards with fresh ingredients.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl font-bold mb-6">
                            Ready to Start Ordering?
                        </h2>
                        <p className="text-xl mb-8 text-blue-100">
                            Join thousands of students who are already enjoying the convenience of pre-ordering their meals.
                        </p>
                        <Link
                            to="/signup"
                            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200 inline-block"
                        >
                            Get Started Today
                        </Link>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;