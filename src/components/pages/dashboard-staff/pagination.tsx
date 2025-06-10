import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useDashboardStaff } from "@/context/dashboard-staff-context"

export function Pagination() {
    const {
        currentPage,
        setCurrentPage,
        itemsPerPage,
        sortedMembers,
        totalPages
    } = useDashboardStaff()

    if (totalPages <= 1) return null

    return (
        <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-500">
                Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
                {Math.min(currentPage * itemsPerPage, sortedMembers.length)} de {sortedMembers.length} resultados
            </div>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm">
                    Página {currentPage} de {totalPages}
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                >
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
} 