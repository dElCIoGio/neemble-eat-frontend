import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {NavLink} from "react-router-dom";
import {Brain, Handshake, RocketLaunch} from "@phosphor-icons/react";
import {Founders, Demo, NeeembleRoom, NeembleClose, NeembleBanner} from "@/assets";


export default function AboutUs() {

    document.title = "Sobre | Neemble Eat"

    return (
        <div className="bg-white">
            <section className="pt-20 pb-16 md:pt-28 md:pb-24 bg-gradient-to-b from-purple-100 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h1 className="text-4xl font-poppins md:text-5xl font-bold mb-6">Transformando a Experiência Gastronômica em Angola</h1>
                        <p className="text-xl text-gray-600">
                            A Neemble Eat é mais do que um software, somos uma revolução digital nos restaurantes angolanos.
                            Nosso propósito é modernizar a gestão e o atendimento no setor gastronômico, criando experiências mais rápidas, organizadas e humanas para clientes e estabelecimentos.
                        </p>
                    </div>

                    <div className="relative rounded-2xl overflow-hidden">
                        <img
                            src={NeembleBanner}
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
                            <p>
                                A Neemble Eat nasceu em Luanda, da visão partilhada por três amigos que identificaram um grande problema mas pouco resolvido: restaurantes com processos desorganizados, pedidos confusos ou perdidos e uma gestão pouco digitalizada.
                            </p>
                            <p>
                                Em vez de aceitar o caos como normal, decidimos construir uma solução simples, mas poderosa, que transforma cada mesa num ponto inteligente de pedidos, reduz erros, acelera o atendimento e oferece dados em tempo real para os donos e gestores tomarem melhores decisões.
                            </p>
                            <p>
                                Começamos com um MVP em restaurantes local. Com o grande potencial de sucesso, sonhamos em ajudar inúmeros estabelecimentos a operar com mais agilidade, controle e eficiência mesmo quando os donos não estão presentes.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative h-[200px] rounded-lg overflow-hidden">
                                <img
                                    src={Founders}
                                    alt="Primeiros dias da Neemble Eat"
                                    className="object-cover"
                                />
                            </div>
                            <div className="relative h-[200px] rounded-lg overflow-hidden">
                                <img src={Demo} alt="Equipe em ação"  className="object-cover" />
                            </div>
                            <div className="relative h-[200px] rounded-lg overflow-hidden">
                                <img
                                    src={NeeembleRoom}
                                    alt="Treinamento de clientes"
                                    className="object-cover"
                                />
                            </div>
                            <div className="relative h-[200px] rounded-lg overflow-hidden">
                                <img
                                    src={NeembleClose}
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
                            <div className="h-12 w-12 rounded-full bg-purple-500/10 bg-opacity-10 flex items-center justify-center mb-6">
                                <RocketLaunch className="text-purple-900" size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Inovação com Propósito</h3>
                            <p className="text-gray-600">
                                Não seguimos tendências. Criamos soluções que resolvem dores reais do setor gastronômico angolano, com foco na utilidade e impacto.
                            </p>
                        </Card>
                        <Card className="p-6">
                            <div className="h-12 w-12 rounded-full bg-purple-500/10 bg-opacity-10 flex items-center justify-center mb-6">
                                <Handshake className="text-purple-900" size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Compromisso com Resultados</h3>
                            <p className="text-gray-600">
                                Estamos ao lado dos nossos parceiros em cada etapa. Medimos nosso sucesso pelos resultados que eles alcançam: mais pedidos, menos erros e clientes mais satisfeitos.
                            </p>
                        </Card>
                        <Card className="p-6">
                            <div className="h-12 w-12 rounded-full bg-purple-500/10 bg-opacity-10 flex items-center justify-center mb-6">
                                <Brain className="text-purple-900" size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Excelência Técnica</h3>
                            <p className="text-gray-600">
                                Somos obcecados pela qualidade do nosso produto. Construímos sistemas escaláveis, rápidos e seguros, prontos para o ritmo acelerado dos melhores restaurantes.                            </p>
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
                                bio: "Gestor de negócios e finanças.",
                            },
                            {
                                name: "Delcio Agostinho",
                                role: "CTO & Co-fundador",
                                bio: "Especialista em desenvolvimento de software e sistemas escaláveis.",
                            },
                            {
                                name: "Evandro Reis",
                                role: "COO & Co-fundador",
                                bio: "Experiência em gestão e operações.",
                            },
                        ].map((member, index) => (
                            <Card key={index} className="p-6">
                                <div className="relative hidden h-[300px] rounded-lg overflow-hidden mb-6">
                                    <img src="/placeholder.svg?height=300&width=300" alt={member.name}  className="object-cover hidden" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold">{member.name}</h3>
                                    <p className="text-purple-700 font-medium">{member.role}</p>
                                    <p className="text-gray-600">{member.bio}</p>
                                </div>

                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Impact Section */}
            <section className="py-24 bg-gray-50 hidden">
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
                        Junte-se à Neemble Eat e transforme o seu restaurante em um exemplo de agilidade, controle e inovação no setor gastronômico angolano.                    </p>
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
