import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { QrCode, BowlFood, ChartLine, MapPin } from "@phosphor-icons/react"
import {NavLink} from "react-router";


const plans = [
    {
        name: "Básico",
        description: "Para restaurantes pequenos começando sua jornada digital",
        price: "20.000",
        period: "/mês",
        features: [
            "Menu digital via QR Code",
            "Até 50 itens no cardápio",
            "Gestão de pedidos básica",
            "Relatórios simples",
            "Suporte por email",
        ],
        limitations: ["1 ponto de venda", "Sem análise avançada", "Sem integração com sistemas externos"],
    },
    {
        name: "Profissional",
        description: "Ideal para restaurantes em crescimento",
        price: "35.000",
        period: "/mês",
        popular: true,
        features: [
            "Tudo do plano Básico",
            "Cardápio ilimitado",
            "Dashboard da cozinha",
            "Análise avançada de dados",
            "Múltiplos QR codes",
            "Gestão de mesas",
            "Integração com impressoras",
            "Suporte prioritário",
            "Treinamento da equipe",
        ],
        limitations: ["Até 3 pontos de venda", "API básica"],
    },
    {
        name: "Empresarial",
        description: "Para redes de restaurantes e operações maiores",
        price: "Personalizado",
        period: "",
        features: [
            "Tudo do plano Profissional",
            "Pontos de venda ilimitados",
            "API completa",
            "Integrações personalizadas",
            "Gerente de conta dedicado",
            "SLA garantido",
            "Suporte 24/7",
            "Treinamento completo",
            "Personalização total",
        ],
        limitations: [],
    },
]

const features = [
    {
        title: "Menu Digital",
        description: "Cardápio digital completo com fotos e descrições detalhadas",
        icon: QrCode,
    },
    {
        title: "Gestão de Pedidos",
        description: "Sistema completo de gerenciamento de pedidos em tempo real",
        icon: BowlFood,
    },
    {
        title: "Analytics",
        description: "Análise detalhada de vendas, produtos e comportamento do cliente",
        icon: ChartLine,
    },
    {
        title: "Suporte Local",
        description: "Equipe de suporte baseada em Angola para ajuda rápida",
        icon: MapPin,
    },
]

export default function Pricing() {

    document.title = "Preços | Neemble Eat"

    return (
        <div className="bg-white">

            <section className="bg-gray-50 py-12 md:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Preços transparentes para seu negócio</h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        Escolha o plano ideal para seu restaurante. Sem custos ocultos, cancele quando quiser.
                    </p>
                    <div className="inline-flex items-center rounded-full hidden bg-white border px-4 py-2">
                        <span className="text-sm font-medium">Faturamento mensal</span>
                        <Badge className="ml-4 bg-[#FF6B35]">2 meses grátis</Badge>
                    </div>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="py-12 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        {plans.map((plan, ) => (
                            <div
                                key={plan.name}
                                className={`relative rounded-2xl p-8 ${
                                    plan.popular ? "border-2 border-purple-400 shadow-lg" : plan.name == "Empresarial"? "border-2 border-zinc-800": "border"
                                }`}
                            >
                                {plan.popular && (
                                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500">Mais Popular</Badge>
                                )}
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                    <p className="text-gray-600 mb-4">{plan.description}</p>
                                    <div className="flex items-baseline gap-1">
                                        {plan.price === "Personalizado" ? (
                                            <span className="text-3xl font-bold">Personalizado</span>
                                        ) : (
                                            <>
                                                <span className="text-3xl font-bold">{plan.price}</span>
                                                <span className="text-gray-600">Kz</span>
                                                <span className="text-gray-600">{plan.period}</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <Button
                                    className={`w-full mb-8 ${plan.popular ? "bg-purple-500 hover:bg-purple-400" : plan.name == "Empresarial"? "": ""} ${plan.name == "Empresarial"? "": ""}`}
                                    variant={plan.popular ? "default" : plan.name == "Empresarial"? "default": "outline"} >
                                    {
                                        plan.price === "Personalizado" ?
                                            "Falar connosco" :
                                            "Começar Agora"
                                    }
                                </Button>

                                <div className="space-y-4">
                                    <div>
                                        <div className="text-sm font-medium mb-2">Inclui:</div>
                                        <ul className="space-y-3">
                                            {plan.features.map((feature) => (
                                                <li key={feature} className="flex items-start gap-2">
                                                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                                    <span className="text-gray-600">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {plan.limitations.length > 0 && (
                                        <div>
                                            <div className="text-sm font-medium mb-2">Limitações:</div>
                                            <ul className="space-y-3">
                                                {plan.limitations.map((limitation) => (
                                                    <li key={limitation} className="flex items-start gap-2">
                                                        <span className="w-5 h-5 text-gray-400 shrink-0 mt-0.5">•</span>
                                                        <span className="text-gray-600">{limitation}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-12 md:py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Tudo que você precisa para crescer</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Cada plano inclui as ferramentas essenciais para modernizar seu restaurante e melhorar a experiência dos
                            seus clientes.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature) => (
                            <div key={feature.title} className="text-center">
                                <div className="w-12 h-12 rounded-full bg-purple-500/10 bg-opacity-10 flex items-center justify-center mx-auto mb-4">
                                    <feature.icon className="w-6 h-6 text-purple-500"/>
                                </div>
                                <h3 className="font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-600 text-sm">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-12 md:py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Perguntas Frequentes</h2>
                        <p className="text-gray-600">Tire suas dúvidas sobre nossos planos e preços</p>
                    </div>

                    <div className="space-y-8">
                        {[
                            {
                                question: "Existe período mínimo de contrato?",
                                answer: "Não, todos os planos são mensais e você pode cancelar quando quiser sem multa.",
                            },
                            {
                                question: "Posso mudar de plano depois?",
                                answer: "Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento.",
                            },
                            {
                                question: "Como funciona o período gratuito?",
                                answer: "Oferecemos 30 dias gratuitos em qualquer plano para você testar todas as funcionalidades.",
                            },
                            {
                                question: "Preciso de equipamento especial?",
                                answer: "Apenas um dispositivo com acesso à internet. Não é necessário nenhum equipamento especial.",
                            },
                        ].map((item) => (
                            <div key={item.question} className="border-b pb-8">
                                <h3 className="font-semibold mb-2">{item.question}</h3>
                                <p className="text-gray-600">{item.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 md:py-24 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ainda tem dúvidas?</h2>
                    <p className="text-gray-600 mb-8">
                        Nossa equipe está pronta para ajudar você a escolher o melhor plano para seu restaurante.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">


                        <Button className="bg-purple-500 hover:bg-purple-400">
                            <NavLink to="../contact">
                                Fale connosco
                            </NavLink>
                        </Button>

                        <Button variant="outline">
                            <NavLink to="../demo">
                                Ver Demonstração
                            </NavLink>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}

