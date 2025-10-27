import React from "react";
import { Card, Button } from "antd";

interface MenuCardProps {
    title: string;
    description?: string;
    price?: string;
    image?: string;
}

const MenuCard: React.FC<MenuCardProps> = ({ title, description, price, image }) => {
    return (
        <Card hoverable bodyStyle={{ padding: 12 }} className="shadow-md">
            <div className="flex flex-col">
                <div className="w-full h-44 bg-gray-100 rounded mb-3 flex items-center justify-center overflow-hidden">
                    {image ? <img src={image} alt={title} className="w-full h-full object-cover" /> : <div className="text-gray-400">No Image</div>}
                </div>
                <h3 className="font-semibold text-lg">{title}</h3>
                <p className="text-sm text-gray-500">{description}</p>
                <div className="mt-4 flex items-center justify-between">
                    <div className="text-lg font-bold">{price}</div>
                    <Button type="primary" className="bg-brand.red border-0">Add</Button>
                </div>
            </div>
        </Card>
    );
};

export default MenuCard;
