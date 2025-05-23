export type Category = {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    restaurantId: string;
    itemIds: string[];
    description?: string | null;
    imageUrl?: string | null;
    position: number;
    isActive: boolean;
    tags?: string[] | null;
    slug?: string | null;
};
