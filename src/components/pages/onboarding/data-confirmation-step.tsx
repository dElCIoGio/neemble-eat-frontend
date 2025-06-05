
import { Button } from "@/components/ui/button"
import { ChevronLeft, ClipboardCheck } from "lucide-react"
import { useState } from "react"
import {User} from "@/types/user";
import {useOnboardingContext} from "@/context/onboarding-context";

interface DataConfirmationStepProps {
    userData: User
    onBack: () => void
}

export function DataConfirmationStep({ userData, onBack }: DataConfirmationStepProps) {
    const [isLoading, setIsLoading] = useState(false)

    const {handleSubmit} = useOnboardingContext()

    async function handleComplete() {
        setIsLoading(true)
        handleSubmit()
        setIsLoading(false)
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
                    <ClipboardCheck className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-bold">Confirme seus dados</h1>
                <p className="text-balance text-muted-foreground">Verifique se todas as informações estão corretas</p>
            </div>

            <div className="space-y-6 rounded-lg border p-4">
                <div className="space-y-4">
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Informações pessoais</h3>
                        <div className="mt-1 grid grid-cols-2 gap-2">
                            <div>
                                <p className="text-sm font-medium">Nome</p>
                                <p className="text-sm">
                                    {userData.firstName} {userData.lastName}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium">Email</p>
                                <p className="text-sm">{userData.email}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium">Telefone</p>
                                <p className="text-sm">{userData.phoneNumber}</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Informações do restaurante</h3>
                        {/*<div className="mt-1">*/}
                        {/*    {invites ? (*/}
                        {/*        <div>*/}
                        {/*            <p className="text-sm font-medium">Convite pendente</p>*/}
                        {/*            <p className="text-sm">{userData.invitedByRestaurant.name}</p>*/}
                        {/*        </div>*/}
                        {/*    ) : userData.createRestaurant && userData.restaurantName ? (*/}
                        {/*        <div>*/}
                        {/*            <p className="text-sm font-medium">Novo restaurante</p>*/}
                        {/*            <p className="text-sm">{userData.restaurantName}</p>*/}
                        {/*        </div>*/}
                        {/*    ) : (*/}
                        {/*        <p className="text-sm">Nenhum restaurante configurado</p>*/}
                        {/*    )}*/}
                        {/*</div>*/}
                    </div>

                </div>
            </div>

            <div className="space-y-4">
                <Button onClick={handleComplete} className="w-full" disabled={isLoading}>
                    {isLoading ? "Finalizando..." : "Finalizar cadastro"}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                    Ao finalizar, você concorda com nossos{" "}
                    <a href="#" className="underline underline-offset-2">
                        Termos de Serviço
                    </a>{" "}
                    e{" "}
                    <a href="#" className="underline underline-offset-2">
                        Política de Privacidade
                    </a>
                    .
                </p>
            </div>
        </div>
    )
}
