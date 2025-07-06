export async function compileLatexToPdf(tex: string): Promise<Blob> {
    const response = await fetch('https://latexonline.cc/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-latex' },
        body: tex,
    })
    if (!response.ok) {
        throw new Error('Failed to compile LaTeX document')
    }
    return response.blob()
}

