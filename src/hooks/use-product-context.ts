import {createContext, useContext} from "react";
import {z} from "zod";
import {Item} from "@/types/item";
import {AdditionalNoteSchema} from "@/lib/schemas/additional-note";


type ProductContextProps = {
    item: Item;
    onClickItemQuantity: (operation: string) => void;
    onSubmit: (data: z.infer<typeof AdditionalNoteSchema>) => void;
    total: number;
    quantity: number;
    productAdded: boolean
}

export const ProductContext = createContext<ProductContextProps | undefined>(undefined)

export function useProductContext() {
    const context = useContext(ProductContext)

    if (!context)
        throw new Error("useProductContext must be used within the ProductContext");

    return context
}