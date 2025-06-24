
export type OpeningHours = {


    monday?: string; // eg (always 24h format): 09:00-22:00
    tuesday?: string; // eg (always 24h format): 09:00-22:00
    wednesday?: string; // eg (always 24h format): 09:00-22:00
    thursday?: string; // eg (always 24h format): 09:00-22:00
    friday?: string; // eg (always 24h format): 09:00-22:00
    saturday?: string; // eg (always 24h format): 09:00-22:00
    sunday?: string; // eg (always 24h format): 09:00-22:00
};

export type RestaurantSettings = {
    openingHours?: OpeningHours | null;
};


export type RestaurantCreate = {
    name: string;
    address: string;
    description: string;
    phoneNumber: string;
    bannerFile: File
    logoFile?: File
    settings: RestaurantSettings;
}

export type Restaurant = {
    _id: string;
    createdAt: string;
    updatedAt: string;
    bannerUrl: string;
    logoUrl: string | null;

    isActive: boolean;
    currentMenuId: string;
    menuIds: string[];
    tableIds: string[];
    sessionIds: string[];
    orderIds: string[];
    slug: string | null;
} & Omit<RestaurantCreate, "bannerFile" | "logoFile">;
