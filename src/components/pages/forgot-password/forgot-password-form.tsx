
import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { CheckCircle } from "lucide-react"
import { ForgotPasswordFormValues, forgotPasswordSchema } from "@/lib/schemas/auth"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "@/firebase/config"
import { toast } from "sonner"
import {Link} from "react-router";

interface ForgotPasswordFormProps extends React.ComponentPropsWithoutRef<"div"> {
    className?: string
}

export function ForgotPasswordForm({ className, ...props }: ForgotPasswordFormProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
    const [submittedEmail, setSubmittedEmail] = useState<string>("")

    const form = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    })

    async function onSubmit(data: ForgotPasswordFormValues) {
        setIsLoading(true)
        try {
            await sendPasswordResetEmail(auth, data.email)
            setIsSubmitted(true)
            setSubmittedEmail(data.email)
            toast.success("Email de recuperação enviado")
        } catch {
            toast.error("Não foi possível enviar o email de recuperação")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Recupere sua senha</h1>
                <p className="text-balance text-sm text-muted-foreground">
                    Digite seu email e enviaremos um link para recuperar sua senha
                </p>
            </div>

            {isSubmitted ? (
                <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-muted/50 p-6 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                        <CheckCircle className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-lg font-medium">Verifique seu email</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Enviamos um link de recuperação de senha para <span className="font-medium">{submittedEmail}</span>
                        </p>
                    </div>
                    <Button variant="link" asChild className="p-0 mt-2 w-full">
                        <Link to="/auth/login">Voltar para o login</Link>
                    </Button>
                </div>
            ) : (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="m@exemplo.com"
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
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Enviando link..." : "Enviar link de recuperação"}
                        </Button>
                    </form>
                </Form>
            )}

            {!isSubmitted && (
                <div className="text-center text-sm">
                    Lembrou sua senha?{" "}
                    <Link to="/auth/login" className="underline underline-offset-4">
                        Voltar para o login
                    </Link>
                </div>
            )}
        </div>
    )
}
