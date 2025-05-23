import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'
import { Toaster } from "@/components/ui/sonner"
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { HelmetProvider } from "react-helmet-async";



const queryClient = new QueryClient()


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <HelmetProvider>
            <BrowserRouter>
                <QueryClientProvider client={queryClient}>
                    <App/>
                    <Toaster/>
                </QueryClientProvider>
            </BrowserRouter>
        </HelmetProvider>
    </StrictMode>,
)
