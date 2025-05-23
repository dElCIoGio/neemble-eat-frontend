export type Table = {
    id: string;
    createdAt: string;
    updatedAt: string;
    number: number;
    restaurantId: string;
    currentSessionId?: string | null;
    url?: string | null;
    isActive: boolean;
};
