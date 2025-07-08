import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, BarChart2, DollarSign, Users, Clock, LineChart, Target, Zap, Share2 } from "lucide-react"
import {Link} from "react-router-dom";
import {DesktopAnalytics, DesktopMenu} from "@/assets";


const kpiCategories = [
    {
        title: "Vendas e Receita",
        icon: DollarSign,
        metrics: [
            "Receita total diária/mensal",
            "Ticket médio por cliente",
            "Vendas por categoria de produto",
            "Margem de lucro por item",
        ],
    },
    {
        title: "Operacional",
        icon: Clock,
        metrics: ["Tempo médio de preparo", "Tempo de atendimento", "Taxa de ocupação das mesas", "Eficiência da equipe"],
    },
    {
        title: "Clientes",
        icon: Users,
        metrics: ["Satisfação do cliente", "Taxa de retorno", "Preferências de pedidos", "Horários de pico"],
    },
    {
        title: "Inventário",
        icon: BarChart2,
        metrics: ["Rotatividade de estoque", "Itens mais vendidos", "Desperdício", "Previsão de demanda"],
    },
]

const features = [
    {
        icon: Target,
        title: "KPIs em Tempo Real",
        description: "Acompanhe os principais indicadores do seu restaurante em tempo real",
    },
    {
        icon: LineChart,
        title: "Relatórios Personalizados",
        description: "Crie relatórios específicos para suas necessidades de análise",
    },
    {
        icon: Zap,
        title: "Alertas Inteligentes",
        description: "Receba notificações sobre métricas importantes e anomalias",
    },
    {
        icon: Share2,
        title: "Exportação de Dados",
        description: "Exporte seus dados em diversos formatos para análise externa",
    },
]

export default function DataAnalysis() {

    document.title = "Análise de dados | Neemble Eat"


    return (
        <div>

            <section className="relative bg-gray-50 pt-20 pb-28 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="relative z-10">
                            <Badge className="mb-4 bg-purple-500 text-white">Análise de Dados</Badge>
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">Transforme dados em decisões inteligentes</h1>
                            <p className="text-xl text-gray-600 mb-8">
                                Dashboard analítico completo com KPIs em tempo real para ajudar você a tomar as melhores decisões para
                                seu restaurante.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button className="bg-purple-500 hover:bg-purple-400 text-white">Começar Agora</Button>
                                <Button variant="outline">Agendar Demonstração</Button>
                            </div>
                        </div>
                        <div className="relative lg:h-[600px]">
                            <div className="relative z-10 bg-white rounded-xl shadow-xl">
                                <img
                                    src={DesktopAnalytics}
                                    alt="Dashboard Analytics"
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

            {/* KPI Categories */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold mb-4">Métricas que impulsionam seu negócio</h2>
                        <p className="text-gray-600">Monitore todos os aspectos importantes do seu restaurante em um único lugar</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {kpiCategories.map((category) => (
                            <Card key={category.title} className="p-6">
                                <div className="w-12 h-12 rounded-lg bg-purple-500/10 bg-opacity-10 flex items-center justify-center mb-4">
                                    <category.icon className="w-6 h-6 text-purple-500" />
                                </div>
                                <h3 className="font-semibold mb-4">{category.title}</h3>
                                <ul className="space-y-2">
                                    {category.metrics.map((metric) => (
                                        <li key={metric} className="flex items-start gap-2 text-sm text-gray-600">
                                            <Check className="w-4 h-4 text-green-500 mt-1 shrink-0" />
                                            <span>{metric}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Dashboard Preview */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold">Dashboard intuitivo e poderoso</h2>
                            <p className="text-gray-600">
                                Interface moderna e fácil de usar que apresenta seus dados de forma clara e acionável.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Visualizações interativas e personalizáveis",
                                    "Filtros avançados por período e categoria",
                                    "Comparativos históricos",
                                    "Previsões baseadas em IA",
                                    "Exportação de relatórios em PDF e Excel",
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
                            <div className="relative z-10 bg-white rounded-xl shadow-xl">
                                <img
                                    src={DesktopMenu}
                                    alt="Dashboard Interface"
                                    width={600}
                                    height={400}
                                    className="rounded-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold mb-4">Recursos avançados de análise</h2>
                        <p className="text-gray-600">Ferramentas poderosas para entender e otimizar seu negócio</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature) => (
                            <Card key={feature.title} className="p-6">
                                <div className="w-12 h-12 rounded-lg bg-purple-500/10 bg-opacity-10 flex items-center justify-center mb-4">
                                    <feature.icon className="w-6 h-6 text-purple-500" />
                                </div>
                                <h3 className="font-semibold mb-2">{feature.title}</h3>
                                <p className="text-sm text-gray-600">{feature.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Reports Preview */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    {
                                        title: "Relatório de Vendas",
                                        description: "Análise detalhada de vendas por período",
                                    },
                                    {
                                        title: "Performance da Equipe",
                                        description: "Métricas de eficiência e produtividade",
                                    },
                                    {
                                        title: "Análise de Cardápio",
                                        description: "Desempenho e rentabilidade dos pratos",
                                    },
                                    {
                                        title: "Comportamento do Cliente",
                                        description: "Padrões de consumo e preferências",
                                    },
                                ].map((report) => (
                                    <Card key={report.title} className="p-4 hover:shadow-sm hover:-translate-y-1">
                                        <h4 className="font-semibold mb-2">{report.title}</h4>
                                        <p className="text-sm text-zinc-600">{report.description}</p>
                                    </Card>
                                ))}
                            </div>
                        </div>
                        <div className="order-1 lg:order-2 space-y-6">
                            <h2 className="text-3xl font-bold">Relatórios personalizados para cada necessidade</h2>
                            <p className="text-gray-600">
                                Crie e personalize relatórios específicos para diferentes aspectos do seu negócio.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Relatórios automáticos por email",
                                    "Personalização completa de métricas",
                                    "Comparativos entre períodos",
                                    "Insights automáticos baseados em IA",
                                    "Compartilhamento seguro de relatórios",
                                ].map((item) => (
                                    <li key={item} className="flex items-start gap-3 ">
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

            {/* Success Story */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="flex justify-center hidden mb-8">
                            <img
                                src="/placeholder.svg?height=100&width=100"
                                alt="Cliente"
                                width={100}
                                height={100}
                                className="rounded-full"
                            />
                        </div>
                        <blockquote className="text-2xl font-medium text-gray-900 mb-8">
                            "Com o analytics do Neemble Eat, conseguimos identificar nossos pratos mais rentáveis e otimizar nosso
                            cardápio, aumentando nossa margem de lucro em 25%."
                        </blockquote>
                        <div className="font-semibold">Pedro Costa</div>
                        <div className="text-gray-600">Proprietário</div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">Pronto para tomar decisões baseadas em dados?</h2>
                    <p className="text-gray-600 mb-8">
                        Comece agora e descubra como a análise de dados pode transformar seu restaurante.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button className="bg-purple-500 hover:bg-purple-400 text-white">Começar Gratuitamente</Button>
                            <Button variant="outline">
                            <Link to="../../demo">
                                Ver Demonstração
                            </Link>
                        </Button>
                    </div>
                    <p className="mt-4 text-sm text-gray-500">Teste grátis por 30 dias. Sem compromisso.</p>
                </div>
            </section>
        </div>
    )
}