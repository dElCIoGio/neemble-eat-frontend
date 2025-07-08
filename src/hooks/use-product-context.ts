import {createContext, useContext} from "react";
import {z} from "zod";
import {CustomizationRule, Item} from "@/types/item";
import {AdditionalNoteSchema} from "@/lib/schemas/additional-note";


type ProductContextProps = {
    item: Item;
    onClickItemQuantity: (operation: string) => void;
    onSubmit: (data: z.infer<typeof AdditionalNoteSchema>) => void;
    total: number;
    quantity: number;
    productAdded: boolean
    handleCustomizationChange: (
        ruleName: string,
        optionName: string,
        priceModifier: number,
        isSelected: boolean,
        optionQuantity?: number
    ) => void;
    getOptionQuantity: (ruleName: string, optionName: string) => number;
    canSelectMore: (rule: CustomizationRule) => boolean;
    isOptionSelected: (ruleName: string, optionName: string) => boolean;
    allRequiredRulesSatisfied: () => boolean;
    isRequiredRuleSatisfied: (rule: CustomizationRule) => boolean;
    getMissingRequiredRules: () => string[];
}

export const ProductContext = createContext<ProductContextProps | undefined>(undefined)

export function useProductContext() {
    const context = useContext(ProductContext)

    if (!context)
        throw new Error("useProductContext must be used within the ProductContext");

    return context
}