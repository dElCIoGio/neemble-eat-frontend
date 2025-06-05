import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {Link} from "react-router";

export default function WelcomePage() {
    return (
        <div className="flex font-poppins items-center justify-center p-4">
            <div className="w-full">
                <div className="text-center mb-12">
                    <h1 className="text-2xl md:text-4xl font-semibold text-gray-900 mb-6 tracking-tight">Bem-vindo</h1>
                    <p className="text-xl text-gray-600 mb-3 font-light">Pronto(a) para começar sua jornada pelo Neemble Eat?</p>
                    <p className="text-base text-gray-500 font-light">
                        Crie seu restaurante e compartilhe seus pratos incríveis com o mundo.
                    </p>
                </div>

                <Card className="border border-gray-200 bg-white shadow-sm">
                    <CardHeader className="text-center pb-6">
                        <CardTitle className="text-2xl font-light text-gray-900">Comece Agora</CardTitle>
                        <CardDescription className="text-gray-500 font-light">
                            É rápido, fácil e totalmente gratuito para começar
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center space-y-8 pt-2">
                        <div className="w-16 h-16 border-2 border-gray-300 rounded-full flex items-center justify-center">
                            <Plus className="w-8 h-8 text-gray-600" />
                        </div>

                        <Button
                            asChild
                            size="lg"
                            className="w-full max-w-sm h-12 text-base font-normal bg-gray-900 hover:bg-gray-800 text-white border-0 transition-colors duration-200"
                        >
                            <Link to="/dashboard/create-restaurant">
                                Criar Meu Restaurante
                            </Link>

                        </Button>

                        <p className="text-sm text-gray-400 text-center max-w-md font-light leading-relaxed">
                            Junte-se a milhares de restaurantes que já estão usando nossa plataforma para crescer seus negócios.
                        </p>
                    </CardContent>
                </Card>

                <div className="mt-12 text-center">
                    <p className="text-gray-400 text-sm font-light">Tem dúvidas? Entre em contato conosco a qualquer momento.</p>
                </div>
            </div>
        </div>
    )
}
