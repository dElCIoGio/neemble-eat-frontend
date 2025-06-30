

export type NotificationType = 'system' | 'data' | 'finances' | 'notice'

export type NotificationCreate = {
    userId: string;
    restaurantId: string;
    notificationType: NotificationType;
    title: string;
    message: string;
    category: string;
    priority: 'high' | 'medium' | 'low';
}

export type Notification = {
    _id: string;
    createdAt: Date
    updatedAt: Date

    isRead: boolean;
    readOn?: Date

} & NotificationCreate;

export interface NotificationSettings {
    types: {
        system: boolean;
        data: boolean;
        finance: boolean;
        notice: boolean;
    };
    channels: {
        app: boolean;
        email: boolean;
        sms: boolean;
    };
    frequency: 'immediate' | 'daily' | 'weekly';
    quietHours: {
        enabled: boolean;
        start: string;
        end: string;
    };
    priorities: {
        high: boolean;
        medium: boolean;
        low: boolean;
    };
}

export type NotificationFilterType = "todas" | NotificationType