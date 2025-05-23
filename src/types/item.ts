export type LimitType = "UP_TO" | "EXACTLY" | "AT_LEAST" | "ALL";

export type OptionLimitType = "UP_TO" | "UNLIMITED";

export type CustomizationOption = {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    priceModifier: number;
    maxQuantity?: number | null;
};

export type CustomizationRule = {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    description?: string | null;
    isRequired: boolean;
    limitType: LimitType;
    limit: number;
    options: CustomizationOption[];
};

export type Item = {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    price: number;
    imageUrl: string;
    restaurantId: string;
    categoryId: string;
    description?: string | null;
    isAvailable: boolean;
    customizations: CustomizationRule[];
};
