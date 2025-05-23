"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UserPlus } from "lucide-react"
import {User} from "@/types/user.ts";

const userInfoSchema = z.object({
    firstName: z.string().min(2, {
        message: "O nome deve ter pelo menos 2 caracteres",
    }),
    lastName: z.string().min(2, {
        message: "O sobrenome deve ter pelo menos 2 caracteres",
    }),
    email: z.string().email({
        message: "Por favor, digite um email válido",
    }),
    phone: z.string().min(10, {
        message: "Por favor, digite um número de telefone válido",
    }),
})

interface UserInfoStepProps {
    userData: User
    updateUserData: (data: Partial<User>) => void
    onNext: () => void
}

export function UserInfoStep({ userData, updateUserData, onNext }: UserInfoStepProps) {
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof userInfoSchema>>({
        resolver: zodResolver(userInfoSchema),
        defaultValues: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            phone: userData.phoneNumber,
        },
    })

    async function onSubmit(values: z.infer<typeof userInfoSchema>) {
        setIsLoading(true)

        try {
            // In a real app, you would save the user data to your backend here
            await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

            // Update user data in parent component
            updateUserData(values)

            // Move to next step
            onNext()
        } catch (error) {
            console.error("Error saving user data:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col items-center space-y-2 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <UserPlus className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-bold">Vamos começar</h1>
                <p className="text-balance text-muted-foreground">
                    Precisamos de algumas informações para criar sua conta no Neemble Eat
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome</FormLabel>
                                    <FormControl>
                                        <Input placeholder="João" disabled={isLoading} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sobrenome</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Silva" disabled={isLoading} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="seu@email.com"
                                        type="email"
                                        autoComplete="email"
                                        disabled={isLoading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Telefone</FormLabel>
                                <FormControl>
                                    <Input placeholder="(11) 98765-4321" type="tel" autoComplete="tel" disabled={isLoading} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Salvando..." : "Continuar"}
                    </Button>
                </form>
            </Form>
        </div>
    )
}
