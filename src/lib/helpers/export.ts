import type { ExportData } from "@/types/dashboard"
import { formatCurrency } from "@/utils/format-currency"

export const generateCSV = (data: ExportData): string => {
    const headers = ["Métrica", "Valor", "Crescimento (%)", "Categoria"]

    const rows: string[][] = [
        headers,
        // Sales Data
        ["Total de Vendas", formatCurrency(data.salesData.totalSales), data.salesData.salesGrowth.toString(), "Vendas"],
        ["Faturas Emitidas", data.salesData.invoiceCount.toString(), data.salesData.invoiceGrowth.toString(), "Vendas"],
        [
            "Valor Médio por Fatura",
            formatCurrency(data.salesData.averageInvoice),
            data.salesData.averageGrowth.toString(),
            "Vendas",
        ],
        ["Mesas Servidas", data.salesData.distinctTables.toString(), data.salesData.tableGrowth.toString(), "Vendas"],
        [
            "Receita por Mesa",
            formatCurrency(data.salesData.revenuePerTable),
            data.salesData.revenueGrowth.toString(),
            "Vendas",
        ],

        // Orders Data
        ["Total de Pedidos", data.ordersData.orderCount.toString(), data.ordersData.ordersGrowth.toString(), "Pedidos"],
        [
            "Pedidos Cancelados",
            data.ordersData.cancelledCount.toString(),
            data.ordersData.cancelledGrowth.toString(),
            "Pedidos",
        ],
        ["Taxa de Cancelamento", `${data.ordersData.cancelledRate.toFixed(1)}%`, "", "Pedidos"],

        // Sessions Data
        [
            "Duração Média da Sessão",
            `${data.sessionsData.averageDurationMinutes} min`,
            data.sessionsData.durationGrowth.toString(),
            "Sessões",
        ],
        [
            "Sessões Ativas",
            data.sessionsData.activeSessions.toString(),
            data.sessionsData.activeGrowth.toString(),
            "Sessões",
        ],
    ]

    // Add popular items
    rows.push(["", "", "", ""])
    rows.push(["Item Popular", "Quantidade", "", "Itens Populares"])
    data.popularItems.forEach((item) => {
        rows.push([item.itemName, item.quantity.toString(), "", "Itens Populares"])
    })

    return rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")
}

export const downloadCSV = (data: ExportData): void => {
    const csv = generateCSV(data)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")

    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", `dashboard-restaurante-${data.exportDate}.csv`)
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }
}

export const generatePDFContent = (data: ExportData): string => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Dashboard de Desempenho - Restaurante</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 10px; }
        .section { margin-bottom: 25px; }
        .section h2 { color: #2563eb; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
        .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
        .metric-card { border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px; }
        .metric-value { font-size: 24px; font-weight: bold; color: #1f2937; }
        .metric-growth { font-size: 14px; margin-top: 5px; }
        .positive { color: #059669; }
        .negative { color: #dc2626; }
        .items-list { list-style: none; padding: 0; }
        .items-list li { padding: 8px 0; border-bottom: 1px solid #f3f4f6; display: flex; justify-content: space-between; }
        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #6b7280; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Relatório de Desempenho</h1>
        <p>Gerado em: ${data.exportDate}</p>
        <p>Período: ${data.dateFilter} | Turno: ${data.shiftFilter}</p>
    </div>

    <div class="section">
        <h2>Resumo de Vendas</h2>
        <div class="metrics-grid">
            <div class="metric-card">
                <div>Total de Vendas</div>
                <div class="metric-value">${formatCurrency(data.salesData.totalSales)}</div>
                <div class="metric-growth ${data.salesData.salesGrowth > 0 ? "positive" : "negative"}">
                    ${data.salesData.salesGrowth > 0 ? "+" : ""}${data.salesData.salesGrowth.toFixed(1)}%
                </div>
            </div>
            <div class="metric-card">
                <div>Faturas Emitidas</div>
                <div class="metric-value">${data.salesData.invoiceCount}</div>
                <div class="metric-growth ${data.salesData.invoiceGrowth > 0 ? "positive" : "negative"}">
                    ${data.salesData.invoiceGrowth > 0 ? "+" : ""}${data.salesData.invoiceGrowth.toFixed(1)}%
                </div>
            </div>
            <div class="metric-card">
                <div>Valor Médio por Fatura</div>
                <div class="metric-value">${formatCurrency(data.salesData.averageInvoice)}</div>
                <div class="metric-growth ${data.salesData.averageGrowth > 0 ? "positive" : "negative"}">
                    ${data.salesData.averageGrowth > 0 ? "+" : ""}${data.salesData.averageGrowth.toFixed(1)}%
                </div>
            </div>
            <div class="metric-card">
                <div>Mesas Servidas</div>
                <div class="metric-value">${data.salesData.distinctTables}</div>
                <div class="metric-growth ${data.salesData.tableGrowth > 0 ? "positive" : "negative"}">
                    ${data.salesData.tableGrowth > 0 ? "+" : ""}${data.salesData.tableGrowth.toFixed(1)}%
                </div>
            </div>
            <div class="metric-card">
                <div>Receita por Mesa</div>
                <div class="metric-value">${formatCurrency(data.salesData.revenuePerTable)}</div>
                <div class="metric-growth ${data.salesData.revenueGrowth > 0 ? "positive" : "negative"}">
                    ${data.salesData.revenueGrowth > 0 ? "+" : ""}${data.salesData.revenueGrowth.toFixed(1)}%
                </div>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>Pedidos</h2>
        <div class="metrics-grid">
            <div class="metric-card">
                <div>Total de Pedidos</div>
                <div class="metric-value">${data.ordersData.orderCount}</div>
            </div>
            <div class="metric-card">
                <div>Pedidos Cancelados</div>
                <div class="metric-value">${data.ordersData.cancelledCount}</div>
            </div>
            <div class="metric-card">
                <div>Taxa de Cancelamento</div>
                <div class="metric-value">${data.ordersData.cancelledRate.toFixed(1)}%</div>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>Itens Mais Populares</h2>
        <ul class="items-list">
            ${data.popularItems
        .map(
            (item, index) => `
                <li>
                    <span>#${index + 1} ${item.itemName}</span>
                    <span>${item.quantity} vendidos</span>
                </li>
            `,
        )
        .join("")}
        </ul>
    </div>

    <div class="section">
        <h2>Sessões de Cliente</h2>
        <div class="metrics-grid">
            <div class="metric-card">
                <div>Duração Média da Sessão</div>
                <div class="metric-value">${data.sessionsData.averageDurationMinutes} min</div>
            </div>
            <div class="metric-card">
                <div>Sessões Ativas</div>
                <div class="metric-value">${data.sessionsData.activeSessions}</div>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>Glossário</h2>
        <ul>
            <li><strong>Total de Vendas</strong> - soma em kwanzas de todas as vendas no período.</li>
            <li><strong>Faturas Emitidas</strong> - quantidade de faturas geradas.</li>
            <li><strong>Mesas Servidas</strong> - número total de mesas atendidas.</li>
            <li><strong>Taxa de Cancelamento</strong> - porcentagem de pedidos cancelados face ao total.</li>
        </ul>
    </div>

    <div class="footer">
        <p>Relatório gerado automaticamente pelo Dashboard de Desempenho</p>
    </div>
</body>
</html>
  `
}

export const downloadPDF = (data: ExportData): void => {
    const htmlContent = generatePDFContent(data)
    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8;" })
    const link = document.createElement("a")

    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", `dashboard-restaurante-${data.exportDate}.html`)
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }
}
