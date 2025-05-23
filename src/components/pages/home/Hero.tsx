import {Button} from "@/components/ui/button.tsx";
import {NavLink} from "react-router";
import {motion} from "framer-motion";
import img from "@/../public/chef-hero.png"


export function Hero() {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
                initial={{opacity: 0, y: 50}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.8}}
            >
                <motion.div className="space-y-6">
                    <motion.h1
                        className="text-4xl md:text-5xl lg:text-6xl font-bold"
                        initial={{opacity: 0, y: -20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 1}}
                    >
                        <span
                            className="bg-gradient-to-r from-purple-200 to-purple-500 bg-clip-text text-transparent">
                            Modernize seu restaurante
                        </span>{" "}
                        com pedidos digitais
                    </motion.h1>
                    <motion.h2
                        className="text-gray-600 text-lg md:text-xl max-w-lg"
                        initial={{opacity: 0, y: -20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 1, delay: 0.2}}
                    >
                        Sistema completo de menu digital via QR code, gestão de pedidos e análises para seu
                        restaurante em Angola.
                        Aumente suas vendas e eficiência.
                    </motion.h2>
                    <motion.div
                        className="flex flex-col sm:flex-row gap-4"
                        initial={{opacity: 0, scale: 0.9}}
                        animate={{opacity: 1, scale: 1}}
                        transition={{duration: 0.8, delay: 0.4}}
                    >
                        <Button className="bg-zinc-700 hover:bg-zinc-600 text-white px-8 py-6 rounded-md">
                            Começar Gratuitamente
                        </Button>
                        <Button asChild variant="outline" className="px-8 py-6">
                            <NavLink to="demo">
                                Ver Demonstração
                            </NavLink>
                        </Button>
                    </motion.div>
                </motion.div>
                <motion.div
                    className="relative"
                    initial={{opacity: 0, y: 50}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.8, delay: 0.6}}
                >
                    <div className="relative w-full h-[500px] rounded-xl overflow-hidden">
                        <img
                            src={img}
                            alt="Aplicativo Neemble Eat em ação"
                            className="object-cover w-full h-full"
                        />
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}

