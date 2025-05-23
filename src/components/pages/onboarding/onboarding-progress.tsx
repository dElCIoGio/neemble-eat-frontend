interface OnboardingProgressProps {
    currentStep: number
    totalSteps: number
}

export function OnboardingProgress({ currentStep, totalSteps }: OnboardingProgressProps) {
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between">
                <div className="text-sm font-medium">
                    Passo {currentStep + 1} de {totalSteps}
                </div>
                <div className="text-sm text-muted-foreground">
                    {Math.round(((currentStep + 1) / totalSteps) * 100)}% completo
                </div>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                    className="h-full bg-primary transition-all duration-500 ease-in-out"
                    style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                />
            </div>
        </div>
    )
}
