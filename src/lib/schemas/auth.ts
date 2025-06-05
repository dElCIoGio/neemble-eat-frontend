import * as z from "zod"

export const signupSchema = z
    .object({
        email: z.string().email({ message: "Por favor, digite um email válido" }),
        password: z
            .string()
            .min(8, {
                message: "A senha deve ter pelo menos 8 caracteres",
            })
            .regex(/[A-Z]/, {
                message: "A senha deve conter pelo menos uma letra maiúscula",
            })
            .regex(/[a-z]/, {
                message: "A senha deve conter pelo menos uma letra minúscula",
            })
            .regex(/[0-9]/, {
                message: "A senha deve conter pelo menos um número",
            }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "As senhas não coincidem",
        path: ["confirmPassword"],
    })

export const forgotPasswordSchema = z.object({
    email: z.string().email({ message: "Por favor, digite um email válido" }),
})

export const loginSchema = z.object({
    email: z.string().email({ message: "Por favor, digite um email válido" }),
    password: z.string().min(8, {
        message: "A senha deve ter pelo menos 8 caracteres",
    }),
})

export const resetPasswordSchema = z
    .object({
        password: z
            .string()
            .min(8, { message: "Senha deve ter pelo menos 8 caracteres" })
            .max(100, { message: "Senha não pode ter mais de 100 caracteres" }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "As senhas não coincidem",
        path: ["confirmPassword"],
    })

export const profilePersonalSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Nome deve ter pelo menos 2 caracteres" })
        .max(50, { message: "Nome não pode ter mais de 50 caracteres" }),
    email: z.string().email({ message: "E-mail inválido" }).min(1, { message: "E-mail é obrigatório" }),
    phone: z.string().min(1, { message: "Telefone é obrigatório" }),
    bio: z.string().optional(),
})

export const profileAddressSchema = z.object({
    street: z.string().min(1, { message: "Endereço é obrigatório" }),
    city: z.string().min(1, { message: "Cidade é obrigatória" }),
    state: z.string().min(1, { message: "Estado é obrigatório" }),
    zipCode: z.string().min(1, { message: "CEP é obrigatório" }),
    country: z.string().min(1, { message: "País é obrigatório" }),
})

export const profilePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, { message: "Senha atual é obrigatória" }),
        newPassword: z
            .string()
            .min(8, { message: "Senha deve ter pelo menos 8 caracteres" })
            .max(100, { message: "Senha não pode ter mais de 100 caracteres" }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "As senhas não coincidem",
        path: ["confirmPassword"],
    })

export type LoginFormValues = z.infer<typeof loginSchema>
export type SignupFormValues = z.infer<typeof signupSchema>
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>