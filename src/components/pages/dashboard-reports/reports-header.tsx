import { CalendarDays, Download, Filter, FileText, FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {DatePreset} from "@/types/report";
import {Card} from "@/components/ui/card";


interface ReportsHeaderProps {
    activeFilters: number
    selectedPreset: DatePreset
    onPresetChange: (preset: DatePreset) => void
    onFilterClick: () => void
    onExport: (format: "pdf" | "csv") => void
}

const datePresets = [
    { value: "today" as DatePreset, label: "Today" },
    { value: "last7days" as DatePreset, label: "Last 7 days" },
    { value: "last30days" as DatePreset, label: "Last 30 days" },
    { value: "custom" as DatePreset, label: "Custom" },
]

export function ReportsHeader({
                                  activeFilters,
                                  selectedPreset,
                                  onPresetChange,
                                  onFilterClick,
                                  onExport,
                              }: ReportsHeaderProps) {
    return (
        <Card className="sticky top-0 z-0 p-4">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={onFilterClick} className="relative bg-transparent">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                            {activeFilters > 0 && (
                                <Badge
                                    variant="secondary"
                                    className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                                >
                                    {activeFilters}
                                </Badge>
                            )}
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    <Download className="h-4 w-4 mr-2" />
                                    Export
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => onExport("pdf")}>
                                    <FileText className="h-4 w-4 mr-2" />
                                    Export as PDF
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onExport("csv")}>
                                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                                    Export as CSV
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {datePresets.map((preset) => (
                        <Button
                            key={preset.value}
                            variant={selectedPreset === preset.value ? "default" : "outline"}
                            size="sm"
                            onClick={() => onPresetChange(preset.value)}
                            className="flex items-center gap-2"
                        >
                            <CalendarDays className="h-3 w-3" />
                            {preset.label}
                        </Button>
                    ))}
                </div>
            </div>
        </Card>
    )
}
