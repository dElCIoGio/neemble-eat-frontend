import type React from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import {toast} from "sonner";
import {restaurantApi} from "@/api/endpoints/restaurants/requests";
import {useNavigate} from "react-router-dom";

// Zod schema for validation
const restaurantCreateSchema = z.object({
    name: z.string().min(1, "Nome do restaurante é obrigatório").min(2, "Nome deve ter pelo menos 2 caracteres"),
    address: z.string().min(1, "Endereço é obrigatório").min(5, "Por favor, insira um endereço completo"),
    description: z.string().min(1, "Descrição é obrigatória").min(10, "Descrição deve ter pelo menos 10 caracteres"),
    phoneNumber: z
        .string()
        .min(1, "Número de telefone é obrigatório")
        .regex(/^[+]?[1-9][\d]{0,15}$/, "Por favor, insira um número de telefone válido"),
    bannerFile: z
        .instanceof(File, { message: "Imagem de banner é obrigatória" })
        .refine((file) => file.size <= 5 * 1920 * 1080, "Imagem de banner deve ter menos de 5MB")
        .refine(
            (file) => ["image/jpeg", "image/jpg", "image/png"].includes(file.type),
            "Banner deve ser uma imagem PNG ou JPG",
        ),
    logoFile: z
        .instanceof(File)
        .refine((file) => file.size <= 5 * 1024 * 1024, "Imagem de logo deve ter menos de 5MB")
        .refine(
            (file) => ["image/jpeg", "image/jpg", "image/png"].includes(file.type),
            "Logo deve ser uma imagem PNG ou JPG",
        )
        .refine(
            (file) => {
                return new Promise<boolean>((resolve) => {
                    const reader = new FileReader()
                    reader.onload = (e) => {
                        const img = new Image()
                        img.onload = () => {
                            const isValid = img.width <= 500 && img.height <= 500
                            resolve(isValid)
                        }
                        img.onerror = () => {
                            resolve(false)
                        }
                        if (e.target?.result) {
                            img.src = e.target.result as string
                        } else {
                            resolve(false)
                        }
                    }
                    reader.onerror = () => {
                        resolve(false)
                    }
                    reader.readAsDataURL(file)
                })
            },
            "Logo deve ter no máximo 500x500 pixels"
        )
        .optional(),
    settings: z.object({
        openingHours: z.object({
            monday: z
                .string()
                .regex(
                    /^([01]?[0-9]|2[0-3]):[0-5][0-9]-([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
                    "Formato: HH:mm-HH:mm (ex: 09:00-22:00)",
                )
                .optional()
                .or(z.literal("")),
            tuesday: z
                .string()
                .regex(
                    /^([01]?[0-9]|2[0-3]):[0-5][0-9]-([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
                    "Formato: HH:mm-HH:mm (ex: 09:00-22:00)",
                )
                .optional()
                .or(z.literal("")),
            wednesday: z
                .string()
                .regex(
                    /^([01]?[0-9]|2[0-3]):[0-5][0-9]-([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
                    "Formato: HH:mm-HH:mm (ex: 09:00-22:00)",
                )
                .optional()
                .or(z.literal("")),
            thursday: z
                .string()
                .regex(
                    /^([01]?[0-9]|2[0-3]):[0-5][0-9]-([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
                    "Formato: HH:mm-HH:mm (ex: 09:00-22:00)",
                )
                .optional()
                .or(z.literal("")),
            friday: z
                .string()
                .regex(
                    /^([01]?[0-9]|2[0-3]):[0-5][0-9]-([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
                    "Formato: HH:mm-HH:mm (ex: 09:00-22:00)",
                )
                .optional()
                .or(z.literal("")),
            saturday: z
                .string()
                .regex(
                    /^([01]?[0-9]|2[0-3]):[0-5][0-9]-([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
                    "Formato: HH:mm-HH:mm (ex: 09:00-22:00)",
                )
                .optional()
                .or(z.literal("")),
            sunday: z
                .string()
                .regex(
                    /^([01]?[0-9]|2[0-3]):[0-5][0-9]-([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
                    "Formato: HH:mm-HH:mm (ex: 09:00-22:00)",
                )
                .optional()
                .or(z.literal("")),
        }),
    }),
})

type RestaurantCreate = z.infer<typeof restaurantCreateSchema>

type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"

type Step = {
    id: number
    title: string
    description: string
}

type FileFieldName = "bannerFile" | "logoFile"

const daysOfWeek: Array<{ key: DayOfWeek; label: string }> = [
    { key: "monday", label: "Segunda-feira" },
    { key: "tuesday", label: "Terça-feira" },
    { key: "wednesday", label: "Quarta-feira" },
    { key: "thursday", label: "Quinta-feira" },
    { key: "friday", label: "Sexta-feira" },
    { key: "saturday", label: "Sábado" },
    { key: "sunday", label: "Domingo" },
] as const

const steps: Step[] = [
    { id: 0, title: "Informações Básicas", description: "Preencha os detalhes básicos do seu restaurante" },
    { id: 1, title: "Imagens", description: "Adicione imagens do seu restaurante" },
    { id: 2, title: "Horário de Funcionamento", description: "Defina os horários de funcionamento" },
]

interface ProgressIndicatorProps {
    currentStep: number
    steps: Step[]
}

function ProgressIndicator({ currentStep, steps }: ProgressIndicatorProps) {
    return (
        <div className="w-full mb-8">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                        <div className="flex flex-col items-center">
                            <div
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                                    index < currentStep
                                        ? "bg-primary text-primary-foreground"
                                        : index === currentStep
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-muted-foreground",
                                )}
                            >
                                {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
                            </div>
                            <div className="mt-2 text-center">
                                <div className="text-sm font-medium">{step.title}</div>
                                <div className="text-xs text-muted-foreground hidden sm:block">{step.description}</div>
                            </div>
                        </div>
                        {index < steps.length - 1 && (
                            <div
                                className={cn("flex-1 h-0.5 mx-4 transition-colors", index < currentStep ? "bg-primary" : "bg-muted")}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function CreateRestaurantPage() {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [currentStep, setCurrentStep] = useState<number>(0)

    const form = useForm<RestaurantCreate>({
        resolver: zodResolver(restaurantCreateSchema),
        defaultValues: {
            name: "",
            address: "",
            description: "",
            phoneNumber: "",
            settings: {
                openingHours: {
                    monday: "",
                    tuesday: "",
                    wednesday: "",
                    thursday: "",
                    friday: "",
                    saturday: "",
                    sunday: "",
                },
            },
        },
        mode: "onChange",
    })

    const navigate = useNavigate()

    // Placeholder function for restaurant creation
    const onCreateRestaurant = async (formData: RestaurantCreate): Promise<void> => {
        const data = new FormData()
        
        // Add basic information
        data.append("name", formData.name)
        data.append("address", formData.address)
        data.append("description", formData.description)
        data.append("phone_number", formData.phoneNumber)
        
        // Add files
        data.append("banner_file", formData.bannerFile)
        if (formData.logoFile) {
            data.append("logo_file", formData.logoFile)
        }
        
        // Add opening hours
        Object.entries(formData.settings.openingHours).forEach(([day, hours]) => {
            data.append(`opening_hours[${day}]`, hours)
        })

        await restaurantApi.createRestaurant(data)

        navigate("/dashboard")

        toast.success("Restaurante Criado!", {
            description: `${formData.name} foi criado com sucesso.`,
        })
    }

    const onSubmit = async (values: RestaurantCreate): Promise<void> => {
        try {
            setIsSubmitting(true)
            await onCreateRestaurant(values)
            form.reset()
            setCurrentStep(0)
        } catch (error) {
            console.error(error)
            toast.error("Erro", {
                description: "Falha ao criar restaurante. Por favor, tente novamente.",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, fieldName: FileFieldName): void => {
        const file = event.target.files?.[0]
        if (file) {
            form.setValue(fieldName, file)
            form.trigger(fieldName)
        }
    }

    const nextStep = async (): Promise<void> => {
        let fieldsToValidate: (keyof RestaurantCreate)[] = []

        // Define which fields to validate for each step
        switch (currentStep) {
            case 0:
                fieldsToValidate = ["name", "address", "description", "phoneNumber"]
                break
            case 1:
                fieldsToValidate = ["bannerFile", "logoFile"]
                break
            default:
                break
        }

        const result = await form.trigger(fieldsToValidate)
        if (result) {
            setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
        }
    }

    const prevStep = (): void => {
        setCurrentStep((prev) => Math.max(prev - 1, 0))
    }

    const renderStepContent = (): React.ReactNode => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome do Restaurante</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Digite o nome do restaurante" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Endereço</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Digite o endereço completo" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descrição</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Descreva seu restaurante, tipo de culinária, ambiente, etc."
                                            className="min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Número de Telefone</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Digite o número de telefone" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                )

            case 1:
                return (
                    <div className="space-y-6">
                        <FormField
                            control={form.control}
                            name="bannerFile"
                            render={({ field: { ref, name, onBlur } }) => (
                                <FormItem>
                                    <FormLabel>Imagem de Banner</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="file"
                                            accept="image/png,image/jpeg,image/jpg"
                                            onChange={(e) => handleFileChange(e, "bannerFile")}
                                            ref={ref}
                                            name={name}
                                            onBlur={onBlur}
                                        />
                                    </FormControl>
                                    <FormDescription>Envie uma imagem de banner para seu restaurante (PNG/JPG, máx 5MB)</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="logoFile"
                            render={({ field: { ref, name, onBlur } }) => (
                                <FormItem>
                                    <FormLabel>Imagem de Logo (Opcional)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="file"
                                            accept="image/png,image/jpeg,image/jpg"
                                            onChange={(e) => handleFileChange(e, "logoFile")}
                                            ref={ref}
                                            name={name}
                                            onBlur={onBlur}
                                        />
                                    </FormControl>
                                    <FormDescription>Envie um logo para seu restaurante (PNG/JPG, máx 5MB)</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                )

            case 2:
                return (
                    <div className="space-y-6">
                        <div>
                            <p className="text-sm text-muted-foreground mb-4">
                                Digite os horários no formato 24 horas (ex: 09:00-22:00). Deixe em branco para dias fechados.
                            </p>
                        </div>

                        <div className="grid gap-4">
                            {daysOfWeek.map((day) => (
                                <FormField
                                    key={day.key}
                                    control={form.control}
                                    name={`settings.openingHours.${day.key}`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{day.label}</FormLabel>
                                            <FormControl>
                                                <Input placeholder="09:00-22:00 (ou deixe em branco se fechado)" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <div className="mx-auto w-full">
            <ProgressIndicator currentStep={currentStep} steps={steps} />

            <Card>
                <CardHeader className="bg-transparent">
                    <CardTitle className="text-2xl">{steps[currentStep].title}</CardTitle>
                    <CardDescription>{steps[currentStep].description}</CardDescription>
                </CardHeader>
                <CardContent className="bg-transparent">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            {renderStepContent()}
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex justify-between bg-transparent">
                    {currentStep > 0 ? (
                        <Button type="button" variant="outline" onClick={prevStep} className="flex items-center gap-2">
                            <ChevronLeft className="h-4 w-4" /> Voltar
                        </Button>
                    ) : (
                        <div></div>
                    )}

                    {currentStep < steps.length - 1 ? (
                        <Button type="button" onClick={nextStep} className="flex items-center gap-2">
                            Próximo <ChevronRight className="h-4 w-4" />
                        </Button>
                    ) : (
                        <Button type="button" onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
                            {isSubmitting ? "Criando Restaurante..." : "Criar Restaurante"}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}
