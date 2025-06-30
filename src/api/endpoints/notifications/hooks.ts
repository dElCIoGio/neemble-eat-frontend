import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {notificationsApi} from "./requests";
import type {Notification, NotificationFilterType} from "@/types/notification";

export function useListNotifications(params: {
    notificationType?: NotificationFilterType;
    isRead?: boolean;
    search?: string;
    page?: number;
}) {
    const {notificationType = "todas", isRead = false, search = "", page = 1} = params;
    const queryKey = ["notifications", notificationType, isRead, search, page];
    return useQuery<Notification[]>({
        queryKey,
        queryFn: () =>
            notificationsApi.listNotifications(notificationType, isRead, search, page),
    });
}

export function useUnreadCount() {
    return useQuery<number>({
        queryKey: ["notifications", "unread-count"],
        queryFn: notificationsApi.getUnreadCount,
    });
}

export function useMarkAllRead() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: notificationsApi.markAllRead,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["notifications"]});
            queryClient.invalidateQueries({queryKey: ["notifications", "unread-count"]});
        },
    });
}

export function useMarkNotificationRead() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: notificationsApi.markNotificationRead,
        onSuccess: (notification) => {
            queryClient.setQueryData<Notification[]>(["notifications"], (old = []) =>
                old.map((n) => (n._id === notification._id ? notification : n))
            );
            queryClient.invalidateQueries({queryKey: ["notifications", "unread-count"]});
        },
    });
}

export function useMarkNotificationUnread() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: notificationsApi.markNotificationUnread,
        onSuccess: (notification) => {
            queryClient.setQueryData<Notification[]>(["notifications"], (old = []) =>
                old.map((n) => (n._id === notification._id ? notification : n))
            );
            queryClient.invalidateQueries({queryKey: ["notifications", "unread-count"]});
        },
    });
}

export function useDeleteNotification() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: notificationsApi.deleteNotification,
        onSuccess: (_, id) => {
            queryClient.setQueryData<Notification[]>(["notifications"], (old = []) =>
                old.filter((n) => n._id !== id)
            );
            queryClient.invalidateQueries({queryKey: ["notifications", "unread-count"]});
        },
    });
}
