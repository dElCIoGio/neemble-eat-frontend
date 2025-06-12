import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Phone, MapPin, Clock, MessagesSquare } from "lucide-react"
import {Link} from "react-router";
import { FacebookLogo, LinkedinLogo, InstagramLogo } from "@phosphor-icons/react"
import {  } from "lucide-react"


export default function ContactPage() {

    document.title = "Contacto | Neemble Eat"


    return (
        <div className="min-h-screen bg-white">

            <section className="bg-gray-50 py-12 md:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">Estamos aqui para ajudar</h1>
                        <p className="text-xl text-gray-600">
                            Tem alguma dúvida? Nossa equipe está pronta para ajudar seu restaurante a alcançar todo seu potencial
                            digital.
                        </p>
                    </div>
                </div>
            </section>

            {/* Quick Contact Options */}
            <section className="py-12 border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg">
                            <Phone className="w-6 h-6 text-purple-700" />
                            <div>
                                <h3 className="font-semibold mb-2">Telefone</h3>
                                <p className="text-gray-600 mb-2">Seg-Sex, 8h às 18h</p>
                                <Link to="tel:+244923456789" className="text-purple-700 hover:underline">
                                    +244 923 456 789
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg">
                            <MessagesSquare className="w-6 h-6 text-purple-700" />
                            <div>
                                <h3 className="font-semibold mb-2">WhatsApp</h3>
                                <p className="text-gray-600 mb-2">Resposta rápida</p>
                                <Link to="https://wa.me/244923456789" className="text-purple-700 hover:underline">
                                    Iniciar conversa
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg">
                            <Mail className="w-6 h-6 text-purple-700" />
                            <div>
                                <h3 className="font-semibold mb-2">Email</h3>
                                <p className="text-gray-600 mb-2">Suporte 24/7</p>
                                <Link to="mailto:suporte@neembleeat.ao" className="text-purple-700 hover:underline">
                                    suporte@neembleeat.ao
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div>
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold mb-4">Envie sua mensagem</h2>
                                <p className="text-gray-600">
                                    Preencha o formulário abaixo e nossa equipe entrará em contato em até 24 horas.
                                </p>
                            </div>

                            <form className="space-y-6">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-medium">
                                            Nome
                                        </label>
                                        <Input id="name" placeholder="Seu nome completo" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-medium">
                                            Email
                                        </label>
                                        <Input id="email" type="email" placeholder="seu@email.com" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="phone" className="text-sm font-medium">
                                        Telefone
                                    </label>
                                    <Input id="phone" placeholder="+244" />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="subject" className="text-sm font-medium">
                                        Assunto
                                    </label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o assunto" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="sales">Vendas</SelectItem>
                                            <SelectItem value="support">Suporte Técnico</SelectItem>
                                            <SelectItem value="billing">Faturamento</SelectItem>
                                            <SelectItem value="partnership">Parcerias</SelectItem>
                                            <SelectItem value="other">Outro</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-medium">
                                        Mensagem
                                    </label>
                                    <Textarea id="message" placeholder="Digite sua mensagem..." className="min-h-[150px]" />
                                </div>

                                <Button className="w-full bg-purple-700 hover:bg-purple-600 text-white">
                                    Enviar mensagem
                                </Button>
                            </form>
                        </div>

                        {/* Map and Office Info */}
                        <div className="lg:pl-12">
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold mb-4">Nosso escritório</h2>
                                <p className="text-gray-600">
                                    Visite nosso escritório em Luanda para uma demonstração presencial do Neemble Eat.
                                </p>
                            </div>

                            {/* Map */}
                            <div className="relative h-[300px] mb-8 rounded-lg overflow-hidden">
                                <img
                                    src="/placeholder.svg?height=300&width=600"
                                    alt="Localização do escritório"
                                    className="object-cover"
                                />
                            </div>

                            {/* Office Details */}
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <MapPin className="w-6 h-6 text-purple-600" />
                                    <div>
                                        <h3 className="font-semibold mb-1">Endereço</h3>
                                        <p className="text-gray-600">
                                            Rua Principal, 123
                                            <br />
                                            Bairro Talatona
                                            <br />
                                            Luanda, Angola
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <Clock className="w-6 h-6 text-purple-600" />
                                    <div>
                                        <h3 className="font-semibold mb-1">Horário de Funcionamento</h3>
                                        <p className="text-gray-600">
                                            Segunda a Sexta: 8h às 18h
                                            <br />
                                            Sábado: 9h às 13h
                                            <br />
                                            Domingo: Fechado
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Media */}
                            <div className="mt-8 pt-8 border-t">
                                <h3 className="font-semibold mb-4">Siga-nos nas redes sociais</h3>
                                <div className="flex gap-4">
                                    <Link
                                        to="#"
                                        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                                    >
                                        <FacebookLogo className="w-6 h-6"/>
                                    </Link>
                                    <Link
                                        to="#"
                                        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                                    >
                                        <InstagramLogo className="w-6 h-6"/>
                                    </Link>
                                    <Link
                                        to="#"
                                        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                                    >
                                        <LinkedinLogo className="w-6 h-6"/>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Preview Section */}
            <section className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Perguntas Frequentes</h2>
                        <p className="text-gray-600">Encontre respostas rápidas para as dúvidas mais comuns</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <div className="p-6 bg-white rounded-lg">
                            <h3 className="font-semibold mb-2">Como começar com o Neemble Eat?</h3>
                            <p className="text-gray-600">
                                Agende uma demonstração gratuita e nossa equipe irá guiá-lo em todo o processo.
                            </p>
                        </div>
                        <div className="p-6 bg-white rounded-lg">
                            <h3 className="font-semibold mb-2">Quanto tempo leva para implementar?</h3>
                            <p className="text-gray-600">
                                A implementação básica pode ser feita em 24 horas com nosso suporte completo.
                            </p>
                        </div>
                        <div className="p-6 bg-white rounded-lg">
                            <h3 className="font-semibold mb-2">Preciso de equipamento especial?</h3>
                            <p className="text-gray-600">Apenas um dispositivo com acesso à internet para gerenciar os pedidos.</p>
                        </div>
                    </div>

                    <div className="text-center mt-8">
                        <Link to="/faq">
                            <Button variant="outline">Ver todas as perguntas</Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}


