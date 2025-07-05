import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";

function Pricing() {
    return (
        <section id="precos" className="py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Planos que cabem no seu
                    orçamento</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <Card className="p-6">
                        <h3 className="text-xl font-bold mb-2">Básico</h3>
                        <p className="text-gray-600 mb-4">Para restaurantes pequenos</p>
                        <div className="text-3xl font-bold mb-6">35.000 Kz/mês</div>
                        <Button className="w-full mb-6">Começar Agora</Button>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2">
                                <div
                                    className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    ✓
                                </div>
                                <span>Menu Digital QR Code</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <div
                                    className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    ✓
                                </div>
                                <span>Gestão de Pedidos Básica</span>
                            </li>
                        </ul>
                    </Card>
                    <Card className="p-6 border-purple-600 outline-amethyst outline-2">
                        <h3 className="text-xl font-bold mb-2">Profissional</h3>
                        <p className="text-gray-600 mb-4">Mais popular</p>
                        <div className="text-3xl font-bold mb-6">45.000 Kz/mês</div>
                        <Button className="w-full mb-6 bg-purple-600 hover:bg-purple-500">Começar Agora</Button>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2">
                                <div
                                    className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    ✓
                                </div>
                                <span>Tudo do Plano Básico</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <div
                                    className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    ✓
                                </div>
                                <span>Analytics Avançado</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <div
                                    className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    ✓
                                </div>
                                <span>Suporte Prioritário</span>
                            </li>
                        </ul>
                    </Card>
                    <Card className="p-6">
                        <h3 className="text-xl font-bold mb-2">Empresarial</h3>
                        <p className="text-gray-600 mb-4">Para redes de restaurantes</p>
                        <div className="text-3xl font-bold mb-6">Personalizado</div>
                        <Button variant="outline" className="w-full mb-6">
                            Fale connosco
                        </Button>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2">
                                <div
                                    className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    ✓
                                </div>
                                <span>Tudo do Plano Profissional</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <div
                                    className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    ✓
                                </div>
                                <span>API Personalizada</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <div
                                    className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    ✓
                                </div>
                                <span>Gerente de Conta Dedicado</span>
                            </li>
                        </ul>
                    </Card>
                </div>
            </div>
        </section>
    );
}

export default Pricing;