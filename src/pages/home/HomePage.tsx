import React from "react";
import { Button } from "antd";
import { PlayCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import Hero from "../../components/Hero";
import MenuCard from "../../components/MenuCard";

const featuredMenu = [
    {
        title: 'Grilled Salmon',
        description: 'Fresh Atlantic salmon grilled to perfection with herbs and lemon',
        price: '$28.99',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop'
    },
    {
        title: 'Wagyu Beef Steak',
        description: 'Premium wagyu steak with roasted vegetables and red wine reduction',
        price: '$45.50',
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop'
    },
    {
        title: 'Lobster Risotto',
        description: 'Creamy arborio rice with fresh lobster and saffron',
        price: '$32.99',
        image: 'https://images.unsplash.com/photo-1563379091339-03246963d7d3?w=400&h=300&fit=crop'
    },
    {
        title: 'Truffle Pasta',
        description: 'Handmade pasta with black truffle and parmesan cream sauce',
        price: '$26.00',
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop'
    },
    {
        title: 'Duck Confit',
        description: 'Slow-cooked duck leg with garlic potatoes and cherry sauce',
        price: '$29.50',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop'
    },
    {
        title: 'Chocolate Soufflé',
        description: 'Warm chocolate soufflé with vanilla ice cream and berry coulis',
        price: '$12.50',
        image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop'
    },
];

const HomePage: React.FC = () => (
    <div className="min-h-screen">
        <Hero />

        {/* About Section */}
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="relative">
                        <img
                            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop"
                            alt="Restaurant interior"
                            className="rounded-lg shadow-lg w-full"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg flex items-center justify-center">
                            <Button
                                type="text"
                                size="large"
                                icon={<PlayCircleOutlined style={{ fontSize: '48px', color: 'white' }} />}
                                className="border-0 shadow-none hover:scale-110 transition-transform"
                            />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">
                            Culinary Excellence Since 1985
                        </h2>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            We believe that great food brings people together. Our passionate chefs use only the finest
                            ingredients to create memorable dining experiences that celebrate the art of cuisine.
                        </p>
                        <div className="space-y-4 mb-8">
                            <div className="flex items-center">
                                <CheckCircleOutlined className="text-brand-red text-xl mr-3" />
                                <span className="text-gray-700">Fresh ingredients sourced daily</span>
                            </div>
                            <div className="flex items-center">
                                <CheckCircleOutlined className="text-brand-red text-xl mr-3" />
                                <span className="text-gray-700">Award-winning chef team</span>
                            </div>
                            <div className="flex items-center">
                                <CheckCircleOutlined className="text-brand-red text-xl mr-3" />
                                <span className="text-gray-700">Warm, welcoming atmosphere</span>
                            </div>
                        </div>
                        <Button
                            type="primary"
                            size="large"
                            className="bg-brand-red border-brand-red hover:bg-red-700 px-8"
                        >
                            Learn More About Us
                        </Button>
                    </div>
                </div>
            </div>
        </section>

        {/* Featured Menu Section */}
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Signature Dishes</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover our chef's carefully crafted selections, each dish representing the perfect
                        balance of flavor, presentation, and culinary artistry.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredMenu.map((dish) => (
                        <MenuCard
                            key={dish.title}
                            title={dish.title}
                            description={dish.description}
                            price={dish.price}
                            image={dish.image}
                        />
                    ))}
                </div>
                <div className="text-center mt-12">
                    <Button
                        type="default"
                        size="large"
                        className="border-brand-red text-brand-red hover:bg-brand-red hover:text-white px-8"
                    >
                        View Full Menu
                    </Button>
                </div>
            </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-brand-red text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div>
                        <div className="text-4xl font-bold mb-2">38+</div>
                        <div className="text-red-100">Years of Excellence</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold mb-2">50K+</div>
                        <div className="text-red-100">Happy Customers</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold mb-2">15</div>
                        <div className="text-red-100">Award Winning</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold mb-2">100+</div>
                        <div className="text-red-100">Menu Items</div>
                    </div>
                </div>
            </div>
        </section>

        {/* Reservation CTA Section */}
        <section className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                    Ready for an Unforgettable Experience?
                </h2>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                    Book your table today and let us create a memorable dining experience for you and your loved ones.
                    Our team is ready to serve you with excellence.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        type="primary"
                        size="large"
                        className="bg-brand-red border-brand-red hover:bg-red-700 px-8"
                    >
                        Reserve a Table
                    </Button>
                    <Button
                        type="default"
                        size="large"
                        className="border-brand-red text-brand-red hover:bg-brand-red hover:text-white px-8"
                    >
                        Order Online
                    </Button>
                </div>
            </div>
        </section>
    </div>
);

export default HomePage;