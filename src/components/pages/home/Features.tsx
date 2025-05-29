import {Card} from "@/components/ui/card";



export function Features() {
    return (
        <section className="py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Como funciona</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <Card className="p-6">
                        <div
                            className="mb-4 h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center text-white">
                            1
                        </div>
                        <h3 className="text-xl font-bold mb-4">Menu Digital via QR Code</h3>
                        <p className="text-gray-600">
                            Clientes escaneiam o QR code na mesa e acessam seu cardápio digital completo, com fotos
                            e descrições
                            detalhadas.
                        </p>
                    </Card>
                    <Card className="p-6">
                        <div
                            className="mb-4 h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center text-white">
                            2
                        </div>
                        <h3 className="text-xl font-bold mb-4">Gestão de Pedidos</h3>
                        <p className="text-gray-600">
                            Pedidos são enviados diretamente para a cozinha, com sistema de acompanhamento em tempo
                            real.
                        </p>
                    </Card>
                    <Card className="p-6">
                        <div
                            className="mb-4 h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center text-white">
                            3
                        </div>
                        <h3 className="text-xl font-bold mb-4">Análise de Dados</h3>
                        <p className="text-gray-600">
                            Acesse relatórios detalhados sobre vendas, pratos mais populares e horários de pico.
                        </p>
                    </Card>
                </div>
            </div>
        </section>

    );
}

