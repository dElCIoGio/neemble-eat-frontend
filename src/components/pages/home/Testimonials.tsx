
export function Testimonials() {
    return (
        <section className="py-24 bg-gray-50 hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Histórias de Sucesso</h2>
                    <p className="text-gray-600">
                        Descubra como restaurantes em toda Angola estão transformando seus negócios com o Neemble Eat
                    </p>
                </div>

                {/* Featured Testimonial */}
                <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
                    <div className="relative hidden h-[400px] rounded-2xl overflow-hidden">
                        <img
                            src="/placeholder.svg?height=400&width=600"
                            alt="Restaurante Sabores de Angola"
                            className="object-cover"
                        />
                    </div>
                    <div className="space-y-6">
                        <div className="flex gap-1">
                            {Array.from({length: 5}).map((_, i) => (
                                <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                    <path
                                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                </svg>
                            ))}
                        </div>
                        <blockquote className="text-2xl font-medium text-gray-900">
                            "O Neemble Eat revolucionou nosso restaurante. Reduzimos erros nos pedidos em 90% e
                            aumentamos nossas
                            vendas em mais de 30%."
                        </blockquote>
                        <div>
                            <div className="font-semibold">João Silva</div>
                            <div className="text-gray-600">Proprietário, Restaurante Sabores de Angola</div>
                        </div>
                    </div>
                </div>

                {/* Testimonial Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            name: "Maria Santos",
                            role: "Gerente",
                            company: "Café Luanda",
                            image: "/placeholder.svg?height=100&width=100",
                            quote:
                                "A implementação foi super rápida e o suporte é excelente. Nossos clientes adoram a praticidade do menu digital.",
                        },
                        {
                            name: "Pedro Costa",
                            role: "Chef Proprietário",
                            company: "Restaurante Mares",
                            image: "/placeholder.svg?height=100&width=100",
                            quote:
                                "O dashboard da cozinha melhorou muito nossa eficiência. A equipe se adaptou rapidamente ao sistema.",
                        },
                        {
                            name: "Ana Oliveira",
                            role: "Diretora de Operações",
                            company: "Rede Sabor Plus",
                            image: "/placeholder.svg?height=100&width=100",
                            quote: "Os relatórios analíticos nos ajudam a tomar decisões melhores sobre nosso cardápio e operação.",
                        },
                    ].map((testimonial, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                                    <img
                                        src={testimonial.image || "/placeholder.svg"}
                                        alt={testimonial.name}
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <div className="font-semibold">{testimonial.name}</div>
                                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                                    <div className="text-sm text-gray-600">{testimonial.company}</div>
                                </div>
                            </div>
                            <blockquote className="text-gray-600">"{testimonial.quote}"</blockquote>
                        </div>
                    ))}
                </div>

                {/* Stats */}
                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {[
                        {number: "50+", label: "Restaurantes Atendidos"},
                        {number: "98%", label: "Taxa de Satisfação"},
                        {number: "30%", label: "Aumento Médio em Vendas"},
                        {number: "15min", label: "Tempo de Implementação"},
                    ].map((stat, index) => (
                        <div key={index}>
                            <div className="text-3xl font-bold text-purple-500">{stat.number}</div>
                            <div className="text-sm text-gray-600">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Trust Badges */}
                <div className="mt-16 text-center">
                    <div className="text-sm font-medium text-gray-500 mb-4">Certificados e Parcerias</div>
                    <div className="flex justify-center gap-8">
                        {Array.from({length: 4}).map((_, i) => (
                            <div key={i} className="w-16 h-16 bg-white rounded-lg shadow-sm"/>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

