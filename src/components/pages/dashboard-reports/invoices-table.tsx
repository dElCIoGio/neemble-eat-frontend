
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, ChevronLeft, ChevronRight, Download } from "lucide-react"
import { Invoice } from "@/types/invoice"
import { invoicesApi } from "@/api/endpoints/invoices/requests"
import { generateInvoiceTex } from "@/lib/templates/invoice"
import { compileLatexToPdf } from "@/lib/helpers/compile-latex"

interface InvoicesTableProps {
    data: Invoice[]
    currentPage: number
    totalPages: number
    totalCount: number
    onNextPage: () => void
    onPrevPage: () => void
}

export function InvoicesTable({ data, currentPage, totalPages, totalCount, onNextPage, onPrevPage }: InvoicesTableProps) {
    const [sortField, setSortField] = useState<keyof Invoice>("generatedTime")
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
    const itemsPerPage = 25

    const handleSort = (field: keyof Invoice) => {
        if (field === sortField) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortDirection("asc")
        }
    }

    const handleDownload = async (invoiceId: string) => {
        try {
            const data = await invoicesApi.getInvoiceData(invoiceId)
            const tex = generateInvoiceTex(data)
            const pdfBlob = await compileLatexToPdf(tex)
            const url = URL.createObjectURL(pdfBlob)
            const link = document.createElement("a")
            link.href = url
            link.download = `invoice-${invoiceId}.pdf`
            document.body.appendChild(link)
            link.click()
            link.remove()
            URL.revokeObjectURL(url)
        } catch (err) {
            console.error("Failed to download invoice", err)
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

    const getStatusBadge = (status: string) => {
        const variants = {
            paid: "default",
            pending: "secondary",
            cancelled: "destructive",
        } as const

        return (
            <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        )
    }

    if (data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-muted-foreground mb-2">No invoices found</div>
                <div className="text-sm text-muted-foreground">Try adjusting your filters or date range</div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                <Button variant="ghost" onClick={() => handleSort("_id")} className="h-auto p-0 font-semibold">
                                    Invoice #
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>
                                <Button
                                    variant="ghost"
                                    onClick={() => handleSort("generatedTime")}
                                    className="h-auto p-0 font-semibold"
                                >
                                    Date
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">
                                <Button variant="ghost" onClick={() => handleSort("total")} className="h-auto p-0 font-semibold">
                                    Total
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.map((invoice) => (
                            <TableRow key={invoice._id}>
                                <TableCell className="font-medium">#{invoice._id.slice(-8)}</TableCell>
                                <TableCell>Table {invoice.sessionId.slice(-4)}</TableCell>
                                <TableCell>{new Date(invoice.generatedTime).toLocaleDateString()}</TableCell>
                                <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                                <TableCell className="text-right">${invoice.total?.toFixed(2) || "0.00"}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDownload(invoice._id)}
                                    >
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalCount)} of {totalCount} results
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onPrevPage}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>
                    <div className="text-sm">Page {currentPage} of {totalPages}</div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onNextPage}
                        disabled={currentPage === totalPages}
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
