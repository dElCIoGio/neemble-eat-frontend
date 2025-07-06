export interface InvoiceItem {
    service: string
    rate: number
    quantity: number
    discount: number
    due: number
}

export interface InvoiceData {
    companyName: string
    contactName: string
    website: string
    phone: string
    email: string
    invoiceNumber: string
    invoiceDate: string
    dueDate: string
    billTo: string
    items: InvoiceItem[]
    total: number
    paymentReceived: number
    etransfer: string
    paypalUrl: string
}

export const generateInvoiceTex = (data: InvoiceData): string => {
    const itemRows = data.items
        .map(item =>
            `    \\centering ${item.service} & \\centering\\$${item.rate.toFixed(2)} & \\centering ${item.quantity} & \\centering\\$${item.discount.toFixed(2)} & \\$${item.due.toFixed(2)}\\\\[2.5ex]\\hline\n    & & & &\\`)
        .join("\n")

    const balanceDue = data.total - data.paymentReceived

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
   \\hspace{-8pt} \\multirow{5}{*}{\\includegraphics[height=1.98cm]{src/assets/images/n.png}} & \\textbf{${data.companyName}} & \\hskip12pt\\multirow{5}{*}{\\begin{tabular}{r}\\footnotesize\\bf INVOICE \\[-0.8ex] \\footnotesize ${data.invoiceNumber} \\[-0.4ex] \\footnotesize\\bf DATE \\[-0.8ex] \\footnotesize ${data.invoiceDate} \\[-0.4ex] \\footnotesize\\bf DUE \\[-0.8ex] \\footnotesize ${data.dueDate} \\end{tabular}}\\hspace{-6pt} \\ 
   & ${data.contactName} & \\ 
   & ${data.website} & \\ 
   & ${data.phone} & \\ 
   & ${data.email} & \\ 
\\end{tabularx}

\\vspace{1 cm}

BILL TO

\\Large\\textbf{${data.billTo}}\\normalsize

\\begin{tabularx}{\\linewidth}{c X X X c}
    \\hline
    & & & &\\[0.25ex]
    \\centering{\\bf{Service}} & \\centering{\\bf{Rate}} & \\centering{\\bf{Quantity}} & \\centering{\\bf{Discount}} & \\bf Payment due\\[2.5ex]\\hline
    & & & &\\
${itemRows}
    & & & \\bf Total & \\$${data.total.toFixed(2)}\\[2.5ex]\\hhline{~~~--}
    & & & & \\ 
    & & & \\bf Payment received & \\$${data.paymentReceived.toFixed(2)}\\[2.5ex]\\hhline{~~~--}
    & & & & \\ 
    & & & \\bf Balance due & \\$${balanceDue.toFixed(2)}\\[2.5ex]\\hhline{~~~==}
\\end{tabularx}

\\vspace{1 cm}

\\Large\\textbf{Payment instructions}\\normalsize

\\vspace{0.1 cm}

\\textbf{E-transfer}\\
${data.etransfer}

\\textbf{Paypal}\\
\\href{${data.paypalUrl}}{${data.paypalUrl}}

\\end{document}`
}

