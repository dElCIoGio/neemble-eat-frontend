
import { useState } from "react"
import {SalesSummary} from "@/types/analytics";
import {Invoice} from "@/types/invoice";
import {DatePreset, FilterState} from "@/types/report";
import {ReportsTabs, ReportTab} from "@/components/pages/dashboard-reports/reports-tabs";
import {SalesTable} from "@/components/pages/dashboard-reports/sales-tables";
import {InvoicesTable} from "@/components/pages/dashboard-reports/invoices-table";
import {ReportsHeader} from "@/components/pages/dashboard-reports/reports-header";
import {InsightPanel} from "@/components/pages/dashboard-reports/insight-panel";
import {FilterDrawer} from "@/components/pages/dashboard-reports/filter-drawer";


// Mock data
const mockSalesSummary: SalesSummary = {
    totalSales: 45231.89,
    invoiceCount: 234,
    averageInvoice: 193.29,
    distinctTables: 12,
    revenuePerTable: 3769.32,
    totalSalesGrowth: 12.5,
    invoiceCountGrowth: 8.3,
    averageInvoiceGrowth: 4.1,
    distinctTablesGrowth: 0,
    revenuePerTableGrowth: 12.5,
}

const mockSalesData = [
    { date: "2024-01-15", grossSales: 2450.0, netSales: 2205.0, orders: 18 },
    { date: "2024-01-14", grossSales: 1890.5, netSales: 1701.45, orders: 14 },
    { date: "2024-01-13", grossSales: 3200.75, netSales: 2880.68, orders: 22 },
    { date: "2024-01-12", grossSales: 2100.25, netSales: 1890.23, orders: 16 },
    { date: "2024-01-11", grossSales: 2750.0, netSales: 2475.0, orders: 19 },
]

const mockInvoices: Invoice[] = [
    {
        id: "inv_001",
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T11:00:00Z",
        restaurantId: "rest_001",
        sessionId: "sess_001",
        orders: ["order_001", "order_002"],
        total: 125.5,
        tax: 12.55,
        discount: 0,
        generatedTime: "2024-01-15T11:00:00Z",
        status: "paid",
        isActive: true,
    },
    {
        id: "inv_002",
        createdAt: "2024-01-15T12:15:00Z",
        updatedAt: "2024-01-15T12:45:00Z",
        restaurantId: "rest_001",
        sessionId: "sess_002",
        orders: ["order_003"],
        total: 89.25,
        tax: 8.93,
        discount: 5.0,
        generatedTime: "2024-01-15T12:45:00Z",
        status: "pending",
        isActive: true,
    },
]

export default function ReportsPage() {
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

    const handlePresetChange = (preset: DatePreset) => {
        setSelectedPreset(preset)
        // In a real app, you'd update the date range based on the preset
    }

    const handleFilterApply = () => {
        setFilterDrawerOpen(false)
        // In a real app, you'd fetch data based on filters
    }

    const handleFilterReset = () => {
        setFilters({
            dateRange: { from: null, to: null },
            categories: [],
            orderStatus: [],
            invoiceStatus: [],
        })
    }

    const handleExport = (format: "pdf" | "csv") => {
        // In a real app, you'd trigger the export
        console.log(`Exporting as ${format}`)
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case "sales":
                return <SalesTable data={mockSalesData} />
            case "invoices":
                return <InvoicesTable data={mockInvoices} />
            case "items":
                return (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="text-muted-foreground mb-2">Items Sold data coming soon</div>
                        <div className="text-sm text-muted-foreground">This feature is under development</div>
                    </div>
                )
            case "cancelled":
                return (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="text-muted-foreground mb-2">Cancelled Orders data coming soon</div>
                        <div className="text-sm text-muted-foreground">This feature is under development</div>
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

                <InsightPanel data={mockSalesSummary} />

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
