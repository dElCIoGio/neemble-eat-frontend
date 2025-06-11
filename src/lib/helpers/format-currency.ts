export function formatCurrency(value: number): string {
    const amount = parseInt(value.toString());
    const formattedAmount = new Intl.NumberFormat('de-DE', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: false,
    }).format(amount);
    return formattedAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
