
import { ArrowLeft, Upload, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {Link} from "react-router";


export default function AddMenuPage() {

    return (
        <div className="">
            <div className="mx-auto">
                {/* Header */}
        <div className="flex items-center gap-4">
            <Link to="../">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar aos Cardápios
                </Button>
            </Link>
        </div>

                <div className="text-center mb-12">
                    <h1 className="text-xl font-bold text-gray-900 mb-4">Adicionar Novo Cardápio</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Escolha como você gostaria de criar o seu novo cardápio do restaurante. Importe de uma fonte existente ou crie um do zero.
                    </p>
                </div>

                {/* RestaurantMenu Creation Options */}
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Import RestaurantMenu Card */}
                    <Card className="hover:shadow-lg transition-shadow group opacity-50 pointer-events-none">
                        <CardHeader className="text-center pb-4">
                            <div className="relative">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                                    <Upload className="h-8 w-8 text-blue-600" />
                                </div>
                                <Badge className="absolute -top-2 -right-2 bg-gray-300 text-gray-600 cursor-not-allowed">
                                    Em breve
                                </Badge>
                            </div>
                            <CardTitle className="text-xl font-semibold text-gray-900">Importar Cardápio</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <CardDescription className="text-gray-600 text-sm leading-relaxed">
                                Copie um cardápio existente de outro restaurante usando um código de cardápio. Isso permite duplicar rapidamente configurações de cardápios bem-sucedidas e personalizá-las para seu estabelecimento.
                            </CardDescription>
                            <div className="mt-6">
                                <Button variant="secondary" size="sm" className="w-full" disabled>
                                    <Upload className="h-4 w-4 mr-2" />
                                    Importar Cardápio
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Create RestaurantMenu Card */}
                    <Card className="hover:shadow-lg transition-shadow group">
                        <CardHeader className="text-center pb-4">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                                <Plus className="h-8 w-8 text-purple-600" />
                            </div>
                            <CardTitle className="text-xl font-semibold text-gray-900">Criar Cardápio</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <CardDescription className="text-gray-600 text-sm leading-relaxed">
                                Crie seu cardápio do zero com controle total sobre cada detalhe. Personalize categorias, itens,
                                descrições e preços exatamente como desejar.
                            </CardDescription>
                            <div className="mt-6">
                                <Button asChild variant="default" className="w-full">
                                    <Link to="manual">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Criar Cardápio
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Additional Info */}
                <div className="mt-12 text-center">
                    <p className="text-gray-500 text-sm">
                        Precisa de ajuda para decidir? Você sempre pode alternar entre os métodos ou combinar as duas abordagens depois.
                    </p>
                </div>
            </div>
        </div>
    )
}
