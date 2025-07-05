import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Check,
    ClipboardList,
    Bell,
    Utensils,
    Smartphone,
    Users,
    Timer,
    Printer,
    Settings,
    History,
} from "lucide-react"
import {Link} from "react-router";
import {DesktopAnalytics, DesktopOrders} from "@/assets";


const features = [
    {
        icon: ClipboardList,
        title: "Pedidos em Tempo Real",
        description: "Receba e gerencie pedidos instantaneamente, sem atrasos ou confusões",
    },
    {
        icon: Bell,
        title: "Notificações Inteligentes",
        description: "Alertas automáticos para novos pedidos, atualizações e status",
    },
    {
        icon: Timer,
        title: "Tempo Estimado",
        description: "Controle e comunique tempos de preparo precisos aos clientes",
    },
    {
        icon: Printer,
        title: "Impressão Automática",
        description: "Integração com impressoras térmicas para comanda automática",
    },
    {
        icon: Settings,
        title: "Personalização Total",
        description: "Adapte o sistema às necessidades específicas do seu restaurante",
    },
    {
        icon: History,
        title: "Histórico Completo",
        description: "Acesse todo histórico de pedidos e análises detalhadas",
    },
]

const stats = [
    { number: "40%", label: "Redução em erros de pedidos" },
    { number: "25min", label: "Economia de tempo por dia" },
    { number: "30%", label: "Aumento na eficiência" },
    { number: "98%", label: "Satisfação dos clientes" },
]

export default function OrderManagement() {
    return (
        <div>

            {/* Hero Section */}
            <section className="relative bg-gray-50 pt-20 pb-28 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="relative z-10">
                            <Badge className="mb-4 bg-purple-500 text-white">Gestão de Pedidos</Badge>
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                                Simplifique a gestão dos pedidos do seu restaurante
                            </h1>
                            <p className="text-xl text-gray-600 mb-8">
                                Sistema completo de gestão de pedidos que conecta salão, cozinha e clientes em uma única plataforma
                                intuitiva.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button className="bg-purple-500 hover:bg-purple-400 text-white">Começar Agora</Button>
                                <Button variant="outline">Agendar Demonstração</Button>
                            </div>
                        </div>
                        <div className="relative lg:h-[600px]">
                            <div className="relative z-10 bg-white rounded-xl shadow-xl px-3 rounded-md pb-3">
                                <img
                                    src={DesktopOrders}
                                    alt="Dashboard de Pedidos"
                                    width={600}
                                    height={500}
                                    className="rounded-lg"
                                />
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-purple-500 to-purple-400 opacity-10 rounded-full blur-3xl" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat) => (
                            <div key={stat.number} className="text-center">
                                <div className="text-4xl font-bold text-purple-500 mb-2">{stat.number}</div>
                                <div className="text-sm text-gray-600">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Kitchen Display System */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold">Dashboard da Cozinha em Tempo Real</h2>
                            <p className="text-gray-600">
                                Visualização clara e organizada de todos os pedidos em andamento, permitindo que sua equipe trabalhe com
                                máxima eficiência.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Visão clara de todos os pedidos em andamento",
                                    "Tempos estimados de preparo por pedido",
                                    "Alertas sonoros para novos pedidos",
                                    "Organização por prioridade e tempo",
                                    "Interface touch-screen amigável",
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
                        <div className="relative hidden">
                            <div className="relative z-10 bg-white rounded-xl shadow-xl p-6">
                                <img
                                    src="/placeholder.svg?height=400&width=600"
                                    alt="Kitchen Display System"
                                    width={600}
                                    height={400}
                                    className="rounded-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold mb-4">Recursos que otimizam sua operação</h2>
                        <p className="text-gray-600">Ferramentas completas para gerenciar pedidos de forma eficiente</p>
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

            {/* Process Flow */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold mb-4">Como funciona</h2>
                        <p className="text-gray-600">Processo simplificado do pedido à entrega</p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-purple-500/10 bg-opacity-10 flex items-center justify-center mx-auto mb-4">
                                <Smartphone className="w-8 h-8 text-purple-500" />
                            </div>
                            <h3 className="font-semibold mb-2">1. Recebimento do Pedido</h3>
                            <p className="text-gray-600">Cliente faz o pedido via QR code ou garçom</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-purple-500/10 bg-opacity-10 flex items-center justify-center mx-auto mb-4">
                                <Bell className="w-8 h-8 text-purple-500" />
                            </div>
                            <h3 className="font-semibold mb-2">2. Notificação Instantânea</h3>
                            <p className="text-gray-600">Cozinha recebe alerta do novo pedido</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-purple-500/10 bg-opacity-10 flex items-center justify-center mx-auto mb-4">
                                <Utensils className="w-8 h-8 text-purple-500" />
                            </div>
                            <h3 className="font-semibold mb-2">3. Preparo</h3>
                            <p className="text-gray-600">Acompanhamento em tempo real do preparo</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-purple-500/10 bg-opacity-10 flex items-center justify-center mx-auto mb-4">
                                <Users className="w-8 h-8 text-purple-500" />
                            </div>
                            <h3 className="font-semibold mb-2">4. Entrega</h3>
                            <p className="text-gray-600">Garçom é notificado quando pedido está pronto</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Analytics Preview */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="relative">
                                <img
                                    src={DesktopAnalytics}
                                    alt="Analytics Dashboard"
                                    width={600}
                                    height={500}
                                    className="rounded-xl shadow-lg"
                                />
                            </div>
                        </div>
                        <div className="order-1 lg:order-2 space-y-6">
                            <h2 className="text-3xl font-bold">Análises detalhadas para decisões inteligentes</h2>
                            <p className="text-gray-600">
                                Acompanhe o desempenho do seu restaurante com relatórios detalhados e métricas em tempo real.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Tempo médio de preparo por prato",
                                    "Análise de picos de demanda",
                                    "Pratos mais vendidos",
                                    "Desempenho da equipe",
                                    "Satisfação dos clientes",
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

            {/* Testimonials */}
            <section className="py-24 hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        {[
                            {
                                quote:
                                    "Reduzimos o tempo de preparo dos pedidos em 40% desde que implementamos o sistema de gestão do Neemble Eat.",
                                author: "Carlos Santos",
                                role: "Chef Executivo",
                                restaurant: "Restaurante Sabores de Angola",
                            },
                            {
                                quote:
                                    "A organização da cozinha melhorou drasticamente. Agora temos total controle sobre cada pedido em tempo real.",
                                author: "Ana Maria",
                                role: "Gerente de Operações",
                                restaurant: "Café Marina",
                            },
                        ].map((testimonial, index) => (
                            <Card key={index} className="p-8 ">
                                <blockquote className="text-lg text-gray-600 mb-6">"{testimonial.quote}"</blockquote>
                                <div className="flex items-center gap-4">
                                    <div className="relative hidden w-12 h-12 rounded-full overflow-hidden">
                                        <img
                                            src="/placeholder.svg?height=100&width=100"
                                            alt={testimonial.author}
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <div className="font-semibold">{testimonial.author}</div>
                                        <div className="text-sm text-gray-600">{testimonial.role}</div>
                                        <div className="text-sm text-gray-600">{testimonial.restaurant}</div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">Pronto para otimizar a gestão do seu restaurante?</h2>
                    <p className="text-gray-600 mb-8">
                        Comece agora e veja a diferença que um sistema de gestão eficiente pode fazer.
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

