import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function ProtectedRoute({ element, children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(null);  // null for loading state
    const location = useLocation();

    const checkAuth = async () => {
        try {
            await axios.get('http://localhost:8000/api/v1/users/protected-route', {
                withCredentials: true,
            });
            setIsAuthenticated(true);
        } catch (error) {
            setIsAuthenticated(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        return <div>Loading...</div>;  // Loading state
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If authenticated, render the passed element or children
    return element ? element : children;
}

export default ProtectedRoute;
