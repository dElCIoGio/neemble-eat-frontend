
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react"

interface SalesData {
    date: string
    grossSales: number
    orders: number
}

interface SalesTableProps {
    data: SalesData[]
    currentPage: number
    totalPages: number
    totalCount: number
    onNextPage: () => void
    onPrevPage: () => void
}

export function SalesTable({ data, currentPage, totalPages, totalCount, onNextPage, onPrevPage }: SalesTableProps) {
    const [sortField, setSortField] = useState<keyof SalesData>("date")
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
    const itemsPerPage = 25

    const handleSort = (field: keyof SalesData) => {
        if (field === sortField) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortDirection("asc")
        }
    }

    const sortedData = [...data].sort((a, b) => {
        const aValue = a[sortField]
        const bValue = b[sortField]

        if (typeof aValue === "string" && typeof bValue === "string") {
            return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
        }

        return sortDirection === "asc" ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number)
    })

    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedData = sortedData

    if (data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-muted-foreground mb-2">Nenhum dado de venda encontrado</div>
                <div className="text-sm text-muted-foreground">Tente ajustar seus filtros ou intervalo de datas</div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                <Button variant="ghost" onClick={() => handleSort("date")} className="h-auto p-0 font-semibold">
                                    Data
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead className="text-right">
                                <Button variant="ghost" onClick={() => handleSort("grossSales")} className="h-auto p-0 font-semibold">
                                    Vendas Brutas
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead className="text-right">
                                <Button variant="ghost" onClick={() => handleSort("orders")} className="h-auto p-0 font-semibold">
                                    Pedidos
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{new Date(row.date).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">${row.grossSales.toLocaleString()}</TableCell>
                                <TableCell className="text-right">{row.orders}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Exibindo {startIndex + 1} a {Math.min(startIndex + itemsPerPage, totalCount)} de {totalCount} resultados
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onPrevPage}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Anterior
                    </Button>
                    <div className="text-sm">Página {currentPage} de {totalPages}</div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onNextPage}
                        disabled={currentPage === totalPages}
                    >
                        Próximo
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
