// src/features/auth/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from 'react-router';
import { Loader } from '@/components/ui/loader';
import {useAuth} from "@/context/auth-context"; // Optional: your own loading spinner

interface Props {
    authRequired?: boolean;
}

const ProtectedRoute = ({ authRequired = true }: Props) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <Loader />;
    }

    if (!user && authRequired == true) {
        return <Navigate to="/auth/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
