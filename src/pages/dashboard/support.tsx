

import { useState } from "react"
import {
    BookOpen,
    Mail,
    MessageSquare,
    Phone,
    Search,
    Send,
    Ticket,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

export default function Support() {
    const [searchQuery, setSearchQuery] = useState("")
    const [chatMessage, setChatMessage] = useState("")
    const [chatMessages, setChatMessages] = useState([
        { sender: "system", message: "Bem-vindo ao suporte da Neemble Eat! Como podemos ajudar hoje?", time: "10:30" },
    ])

    const handleSendMessage = () => {
        if (chatMessage.trim()) {
            // Add user message
            setChatMessages([...chatMessages, { sender: "user", message: chatMessage, time: getCurrentTime() }])

            // Simulate response after a short delay
            setTimeout(() => {
                setChatMessages((prev) => [
                    ...prev,
                    {
                        sender: "system",
                        message:
                            "Obrigado pelo seu contacto. Um dos nossos agentes irá responder em breve. O tempo médio de resposta é de 5 minutos.",
                        time: getCurrentTime(),
                    },
                ])
            }, 1000)

            setChatMessage("")
        }
    }

    const getCurrentTime = () => {
        const now = new Date()
        return `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`
    }

    return (
        <div className="flex-1 overflow-auto">

            <div className="">
                <div className="mb-6 hidden">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Pesquisar por tópicos de ajuda..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <Tabs defaultValue="faq">
                    <TabsList className="mb-4 w-full">
                        <TabsTrigger
                            value="faq"
                            className=""
                        >
                            Perguntas Frequentes
                        </TabsTrigger>
                        <TabsTrigger
                            value="contact"
                            className=""
                        >
                            Contacto
                        </TabsTrigger>
                        <TabsTrigger
                            value="knowledge"
                            className=""
                        >
                            Base de Conhecimento
                        </TabsTrigger>
                        <TabsTrigger
                            value="chat"
                            className=""
                        >
                            Chat de Suporte
                        </TabsTrigger>
                        <TabsTrigger
                            value="tickets"
                            className=""
                        >
                            Meus Tickets
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="faq" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Perguntas Frequentes</CardTitle>
                                <CardDescription>
                                    Respostas para as dúvidas mais comuns sobre a plataforma Neemble Eat.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger>Como adicionar um novo item ao menu?</AccordionTrigger>
                                        <AccordionContent>
                                            <p className="mb-2">Para adicionar um novo item ao menu, siga estes passos:</p>
                                            <ol className="list-decimal pl-5 space-y-1">
                                                <li>Acesse a seção "Menu" no painel lateral</li>
                                                <li>Clique no botão "Adicionar Item"</li>
                                                <li>Preencha os detalhes do item (nome, descrição, preço, categoria)</li>
                                                <li>Adicione uma imagem do prato (opcional)</li>
                                                <li>Clique em "Salvar" para adicionar o item ao menu</li>
                                            </ol>
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-2">
                                        <AccordionTrigger>Como configurar métodos de pagamento?</AccordionTrigger>
                                        <AccordionContent>
                                            <p className="mb-2">Para configurar os métodos de pagamento aceitos pelo seu restaurante:</p>
                                            <ol className="list-decimal pl-5 space-y-1">
                                                <li>Acesse a seção "Pagamento" no painel lateral</li>
                                                <li>Na aba "Métodos de Pagamento", ative os métodos desejados</li>
                                                <li>Configure as credenciais para cada método de pagamento</li>
                                                <li>Clique em "Salvar Alterações" para aplicar as configurações</li>
                                            </ol>
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                Nota: Para alguns métodos de pagamento, pode ser necessário verificar a conta do seu
                                                restaurante.
                                            </p>
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-3">
                                        <AccordionTrigger>Como gerar códigos QR para as mesas?</AccordionTrigger>
                                        <AccordionContent>
                                            <p className="mb-2">Para gerar códigos QR para as mesas do seu restaurante:</p>
                                            <ol className="list-decimal pl-5 space-y-1">
                                                <li>Acesse a seção "Mesas e QR Code" no painel lateral</li>
                                                <li>Clique em "Adicionar Mesa" se precisar criar uma nova mesa</li>
                                                <li>Selecione as mesas para as quais deseja gerar códigos QR</li>
                                                <li>Clique em "Gerar QR Codes"</li>
                                                <li>Você pode imprimir os códigos QR ou baixá-los em formato PDF</li>
                                            </ol>
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                Dica: Coloque os códigos QR em suportes de acrílico ou lamine-os para maior durabilidade.
                                            </p>
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-4">
                                        <AccordionTrigger>Como adicionar membros à equipe do restaurante?</AccordionTrigger>
                                        <AccordionContent>
                                            <p className="mb-2">Para adicionar novos membros à equipe do seu restaurante:</p>
                                            <ol className="list-decimal pl-5 space-y-1">
                                                <li>Acesse a seção "Equipe do Restaurante" no painel lateral</li>
                                                <li>Clique no botão "Convidar membro"</li>
                                                <li>Insira o email da pessoa que deseja convidar</li>
                                                <li>Selecione o cargo/função dessa pessoa (Administrador, Gerente, Atendente, etc.)</li>
                                                <li>Clique em "Enviar convite"</li>
                                            </ol>
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                A pessoa receberá um email com instruções para acessar a plataforma.
                                            </p>
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-5">
                                        <AccordionTrigger>Como visualizar relatórios de vendas?</AccordionTrigger>
                                        <AccordionContent>
                                            <p className="mb-2">Para acessar os relatórios de vendas do seu restaurante:</p>
                                            <ol className="list-decimal pl-5 space-y-1">
                                                <li>Acesse a seção "Dashboard" no painel lateral</li>
                                                <li>Na parte inferior, encontre a seção "Relatórios"</li>
                                                <li>Selecione o tipo de relatório que deseja visualizar (diário, semanal, mensal)</li>
                                                <li>Defina o período desejado usando o seletor de datas</li>
                                                <li>Clique em "Gerar Relatório"</li>
                                            </ol>
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                Você pode exportar os relatórios em formato PDF, Excel ou CSV para análise posterior.
                                            </p>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="contact" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Formulário de Contacto</CardTitle>
                                <CardDescription>Envie-nos uma mensagem e responderemos o mais breve possível.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="contact-name">Nome</Label>
                                            <Input id="contact-name" defaultValue="Delcio Agostinho" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="contact-email">Email</Label>
                                            <Input id="contact-email" type="email" defaultValue="dagostinho34@hotmail.com" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="contact-subject">Assunto</Label>
                                        <Select defaultValue="question">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o assunto" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="question">Dúvida sobre a plataforma</SelectItem>
                                                <SelectItem value="bug">Reportar um problema</SelectItem>
                                                <SelectItem value="feature">Sugestão de funcionalidade</SelectItem>
                                                <SelectItem value="billing">Questões de faturamento</SelectItem>
                                                <SelectItem value="other">Outro assunto</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="contact-message">Mensagem</Label>
                                        <Textarea
                                            id="contact-message"
                                            placeholder="Descreva sua dúvida ou problema em detalhes..."
                                            rows={5}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="contact-attachment">Anexos (opcional)</Label>
                                        <Input id="contact-attachment" type="file" />
                                        <p className="text-xs text-muted-foreground">
                                            Formatos aceitos: JPG, PNG, PDF. Tamanho máximo: 5MB
                                        </p>
                                    </div>
                                </form>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <p className="text-sm text-muted-foreground">Tempo médio de resposta: 24 horas</p>
                                <Button className="bg-[#1a1a2e] hover:bg-[#2d2d44]">
                                    <Send className="mr-2 h-4 w-4" /> Enviar Mensagem
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Outras Formas de Contacto</CardTitle>
                                <CardDescription>Entre em contacto conosco através de outros canais.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="flex flex-col items-center rounded-lg border p-4 text-center">
                                        <Phone className="mb-2 h-8 w-8 text-[#6941c6]" />
                                        <h3 className="mb-1 font-medium">Telefone</h3>
                                        <p className="text-sm">+351 210 123 456</p>
                                        <p className="text-xs text-muted-foreground">Seg-Sex, 9h-18h</p>
                                    </div>
                                    <div className="flex flex-col items-center rounded-lg border p-4 text-center">
                                        <Mail className="mb-2 h-8 w-8 text-[#6941c6]" />
                                        <h3 className="mb-1 font-medium">Email</h3>
                                        <p className="text-sm">suporte@neemble.com</p>
                                        <p className="text-xs text-muted-foreground">Resposta em até 24h</p>
                                    </div>
                                    <div className="flex flex-col items-center rounded-lg border p-4 text-center">
                                        <MessageSquare className="mb-2 h-8 w-8 text-[#6941c6]" />
                                        <h3 className="mb-1 font-medium">Chat ao Vivo</h3>
                                        <p className="text-sm">Disponível no site</p>
                                        <p className="text-xs text-muted-foreground">Seg-Sex, 9h-22h</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="knowledge" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Base de Conhecimento</CardTitle>
                                <CardDescription>
                                    Artigos e tutoriais para ajudar a utilizar a plataforma Neemble Eat.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    <div className="rounded-lg border p-4">
                                        <div className="mb-3 flex items-center gap-2">
                                            <BookOpen className="h-5 w-5 text-[#6941c6]" />
                                            <h3 className="font-medium">Primeiros Passos</h3>
                                        </div>
                                        <ul className="space-y-2 text-sm">
                                            <li className="rounded-md p-2 hover:bg-slate-50">
                                                <a href="#" className="block">
                                                    Configuração inicial do restaurante
                                                </a>
                                            </li>
                                            <li className="rounded-md p-2 hover:bg-slate-50">
                                                <a href="#" className="block">
                                                    Criando seu primeiro menu
                                                </a>
                                            </li>
                                            <li className="rounded-md p-2 hover:bg-slate-50">
                                                <a href="#" className="block">
                                                    Configurando mesas e QR codes
                                                </a>
                                            </li>
                                            <li className="rounded-md p-2 hover:bg-slate-50">
                                                <a href="#" className="block">
                                                    Processando seu primeiro pedido
                                                </a>
                                            </li>
                                        </ul>
                                        <Button variant="link" className="mt-2 h-auto p-0 text-[#6941c6]">
                                            Ver todos os artigos
                                        </Button>
                                    </div>
                                    <div className="rounded-lg border p-4">
                                        <div className="mb-3 flex items-center gap-2">
                                            <BookOpen className="h-5 w-5 text-[#6941c6]" />
                                            <h3 className="font-medium">Gestão de Pedidos</h3>
                                        </div>
                                        <ul className="space-y-2 text-sm">
                                            <li className="rounded-md p-2 hover:bg-slate-50">
                                                <a href="#" className="block">
                                                    Fluxo de trabalho de pedidos
                                                </a>
                                            </li>
                                            <li className="rounded-md p-2 hover:bg-slate-50">
                                                <a href="#" className="block">
                                                    Gerenciando pedidos em horários de pico
                                                </a>
                                            </li>
                                            <li className="rounded-md p-2 hover:bg-slate-50">
                                                <a href="#" className="block">
                                                    Configurando tempos de preparação
                                                </a>
                                            </li>
                                            <li className="rounded-md p-2 hover:bg-slate-50">
                                                <a href="#" className="block">
                                                    Lidando com cancelamentos
                                                </a>
                                            </li>
                                        </ul>
                                        <Button variant="link" className="mt-2 h-auto p-0 text-[#6941c6]">
                                            Ver todos os artigos
                                        </Button>
                                    </div>
                                    <div className="rounded-lg border p-4">
                                        <div className="mb-3 flex items-center gap-2">
                                            <BookOpen className="h-5 w-5 text-[#6941c6]" />
                                            <h3 className="font-medium">Pagamentos</h3>
                                        </div>
                                        <ul className="space-y-2 text-sm">
                                            <li className="rounded-md p-2 hover:bg-slate-50">
                                                <a href="#" className="block">
                                                    Configurando métodos de pagamento
                                                </a>
                                            </li>
                                            <li className="rounded-md p-2 hover:bg-slate-50">
                                                <a href="#" className="block">
                                                    Processamento de pagamentos online
                                                </a>
                                            </li>
                                            <li className="rounded-md p-2 hover:bg-slate-50">
                                                <a href="#" className="block">
                                                    Gerenciando reembolsos
                                                </a>
                                            </li>
                                            <li className="rounded-md p-2 hover:bg-slate-50">
                                                <a href="#" className="block">
                                                    Relatórios financeiros
                                                </a>
                                            </li>
                                        </ul>
                                        <Button variant="link" className="mt-2 h-auto p-0 text-[#6941c6]">
                                            Ver todos os artigos
                                        </Button>
                                    </div>
                                    <div className="rounded-lg border p-4">
                                        <div className="mb-3 flex items-center gap-2">
                                            <BookOpen className="h-5 w-5 text-[#6941c6]" />
                                            <h3 className="font-medium">Menu e Produtos</h3>
                                        </div>
                                        <ul className="space-y-2 text-sm">
                                            <li className="rounded-md p-2 hover:bg-slate-50">
                                                <a href="#" className="block">
                                                    Organizando categorias do menu
                                                </a>
                                            </li>
                                            <li className="rounded-md p-2 hover:bg-slate-50">
                                                <a href="#" className="block">
                                                    Adicionando modificadores e opções
                                                </a>
                                            </li>
                                            <li className="rounded-md p-2 hover:bg-slate-50">
                                                <a href="#" className="block">
                                                    Gerenciando disponibilidade de itens
                                                </a>
                                            </li>
                                            <li className="rounded-md p-2 hover:bg-slate-50">
                                                <a href="#" className="block">
                                                    Criando promoções e descontos
                                                </a>
                                            </li>
                                        </ul>
                                        <Button variant="link" className="mt-2 h-auto p-0 text-[#6941c6]">
                                            Ver todos os artigos
                                        </Button>
                                    </div>
                                    <div className="rounded-lg border p-4">
                                        <div className="mb-3 flex items-center gap-2">
                                            <BookOpen className="h-5 w-5 text-[#6941c6]" />
                                            <h3 className="font-medium">Equipe e Permissões</h3>
                                        </div>
                                        <ul className="space-y-2 text-sm">
                                            <li className="rounded-md p-2 hover:bg-slate-50">
                                                <a href="#" className="block">
                                                    Gerenciando funções da equipe
                                                </a>
                                            </li>
                                            <li className="rounded-md p-2 hover:bg-slate-50">
                                                <a href="#" className="block">
                                                    Configurando permissões de acesso
                                                </a>
                                            </li>
                                            <li className="rounded-md p-2 hover:bg-slate-50">
                                                <a href="#" className="block">
                                                    Monitorando atividades da equipe
                                                </a>
                                            </li>
                                            <li className="rounded-md p-2 hover:bg-slate-50">
                                                <a href="#" className="block">
                                                    Treinamento de novos membros
                                                </a>
                                            </li>
                                        </ul>
                                        <Button variant="link" className="mt-2 h-auto p-0 text-[#6941c6]">
                                            Ver todos os artigos
                                        </Button>
                                    </div>
                                    <div className="rounded-lg border p-4">
                                        <div className="mb-3 flex items-center gap-2">
                                            <BookOpen className="h-5 w-5 text-[#6941c6]" />
                                            <h3 className="font-medium">Integrações</h3>
                                        </div>
                                        <ul className="space-y-2 text-sm">
                                            <li className="rounded-md p-2 hover:bg-slate-50">
                                                <a href="#" className="block">
                                                    Integrando com serviços de delivery
                                                </a>
                                            </li>
                                            <li className="rounded-md p-2 hover:bg-slate-50">
                                                <a href="#" className="block">
                                                    Conectando com sistemas de contabilidade
                                                </a>
                                            </li>
                                            <li className="rounded-md p-2 hover:bg-slate-50">
                                                <a href="#" className="block">
                                                    Integrações com redes sociais
                                                </a>
                                            </li>
                                            <li className="rounded-md p-2 hover:bg-slate-50">
                                                <a href="#" className="block">
                                                    APIs e webhooks personalizados
                                                </a>
                                            </li>
                                        </ul>
                                        <Button variant="link" className="mt-2 h-auto p-0 text-[#6941c6]">
                                            Ver todos os artigos
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline" className="w-full">
                                    <Search className="mr-2 h-4 w-4" /> Pesquisar na base de conhecimento
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="chat" className="space-y-6">
                        <Card className="flex h-[600px] flex-col">
                            <CardHeader>
                                <CardTitle>Chat de Suporte</CardTitle>
                                <CardDescription>Converse em tempo real com nossa equipe de suporte.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-auto p-4">
                                <div className="space-y-4">
                                    {chatMessages.map((msg, index) => (
                                        <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                                            <div
                                                className={`max-w-[80%] rounded-lg p-3 ${
                                                    msg.sender === "user" ? "bg-[#1a1a2e] text-white" : "bg-slate-100 text-slate-900"
                                                }`}
                                            >
                                                <p className="text-sm">{msg.message}</p>
                                                <p
                                                    className={`mt-1 text-right text-xs ${
                                                        msg.sender === "user" ? "text-slate-300" : "text-slate-500"
                                                    }`}
                                                >
                                                    {msg.time}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter className="border-t p-4">
                                <div className="flex w-full items-center gap-2">
                                    <Input
                                        placeholder="Digite sua mensagem..."
                                        value={chatMessage}
                                        onChange={(e) => setChatMessage(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                    />
                                    <Button className="bg-[#1a1a2e] hover:bg-[#2d2d44]" onClick={handleSendMessage}>
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="tickets" className="space-y-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Meus Tickets</CardTitle>
                                    <CardDescription>Acompanhe o status dos seus tickets de suporte.</CardDescription>
                                </div>
                                <Button className="bg-[#1a1a2e] hover:bg-[#2d2d44]">
                                    <Ticket className="mr-2 h-4 w-4" /> Novo Ticket
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="rounded-lg border p-4">
                                        <div className="mb-2 flex items-center justify-between">
                                            <h3 className="font-medium">Problema com processamento de pagamentos</h3>
                                            <Badge className="bg-amber-500">Em andamento</Badge>
                                        </div>
                                        <p className="mb-2 text-sm text-muted-foreground">
                                            Estamos tendo problemas com o processamento de pagamentos via cartão de crédito. Os clientes
                                            relatam erros ao finalizar a compra.
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span>Ticket #2023-0584</span>
                                            <span>Atualizado: 25 de Fevereiro, 2023</span>
                                        </div>
                                    </div>
                                    <div className="rounded-lg border p-4">
                                        <div className="mb-2 flex items-center justify-between">
                                            <h3 className="font-medium">Solicitação de nova funcionalidade</h3>
                                            <Badge className="bg-blue-500">Aberto</Badge>
                                        </div>
                                        <p className="mb-2 text-sm text-muted-foreground">
                                            Gostaria de solicitar a implementação de um sistema de fidelidade para clientes frequentes.
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span>Ticket #2023-0492</span>
                                            <span>Atualizado: 20 de Fevereiro, 2023</span>
                                        </div>
                                    </div>
                                    <div className="rounded-lg border p-4">
                                        <div className="mb-2 flex items-center justify-between">
                                            <h3 className="font-medium">Dúvida sobre relatórios financeiros</h3>
                                            <Badge className="bg-green-500">Resolvido</Badge>
                                        </div>
                                        <p className="mb-2 text-sm text-muted-foreground">
                                            Preciso de ajuda para entender como exportar relatórios financeiros mensais em formato Excel.
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span>Ticket #2023-0421</span>
                                            <span>Atualizado: 15 de Fevereiro, 2023</span>
                                        </div>
                                    </div>
                                    <div className="rounded-lg border p-4">
                                        <div className="mb-2 flex items-center justify-between">
                                            <h3 className="font-medium">Erro ao adicionar novo membro à equipe</h3>
                                            <Badge className="bg-green-500">Resolvido</Badge>
                                        </div>
                                        <p className="mb-2 text-sm text-muted-foreground">
                                            Ao tentar adicionar um novo membro à equipe, recebo uma mensagem de erro "Email inválido".
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span>Ticket #2023-0387</span>
                                            <span>Atualizado: 10 de Fevereiro, 2023</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button variant="outline">Ver tickets arquivados</Button>
                                <div className="flex items-center gap-1">
                                    <Button variant="outline" size="icon">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-4 w-4"
                                        >
                                            <path d="m15 18-6-6 6-6" />
                                        </svg>
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        1
                                    </Button>
                                    <Button variant="outline" size="icon">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-4 w-4"
                                        >
                                            <path d="m9 18 6-6-6-6" />
                                        </svg>
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

