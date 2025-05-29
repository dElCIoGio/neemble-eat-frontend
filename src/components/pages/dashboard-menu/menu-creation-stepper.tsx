
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface MenuCreationStepperProps {
  currentStep: number
}

const steps = [
  { number: 1, title: "Menu Details", description: "Basic information" },
  { number: 2, title: "Categories", description: "Organize items" },
  { number: 3, title: "Menu Items", description: "Add products" },
  { number: 4, title: "Review", description: "Finalize menu" },
]

export function MenuCreationStepper({ currentStep }: MenuCreationStepperProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium",
                  currentStep > step.number
                    ? "border-primary bg-primary text-primary-foreground"
                    : currentStep === step.number
                      ? "border-primary bg-background text-primary"
                      : "border-muted-foreground/25 bg-background text-muted-foreground",
                )}
              >
                {currentStep > step.number ? <Check className="h-5 w-5" /> : step.number}
              </div>
              <div className="mt-2 text-center">
                <div
                  className={cn(
                    "text-sm font-medium",
                    currentStep >= step.number ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {step.title}
                </div>
                <div className="text-xs text-muted-foreground">{step.description}</div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "mx-4 h-0.5 w-16 flex-1",
                  currentStep > step.number ? "bg-primary" : "bg-muted-foreground/25",
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
