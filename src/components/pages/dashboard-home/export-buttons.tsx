import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText } from "lucide-react"
import { useDashboardHomeContext } from "@/context/dashboard-home-context"

export default function ExportButtons() {
    const { handleExportCSV, handleExportPDF, isExporting } = useDashboardHomeContext()

    return (
        <Card>
            <CardHeader>
                <CardTitle>Exportar Dados</CardTitle>
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
