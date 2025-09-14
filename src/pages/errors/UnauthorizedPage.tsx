import React from "react";

const UnauthorizedPage: React.FC = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-400 mb-4">403</h1>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Access Denied
            </h2>
            <p className="text-gray-600 mb-8">
                You don't have permission to access this resource.
            </p>
            <button
                onClick={() => window.history.back()}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
                Go Back
            </button>
        </div>
    </div>
);

export default UnauthorizedPage;