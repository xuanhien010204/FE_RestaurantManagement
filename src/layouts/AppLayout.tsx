import React from "react";
import { Layout } from "antd";
import Header from "./Header";
import Footer from "./Footer";

const { Content } = Layout;

interface AppLayoutProps {
    children: React.ReactNode;
    showFooter?: boolean;
    className?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({
    children,
    showFooter = true,
    className = ""
}) => {
    return (
        <Layout className={`min-h-screen ${className}`}>
            <Header />
            <Content className="flex-1">
                {children}
            </Content>
            {showFooter && <Footer />}
        </Layout>
    );
};

export default AppLayout;