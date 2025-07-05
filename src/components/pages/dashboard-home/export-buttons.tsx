import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useDashboardHomeContext } from "@/context/dashboard-home-context"

export default function ExportButtons() {
    const { handleExportCSV, handleExportPDF, isExporting } = useDashboardHomeContext()

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-1">
                    <span>Exportar Dados</span>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="cursor-default">
                                <Info className="h-3.5 w-3.5 text-muted-foreground" />
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>Descarregue os dados do dashboard em diferentes formatos</TooltipContent>
                    </Tooltip>
                </CardTitle>
                <CardDescription>Descarregue os dados do dashboard em diferentes formatos</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
                    <Button className="flex items-center space-x-2" onClick={handleExportCSV} disabled={isExporting}>
                        <Download className="h-4 w-4" />
                        <span>{isExporting ? "A exportar..." : "Exportar CSV"}</span>
                    </Button>
                    <Button className="flex items-center space-x-2" onClick={handleExportPDF} disabled={isExporting}>
                        <FileText className="h-4 w-4" />
                        <span>{isExporting ? "A exportar..." : "Exportar PDF"}</span>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
