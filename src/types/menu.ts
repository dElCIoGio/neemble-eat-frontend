
export type MenuPreferences = {
    highlightFeaturedItems: boolean;
    showPrices: boolean;
    showItemImages: boolean;
};


export type MenuCreate = {
    name: string;
    restaurantId: string;
    description: string;
    isActive: boolean;
    preferences: MenuPreferences;

}

export type Menu = {
    _id: string;
    createdAt: string;
    updatedAt: string;
    slug: string;
    categoryIds: string[];
    position: number;
} & MenuCreate;


type OptionalMenuFields = Partial<Omit<Menu, '_id' | 'createdAt' | 'updatedAt'>>;

export type PartialMenu = OptionalMenuFields;