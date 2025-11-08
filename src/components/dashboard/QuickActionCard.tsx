import React from 'react';
import { Card } from 'antd';

// Reusable quick action card component for navigation shortcuts
interface QuickActionCardProps {
    title: string; // Card title
    description: string; // Card description text
    icon: React.ReactNode; // Icon component to display
    iconColor?: string; // Optional custom color for icon
    onClick: () => void; // Click handler for navigation
    className?: string; // Optional additional CSS classes
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
    title,
    description,
    icon,
    iconColor = 'text-blue-500',
    onClick,
    className = ''
}) => {
    return (
        <Card
            hoverable
            onClick={onClick}
            className={`text-center cursor-pointer transition-all hover:shadow-lg ${className}`}
            bodyStyle={{ padding: '24px' }}
        >
            <div className={`text-5xl mb-4 ${iconColor}`}>
                {icon}
            </div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-gray-600 text-sm">{description}</p>
        </Card>
    );
};

export default QuickActionCard;
