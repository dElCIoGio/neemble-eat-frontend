import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar as CalendarIcon } from "lucide-react"
import { useState } from "react"
import { format } from "date-fns"
import { pt } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { useDashboardHomeContext } from "@/context/dashboard-home-context"
import { DateFilter } from "@/types/dashboard"
import type { DateRange } from "react-day-picker"

export default function DashboardHomeHeader() {
    const {
        dateFilter,
        setDateFilter,
        customDateRange,
        setCustomDateRange,
    } = useDashboardHomeContext()
    const [isRangeOpen, setIsRangeOpen] = useState(false)

    const rangeLabel = customDateRange?.from && customDateRange.to
        ? `${format(customDateRange.from, "dd/MM/yyyy", { locale: pt })} - ${format(customDateRange.to, "dd/MM/yyyy", { locale: pt })}`
        : "Selecionar período"

    return (
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                <Select defaultValue="today" value={dateFilter} onValueChange={(value: DateFilter) => setDateFilter(value)}>
                    <SelectTrigger className="w-full sm:w-48">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="today">Hoje</SelectItem>
                        <SelectItem value="yesterday">Ontem</SelectItem>
                        <SelectItem value="7days">Últimos 7 dias</SelectItem>
                        <SelectItem value="30days">Últimos 30 dias</SelectItem>
                        <SelectItem value="custom">Personalizado</SelectItem>
                    </SelectContent>
                </Select>
                {dateFilter === "custom" && (
                    <Popover open={isRangeOpen} onOpenChange={setIsRangeOpen}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {rangeLabel}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto rounded-lg p-0" align="start" side="bottom" sideOffset={4}>
                            <div className="p-3">
                                <Calendar
                                    mode="range"
                                    numberOfMonths={2}
                                    showOutsideDays={false}
                                    selected={customDateRange}
                                    onSelect={(range: DateRange | undefined) => setCustomDateRange(range)}
                                    locale={pt}
                                    className=""
                                />
                            </div>
                        </PopoverContent>
                    </Popover>
                )}

            </div>
        </div>
    )
}
