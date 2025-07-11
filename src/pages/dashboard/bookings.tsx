import { useState } from "react"
import { format } from "date-fns"
import { pt } from "date-fns/locale"
import { Calendar as CalendarIcon, Clock, Mail, MapPin, Phone, Search, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import type { Booking, NewBooking } from "@/types/booking"
import type { BookingUpdate } from "@/types/update-types"
import { NewBookingSheet } from "@/components/pages/dashboard-booking/new-booking-sheet"
import { EditBookingSheet } from "@/components/pages/dashboard-booking/edit-booking-sheet"
import {useDashboardContext} from "@/context/dashboard-context";
import {useCreateBooking, useGetRestaurantBookingsByDate, useUpdateBooking} from "@/api/endpoints/booking/hooks";



export default function ReservationsPage() {

    const { restaurant } = useDashboardContext()

    const [selectedDate, setSelectedDate] = useState<Date>()

    const {
        data: reservations = [],
        addBooking,
        updateBooking: updateBookingCache,
    } = useGetRestaurantBookingsByDate({ restaurantId: restaurant._id, date: selectedDate })

    const { mutate: createBooking } = useCreateBooking()
    const { mutate: updateBooking } = useUpdateBooking()

    const [selectedReservation, setSelectedReservation] = useState<Booking | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterByGuests, setFilterByGuests] = useState<string>("all")
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [isNewBookingOpen, setIsNewBookingOpen] = useState(false)
    const [isEditBookingOpen, setIsEditBookingOpen] = useState(false)
    const [isDateOpen, setIsDateOpen] = useState(false)

    // Filtrar reservas baseado na pesquisa e filtros
    const filteredReservations = reservations.filter((reservation) => {
        const matchesSearch =
            `${reservation.firstName} ${reservation.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reservation.email.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesGuestFilter =
            filterByGuests === "all" ||
            (filterByGuests === "1-2" && reservation.numberOfGuest <= 2) ||
            (filterByGuests === "3-4" && reservation.numberOfGuest >= 3 && reservation.numberOfGuest <= 4) ||
            (filterByGuests === "5+" && reservation.numberOfGuest >= 5)

        return matchesSearch && matchesGuestFilter
    })



    const handleReservationClick = (reservation: Booking) => {
        setSelectedReservation(reservation)
        setIsSheetOpen(true)
    }

    const handleNewBooking = (newBooking: NewBooking) => {
        createBooking(newBooking, {
            onSuccess: (booking) => {
                addBooking(booking)
                setIsNewBookingOpen(false)
            }
        })
    }

    const handleEditBooking = (data: BookingUpdate) => {
        if (!selectedReservation) return
        updateBooking({ bookingId: selectedReservation._id, data }, {
            onSuccess: (updated) => {
                updateBookingCache(updated)
                setIsEditBookingOpen(false)
            }
        })
    }

    return (
        <div className="mx-auto w-full space-y-6">
            {/* Cabeçalho */}
            <div className="flex justify-end space-y-2 sm:space-y-0">
                <Button size="sm" onClick={() => setIsNewBookingOpen(true)} className="sm:w-auto">
                    + Nova Reserva
                </Button>
            </div>

            {/* Filtros e Pesquisa */}
            <Card>
                <CardHeader>
                    <CardTitle>Filtros</CardTitle>
                    <CardDescription>Pesquise e filtre as reservas por critérios específicos.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 space-y-2.5">
                            <Label htmlFor="search">Pesquisar por nome ou email</Label>
                            <div className="relative my-1">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="search"
                                    placeholder="Digite o nome ou email do cliente..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="sm:w-48 space-y-2.5">
                            <Label htmlFor="guests-filter">Filtrar por nº de pessoas</Label>
                            <Select value={filterByGuests} onValueChange={setFilterByGuests}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Todas" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas</SelectItem>
                                    <SelectItem value="1-2">1-2 pessoas</SelectItem>
                                    <SelectItem value="3-4">3-4 pessoas</SelectItem>
                                    <SelectItem value="5+">5+ pessoas</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="sm:w-48 space-y-2.5">
                            <Label>Data</Label>
                            <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: pt }) : "Selecionar"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start" side="bottom" sideOffset={4}>
                                    <div className="p-3 bg-background">
                                        <Calendar
                                            mode="single"
                                            selected={selectedDate}
                                            onSelect={(date) => setSelectedDate(date)}
                                            locale={pt}
                                            className="rounded-md border"
                                        />
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabela de Reservas */}
            <Card>
                <CardHeader>
                    <CardTitle>Lista de Reservas</CardTitle>
                    <CardDescription>{filteredReservations.length} reserva(s) encontrada(s)</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Data e Hora</TableHead>
                                    <TableHead className="text-center">Pessoas</TableHead>
                                    <TableHead>Ocasião</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredReservations.map((reservation) => (
                                    <TableRow
                                        key={reservation._id}
                                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                                        onClick={() => handleReservationClick(reservation)}
                                    >
                                        <TableCell className="font-medium">
                                            {reservation.firstName} {reservation.lastName}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                                {format(new Date(reservation.startTime), "dd/MM/yyyy", { locale: pt })}
                                                <Clock className="h-4 w-4 text-muted-foreground ml-2" />
                                                {format(new Date(reservation.startTime), "HH:mm", { locale: pt })}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <Users className="h-4 w-4 text-muted-foreground" />
                                                {reservation.numberOfGuest}
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-[200px] truncate">{reservation.occasion}</TableCell>
                                    </TableRow>
                                ))}
                                {filteredReservations.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                            Nenhuma reserva encontrada com os critérios selecionados.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Sheet com Detalhes da Reserva */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>

                    <SheetHeader className={`px-4 ${!isSheetOpen && "hidden"}`}>
                        <SheetTitle>Detalhes da Reserva</SheetTitle>
                        <SheetDescription>Informações completas sobre a reserva selecionada.</SheetDescription>
                    </SheetHeader>
                    <SheetContent className="sm:px-4 flex flex-col py-8">
                        <div className="overflow-auto">
                        {selectedReservation && (
                            <div className="space-y-6">
                                {/* Informações do Cliente */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-lg border-b pb-2">Informações do Cliente</h3>

                                    <div className="space-y-3">
                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">Nome Completo</Label>
                                            <p className="text-sm font-medium">
                                                {selectedReservation.firstName} {selectedReservation.lastName}
                                            </p>
                                        </div>

                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">Contacto Telefónico</Label>
                                            <div className="flex items-center gap-2">
                                                <Phone className="text-purple-600 h-4 w-4" />
                                                <p className="text-sm">{selectedReservation.phoneNumber}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                                            <div className="flex items-center gap-2">
                                                <Mail className="text-purple-600 h-4 w-4" />
                                                <p className="text-sm">{selectedReservation.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Detalhes da Reserva */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-lg border-b pb-2">Detalhes da Reserva</h3>

                                    <div className="space-y-3">
                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">Data e Hora de Início</Label>
                                            <div className="flex items-center gap-2">
                                                <CalendarIcon className="text-purple-600 h-4 w-4 " />
                                                <p className="text-sm">
                                                    {format(new Date(selectedReservation.startTime), "dd/MM/yyyy 'às' HH:mm", { locale: pt })}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">Data e Hora de Fim</Label>
                                            <div className="flex items-center gap-2">
                                                <Clock className="text-purple-600 h-4 w-4" />
                                                <p className="text-sm">
                                                    {format(new Date(selectedReservation.endTime), "dd/MM/yyyy 'às' HH:mm", { locale: pt })}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">Número de Pessoas</Label>
                                            <div className="flex items-center gap-2">
                                                <Users className="text-purple-600 h-4 w-4 " />
                                                <p className="text-sm">{selectedReservation.numberOfGuest} pessoa(s)</p>
                                            </div>
                                        </div>

                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">Mesa Reservada</Label>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-purple-600" />
                                                <p className="text-sm">{selectedReservation.tableId}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">Ocasião</Label>
                                            <p className="text-sm">{selectedReservation.occasion}</p>
                                        </div>

                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">Notas</Label>
                                            <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">{selectedReservation.notes}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Botões de Ação */}
                                <div className="space-y-3 pt-4 border-t">
                                    <Button className="w-full" variant="default" onClick={() => { setIsSheetOpen(false); setIsEditBookingOpen(true); }}>
                                        Editar Reserva
                                    </Button>
                                    <Button className="w-full" variant="destructive">
                                        Cancelar Reserva
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    </SheetContent>
            </Sheet>

            {/* Nova Reserva Sheet */}
            <NewBookingSheet
                open={isNewBookingOpen}
                onOpenChange={setIsNewBookingOpen}
                onSubmit={handleNewBooking}
                restaurantId={restaurant._id}
            />
            {selectedReservation && (
                <EditBookingSheet
                    open={isEditBookingOpen}
                    onOpenChange={setIsEditBookingOpen}
                    onSubmit={handleEditBooking}
                    booking={selectedReservation}
                />
            )}
        </div>
    )
}
