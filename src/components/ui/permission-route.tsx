import { Navigate, Outlet } from 'react-router'
import { usePermissions } from '@/context/permissions-context'
import { Permissions } from '@/types/role'

interface PermissionRouteProps {
    section: string
    operation: Permissions
    redirectTo?: string
}

export default function PermissionRoute({ section, operation, redirectTo = '/' }: PermissionRouteProps) {
    const { hasPermission } = usePermissions()
    const allowed = hasPermission(section, operation)

    if (!allowed) {
        return <Navigate to={redirectTo} replace />
    }

    return <Outlet />
}
