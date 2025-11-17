import React from "react";
import {Navigate}   from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.js"
import Loadingspinner from "./Loadingspinner.jsx";

const ProtectedRoute = ({children, requiredRole}) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loadingspinner size="lg"/>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" />
    } 
    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/dashboard" />
    } 

    return children

};

export default ProtectedRoute;