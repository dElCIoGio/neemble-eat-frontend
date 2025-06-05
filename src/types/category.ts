


export type CategoryCreate = {
    name: string;
    restaurantId: string;
    description: string;
    menuId: string;
}

export type Category = {
    _id: string;
    createdAt: string;
    updatedAt: string;

    itemIds: string[];
    position: number;
    isActive: boolean;
    tags?: string[] | null;
    slug?: string | null;
} & CategoryCreate;

type OptionalCategoryFields = Partial<Omit<Category, '_id' | 'createdAt' | 'updatedAt'>>;

export type PartialCategory = OptionalCategoryFields & {
    _id: string;
    createdAt: string;
    updatedAt: string;
};