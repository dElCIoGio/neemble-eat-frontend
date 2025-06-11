import {Menu} from "@/types/menu";
import {Category} from "@/types/category";
import {CustomizationOption, CustomizationRule} from "@/types/item";

export interface ValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
}

export const validateMenu = (menu: Partial<Menu>): ValidationResult => {
    const errors: Record<string, string> = {};

    if (!menu.name?.trim()) {
        errors.name = 'RestaurantMenu name is required';
    }

    if (menu.name && menu.name.length > 100) {
        errors.name = 'RestaurantMenu name must be less than 100 characters';
    }

    if (menu.description && menu.description.length > 500) {
        errors.description = 'Description must be less than 500 characters';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export const validateCategory = (category: Partial<Category>): ValidationResult => {
    const errors: Record<string, string> = {};

    if (!category.name?.trim()) {
        errors.name = 'Category name is required';
    }

    if (category.name && category.name.length > 50) {
        errors.name = 'Category name must be less than 50 characters';
    }

    if (category.description && category.description.length > 200) {
        errors.description = 'Description must be less than 200 characters';
    }

    if (category.tags && category.tags.length > 10) {
        errors.tags = 'Maximum 10 tags allowed';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};


export const validateCustomizations = (customizations: CustomizationRule[]): ValidationResult => {
    const errors: Record<string, string> = {};

    customizations.forEach((customization, index) => {
        if (!customization.name?.trim()) {
            errors[`customization-${index}-name`] = 'Customization name is required';
        }

        if (customization.name && customization.name.length > 50) {
            errors[`customization-${index}-name`] = 'Customization name must be less than 50 characters';
        }

        if (customization.description && customization.description.length > 200) {
            errors[`customization-${index}-description`] = 'Description must be less than 200 characters';
        }

        if (typeof customization.limit !== 'number' || customization.limit <= 0) {
            errors[`customization-${index}-limit`] = 'Limit must be greater than 0';
        }

        if (customization.options) {
            const optionErrors = validateOptions(customization.options, index);
            if (!optionErrors.isValid) {
                Object.assign(errors, optionErrors.errors);
            }
        }
    });

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export const validateOptions = (options: CustomizationOption[], customizationIndex: number): ValidationResult => {
    const errors: Record<string, string> = {};

    options.forEach((option, index) => {
        if (!option.name?.trim()) {
            errors[`option-${customizationIndex}-${index}-name`] = 'Option name is required';
        }

        if (option.name && option.name.length > 50) {
            errors[`option-${customizationIndex}-${index}-name`] = 'Option name must be less than 50 characters';
        }

        if (typeof option.priceModifier !== 'number' || option.priceModifier < 0) {
            errors[`option-${customizationIndex}-${index}-priceModifier`] = 'Price modifier must be 0 or greater';
        }

        if (typeof option.maxQuantity !== 'number' || option.maxQuantity <= 0) {
            errors[`option-${customizationIndex}-${index}-maxQuantity`] = 'Max quantity must be greater than 0';
        }
    });

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}; 