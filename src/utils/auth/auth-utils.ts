import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
    sub: string;
    exp: number;
    permissions: string[];
    restaurantId?: string;
}

export const getAuthToken = (): string | null => {
    return localStorage.getItem('auth_token');
};

export const setAuthToken = (token: string): void => {
    localStorage.setItem('auth_token', token);
};

export const removeAuthToken = (): void => {
    localStorage.removeItem('auth_token');
};

export const isTokenValid = (token: string): boolean => {
    try {
        const decoded = jwtDecode<TokenPayload>(token);
        return decoded.exp * 1000 > Date.now();
    } catch {
        return false;
    }
};

export const getTokenPayload = (): TokenPayload | null => {
    const token = getAuthToken();
    if (!token) return null;

    try {
        return jwtDecode<TokenPayload>(token);
    } catch {
        return null;
    }
};

export const isAuthenticated = (): boolean => {
    const token = getAuthToken();
    if (!token) return false;
    return isTokenValid(token);
};

export const hasPermission = (permission: string): boolean => {
    const payload = getTokenPayload();
    if (!payload) return false;
    return payload.permissions.includes(permission);
};

export const hasAnyPermission = (permissions: string[]): boolean => {
    const payload = getTokenPayload();
    if (!payload) return false;
    return permissions.some(permission => payload.permissions.includes(permission));
};

export const hasAllPermissions = (permissions: string[]): boolean => {
    const payload = getTokenPayload();
    if (!payload) return false;
    return permissions.every(permission => payload.permissions.includes(permission));
};

export const getRestaurantId = (): string | null => {
    const payload = getTokenPayload();
    return payload?.restaurantId || null;
};

export const handleUnauthorized = (): void => {
    removeAuthToken();
    window.location.href = '/login';
};

export const checkAuth = (): boolean => {
    if (!isAuthenticated()) {
        handleUnauthorized();
        return false;
    }
    return true;
};

export const requirePermission = (permission: string): boolean => {
    if (!checkAuth()) return false;
    if (!hasPermission(permission)) {
        handleUnauthorized();
        return false;
    }
    return true;
};

export const requireAnyPermission = (permissions: string[]): boolean => {
    if (!checkAuth()) return false;
    if (!hasAnyPermission(permissions)) {
        handleUnauthorized();
        return false;
    }
    return true;
};

export const requireAllPermissions = (permissions: string[]): boolean => {
    if (!checkAuth()) return false;
    if (!hasAllPermissions(permissions)) {
        handleUnauthorized();
        return false;
    }
    return true;
}; 