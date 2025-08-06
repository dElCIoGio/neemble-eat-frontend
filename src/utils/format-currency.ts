export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("pt-AO", {
        style: "currency",
        currency: "AOA",
    }).format(amount);
}
