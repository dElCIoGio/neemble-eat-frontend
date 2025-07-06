import axios from "axios";
import config from "@/config";


export const compileLatex = async (tex: string) => {
    const payload = {
        main: "main.tex",
        resources: [],
        inputs: {
            "main.tex": "\\documentclass{article}\\begin{document}Hello, it works!\\end{document}"
        }
    };

    console.log(tex);

    const backendUrl = config.api.apiUrl

    try {
        const response = await axios.post(`${backendUrl}/compile-latex`, payload, {
            responseType: 'blob' // Get binary PDF
        });

        console.log(response)

        // Wrap the response data in a Blob
        const blob = new Blob([response.data], { type: 'application/pdf' });

        return blob; // ✅ return the blob to the caller

    } catch (error) {
        console.error("PDF compilation failed:", error);
        throw error; // Optional: rethrow if you want to handle errors higher up
    }
};


export const handleCompile = async (tex: string) => {
    try {
        const blob = await compileLatex(tex)
        const text = await blob.text();
        console.log('Blob content (first 500 chars):', text.slice(0, 500));
        return blob
    } catch (err) {
        console.error('Failed to compile LaTeX:', err);
    }
};


