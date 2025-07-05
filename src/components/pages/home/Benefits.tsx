import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CheckCircle, Sparkles } from "lucide-react";

const benefitGroups = [
    {
        title: "Aumente sua eficiência",
        description:
            "Automatize pedidos e organize a cozinha com uma gestão mais fluida e menos erros.",
        items: [
            "Redução de erros nos pedidos",
            "Atendimento mais rápido com fila digital",
            "Gestão simplificada da cozinha"
        ]
    },
    {
        title: "Eleve seu faturamento",
        description:
            "Impulsione vendas com upsells estratégicos, promoções em tempo real e integração com apps.",
        items: [
            "Upsell inteligente no cardápio digital",
            "Promoções relâmpago em segundos",
            "Integração sem taxas com apps de entrega"
        ]
    },
    {
        title: "Encante seus clientes",
        description:
            "Ofereça uma experiência moderna, simples e agradável — da escolha ao pagamento.",
        items: [
            "Menu intuitivo com fotos saborosas",
            "Pagamentos sem contato e gorjeta fácil",
            "Feedback em tempo real na mesa"
        ]
    },
    {
        title: "Decisões orientadas por dados",
        description:
            "Use dados reais para prever demanda, ajustar operações e crescer com segurança.",
        items: [
            "Relatórios em tempo real",
            "Previsão de demanda baseada em IA",
            "Painel unificado de operações"
        ]
    }
];

export default function Benefits() {
    const [activeIndex, setActiveIndex] = useState(0);
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
    const y = useTransform(scrollYProgress, [0, 1], [0, 200]);

    return (
        <section ref={sectionRef} className="relative overflow-hidden bg-gray-50 py-24">
            {/* Decorative blurred gradient */}
            <motion.div
                aria-hidden="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="pointer-events-none absolute -top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gradient-to-br from-green-300 via-emerald-200 to-teal-100 blur-3xl"
            />

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-16 text-center text-3xl font-bold tracking-tight text-gray-900 md:text-4xl"
                >
                    Benefícios para seu negócio
                </motion.h2>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Cards */}
                    <div className="flex-1 space-y-6">
                        {benefitGroups.map((group, index) => (
                            <motion.button
                                key={group.title}
                                whileInView={{ opacity: 1, y: 0 }}
                                initial={{ opacity: 0, y: 30 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                onClick={() => setActiveIndex(index)}
                                className={`w-full text-left rounded-xl border p-5 shadow-sm transition hover:shadow-md ${
                                    activeIndex === index ? "border-green-500 bg-white" : "bg-gray-100"
                                }`}
                            >
                                <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-gray-900 md:text-xl">
                                    <Sparkles className="h-5 w-5 text-green-600" />
                                    {group.title}
                                </h3>
                                <p className="text-sm text-gray-700">{group.description}</p>
                            </motion.button>
                        ))}
                    </div>

                    {/* Animated Floating Details */}
                    <motion.div
                        style={{ y }}
                        className="hidden h-fit w-full max-w-xl flex-shrink-0 lg:block"
                    >
                        <motion.div
                            key={benefitGroups[activeIndex].title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="rounded-xl border bg-white p-6 shadow-lg"
                        >
                            <h4 className="mb-4 text-xl font-semibold text-gray-900">
                                {benefitGroups[activeIndex].title}
                            </h4>
                            <ul className="space-y-3">
                                {benefitGroups[activeIndex].items.map((item) => (
                                    <li key={item} className="flex items-start gap-3">
                                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-emerald-600" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
