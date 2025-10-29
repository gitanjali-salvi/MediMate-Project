import React from 'react';
import { Navigate } from 'react-router-dom';

// This component acts as a gatekeeper for our dashboard pages
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    // If there is no token in localStorage, the user is not logged in.
    // Redirect them to the login page.
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // If they are logged in, show them the page they requested.
    return children;
};

export default ProtectedRoute;