import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check, PlayCircle } from "lucide-react"
import {IphoneZoomOut} from "@/assets";



const benefits = [
    {
        title: "Demonstração Personalizada",
        description: "Veja como o Neemble Eat pode se adaptar às necessidades específicas do seu restaurante.",
    },
    {
        title: "Consultoria Gratuita",
        description: "Receba insights valiosos sobre como melhorar a eficiência do seu estabelecimento.",
    },
    {
        title: "Configuração Assistida",
        description: "Nossa equipe ajuda você a começar, incluindo a configuração inicial do seu cardápio.",
    },
    {
        title: "Suporte Local",
        description: "Conte com nossa equipe em Angola para suporte presencial quando necessário.",
    },
]

export default function Demo() {

    document.title = "Demonstração | Neemble Eat"

    return (
        <div>

            <div className="grid lg:grid-cols-2">
                {/* Left Column - Form */}
                <section className="px-4 py-12 lg:px-8 lg:py-20">
                    <div className="max-w-lg mx-auto">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold mb-4">Agende uma demonstração gratuita</h1>
                            <p className="text-gray-600">
                                Veja como o Neemble Eat pode transformar seu restaurante com uma demonstração personalizada do nosso
                                sistema.
                            </p>
                        </div>

                        <form className="space-y-6">
                            {/* Restaurant Info */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold">Informações do Restaurante</h2>

                                <div className="space-y-2">
                                    <label htmlFor="restaurant-name" className="text-sm font-medium">
                                        Nome do Restaurante
                                    </label>
                                    <Input id="restaurant-name" placeholder="Digite o nome do seu restaurante" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="restaurant-size" className="text-sm font-medium">
                                            Número de Mesas
                                        </label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1-10">1-10 mesas</SelectItem>
                                                <SelectItem value="11-20">11-20 mesas</SelectItem>
                                                <SelectItem value="21-50">21-50 mesas</SelectItem>
                                                <SelectItem value="50+">Mais de 50 mesas</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="restaurant-type" className="text-sm font-medium">
                                            Tipo de Restaurante
                                        </label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="casual">Casual</SelectItem>
                                                <SelectItem value="fine-dining">Fine Dining</SelectItem>
                                                <SelectItem value="fast-food">Fast Food</SelectItem>
                                                <SelectItem value="cafe">Café</SelectItem>
                                                <SelectItem value="bar">Bar/Pub</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold">Informações de Contato</h2>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-medium">
                                            Seu Nome
                                        </label>
                                        <Input id="name" placeholder="Nome completo" />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="role" className="text-sm font-medium">
                                            Cargo
                                        </label>
                                        <Input id="role" placeholder="Ex: Proprietário, Gerente" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium">
                                        Email Profissional
                                    </label>
                                    <Input id="email" type="email" placeholder="seu@email.com" />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="phone" className="text-sm font-medium">
                                        Telefone
                                    </label>
                                    <Input id="phone" placeholder="+244" />
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold">Informações Adicionais</h2>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-medium">
                                        Como podemos ajudar seu restaurante?
                                    </label>
                                    <Textarea
                                        id="message"
                                        placeholder="Conte-nos sobre seus objetivos e desafios..."
                                        className="min-h-[100px]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="demo-time" className="text-sm font-medium">
                                        Melhor horário para demonstração
                                    </label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o horário preferido" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="morning">Manhã (9h-12h)</SelectItem>
                                            <SelectItem value="afternoon">Tarde (14h-17h)</SelectItem>
                                            <SelectItem value="evening">Noite (após 18h)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Button className="w-full bg-purple-500 hover:bg-purple-400 text-white">Agendar Demonstração</Button>

                            <p className="text-sm text-gray-500 text-center">
                                Ao agendar, você concorda com nossos Termos de Serviço e Política de Privacidade
                            </p>
                        </form>
                    </div>
                </section>

                {/* Right Column - Info */}
                <section className="bg-gray-50 px-4 py-12 lg:px-8 lg:py-20">
                    <div className="max-w-lg mx-auto">
                        {/* Video Preview */}
                        <div className="relative aspect-video mb-12 rounded-xl overflow-hidden bg-gray-100">
                            <BackgroundVideo/>
                            <img src="/placeholder.svg?height=400&width=600" alt="Demo Preview" className="object-cover hidden" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Button variant="ghost" size="icon" className="w-16 h-16 rounded-full">
                                    <PlayCircle className="w-16 h-16 text-white" />
                                </Button>
                            </div>
                        </div>

                        {/* Benefits */}
                        <div className="space-y-8">
                            <h2 className="text-2xl font-bold">O que você vai descobrir na demonstração</h2>

                            <div className="grid gap-6">
                                {benefits.map((benefit) => (
                                    <div key={benefit.title} className="flex gap-4">
                                        <div className="w-6 h-6 rounded-full bg-purple-500 bg-opacity-10 flex items-center justify-center shrink-0">
                                            <Check className="w-4 h-4 text-purple-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-1">{benefit.title}</h3>
                                            <p className="text-gray-600 text-sm">{benefit.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Testimonial */}
                        <div className="mt-12 p-6 bg-white rounded-xl">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                                    <img src="/placeholder.svg?height=100&width=100" alt="Cliente"  className="object-cover hidden" />
                                </div>
                                <div>
                                    <div className="font-semibold">João Silva</div>
                                    <div className="text-sm text-gray-600">Restaurante Sabores de Angola</div>
                                </div>
                            </div>
                            <blockquote className="text-gray-600">
                                "A demonstração foi fundamental para entendermos como o Neemble Eat poderia ajudar nosso restaurante.
                                Hoje, não conseguimos imaginar nossa operação sem o sistema."
                            </blockquote>
                        </div>

                        {/* Stats */}
                        <div className="mt-12 grid grid-cols-3 gap-8 text-center">
                            <div>
                                <div className="text-3xl font-bold text-purple-500">50+</div>
                                <div className="text-sm text-gray-600">Restaurantes Parceiros</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-purple-500">30%</div>
                                <div className="text-sm text-gray-600">Aumento em Vendas</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-purple-500">15min</div>
                                <div className="text-sm text-gray-600">Setup Inicial</div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}


const BackgroundVideo = () => {
    return (
        <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover pointer-events-none select-none"
        >
            <source src={IphoneZoomOut} type="video/mp4" />
            Your browser does not support the video tag.
        </video>
    );
};