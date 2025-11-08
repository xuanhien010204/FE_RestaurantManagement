import React from 'react';
import { Card, Statistic } from 'antd';

// Reusable statistic card component for displaying metrics
interface StatCardProps {
    title: string; // Display title for the statistic
    value: string | number; // Numeric or string value to display
    icon: React.ReactNode; // Icon component to show
    iconColor?: string; // Optional custom color for icon
    prefix?: React.ReactNode; // Optional prefix (e.g., currency symbol)
    suffix?: React.ReactNode; // Optional suffix (e.g., unit)
    className?: string; // Optional additional CSS classes
    onClick?: () => void; // Optional click handler
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon,
    iconColor = 'text-blue-600',
    prefix,
    suffix,
    className = '',
    onClick
}) => {
    return (
        <Card
            hoverable={!!onClick}
            onClick={onClick}
            className={`shadow-md ${className}`}
        >
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <Statistic
                        title={title}
                        value={value}
                        prefix={prefix}
                        suffix={suffix}
                        valueStyle={{ fontSize: '24px', fontWeight: 'bold' }}
                    />
                </div>
                <div className={`text-4xl ${iconColor}`}>
                    {icon}
                </div>
            </div>
        </Card>
    );
};

export default StatCard;
