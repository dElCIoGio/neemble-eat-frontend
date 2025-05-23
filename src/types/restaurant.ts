export type OpeningHours = {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
};

export type RestaurantSettings = {
    acceptsOnlineOrders: boolean;
    autoAcceptOrders: boolean;
    openingHours?: OpeningHours | null;
};

export type Restaurant = {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    address: string;
    description: string;
    phoneNumber: string;
    bannerUrl?: string | null;
    isActive: boolean;
    menuIds: string[];
    tableIds: string[];
    sessionIds: string[];
    orderIds: string[];
    settings?: RestaurantSettings | null;
};
