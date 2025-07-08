
import type React from "react"
import {
    Eye,
    EyeClosed
} from "@phosphor-icons/react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {SignupFormValues, signupSchema} from "@/lib/schemas/auth";
import {useNavigate} from "react-router-dom";
import {createUserWithEmailAndPassword} from "firebase/auth";
import {auth} from "@/firebase/config";
import {useGoogleAuth} from "@/hooks/use-google-auth";

interface SignupFormProps extends React.ComponentPropsWithoutRef<"div"> {
    className?: string
}

export function SignupForm({ className, ...props }: SignupFormProps) {


    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const navigate = useNavigate()
    const form = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    const { signInWithGoogle } = useGoogleAuth()

    async function onSubmitWithGoogle() {
        setIsLoading(true)
        try {
            await signInWithGoogle()
            navigate("/onboarding")
        } finally {
            setIsLoading(false)
        }
    }
    
    function togglePasswordVisibility() {
        setIsPasswordVisible(!isPasswordVisible)
    }
    
    function toggleConfirmPasswordVisibility() {
        setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
    }

    function onSubmit(data: SignupFormValues) {
        setIsLoading(true)
        const { email, password } = data
        createUserWithEmailAndPassword(
            auth,
            email,
            password
        ).then(() => {
            navigate("/onboarding")
            setIsLoading(false)
        }).catch(() => {
            setIsLoading(false)
        })
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Crie uma conta</h1>
                <p className="text-balance text-sm text-muted-foreground">
                    Digite suas informações abaixo para criar sua conta
                </p>
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
                                <FormLabel>Senha</FormLabel>
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
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Confirme a Senha</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            placeholder="******"
                                            type={isConfirmPasswordVisible ? "text" : "password"}
                                            autoComplete="new-password"
                                            disabled={isLoading}
                                            {...field}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={toggleConfirmPasswordVisibility}
                                            className="absolute right-2 top-1/2 text-zinc-400 hover:bg-transparent -translate-y-1/2"
                                            tabIndex={-1}
                                        >
                                            {isConfirmPasswordVisible ? <Eye/> : <EyeClosed/>}
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Criando conta..." : "Criar conta"}
                    </Button>
                    <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                        <span className="relative z-10 bg-background px-2 text-muted-foreground">Ou continue com</span>
                    </div>
                    <Button variant="outline" onClick={onSubmitWithGoogle} className="w-full" type="button">
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
                        Cadastre-se com Google
                    </Button>
                </form>
            </Form>
            <div className="text-center text-sm">
                Já tem uma conta?{" "}
                <a href="/auth/login" className="underline underline-offset-4">
                    Entrar
                </a>
            </div>
        </div>
    )
}
