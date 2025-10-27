import React from "react";
import Hero from "../../components/Hero";
import MenuCard from "../../components/MenuCard";

const sampleMenu = [
    { title: 'Grilled Salmon', description: 'Fresh salmon with herbs', price: '$18.99' },
    { title: 'Beef Steak', description: 'Juicy steak with side salad', price: '$24.50' },
    { title: 'Caesar Salad', description: 'Crisp romaine with parmesan', price: '$9.99' },
    { title: 'Margherita Pizza', description: 'Classic pizza with basil', price: '$12.50' },
    { title: 'Pasta Alfredo', description: 'Creamy parmesan sauce', price: '$14.00' },
    { title: 'Chocolate Cake', description: 'Decadent chocolate dessert', price: '$6.50' },
];

const HomePage: React.FC = () => (
    <div className="min-h-screen bg-gray-50">
        <Hero />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-2xl font-bold mb-6">Popular Dishes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sampleMenu.map((m) => (
                    <MenuCard key={m.title} title={m.title} description={m.description} price={m.price} />
                ))}
            </div>
        </div>
    </div>
);

export default HomePage;