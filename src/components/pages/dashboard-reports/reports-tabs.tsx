
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export type ReportTab = "sales" | "invoices" | "items" | "cancelled"

interface ReportsTabsProps {
    activeTab: ReportTab
    onTabChange: (tab: ReportTab) => void
}

export function ReportsTabs({ activeTab, onTabChange }: ReportsTabsProps) {
    return (
        <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as ReportTab)}>
            <TabsList className="">
                <TabsTrigger value="sales">Sales Summary</TabsTrigger>
                <TabsTrigger value="invoices">Invoices</TabsTrigger>
                <TabsTrigger value="items">Items Sold</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
        </Tabs>
    )
}
