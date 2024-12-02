import React from 'react';
import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

export function login(token, id, isManager,name) {
    sessionStorage.setItem('id', id);
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('isManager', isManager);
    sessionStorage.setItem('name', name);
}

export function logout() {
    sessionStorage.clear()
}

export const LoginRoute = ({ children }) => {
    const token = sessionStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" />;
    }

    return children;
};

export const GuestRoute = ({ children }) => {
    const token = sessionStorage.getItem('token');

    if (token) {
        return <Navigate to="/cashier" />;
    }

    return children;
};

export const ManagerRoute = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const isManager = sessionStorage.getItem('isManager');

        if (!(isManager === 'true')) {
            navigate("/cashier");
        }

    }, [navigate]);

    return children;
};
