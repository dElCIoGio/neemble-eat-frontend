import {UtensilsCrossed} from "lucide-react"

import {Button} from "@/components/ui/button"
import {Link} from "react-router";

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background">
            <div className="container flex max-w-md flex-col items-center justify-center space-y-6 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    <UtensilsCrossed className="h-10 w-10 text-muted-foreground"/>
                </div>

                <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">404</h1>
                    <h2 className="text-3xl font-semibold tracking-tight">Página não encontrada</h2>
                    <p className="text-muted-foreground">Ops! Parece que este prato não está no nosso menu.</p>
                </div>

                <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
                    <Button asChild size="sm">
                        <Link to="/">
                            Voltar para a página inicial
                        </Link>
                    </Button>
                    <Button variant="outline" className="hidden" size="sm" asChild>
                        <Link to="/menu">
                            Ver Menu
                        </Link>
                    </Button>
                </div>

                <div className="mt-8">
                    <p className="text-sm text-muted-foreground">
                        <span className="font-semibold">Neemble Eat</span>
                    </p>
                </div>
            </div>
        </div>
    )
}
