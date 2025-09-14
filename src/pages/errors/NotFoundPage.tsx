import React from "react";

const NotFoundPage: React.FC = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-400 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Page Not Found
            </h2>
            <p className="text-gray-600 mb-8">
                The page you're looking for doesn't exist.
            </p>
            <button
                onClick={() => window.history.back()}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors mr-4"
            >
                Go Back
            </button>
            <a
                href="/"
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors inline-block"
            >
                Go Home
            </a>
        </div>
    </div>
);

export default NotFoundPage;