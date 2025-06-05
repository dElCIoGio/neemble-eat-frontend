// src/components/ui/loader.tsx
import { Loader2 } from 'lucide-react';

export const Loader = () => {
    return (
        <div className="flex items-center justify-center h-full w-full">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
    );
};
