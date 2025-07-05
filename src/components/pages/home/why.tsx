import { motion } from "framer-motion";


function WhyNeembleEat() {
    return (
        <section className="relative bg-white py-24">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl mb-14"
                >
                    Por que restaurantes modernos escolhem a gente?
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {[
                        {
                            title: "Feito para o dia a dia real",
                            text: "Desenvolvido com e para restaurantes locais. Sabemos como é a correria."
                        },
                        {
                            title: "Suporte humano, de verdade",
                            text: "Equipe disponível para treinar, ajudar e acompanhar sua evolução. Você não está sozinho."
                        },
                        {
                            title: "Tecnologia invisível",
                            text: "A experiência é digital, mas o toque continua humano. Simples, fluido e sem complicações."
                        },
                        {
                            title: "Resultados desde o primeiro mês",
                            text: "Aumente o ticket médio, reduza filas e veja seus números crescerem com pouco esforço."
                        },
                        {
                            title: "Atualizações constantes",
                            text: "Evoluímos com você. Toda semana, melhorias e novidades pensadas para o seu negócio."
                        },
                        {
                            title: "Confiança de quem já usa",
                            text: "Usado diariamente por restaurantes premiados e gestores exigentes — e recomendado com orgulho."
                        }
                    ].map((item) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -4, boxShadow: '0 6px 16px rgba(0,0,0,0.08)' }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="rounded-xl border bg-gray-50 p-6 shadow-sm transition-transform"
                        >
                            <h3 className="text-xl font-semibold mb-2 text-green-700">{item.title}</h3>
                            <p className="text-sm text-gray-700">{item.text}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default WhyNeembleEat;
