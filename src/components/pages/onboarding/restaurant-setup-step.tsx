
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Check, ChevronLeft, Store } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {User} from "@/types/user.ts";


interface RestaurantSetupStepProps {
    userData: User
    updateUserData: (data: Partial<User>) => void
    onNext: () => void
    onBack: () => void
}

export function RestaurantSetupStep({ userData, onNext, onBack }: RestaurantSetupStepProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [restaurantName, setRestaurantName] = useState("")
    const [option, setOption] = useState<"create" | "skip">("skip")

    async function handleContinue() {
        setIsLoading(true)

        try {
            // In a real app, you would save the restaurant data to your backend here
            await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call


            // Move to next step
            onNext()
        } catch (error) {
            console.error("Error saving restaurant data:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <Button
                variant="ghost"
                size="sm"
                className="mb-2 flex items-center gap-1 px-0"
                onClick={onBack}
                disabled={isLoading}
            >
                <ChevronLeft className="h-4 w-4" />
                Voltar
            </Button>

            <div className="flex flex-col items-center space-y-2 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Store className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-bold">Configuração do Restaurante</h1>
                <p className="text-balance text-muted-foreground">Vamos configurar seu restaurante no Neemble Eat</p>
            </div>

            {userData ? (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle>Convite pendente</CardTitle>
                        <CardDescription>Você foi convidado para participar de um restaurante</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-3 rounded-md border p-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                                <Building2 className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium">{userData.firstName}</p>
                                <p className="text-sm text-muted-foreground">Convite pendente</p>
                            </div>
                            <Button size="sm" className="gap-1">
                                <Check className="h-4 w-4" /> Aceitar
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    <RadioGroup
                        value={option}
                        onValueChange={(value) => setOption(value as "create" | "skip")}
                        className="grid gap-4"
                    >
                        <div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="create" id="create" />
                                <Label htmlFor="create" className="font-medium">
                                    Criar um novo restaurante
                                </Label>
                            </div>
                            {option === "create" && (
                                <div className="mt-3 pl-6">
                                    <Label htmlFor="restaurant-name">Nome do restaurante</Label>
                                    <Input
                                        id="restaurant-name"
                                        placeholder="Digite o nome do seu restaurante"
                                        className="mt-1"
                                        value={restaurantName}
                                        onChange={(e) => setRestaurantName(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="skip" id="skip" />
                            <Label htmlFor="skip" className="font-medium">
                                Pular por enquanto
                            </Label>
                        </div>
                    </RadioGroup>
                </div>
            )}

            <Button
                onClick={handleContinue}
                className="w-full"
                disabled={isLoading || (option === "create" && !restaurantName)}
            >
                {isLoading ? "Processando..." : "Continuar"}
            </Button>
        </div>
    )
}
