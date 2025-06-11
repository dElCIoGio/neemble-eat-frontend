import {z} from "zod";

export const AdditionalNoteSchema = z.object({
    note: z.string()
})