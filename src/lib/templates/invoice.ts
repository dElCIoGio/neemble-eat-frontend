import invoiceTemplate from "./invoice.html?raw";

export interface InvoiceItem {
    name: string;
    unitPrice: number;
    quantity: number;
    total: number;
}

export interface InvoiceData {
    restaurantName: string;
    restaurantAddress: string;
    restaurantPhoneNumber: string;
    tableNumber: number;
    invoiceNumber: string;
    invoiceDate: string;
    items: InvoiceItem[];
    tax?: number | null;
    discount?: number | null;
    total: number;
}

export const generateInvoiceHtml = (data: InvoiceData): string => {
    const itemRows = data.items
        .map(
            (item) =>
                `<tr><td>${item.name}</td><td>$${item.unitPrice.toFixed(2)}</td><td>${item.quantity}</td><td>$${item.total.toFixed(2)}</td></tr>`
        )
        .join("\n");

    const subtotal = data.items.reduce((sum, item) => sum + item.total, 0);

    return invoiceTemplate
        .replace(/{{restaurantName}}/g, data.restaurantName)
        .replace(/{{restaurantAddress}}/g, data.restaurantAddress)
        .replace(/{{restaurantPhoneNumber}}/g, data.restaurantPhoneNumber)
        .replace(/{{tableNumber}}/g, data.tableNumber.toString())
        .replace(/{{invoiceNumber}}/g, data.invoiceNumber)
        .replace(/{{invoiceDate}}/g, data.invoiceDate)
        .replace(/{{items}}/g, itemRows)
        .replace(/{{subtotal}}/g, subtotal.toFixed(2))
        .replace(/{{tax}}/g, (data.tax ?? 0).toFixed(2))
        .replace(/{{discount}}/g, (data.discount ?? 0).toFixed(2))
        .replace(/{{total}}/g, data.total.toFixed(2));
};
