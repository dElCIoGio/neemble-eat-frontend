import React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { loginSchema, type LoginFormValues } from "@/lib/schemas/auth"
import {signInWithEmailAndPassword} from "firebase/auth";
import { auth } from "@/firebase/config";
import {authApi} from "@/api/endpoints/auth/endpoints";
import {userApi} from "@/api/endpoints/user/endpoints";
import {toast} from "sonner";
import {useNavigate} from "react-router";
import {Eye, EyeClosed} from "@phosphor-icons/react";



interface LoginFormProps extends React.ComponentPropsWithoutRef<"div"> {
    className?: string
}

export function LoginForm({ className, ...props }: LoginFormProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    function togglePasswordVisibility() {
        setIsPasswordVisible(!isPasswordVisible)
    }

    const navigate = useNavigate()

    async function onSubmit(data: LoginFormValues): Promise<void> {
        setIsLoading(true)

        try {
            const credential = await signInWithEmailAndPassword(auth, data.email, data.password)
            const token = await credential.user.getIdToken()
            
            await authApi.login({ idToken: token })
            toast.success("Login realizado com sucesso")

            const exists = await userApi.userExists()
            if (!exists) {
                toast.error("Deve completar o onboarding para poder continuar")
                navigate("/onboarding")
            } else {
                navigate("/dashboard")
            }
        } catch (e: unknown) {
            const error = e as Error
            if (error.message === "Firebase: Error (auth/invalid-credential).")
                toast.error("Palavra passe ou email errados. Tente novamente.")
            else if (error.message === "Firebase: Error (auth/user-not-found).")
                toast.error("Usuário não encontrado. Tente novamente.")
            else
                toast.error("Erro ao fazer login. Verifique suas credenciais.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Entre na sua conta</h1>
                <p className="text-balance text-sm text-muted-foreground">Digite seu email abaixo para entrar na sua conta</p>
            </div>
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
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center justify-between">
                                    <FormLabel>Senha</FormLabel>
                                    <a href="/forgot-password" className="text-sm underline-offset-4 hover:underline">
                                        Esqueceu sua senha?
                                    </a>
                                </div>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            placeholder="******"
                                            type={isPasswordVisible ? "text" : "password"}
                                            autoComplete="new-password"
                                            disabled={isLoading}
                                            {...field}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={togglePasswordVisibility}
                                            className="absolute right-2 top-1/2 text-zinc-400 hover:bg-transparent -translate-y-1/2"
                                            tabIndex={-1}
                                        >
                                            {isPasswordVisible ? <Eye/> : <EyeClosed/>}
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Entrando..." : "Entrar"}
                    </Button>
                    <div
                        className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                        <span className="relative z-10 bg-background px-2 text-muted-foreground">Ou continue com</span>
                    </div>
                    <Button variant="outline" className="w-full" type="button">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                            <path d="M1 1h22v22H1z" fill="none" />
                        </svg>
                        Entrar com Google
                    </Button>
                </form>
            </Form>
            <div className="text-center text-sm">
                Não tem uma conta?{" "}
                <a href="/auth/register" className="underline underline-offset-4">
                    Cadastre-se
                </a>
            </div>
        </div>
    )
}
