import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, UserMinus, UserPlus } from "lucide-react"
import { useDashboardStaff } from "@/context/dashboard-staff-context"

export function BulkActions() {
    const { selectedMembers, handleBulkAction } = useDashboardStaff()

    if (selectedMembers.length === 0) return null

    return (
        <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{selectedMembers.length} membro(s) selecionado(s)</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleBulkAction("Ativar")}>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Ativar
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleBulkAction("Desativar")}>
                            <UserMinus className="w-4 h-4 mr-2" />
                            Desativar
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleBulkAction("Exportar")}>
                            <Download className="w-4 h-4 mr-2" />
                            Exportar
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
} 