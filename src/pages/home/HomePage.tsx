import React from "react";
import { useAppSelector } from "../../redux/app/hook";
import PublicHomePage from "./PublicHomePage";
import AdminHomePage from "./AdminHomePage";
import StaffHomePage from "./StaffHomePage";
import CustomerHomePage from "./CustomerHomePage";

// HomePage router component based on user role
const HomePage: React.FC = () => {
    const { user, token } = useAppSelector(state => state.auth);
    const isAuthenticated = !!token && !!user;

    // Show different homepage based on user role
    if (!isAuthenticated) {
        return <PublicHomePage />;
    }

    switch (user?.role) {
        case 'Admin':
            return <AdminHomePage />;
        case 'Staff':
            return <StaffHomePage />;
        case 'Customer':
            return <CustomerHomePage />;
        default:
            return <PublicHomePage />;
    }
};

export default HomePage;