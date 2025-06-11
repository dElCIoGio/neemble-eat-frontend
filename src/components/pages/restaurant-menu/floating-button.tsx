import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {useNavigate} from "react-router";
import { motion, AnimatePresence } from "framer-motion";



const FloatingCartButton = () => {
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="fixed bottom-8 right-8"
                >
                    <Button
                        onClick={() => navigate(`cart`)}
                        className="py-6 border-2 border-zinc-300 rounded-full shadow-lg bg-zinc-200 hover:bg-zinc-300"
                    >
                        <ShoppingCart className="w-6 h-6 text-black"/>
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default FloatingCartButton;


// navigate(`${URL_PATH_PREFIX}/c/${restaurant.id}/${menu.id}/${tableNumber}`)