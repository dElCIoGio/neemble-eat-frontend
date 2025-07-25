import config from "@/config";
import axios from "axios";
import { auth } from '@/firebase/config';


export const apiClient = axios.create({
    baseURL: `${config.api.apiUrl}/api/v1`,
    timeout: config.api.timeout,
    headers: {
        "Accept": "application/json"
    },
    withCredentials: true,
});

apiClient.interceptors.request.use(async cfg => {
    const token = await auth.currentUser?.getIdToken()
    if (token && cfg.headers) {
        cfg.headers.Authorization = `Bearer ${token}`
    }
    return cfg
})

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            await auth.signOut();
            window.location.href = "/auth/login";
        }
        return Promise.reject(error);
    }
);