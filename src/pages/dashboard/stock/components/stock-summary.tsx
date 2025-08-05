import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Package, AlertTriangle, BarChart3, ChefHat} from "lucide-react";
import {formatCurrency} from "@/lib/helpers/format-currency";
import {useStockContext} from "@/context/stock-context";

export function StockSummary() {
    const {stockItems, recipes} = useStockContext();

    const totalProducts = stockItems.length;
    const okItems = stockItems.filter(item => item.status === "OK").length;
    const lowStockItems = stockItems.filter(item => item.status == "Baixo");
    const criticalStockItems = stockItems.filter(item => item.status === "Critico");
    const totalStockValue = stockItems.reduce((total, item) => {
        return total + item.currentQuantity * (item.cost || 0);
    }, 0);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalProducts}</div>
                    <p className="text-xs text-muted-foreground">
                        {okItems} produtos em estado normal
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Stock Baixo</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{lowStockItems.length}</div>
                    <p className="text-xs text-muted-foreground">
                        {criticalStockItems.length} em estado crítico
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">Kz {formatCurrency(totalStockValue)}</div>
                    <p className="text-xs text-muted-foreground">
                        Valor total do inventário
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Receitas</CardTitle>
                    <ChefHat className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{recipes.length}</div>
                    <p className="text-xs text-muted-foreground">
                        Receitas cadastradas
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

