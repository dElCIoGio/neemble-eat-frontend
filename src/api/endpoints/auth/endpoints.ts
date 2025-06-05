import {api} from "@/api";
import {LoginPayload, RegisterPayload} from "@/api/endpoints/auth/types";
import {User} from "@/types/user";
import {apiClient} from "@/api/axios";

const baseRoute = "/auth"

export const authApi = {
    /**
     * Send Firebase ID token, set session cookies, and get/create user
     * @param payload.idToken - the Firebase ID token
     * @returns the authenticated User
     */
    login: async (payload: LoginPayload) =>
        await apiClient.post<boolean>(`${baseRoute}/login`, {...payload}),

    /**
     * Register a new user with Firebase ID token and profile info
     * @param payload - idToken + first/last name, phone (email optional)
     * @returns the created User
     */
    register: async (payload: RegisterPayload) => {
        const response = await apiClient.post<User>(`${baseRoute}/register`, {...payload})
        return response.data
    },

    /**
     * Fetch the currently authenticated user's profile from cookies
     * @returns the User
     */
    me: async () => {
        const response = await apiClient.get<User>(`${baseRoute}/me`)
        return response.data
    },

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
        await apiClient.post<boolean>(`${baseRoute}/logout`),
}
