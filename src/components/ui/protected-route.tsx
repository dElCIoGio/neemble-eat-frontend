// src/features/auth/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader } from '@/components/ui/loader';
import {useAuth} from "@/context/auth-context"; // Optional: your own loading spinner

const ProtectedRoute = () => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <Loader />; // Or any fallback loading component
    }

    if (!user) {
        return <Navigate to="/auth/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
