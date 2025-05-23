export type MenuPreferences = {
    id: string;
    createdAt: string;
    updatedAt: string;
    highlightFeaturedItems: boolean;
    showPrices: boolean;
    showItemImages: boolean;
};

export type Menu = {
    id: string;
    createdAt: string;
    updatedAt: string;
    restaurantId: string;
    name: string;
    description: string;
    categoryIds: string[];
    isActive: boolean;
    position: number;
    preferences: MenuPreferences;
};
