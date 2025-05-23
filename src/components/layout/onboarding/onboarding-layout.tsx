import type { ReactNode } from "react"
import { GalleryVerticalEnd } from "lucide-react"

interface OnboardingLayoutProps {
    children: ReactNode
}

export function OnboardingLayout({ children }: OnboardingLayoutProps) {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            {/* Content side */}
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <a href="#" className="flex items-center gap-2 font-medium">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                            <GalleryVerticalEnd className="size-4" />
                        </div>
                        <span className="text-lg font-bold">Neemble Eat</span>
                    </a>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-md">{children}</div>
                </div>
            </div>

            {/* Image side */}
            <div className="relative hidden bg-muted lg:block">
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 p-10">
                    <div className="max-w-md space-y-8 text-center">
                        <h2 className="text-3xl font-bold tracking-tight">Bem-vindo ao Neemble Eat</h2>
                        <p className="text-lg text-muted-foreground">
                            Conectando restaurantes e clientes para uma experiência gastronômica incrível.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                                <h3 className="font-medium">Gestão Simplificada</h3>
                                <p className="text-sm text-muted-foreground">Gerencie seu restaurante com facilidade</p>
                            </div>
                            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                                <h3 className="font-medium">Mais Clientes</h3>
                                <p className="text-sm text-muted-foreground">Aumente sua visibilidade e vendas</p>
                            </div>
                            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                                <h3 className="font-medium">Análises Detalhadas</h3>
                                <p className="text-sm text-muted-foreground">Dados para decisões inteligentes</p>
                            </div>
                            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                                <h3 className="font-medium">Suporte 24/7</h3>
                                <p className="text-sm text-muted-foreground">Estamos sempre aqui para ajudar</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
