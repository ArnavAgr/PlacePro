import React from 'react';
import { Navigate } from 'react-router-dom';
import { getRole } from '../services/auth';

const PrivateRoute = ({ children, allowedRoles }) => {
    const role = getRole();

    if (!role) {
        return <Navigate to="/login" />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/" />; // Or unauthorized page
    }

    return children;
};

export default PrivateRoute;
