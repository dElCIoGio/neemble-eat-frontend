
import { useState } from "react"
import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useIsMobile } from "@/hooks/use-mobile"
import {InvoiceStatus} from "@/types/invoice";
import {OrderPrepStatus} from "@/types/order";
import {FilterState} from "@/types/report";

interface FilterDrawerProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    filters: FilterState
    onFiltersChange: (filters: FilterState) => void
    onApply: () => void
    onReset: () => void
}

const categories = ["Entradas", "Pratos Principais", "Sobremesas", "Bebidas", "Acompanhamentos"]

const orderStatuses: { value: OrderPrepStatus; label: string }[] = [
    { value: "queued", label: "Na fila" },
    { value: "in_progress", label: "Em preparo" },
    { value: "ready", label: "Pronto" },
    { value: "served", label: "Servido" },
    { value: "cancelled", label: "Cancelado" },
]

const invoiceStatuses: { value: InvoiceStatus; label: string }[] = [
    { value: "pending", label: "Pendente" },
    { value: "paid", label: "Pago" },
    { value: "cancelled", label: "Cancelado" },
]

function FilterContent({
                           filters,
                           onFiltersChange,
                           onApply,
                           onReset,
                       }: Omit<FilterDrawerProps, "open" | "onOpenChange">) {
    const [dateRange, setDateRange] = useState<{
        from: Date | undefined
        to: Date | undefined
    }>({
        from: filters.dateRange.from || undefined,
        to: filters.dateRange.to || undefined,
    })

    const handleCategoryChange = (category: string, checked: boolean) => {
        const newCategories = checked ? [...filters.categories, category] : filters.categories.filter((c) => c !== category)

        onFiltersChange({
            ...filters,
            categories: newCategories,
        })
    }

    const handleOrderStatusChange = (status: OrderPrepStatus, checked: boolean) => {
        const newStatuses = checked ? [...filters.orderStatus, status] : filters.orderStatus.filter((s) => s !== status)

        onFiltersChange({
            ...filters,
            orderStatus: newStatuses,
        })
    }

    const handleInvoiceStatusChange = (status: InvoiceStatus, checked: boolean) => {
        const newStatuses = checked ? [...filters.invoiceStatus, status] : filters.invoiceStatus.filter((s) => s !== status)

        onFiltersChange({
            ...filters,
            invoiceStatus: newStatuses,
        })
    }

    const handleDateRangeChange = () => {
        onFiltersChange({
            ...filters,
            dateRange: {
                from: dateRange.from || null,
                to: dateRange.to || null,
            },
        })
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 space-y-6 p-6">
                {/* Date Range */}
                <div className="space-y-3">
                    <Label className="text-sm font-medium">Período</Label>
                    <div className="grid gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn("justify-start text-left font-normal", !dateRange.from && "text-muted-foreground")}
                                >
                                    <Calendar className="mr-2 h-4 w-4" />
                                    {dateRange.from ? (
                                        dateRange.to ? (
                                            <>
                                                {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                                            </>
                                        ) : (
                                            format(dateRange.from, "LLL dd, y")
                                        )
                                    ) : (
                                        <span>Escolha um período</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent
                                    initialFocus
                                    mode="range"
                                    defaultMonth={dateRange.from}
                                    selected={{ from: dateRange.from, to: dateRange.to }}
                                    onSelect={(range) => {
                                        setDateRange({
                                            from: range?.from,
                                            to: range?.to,
                                        })
                                        handleDateRangeChange()
                                    }}
                                    numberOfMonths={2}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                {/* Categories */}
                <div className="space-y-3">
                    <Label className="text-sm font-medium">Categorias de Itens</Label>
                    <div className="space-y-2">
                        {categories.map((category) => (
                            <div key={category} className="flex items-center space-x-2">
                                <Checkbox
                                    id={category}
                                    checked={filters.categories.includes(category)}
                                    onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                                />
                                <Label htmlFor={category} className="text-sm font-normal">
                                    {category}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Status */}
                <div className="space-y-3">
                    <Label className="text-sm font-medium">Status do Pedido</Label>
                    <div className="space-y-2">
                        {orderStatuses.map((status) => (
                            <div key={status.value} className="flex items-center space-x-2">
                                <Checkbox
                                    id={status.value}
                                    checked={filters.orderStatus.includes(status.value)}
                                    onCheckedChange={(checked) => handleOrderStatusChange(status.value, checked as boolean)}
                                />
                                <Label htmlFor={status.value} className="text-sm font-normal">
                                    {status.label}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Invoice Status */}
                <div className="space-y-3">
                    <Label className="text-sm font-medium">Status da Fatura</Label>
                    <div className="space-y-2">
                        {invoiceStatuses.map((status) => (
                            <div key={status.value} className="flex items-center space-x-2">
                                <Checkbox
                                    id={status.value}
                                    checked={filters.invoiceStatus.includes(status.value)}
                                    onCheckedChange={(checked) => handleInvoiceStatusChange(status.value, checked as boolean)}
                                />
                                <Label htmlFor={status.value} className="text-sm font-normal">
                                    {status.label}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t p-6">
                <div className="flex gap-2">
                    <Button onClick={onApply} className="flex-1">
                        Aplicar Filtros
                    </Button>
                    <Button variant="outline" onClick={onReset}>
                        Limpar
                    </Button>
                </div>
            </div>
        </div>
    )
}

export function FilterDrawer(props: FilterDrawerProps) {
    const isMobile = useIsMobile()

    if (isMobile) {
        return (
            <Drawer open={props.open} onOpenChange={props.onOpenChange}>
                <DrawerContent className="h-[90vh]">
                    <DrawerHeader>
                        <DrawerTitle>Filtrar Relatórios</DrawerTitle>
                        <DrawerDescription>Personalize os dados do relatório com esses filtros</DrawerDescription>
                    </DrawerHeader>
                    <FilterContent {...props} />
                </DrawerContent>
            </Drawer>
        )
    }

    return (
        <Sheet open={props.open} onOpenChange={props.onOpenChange}>
            <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                    <SheetTitle>Filtrar Relatórios</SheetTitle>
                    <SheetDescription>Personalize os dados do relatório com esses filtros</SheetDescription>
                </SheetHeader>
                <FilterContent {...props} />
            </SheetContent>
        </Sheet>
    )
}
