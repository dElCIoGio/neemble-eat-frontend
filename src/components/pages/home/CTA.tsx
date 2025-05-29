import {Button} from "@/components/ui/button";

export function Cta() {
    return (
        <section className="py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto para modernizar seu restaurante?</h2>
                <p className="text-gray-600 mb-8">
                    Junte-se a dezenas de restaurantes em Angola que já estão a usar o Neemble Eat
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button className="bg-zinc-900 hover:bg-zinc-800 text-white px-8 py-6">
                        Começar Gratuitamente
                    </Button>
                    <Button variant="outline" className="px-8 py-6">
                        Falar com Consultor
                    </Button>
                </div>
            </div>
        </section>
    );
}

