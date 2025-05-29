import { Loader2 } from "lucide-react"
import {OnboardingLayout} from "@/components/layout/onboarding/onboarding-layout";

export function LoadingScreen() {
    return (
        <OnboardingLayout>
            <div className="flex flex-col items-center justify-center space-y-4 py-20">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <h3 className="text-xl font-medium">Carregando...</h3>
                <p className="text-center text-muted-foreground">Estamos preparando sua experiência personalizada</p>
            </div>
        </OnboardingLayout>
    )
}
