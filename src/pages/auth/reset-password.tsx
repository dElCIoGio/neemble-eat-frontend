
import { useState } from "react"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { resetPasswordSchema } from "@/lib/schemas/auth"
import {Link, useNavigate, useSearchParams} from "react-router-dom";

type FormData = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordPage() {
    const navigate = useNavigate()
    const [searchParams, ] = useSearchParams();
    const token = searchParams.get("token")

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const form = useForm<FormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    })

    // Validate token exists
    if (!token) {
        return (
            <Card className="w-full shadow-lg border-green-100">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Link Inválido</CardTitle>
                    <CardDescription className="text-center">
                        O link de redefinição de senha é inválido ou expirou.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center">
                        <p className="mb-4">Por favor, solicite um novo link de redefinição de senha.</p>
                        <Button asChild className="bg-orange-500 hover:bg-orange-600">
                            <Link to="/auth/forgot-password">Solicitar novo link</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const handleSubmit = async (data: FormData) => {
        setError("")
        setIsLoading(true)

        console.log(data)

        // Simulate API call
        try {
            // In a real app, you would call your API here with the token and new password
            await new Promise((resolve) => setTimeout(resolve, 1500))
            navigate("/auth/login?reset=true")
        } catch {
            setError("Ocorreu um erro. Por favor, tente novamente.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full shadow-lg border-green-100">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Criar nova senha</CardTitle>
                <CardDescription className="text-center">Digite sua nova senha abaixo</CardDescription>
            </CardHeader>
            <CardContent>
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nova Senha</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                {...field}
                                                className="pr-10"
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormDescription>A senha deve ter pelo menos 8 caracteres</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirmar Nova Senha</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                {...field}
                                                className="pr-10"
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Atualizando senha...
                                </>
                            ) : (
                                "Redefinir senha"
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
