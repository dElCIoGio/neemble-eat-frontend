import {apiClient} from "@/api/axios";
import {
    NotificationCreate,
    NotificationFilterType,
    Notification
} from "@/types/notification";


const baseRoute = "/notifications"

export const notificationsApi = {

    createNotification: async (data: NotificationCreate) => {
        const response = await apiClient.post<Notification>(`${baseRoute}/`, data)
        return response.data
    },

    listNotifications: async (
        notificationType: NotificationFilterType,
        isRead: boolean,
        search: string,
        page: number
    ) => {
        const response = await apiClient.get<Notification[]>(`${baseRoute}/`, {
            params: { notificationType, search, page, isRead }
        });
        return response.data
    },

    getUnreadCount: async () => {
        const response = await apiClient.get<number>(`${baseRoute}/unread-count`)
        return response.data
    },

    getNotification: async (notificationId: string) => {
        const response = await apiClient.get<Notification>(`${baseRoute}/${notificationId}`);
        return response.data
    },

    markNotificationRead: async (notificationId: string) => {
        const response = await apiClient.post<Notification>(`${baseRoute}/${notificationId}/read`)
        return response.data
    },

    markNotificationUnread: async (notificationId: string) => {
        const response = await apiClient.post<Notification>(`${baseRoute}/${notificationId}/unread`)
        return response.data
    },

    markAllRead: async () => {
        const response = await apiClient.post<number>(`${baseRoute}/read-all`);
        return response.data
    },

    deleteNotification: async (notificationId: string) => {
        const response = await apiClient.delete<boolean>(`${baseRoute}/${notificationId}`);
        return response.data
    }



}