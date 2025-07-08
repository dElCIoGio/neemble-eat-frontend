
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
                <TabsTrigger value="sales">Resumo de Vendas</TabsTrigger>
                <TabsTrigger value="invoices">Faturas</TabsTrigger>
                <TabsTrigger value="items">Itens Vendidos</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelados</TabsTrigger>
            </TabsList>
        </Tabs>
    )
}
