import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoadingSpinner } from "./components/ui";
import { routeConfig } from "./config/routes.config";

/**
 * Main application router component
 * Uses configuration-based routing for better maintainability
 */
const AppRoutes: React.FC = () => {
    return (
        <BrowserRouter>
            <Suspense fallback={<LoadingSpinner tip="Loading application..." />}>
                <Routes>
                    {routeConfig.map((route, index) => (
                        <Route
                            key={route.path || `route-${index}`}
                            path={route.path}
                            element={route.element}
                        />
                    ))}
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
};

export default AppRoutes;
