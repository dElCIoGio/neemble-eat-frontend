export interface InvoiceItem {
    name: string
    unitPrice: number
    quantity: number
    total: number
}

export interface InvoiceData {
    restaurantName: string
    restaurantAddress: string
    restaurantPhoneNumber: string
    tableNumber: number
    invoiceNumber: string
    invoiceDate: string
    items: InvoiceItem[]
    tax?: number | null
    discount?: number | null
    total: number
}

export const generateInvoiceTex = (data: InvoiceData): string => {
    const itemRows = data.items
        .map(item =>
            `    \\centering ${item.name} & \\centering\\$${item.unitPrice.toFixed(2)} & \\centering ${item.quantity} & \\$${item.total.toFixed(2)}\\\\[2.5ex]\\hline\n    & & &\\`)
        .join("\n")

    const subtotal = data.items.reduce((sum, item) => sum + item.total, 0)

    return `\\documentclass{letter}
\\usepackage[utf8]{inputenc}
\\usepackage[colorlinks]{hyperref}
\\usepackage[left=1in,top=1in,right=1in,bottom=1in]{geometry}
\\usepackage{graphicx}
\\usepackage{tabularx}
\\usepackage{multirow}
\\usepackage{ragged2e}
\\usepackage{hhline}
\\usepackage{array}

\\hypersetup{
    urlcolor=blue
}

\\newcolumntype{R}[1]{>{\\raggedleft\\let\\newline\\\\\\arraybackslash\\hspace{0pt}}m{#1}}

\\begin{document}

\\thispagestyle{empty}

% Header
\\begin{tabularx}{\\textwidth}{l X l}
   \\hspace{-8pt} \\multirow{4}{*}{\\includegraphics[height=1.98cm]{src/assets/images/n.png}} & \\textbf{${data.restaurantName}} & \\hskip12pt\\multirow{4}{*}{\\begin{tabular}{r}\\footnotesize\\bf INVOICE \\[-0.8ex] \\footnotesize ${data.invoiceNumber} \\[-0.4ex] \\footnotesize ${data.invoiceDate} \\end{tabular}}\\hspace{-6pt} \\
   & ${data.restaurantAddress} & \\
   & ${data.restaurantPhoneNumber} & \\
   & Table ${data.tableNumber} & \\
\\end{tabularx}

\\vspace{1 cm}

\\begin{tabularx}{\\linewidth}{c X X c}
    \\hline
    & & &\\[0.25ex]
    \\centering{\\bf{Item}} & \\centering{\\bf{Unit Price}} & \\centering{\\bf{Quantity}} & \\bf Total\\[2.5ex]\\hline
    & & &\\
${itemRows}
    & & & \\bf Subtotal & \\$${subtotal.toFixed(2)}\\[2.5ex]\\hhline{~~--}
    & & & \\bf Tax & \\$${(data.tax ?? 0).toFixed(2)}\\[2.5ex]\\hhline{~~--}
    & & & \\bf Discount & \\$${(data.discount ?? 0).toFixed(2)}\\[2.5ex]\\hhline{~~--}
    & & & \\bf Total & \\$${data.total.toFixed(2)}\\[2.5ex]\\hhline{~~==}
\\end{tabularx}

\\end{document}`
}

