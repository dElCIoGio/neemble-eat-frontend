export type LimitType = "UP_TO" | "EXACTLY" | "AT_LEAST" | "ALL";

export type OptionLimitType = "UP_TO" | "UNLIMITED";

export type CustomizationOption = {
    name: string;
    priceModifier: number;
    maxQuantity: number;
};

export type CustomizationRule = {
    name: string;
    description?: string | null;
    isRequired: boolean;
    limitType: LimitType;
    limit: number;
    options: CustomizationOption[];
};

export type ItemCreate = {
    name: string;
    price: number;
    restaurantId: string;
    categoryId: string;
    description?: string;
    customizations: CustomizationRule[];
}

export type Item = {
    id: string;
    createdAt: string;
    updatedAt: string;

    imageUrl: string;

    isAvailable: boolean;
} & ItemCreate;
