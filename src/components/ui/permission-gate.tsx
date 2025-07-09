import { ReactNode } from 'react'
import { Permissions } from '@/types/role'
import { usePermissions } from '@/context/permissions-context'
import { cn } from '@/lib/utils'
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";

interface PermissionGateProps {
    section: string
    operation: Permissions
    mode?: 'hide' | 'blur' | 'disable'
    className?: string
    children: ReactNode
}

export function PermissionGate({ section, operation, mode = 'hide', className, children }: PermissionGateProps) {
    const { hasPermission } = usePermissions()
    const allowed = hasPermission(section, operation)

    if (allowed) return <>{children}</>

    if (mode === 'blur') {
        return <div className={cn('pointer-events-none opacity-60 blur-sm', className)}>{children}</div>
    }

    if (mode === 'disable') {
        return (
            <Tooltip>
                <TooltipTrigger>
                    <div className={cn('pointer-events-none opacity-60', className)}>{children}</div>
                </TooltipTrigger>
                <TooltipContent>
                    Sem permissão
                </TooltipContent>
            </Tooltip>
        )
    }

    return null
}
