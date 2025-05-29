


export type CategoryCreate = {
    name: string;
    restaurantId: string;
    description: string;
    menuId: string;
    imageFile?: File
}

export type Category = {
    id: string;
    createdAt: string;
    updatedAt: string;

    itemIds: string[];
    imageUrl?: string | null;
    position: number;
    isActive: boolean;
    tags?: string[] | null;
    slug?: string | null;
} & CategoryCreate;
