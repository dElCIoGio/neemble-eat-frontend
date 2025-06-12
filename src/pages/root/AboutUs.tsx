import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {NavLink} from "react-router";


export default function AboutUs() {

    document.title = "Sobre | Neemble Eat"

    return (
        <div className="bg-white">
            <section className="pt-20 pb-16 md:pt-28 md:pb-24 bg-gradient-to-b from-purple-100 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">Transformando a experiência gastronômica em Angola</h1>
                        <p className="text-xl text-gray-600">
                            Nossa missão é impulsionar a inovação no setor de restaurantes, conectando clientes e estabelecimentos
                            através da tecnologia.
                        </p>
                    </div>

                    <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
                        <img
                            src="/placeholder.svg?height=500&width=1200"
                            alt="Equipe Neemble Eat"

                            className="object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* Nossa História Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl md:text-4xl font-bold">Nossa História</h2>
                            <p className="text-gray-600 text-lg">
                                A Neemble Eat nasceu em 2023 em Luanda, da visão de três amigos apaixonados por tecnologia e
                                gastronomia. Observando os desafios enfrentados pelos restaurantes locais, identificamos a necessidade
                                de uma solução que simplificasse a gestão e melhorasse a experiência dos clientes.
                            </p>
                            <p className="text-gray-600 text-lg">
                                Começamos com um projeto piloto em cinco restaurantes em Luanda, e rapidamente percebemos o impacto
                                positivo que nossa tecnologia estava tendo. Hoje, atendemos dezenas de estabelecimentos em toda Angola,
                                ajudando-os a prosperar na era digital.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative h-[200px] rounded-lg overflow-hidden">
                                <img
                                    src="/placeholder.svg?height=200&width=200"
                                    alt="Primeiros dias da Neemble Eat"
                                    className="object-cover"
                                />
                            </div>
                            <div className="relative h-[200px] rounded-lg overflow-hidden">
                                <img src="/placeholder.svg?height=200&width=200" alt="Equipe em ação"  className="object-cover" />
                            </div>
                            <div className="relative h-[200px] rounded-lg overflow-hidden">
                                <img
                                    src="/placeholder.svg?height=200&width=200"
                                    alt="Treinamento de clientes"
                                    className="object-cover"
                                />
                            </div>
                            <div className="relative h-[200px] rounded-lg overflow-hidden">
                                <img
                                    src="/placeholder.svg?height=200&width=200"
                                    alt="Escritório em Luanda"
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Valores Section */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Nossos Valores</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="p-6">
                            <div className="h-12 w-12 rounded-full bg-purple-500 bg-opacity-10 flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-4">Inovação Local</h3>
                            <p className="text-gray-600">
                                Desenvolvemos soluções pensando nas necessidades específicas do mercado angolano, adaptando a tecnologia
                                à nossa realidade.
                            </p>
                        </Card>
                        <Card className="p-6">
                            <div className="h-12 w-12 rounded-full bg-purple-500 bg-opacity-10 flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-4">Compromisso com Clientes</h3>
                            <p className="text-gray-600">
                                Oferecemos suporte dedicado e treinamento contínuo para garantir o sucesso de cada estabelecimento
                                parceiro.
                            </p>
                        </Card>
                        <Card className="p-6">
                            <div className="h-12 w-12 rounded-full bg-purple-500 bg-opacity-10 flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-4">Excelência Técnica</h3>
                            <p className="text-gray-600">
                                Mantemos os mais altos padrões de segurança e performance, garantindo um serviço confiável e eficiente.
                            </p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Nossa Equipe</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Marcio Tavares",
                                role: "CEO & Co-fundador",
                                bio: "15 anos de experiência em tecnologia e startups em Angola.",
                            },
                            {
                                name: "Delcio Agostinho",
                                role: "CTO & Co-fundadora",
                                bio: "Especialista em desenvolvimento de software e sistemas escaláveis.",
                            },
                            {
                                name: "Evandro Reis",
                                role: "COO & Co-fundador",
                                bio: "Experiência em gestão de restaurantes e operações.",
                            },
                        ].map((member, index) => (
                            <Card key={index} className="p-6">
                                <div className="relative h-[300px] rounded-lg overflow-hidden mb-6">
                                    <img src="/placeholder.svg?height=300&width=300" alt={member.name}  className="object-cover" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                                <p className="text-zinc-400 font-medium mb-4">{member.role}</p>
                                <p className="text-gray-600">{member.bio}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Impact Section */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Nosso Impacto</h2>
                    <div className="grid md:grid-cols-4 gap-8 text-center">
                        {[
                            { number: "50+", label: "Restaurantes Parceiros" },
                            { number: "100k+", label: "Pedidos Processados" },
                            { number: "30%", label: "Aumento Médio em Vendas" },
                            { number: "15min", label: "Redução no Tempo de Espera" },
                        ].map((stat, index) => (
                            <div key={index} className="space-y-2">
                                <div className="text-4xl font-bold text-purple-500">{stat.number}</div>
                                <div className="text-gray-600">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Faça Parte da Revolução Digital</h2>
                    <p className="text-xl text-gray-600 mb-8">
                        Junte-se a nós na missão de transformar a experiência gastronômica em Angola
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-6 text-sm">
                            <NavLink to="../demo">
                                Agendar Demonstração
                            </NavLink>

                        </Button>
                        <Button asChild variant="outline" className="px-8 py-6 text-sm">
                            <NavLink to="../price">
                                Conhecer Planos
                            </NavLink>

                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}
