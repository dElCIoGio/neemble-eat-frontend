
function Benefits() {
    return (
        <section className="bg-gray-50 py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Benefícios para seu negócio</h2>
                <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold">Aumente sua eficiência</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <div
                                    className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    ✓
                                </div>
                                <span>Redução de erros nos pedidos</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div
                                    className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    ✓
                                </div>
                                <span>Atendimento mais rápido</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div
                                    className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    ✓
                                </div>
                                <span>Gestão simplificada da cozinha</span>
                            </li>
                        </ul>
                    </div>
                    <div className="relative hidden h-[300px] md:h-auto">
                        <img
                            src="/placeholder.svg?height=400&width=600"
                            alt="Dashboard Neemble Eat"
                            className="object-contain rounded-lg"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Benefits;