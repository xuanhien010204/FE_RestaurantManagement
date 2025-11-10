import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import AuthGuard from "../guards/AuthGuard";
import { AppLayout } from "../layouts";
import { HomePage } from "../pages/home";
import { UnauthorizedPage, NotFoundPage } from "../pages/errors";
import PublicGuard from "../guards/PublicGuard";
const AboutPage = lazy(() => import("../pages/public/AboutPage"));
const ContactPage = lazy(() => import("../pages/public/ContactPage"));
// Lazy load pages for better performance
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"));

// Admin pages
const MenuManagementPage = lazy(() => import("../pages/admin/MenuManagementPage"));
const StaffManagementPage = lazy(() => import("../pages/admin/StaffManagementPage"));
const OrderManagementPage = lazy(() => import("../pages/admin/OrderManagementPage"));
const TableManagementPage = lazy(() => import("../pages/admin/TableManagementPage"));
const FeedbackManagementPage = lazy(() => import("../pages/admin/FeedbackManagementPage"));
const PaymentManagementPage = lazy(() => import("../pages/admin/PaymentManagementPage"));
const PaymentCreatePage = lazy(() => import("../pages/admin/PaymentCreatePage"));

// Staff pages
const StaffDashboardPage = lazy(() => import("../pages/staff/StaffDashboardPage"));

// Customer pages
const CustomerOrderPage = lazy(() => import("../pages/customer/CustomerOrderPage"));
const CustomerPaymentPage = lazy(() => import("../pages/customer/CustomerPaymentPage"));
const CustomerProfilePage = lazy(() => import("../pages/customer/CustomerProfilePage"));
const CustomerFeedbackPage = lazy(() => import("../pages/customer/CustomerFeedbackPage"));
const CustomerReservationPage = lazy(() => import("../pages/customer/CustomerReservationPage"));

// Route configuration following a senior-level pattern
export const routeConfig: RouteObject[] = [
    // Public routes without layout
    {
        path: "/login",
        element: (
            <AppLayout>
                <PublicGuard>
                    <LoginPage />
                </PublicGuard>
            </AppLayout>
        ),
    },
    {
        path: "/unauthorized",
        element:
            <AppLayout>
                <UnauthorizedPage />
            </AppLayout>
    },
    {
        path: "/register",
        element: (
            <AppLayout>
                <PublicGuard>
                    <RegisterPage />
                </PublicGuard>
            </AppLayout>
        ),
    },
    // Public home page with layout
    {
        path: "/",
        element: (
            <AppLayout>
                <HomePage />
            </AppLayout>
        ),
    },
    {
        path: "/about",
        element: (
            <AppLayout>
                <AboutPage />
            </AppLayout>
        ),
    },
    {
        path: "/contact",
        element: (
            <AppLayout>
                <ContactPage />
            </AppLayout>
        ),
    },

    // Admin routes
    {
        path: "/admin",
        element: (
            <AppLayout>
                <AuthGuard allowedRoles={["Admin"]}>
                    <div className="p-6">
                        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded-lg shadow">
                                <h3 className="text-lg font-semibold mb-2">Quản lý thực đơn</h3>
                                <p className="text-gray-600 mb-4">Quản lý các món ăn và thức uống</p>
                                <a href="/admin/menu" className="text-blue-600 hover:underline">Xem chi tiết →</a>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow">
                                <h3 className="text-lg font-semibold mb-2">Quản lý nhân viên</h3>
                                <p className="text-gray-600 mb-4">Quản lý thông tin nhân viên</p>
                                <a href="/admin/staff" className="text-blue-600 hover:underline">Xem chi tiết →</a>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow">
                                <h3 className="text-lg font-semibold mb-2">Quản lý đơn hàng</h3>
                                <p className="text-gray-600 mb-4">Theo dõi và xử lý đơn hàng</p>
                                <a href="/admin/orders" className="text-blue-600 hover:underline">Xem chi tiết →</a>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow">
                                <h3 className="text-lg font-semibold mb-2">Quản lý bàn ăn</h3>
                                <p className="text-gray-600 mb-4">Quản lý bàn và đặt chỗ</p>
                                <a href="/admin/tables" className="text-blue-600 hover:underline">Xem chi tiết →</a>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow">
                                <h3 className="text-lg font-semibold mb-2">Quản lý đánh giá</h3>
                                <p className="text-gray-600 mb-4">Xem và phản hồi đánh giá</p>
                                <a href="/admin/feedback" className="text-blue-600 hover:underline">Xem chi tiết →</a>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow">
                                <h3 className="text-lg font-semibold mb-2">Quản lý thanh toán</h3>
                                <p className="text-gray-600 mb-4">Theo dõi giao dịch và doanh thu</p>
                                <a href="/admin/payments" className="text-blue-600 hover:underline">Xem chi tiết →</a>
                            </div>
                        </div>
                    </div>
                </AuthGuard>
            </AppLayout>
        ),
    },
    {
        path: "/admin/menu",
        element: (
            <AppLayout>
                <AuthGuard allowedRoles={["Admin", "Staff"]}>
                    <MenuManagementPage />
                </AuthGuard>
            </AppLayout>
        ),
    },
    {
        path: "/admin/staff",
        element: (
            <AppLayout>
                <AuthGuard allowedRoles={["Admin"]}>
                    <StaffManagementPage />
                </AuthGuard>
            </AppLayout>
        ),
    },
    {
        path: "/admin/orders",
        element: (
            <AppLayout>
                <AuthGuard allowedRoles={["Admin", "Staff"]}>
                    <OrderManagementPage />
                </AuthGuard>
            </AppLayout>
        ),
    },
    {
        path: "/admin/tables",
        element: (
            <AppLayout>
                <AuthGuard allowedRoles={["Admin", "Staff"]}>
                    <TableManagementPage />
                </AuthGuard>
            </AppLayout>
        ),
    },
    {
        path: "/admin/feedback",
        element: (
            <AppLayout>
                <AuthGuard allowedRoles={["Admin"]}>
                    <FeedbackManagementPage />
                </AuthGuard>
            </AppLayout>
        ),
    },
    {
        path: "/admin/payments",
        element: (
            <AppLayout>
                <AuthGuard allowedRoles={["Admin", "Staff"]}>
                    <PaymentManagementPage />
                </AuthGuard>
            </AppLayout>
        ),
    },
    {
        path: "/admin/payments/create",
        element: (
            <AppLayout>
                <AuthGuard allowedRoles={["Admin", "Staff"]}>
                    <PaymentCreatePage />
                </AuthGuard>
            </AppLayout>
        ),
    },

    // Staff routes
    {
        path: "/staff",
        element: (
            <AppLayout>
                <AuthGuard allowedRoles={["Admin", "Staff"]}>
                    <StaffDashboardPage />
                </AuthGuard>
            </AppLayout>
        ),
    },

    // Customer routes
    {
        path: "/customer/orders",
        element: (
            <AppLayout>
                <AuthGuard>
                    <CustomerOrderPage />
                </AuthGuard>
            </AppLayout>
        ),
    },
    {
        path: "/customer/payments",
        element: (
            <AppLayout>
                <AuthGuard>
                    <CustomerPaymentPage />
                </AuthGuard>
            </AppLayout>
        ),
    },
    {
        path: "/customer/profile",
        element: (
            <AppLayout>
                <AuthGuard>
                    <CustomerProfilePage />
                </AuthGuard>
            </AppLayout>
        ),
    },
    {
        path: "/customer/feedback",
        element: (
            <AppLayout>
                <AuthGuard>
                    <CustomerFeedbackPage />
                </AuthGuard>
            </AppLayout>
        ),
    },
    {
        path: "/customer/reservations",
        element: (
            <AppLayout>
                <AuthGuard>
                    <CustomerReservationPage />
                </AuthGuard>
            </AppLayout>
        ),
    },

    // Protected user routes
    {
        path: "/reservations",
        element: (
            <AppLayout>
                <AuthGuard>
                    <div className="p-6">
                        <h1 className="text-2xl font-bold mb-4">Quản lý đặt bàn</h1>
                        <p className="text-gray-600">Reservation functionality coming soon...</p>
                    </div>
                </AuthGuard>
            </AppLayout>
        ),
    },
    {
        path: "/orders",
        element: (
            <AppLayout>
                <AuthGuard>
                    <div className="p-6">
                        <h1 className="text-2xl font-bold mb-4">Quản lý đơn hàng</h1>
                        <p className="text-gray-600">Order functionality coming soon...</p>
                    </div>
                </AuthGuard>
            </AppLayout>
        ),
    },

    // Catch-all route for 404
    {
        path: "*",
        element: <NotFoundPage />,
    },
];

export default routeConfig;
