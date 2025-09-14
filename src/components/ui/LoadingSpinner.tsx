import React from "react";
import { Spin } from "antd";

interface LoadingSpinnerProps {
    size?: "small" | "default" | "large";
    tip?: string;
    className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = "large",
    tip = "Loading...",
    className = ""
}) => (
    <div className={`min-h-screen flex items-center justify-center ${className}`}>
        <Spin size={size} tip={tip} />
    </div>
);

export default LoadingSpinner;