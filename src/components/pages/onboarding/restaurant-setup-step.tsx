import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft, Store } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { User } from "@/types/user"
import { RestaurantCreate } from "@/types/restaurant"

interface RestaurantSetupStepProps {
    userData: User
    updateUserData: (data: Partial<User>) => void
    onNext: () => void
    onBack: () => void
}

export function RestaurantSetupStep({ onNext, onBack }: RestaurantSetupStepProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [option, setOption] = useState<"create" | "skip">("skip")
    const [restaurantData, setRestaurantData] = useState<RestaurantCreate>({
        name: "",
        address: "",
        description: "",
        phoneNumber: "",
        bannerFile: new File([], "")
    })

    const handleRestaurantDataChange = (field: keyof RestaurantCreate, value: string | File) => {
        setRestaurantData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleRestaurantDataChange("bannerFile", e.target.files[0])
        }
    }

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
                            <div className="mt-6 space-y-6">
                                <div>
                                    <Label htmlFor="restaurant-name">Nome do restaurante</Label>
                                    <Input
                                        id="restaurant-name"
                                        placeholder="Digite o nome do seu restaurante"
                                        className="mt-1"
                                        value={restaurantData.name}
                                        onChange={(e) => handleRestaurantDataChange("name", e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="restaurant-address">Endereço</Label>
                                    <Input
                                        id="restaurant-address"
                                        placeholder="Digite o endereço do restaurante"
                                        className="mt-1"
                                        value={restaurantData.address}
                                        onChange={(e) => handleRestaurantDataChange("address", e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="restaurant-phone">Telefone</Label>
                                    <Input
                                        id="restaurant-phone"
                                        placeholder="Digite o telefone do restaurante"
                                        className="mt-1"
                                        value={restaurantData.phoneNumber}
                                        onChange={(e) => handleRestaurantDataChange("phoneNumber", e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="restaurant-description">Descrição</Label>
                                    <Textarea
                                        id="restaurant-description"
                                        placeholder="Descreva seu restaurante"
                                        className="mt-1"
                                        value={restaurantData.description}
                                        onChange={(e) => handleRestaurantDataChange("description", e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="restaurant-banner">Banner do restaurante</Label>
                                    <Input
                                        id="restaurant-banner"
                                        type="file"
                                        accept="image/*"
                                        className="mt-1"
                                        onChange={handleBannerChange}
                                        disabled={isLoading}
                                    />
                                </div>
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

            <Button
                onClick={handleContinue}
                className="w-full"
                disabled={isLoading || (option === "create" && !restaurantData.name)}
            >
                {isLoading ? "Processando..." : "Continuar"}
            </Button>
        </div>
    )
}
