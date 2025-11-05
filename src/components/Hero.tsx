import React from "react";
import { Button } from "antd";

const Hero: React.FC = () => {
    return (
        <section className="bg-[url('/src/assets/hero.jpg')] bg-cover bg-center">
            <div className="bg-black/40">
                <div className="max-w-7xl mx-auto px-4 py-20 text-center text-white">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">Fresh. Local. Delicious.</h1>
                    <p className="text-lg md:text-xl mb-8">Experience the best flavors from our kitchen. Reserve a table or order delivery now.</p>
                    <div className="flex justify-center gap-4">
                        <Button type="primary" size="large" className="bg-brand.red border-0">Reserve a Table</Button>
                        <Button size="large" className="bg-white text-black">Order Online</Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
