import {api} from "@/api";
import {LoginPayload, RegisterPayload} from "@/api/endpoints/auth/types";
import {User} from "@/types/user";

const baseRoute = "/auth"

export const authApi = {
    /**
     * Send Firebase ID token, set session cookies, and get/create user
     * @param payload.idToken - the Firebase ID token
     * @returns the authenticated User
     */
    login: async (payload: LoginPayload) =>
        await api.post<User>(`${baseRoute}/login`, {...payload}),

    /**
     * Register a new user with Firebase ID token and profile info
     * @param payload - idToken + first/last name, phone (email optional)
     * @returns the created User
     */
    register: async (payload: RegisterPayload) =>
        await api.post<User>(`${baseRoute}/register`, {...payload}),

    /**
     * Fetch the currently authenticated user's profile from cookies
     * @returns the User
     */
    me: async () =>
        await api.get<User>(`${baseRoute}/me`),

    /**
     * Refresh session token (backend sets new cookies)
     * @returns success flag
     */
    refresh: async () =>
        await api.post<boolean>(`${baseRoute}/refresh`),

    /**
     * Log out current user, clear cookies
     * @returns success flag
     */
    logout: async () =>
        await api.post<boolean>(`${baseRoute}/logout`),
}
