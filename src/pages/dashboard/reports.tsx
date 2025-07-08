
import { useState, useMemo } from "react"
import {Invoice} from "@/types/invoice";
import {DatePreset, FilterState, SalesReportRow} from "@/types/report";
import {ReportsTabs, ReportTab} from "@/components/pages/dashboard-reports/reports-tabs";
import {SalesTable} from "@/components/pages/dashboard-reports/sales-tables";
import {InvoicesTable} from "@/components/pages/dashboard-reports/invoices-table";
import {ReportsHeader} from "@/components/pages/dashboard-reports/reports-header";
import {InsightPanel} from "@/components/pages/dashboard-reports/insight-panel";
import {FilterDrawer} from "@/components/pages/dashboard-reports/filter-drawer";
import {useDashboardContext} from "@/context/dashboard-context";
import {useGetSalesSummary} from "@/api/endpoints/analytics/hooks";
import {usePaginatedQuery} from "@/hooks/use-paginate";
import {salesReportsClient, invoicesReportsClient} from "@/api/reports-client";
import {apiClient} from "@/api/axios";

export default function ReportsPage() {
    const { restaurant } = useDashboardContext()

    const [activeTab, setActiveTab] = useState<ReportTab>("sales")
    const [selectedPreset, setSelectedPreset] = useState<DatePreset>("last7days")
    const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
    const [filters, setFilters] = useState<FilterState>({
        dateRange: { from: null, to: null },
        categories: [],
        orderStatus: [],
        invoiceStatus: [],
    })

    const activeFiltersCount =
        (filters.dateRange.from || filters.dateRange.to ? 1 : 0) +
        filters.categories.length +
        filters.orderStatus.length +
        filters.invoiceStatus.length

    const dateRange = useMemo(() => {
        const today = new Date()
        const from = new Date()
        switch (selectedPreset) {
            case "today":
                from.setHours(0, 0, 0, 0)
                break
            case "last7days":
                from.setDate(today.getDate() - 7)
                break
            case "last30days":
                from.setDate(today.getDate() - 30)
                break
            case "custom":
                if (filters.dateRange.from) from.setTime(filters.dateRange.from.getTime())
                if (filters.dateRange.to) today.setTime(filters.dateRange.to.getTime())
                break
        }
        return { from: from.toISOString(), to: today.toISOString() }
    }, [selectedPreset, filters.dateRange])

    const salesParams = {
        restaurantId: restaurant._id,
        fromDate: dateRange.from,
        toDate: dateRange.to,
        categories: filters.categories.join(','),
        status: filters.orderStatus.join(',')
    }

    const invoiceParams = {
        restaurantId: restaurant._id,
        fromDate: dateRange.from,
        toDate: dateRange.to,
        status: filters.invoiceStatus.join(',')
    }

    const salesQuery = usePaginatedQuery<SalesReportRow>(salesReportsClient, 25, undefined, salesParams)
    const invoicesQuery = usePaginatedQuery<Invoice>(invoicesReportsClient, 25, undefined, invoiceParams)

    const { data: salesSummary } = useGetSalesSummary({
        restaurantId: restaurant._id,
        fromDate: dateRange.from,
        toDate: dateRange.to
    })

    const handlePresetChange = (preset: DatePreset) => {
        setSelectedPreset(preset)
    }

    const handleFilterApply = () => {
        setFilterDrawerOpen(false)
        salesQuery.resetPagination()
        invoicesQuery.resetPagination()
    }

    const handleFilterReset = () => {
        setFilters({
            dateRange: { from: null, to: null },
            categories: [],
            orderStatus: [],
            invoiceStatus: [],
        })
        salesQuery.resetPagination()
        invoicesQuery.resetPagination()
    }

    const handleExport = async (format: "pdf" | "csv") => {
        const params = activeTab === "sales" ? salesParams : invoiceParams
        try {
            const response = await apiClient.get(`/reports/${activeTab}/export`, {
                params: { ...params, format },
                responseType: 'blob'
            })
            const blob = new Blob([response.data])
            const ext = format === 'pdf' ? 'pdf' : 'csv'
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = `report-${activeTab}.${ext}`
            document.body.appendChild(link)
            link.click()
            link.remove()
        } catch (e) {
            console.error('Export failed', e)
        }
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case "sales":
                return (
                    <SalesTable
                        data={salesQuery.data}
                        currentPage={salesQuery.currentPage}
                        totalPages={Math.ceil(salesQuery.totalCount / 25)}
                        totalCount={salesQuery.totalCount}
                        onNextPage={salesQuery.goToNextPage}
                        onPrevPage={salesQuery.goToPreviousPage}
                    />
                )
            case "invoices":
                return (
                    <InvoicesTable
                        data={invoicesQuery.data}
                        currentPage={invoicesQuery.currentPage}
                        totalPages={Math.ceil(invoicesQuery.totalCount / 25)}
                        totalCount={invoicesQuery.totalCount}
                        onNextPage={invoicesQuery.goToNextPage}
                        onPrevPage={invoicesQuery.goToPreviousPage}
                    />
                )
            case "items":
                return (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="text-muted-foreground mb-2">Dados de Itens Vendidos em breve</div>
                        <div className="text-sm text-muted-foreground">Esta funcionalidade está em desenvolvimento</div>
                    </div>
                )
            case "cancelled":
                return (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="text-muted-foreground mb-2">Dados de Pedidos Cancelados em breve</div>
                        <div className="text-sm text-muted-foreground">Esta funcionalidade está em desenvolvimento</div>
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div className="">
            <ReportsHeader
                activeFilters={activeFiltersCount}
                selectedPreset={selectedPreset}
                onPresetChange={handlePresetChange}
                onFilterClick={() => setFilterDrawerOpen(true)}
                onExport={handleExport}
            />

            <div className=" mt-4 space-y-6">
                <ReportsTabs activeTab={activeTab} onTabChange={setActiveTab} />

                {salesSummary && <InsightPanel data={salesSummary} />}

                <div className="bg-card rounded-lg border p-4">{renderTabContent()}</div>
            </div>

            <FilterDrawer
                open={filterDrawerOpen}
                onOpenChange={setFilterDrawerOpen}
                filters={filters}
                onFiltersChange={setFilters}
                onApply={handleFilterApply}
                onReset={handleFilterReset}
            />
        </div>
    )
}
