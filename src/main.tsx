import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App'
import { Toaster } from "@/components/ui/sonner"
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { AuthProvider } from "@/context/auth-context";
import { PermissionsProvider } from "@/context/permissions-context";



const queryClient = new QueryClient()


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <PermissionsProvider>
                        <App/>
                        <Toaster/>
                    </PermissionsProvider>
                </AuthProvider>
            </QueryClientProvider>
        </BrowserRouter>
    </StrictMode>,
)
