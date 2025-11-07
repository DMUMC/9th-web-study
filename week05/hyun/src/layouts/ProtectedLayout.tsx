import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedLayout = () => {
    const { accessToken } = useAuth();
    if (!accessToken) {
        // window.location.href = '/login';
        return <Navigate to={'/login'} replace />;
    }
    return <Outlet />;
};


export default ProtectedLayout;
