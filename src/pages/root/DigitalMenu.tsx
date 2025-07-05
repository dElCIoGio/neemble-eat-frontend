import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Smartphone, QrCode, Utensils, ImageIcon, Languages, Wifi, Clock } from "lucide-react"
import {Link} from "react-router";
import {IphoneDarkBackground, MacBookDashboard, NeembleEatMenu} from "@/assets";

const features = [
    {
        icon: QrCode,
        title: "QR Code Único",
        description: "Cada mesa tem seu QR code exclusivo para fácil identificação dos pedidos",
    },
    {
        icon: ImageIcon,
        title: "Fotos dos Pratos",
        description: "Apresente seus pratos com imagens profissionais e descrições detalhadas",
    },
    {
        icon: Languages,
        title: "Múltiplos Idiomas",
        description: "Disponível em português, inglês e outros idiomas para atender todos os clientes",
    },
    {
        icon: Wifi,
        title: "Funciona Offline",
        description: "Cache inteligente permite funcionamento mesmo com internet instável",
    },
    {
        icon: Clock,
        title: "Atualização em Tempo Real",
        description: "Atualize preços e disponibilidade instantaneamente",
    },
    {
        icon: Utensils,
        title: "Categorias Personalizadas",
        description: "Organize seu menu da maneira que fizer mais sentido para seu restaurante",
    },
]

export default function DigitalMenu() {

    document.title = "Menu digital | Neemble Eat"


    return (
        <div>
            <section className="relative bg-gray-50 pt-20 pb-28 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="relative z-10">
                            <Badge className="mb-4 bg-purple-500 text-white">Menu Digital</Badge>
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                                Transforme seu cardápio em uma experiência digital incrível
                            </h1>
                            <p className="text-xl text-gray-600 mb-8">
                                Menu digital interativo via QR code que encanta seus clientes e simplifica a gestão do seu restaurante.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button className="bg-purple-500 hover:bg-purple-400 text-white">Começar Agora</Button>
                                <Button variant="outline">
                                    <Link to="../../demo">
                                        Agendar Demonstração
                                    </Link>

                                </Button>
                            </div>
                        </div>
                        <div className="relative lg:h-[600px]">
                            <div className="relative z-10 bg-white rounded-3xl shadow-xl p-2 mx-auto max-w-[300px]">
                                <div className="rounded-2xl overflow-hidden">
                                    <img
                                        src={NeembleEatMenu}
                                        alt="Menu Digital Preview"
                                        width={300}
                                        height={600}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-purple-500 to-purple-400 opacity-10 rounded-full blur-3xl" />
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold mb-4">Como funciona</h2>
                        <p className="text-gray-600">Processo simples e intuitivo para seus clientes e sua equipe</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-purple-500/10 bg-opacity-10 flex items-center justify-center mx-auto mb-4">
                                <QrCode className="w-8 h-8 text-purple-500" />
                            </div>
                            <h3 className="font-semibold mb-2">1. Cliente escaneia o QR code</h3>
                            <p className="text-gray-600">Código único em cada mesa leva ao cardápio digital</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-purple-500/10 bg-opacity-10 flex items-center justify-center mx-auto mb-4">
                                <Smartphone className="w-8 h-8 text-purple-500" />
                            </div>
                            <h3 className="font-semibold mb-2">2. Acessa o menu interativo</h3>
                            <p className="text-gray-600">Visualiza fotos, descrições e preços atualizados</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-purple-500/10 bg-opacity-10 flex items-center justify-center mx-auto mb-4">
                                <Utensils className="w-8 h-8 text-purple-500" />
                            </div>
                            <h3 className="font-semibold mb-2">3. Faz o pedido</h3>
                            <p className="text-gray-600">Seleciona os itens e envia direto para a cozinha</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold mb-4">Recursos que fazem a diferença</h2>
                        <p className="text-gray-600">Tudo que você precisa para criar uma experiência digital memorável</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature) => (
                            <Card key={feature.title} className="p-6">
                                <div className="w-12 h-12 rounded-lg bg-purple-500/10 bg-opacity-10 flex items-center justify-center mb-4">
                                    <feature.icon className="w-6 h-6 text-purple-500" />
                                </div>
                                <h3 className="font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Preview Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold">Interface intuitiva para seus clientes</h2>
                            <p className="text-gray-600">
                                Design moderno e fácil de usar que se adapta a qualquer dispositivo. Seus clientes vão adorar a
                                experiência de navegar pelo cardápio digital.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Navegação intuitiva por categorias",
                                    "Fotos em alta resolução dos pratos",
                                    "Descrições detalhadas e preços atualizados",
                                    "Opções de personalização dos pedidos",
                                    "Suporte a múltiplos idiomas",
                                ].map((item) => (
                                    <li key={item} className="flex items-start gap-3">
                                        <div className="mt-1">
                                            <Check className="w-5 h-5 text-green-500" />
                                        </div>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="relative">
                            <div className="relative z-10 bg-white rounded-3xl shadow-xl p-2">
                                <img
                                    src={IphoneDarkBackground}
                                    alt="Interface do Menu Digital"
                                    width={300}
                                    height={600}
                                    className="w-full rounded-2xl"
                                />
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-purple-500 to-purple-400 opacity-10 rounded-full blur-3xl" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Admin Dashboard Preview */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="relative p-1 rounded-3xl">
                                <img
                                    src={MacBookDashboard}
                                    alt="Dashboard do Menu Digital"
                                    width={800}
                                    height={600}
                                    className="rounded-xl shadow-lg"
                                />
                            </div>
                        </div>
                        <div className="order-1 lg:order-2 space-y-6">
                            <h2 className="text-3xl font-bold">Painel de controle completo</h2>
                            <p className="text-gray-600">
                                Gerencie seu cardápio digital de forma simples e eficiente com nosso painel administrativo intuitivo.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Atualize preços e disponibilidade em tempo real",
                                    "Gerencie categorias e itens facilmente",
                                    "Adicione fotos e descrições detalhadas",
                                    "Visualize estatísticas de pedidos",
                                    "Configure promoções e cardápios especiais",
                                ].map((item) => (
                                    <li key={item} className="flex items-start gap-3">
                                        <div className="mt-1">
                                            <Check className="w-5 h-5 text-green-500" />
                                        </div>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonial */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="flex justify-center mb-8">
                            <img
                                src="/placeholder.svg?height=100&width=100"
                                alt="Cliente"
                                width={100}
                                height={100}
                                className="rounded-full hidden"
                            />
                        </div>
                        <blockquote className="text-2xl font-medium text-gray-900 mb-8">
                            "Desde que implementamos o menu digital do Neemble Eat, nossos clientes adoraram a experiência e nossa
                            operação ficou muito mais eficiente."
                        </blockquote>
                        <div className="font-semibold">Maria Santos</div>
                        <div className="text-gray-600">Proprietária</div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">Pronto para modernizar seu cardápio?</h2>
                    <p className="text-gray-600 mb-8">
                        Comece agora e transforme a experiência dos seus clientes com nosso menu digital.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button className="bg-purple-500 hover:bg-purple-400 text-white">Começar Gratuitamente</Button>
                        <Button variant="outline">
                            <Link to="../../demo">
                                Agendar Demonstração
                            </Link>
                        </Button>
                    </div>
                    <p className="mt-4 text-sm text-gray-500">Teste grátis por 30 dias. Sem compromisso.</p>
                </div>
            </section>
        </div>
    )
}

