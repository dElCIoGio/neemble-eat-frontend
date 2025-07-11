import type React from "react"

import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { format, addMinutes, isWithinInterval, subMinutes } from "date-fns"
import { pt } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Booking } from "@/types/booking"
import { BookingUpdate } from "@/types/update-types"
import { useGetRestaurantUpcomingBookings } from "@/api/endpoints/booking/hooks"

interface EditBookingSheetProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (booking: BookingUpdate) => void
    booking: Booking
}

// Mesas disponíveis
const availableTables = [
    "Mesa 1",
    "Mesa 2",
    "Mesa 3",
    "Mesa 4",
    "Mesa 5",
    "Mesa 6",
    "Mesa 7",
    "Mesa 8",
    "Mesa 9",
    "Mesa 10",
    "Mesa 11",
    "Mesa 12",
    "Mesa 13",
    "Mesa 14",
    "Mesa 15",
]

// Ocasiões comuns
const commonOccasions = [
    "Jantar Romântico",
    "Jantar de Aniversário",
    "Almoço de Negócios",
    "Jantar em Família",
    "Celebração",
    "Encontro com Amigos",
    "Jantar Casual",
    "Almoço Casual",
    "Outro",
]

export function EditBookingSheet({ open, onOpenChange, onSubmit, booking }: EditBookingSheetProps) {
    const { data: existingBookings = [] } = useGetRestaurantUpcomingBookings({ restaurantId: booking.restaurantId })

    const [formData, setFormData] = useState<BookingUpdate>({
        tableId: booking.tableId,
        numberOfGuest: booking.numberOfGuest,
        firstName: booking.firstName,
        lastName: booking.lastName,
        phoneNumber: booking.phoneNumber,
        email: booking.email,
        occasion: booking.occasion,
        notes: booking.notes,
    })

    const [startDate, setStartDate] = useState<Date>(new Date(booking.startTime))
    const [startTime, setStartTime] = useState(format(new Date(booking.startTime), "HH:mm"))
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)
    const [duration, setDuration] = useState(
        Math.max(15, Math.round((new Date(booking.endTime).getTime() - new Date(booking.startTime).getTime()) / 60000))
    )
    const [errors, setErrors] = useState<Partial<Record<keyof BookingUpdate, string>>>({})

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof BookingUpdate, string>> = {}

        if (!formData.firstName.trim()) newErrors.firstName = "Nome é obrigatório"
        if (!formData.lastName.trim()) newErrors.lastName = "Apelido é obrigatório"
        if (!formData.email.trim()) newErrors.email = "Email é obrigatório"
        if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Telefone é obrigatório"
        if (!formData.tableId) newErrors.tableId = "Mesa é obrigatória"
        if (!formData.occasion) newErrors.occasion = "Ocasião é obrigatória"
        if (formData.numberOfGuest < 1) newErrors.numberOfGuest = "Número de pessoas deve ser pelo menos 1"
        if (!startDate || !startTime) newErrors.startTime = "Data e hora de início são obrigatórias"

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = "Email inválido"
        }

        // Validar telefone português
        const phoneRegex = /^(\+244\s?)?[0-9]{9}$/
        if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber.replace(/\s/g, ""))) {
            newErrors.phoneNumber = "Telefone inválido (formato: +351 912345678)"
        }

        // Validar sobreposição de reservas
        if (startDate && startTime && formData.tableId) {
            const startDateTime = new Date(startDate)
            const [startHour, startMinute] = startTime.split(":")
            startDateTime.setHours(Number.parseInt(startHour), Number.parseInt(startMinute))
            
            const endDateTime = addMinutes(startDateTime, duration)
            
            // Verificar sobreposição com reservas existentes
            const hasOverlap = existingBookings.some((booking: Booking) => {
                if (booking.tableId !== formData.tableId) return false
                
                const bookingStart = new Date(booking.startTime)
                const bookingEnd = new Date(booking.endTime)
                
                // Adicionar 15 minutos de buffer antes e depois
                const bookingStartWithBuffer = subMinutes(bookingStart, 15)
                const bookingEndWithBuffer = addMinutes(bookingEnd, 15)
                
                return (
                    isWithinInterval(startDateTime, { start: bookingStartWithBuffer, end: bookingEndWithBuffer }) ||
                    isWithinInterval(endDateTime, { start: bookingStartWithBuffer, end: bookingEndWithBuffer }) ||
                    isWithinInterval(bookingStart, { start: startDateTime, end: endDateTime })
                )
            })
            
            if (hasOverlap) {
                newErrors.startTime = "Esta mesa já tem uma reserva neste horário"
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        // Combinar data e hora
        const startDateTime = new Date(startDate!)
        const [startHour, startMinute] = startTime.split(":")
        startDateTime.setHours(Number.parseInt(startHour), Number.parseInt(startMinute))

        const endDateTime = addMinutes(startDateTime, duration)

        const bookingData: BookingUpdate = {
            ...formData,
            startTime: startDateTime.toISOString(),
            endTime: endDateTime.toISOString(),
        }

        onSubmit(bookingData)
        resetForm()
    }

    const resetForm = () => {
        setFormData({
            tableId: booking.tableId,
            numberOfGuest: booking.numberOfGuest,
            firstName: booking.firstName,
            lastName: booking.lastName,
            phoneNumber: booking.phoneNumber,
            email: booking.email,
            occasion: booking.occasion,
            notes: booking.notes,
        })
        setStartDate(new Date(booking.startTime))
        setStartTime(format(new Date(booking.startTime), "HH:mm"))
        setDuration(Math.max(15, Math.round((new Date(booking.endTime).getTime() - new Date(booking.startTime).getTime()) / 60000)))
        setErrors({})
    }

    const handleInputChange = (field: keyof BookingUpdate, value: string | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        // Limpar erro quando o utilizador começar a digitar
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }))
        }
    }

    const handleDurationChange = (minutes: number) => {
        setDuration(minutes)
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetHeader>
                    <SheetTitle>Editar Reserva</SheetTitle>
                    <SheetDescription>Altere as informações da reserva selecionada.</SheetDescription>
                </SheetHeader>
                <SheetContent className="sm:max-w-lg py-8 px-4 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                    {/* Informações do Cliente */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg border-b pb-2">Informações do Cliente</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">Nome *</Label>
                                <Input
                                    id="firstName"
                                    value={formData.firstName}
                                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                                    placeholder="João"
                                    className={errors.firstName ? "border-red-500" : ""}
                                />
                                {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="lastName">Apelido *</Label>
                                <Input
                                    id="lastName"
                                    value={formData.lastName}
                                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                                    placeholder="Silva"
                                    className={errors.lastName ? "border-red-500" : ""}
                                />
                                {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                placeholder="joao.silva@email.com"
                                className={errors.email ? "border-red-500" : ""}
                            />
                            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber">Telefone *</Label>
                            <Input
                                id="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                                placeholder="+351 912 345 678"
                                className={errors.phoneNumber ? "border-red-500" : ""}
                            />
                            {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
                        </div>
                    </div>

                    {/* Detalhes da Reserva */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg border-b pb-2">Detalhes da Reserva</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Data de Início *</Label>
                                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !startDate && "text-muted-foreground",
                                                errors.startTime && "border-red-500",
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {startDate ? format(startDate, "dd/MM/yyyy", { locale: pt }) : "Selecionar data"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent 
                                        className="w-auto p-0 z-50" 
                                        align="start"
                                        side="bottom"
                                        sideOffset={4}
                                    >
                                        <div className="p-3 bg-background">
                                            <Calendar
                                                mode="single"
                                                selected={startDate}
                                                onSelect={(date) => {
                                                    if (date) {
                                                        setStartDate(date)
                                                        setIsCalendarOpen(false)
                                                    }
                                                }}
                                                locale={pt}
                                                disabled={(date) => date < new Date()}
                                                className="rounded-md border"
                                            />
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="startTime">Hora de Início *</Label>
                                <Input
                                    id="startTime"
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className={errors.startTime ? "border-red-500" : ""}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="duration">Duração da Reserva *</Label>
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDurationChange(Math.max(15, duration - 15))}
                                >
                                    -
                                </Button>
                                <div className="flex-1 text-center">
                                    {duration} minutos
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDurationChange(Math.min(240, duration + 15))}
                                >
                                    +
                                </Button>
                            </div>
                        </div>

                        {errors.startTime && <p className="text-sm text-red-500">{errors.startTime}</p>}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="numberOfGuest">Nº de Pessoas *</Label>
                                <Input
                                    id="numberOfGuest"
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={formData.numberOfGuest}
                                    onChange={(e) => handleInputChange("numberOfGuest", Number.parseInt(e.target.value) || 1)}
                                    className={errors.numberOfGuest ? "border-red-500" : ""}
                                />
                                {errors.numberOfGuest && <p className="text-sm text-red-500">{errors.numberOfGuest}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tableId">Mesa *</Label>
                                <Select value={formData.tableId} onValueChange={(value) => handleInputChange("tableId", value)}>
                                    <SelectTrigger className={errors.tableId ? "border-red-500" : ""}>
                                        <SelectValue placeholder="Selecionar mesa" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableTables.map((table) => (
                                            <SelectItem key={table} value={table}>
                                                {table}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.tableId && <p className="text-sm text-red-500">{errors.tableId}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="occasion">Ocasião *</Label>
                            <Select value={formData.occasion} onValueChange={(value) => handleInputChange("occasion", value)}>
                                <SelectTrigger className={errors.occasion ? "border-red-500" : ""}>
                                    <SelectValue placeholder="Selecionar ocasião" />
                                </SelectTrigger>
                                <SelectContent>
                                    {commonOccasions.map((occasion) => (
                                        <SelectItem key={occasion} value={occasion}>
                                            {occasion}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.occasion && <p className="text-sm text-red-500">{errors.occasion}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">Notas</Label>
                            <Textarea
                                id="notes"
                                value={formData.notes}
                                onChange={(e) => handleInputChange("notes", e.target.value)}
                                placeholder="Observações especiais, alergias, preferências..."
                                rows={3}
                            />
                        </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex gap-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                            Cancelar
                        </Button>
                        <Button type="submit" className="flex-1">
                            Salvar Alterações
                        </Button>
                    </div>
                </form>
                </SheetContent>
        </Sheet>
    )
}
