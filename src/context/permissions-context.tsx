import { createContext, ReactNode, useContext, useCallback } from 'react'
import { useGetCurrentRole } from '@/api/endpoints/user/hooks'
import { Role, Permissions } from '@/types/role'
import { hasPermission as checkRolePermission } from '@/utils/user/has-permission'

interface PermissionContextValue {
    role: Role | null
    hasPermission: (section: string, operation: Permissions) => boolean
}

const PermissionContext = createContext<PermissionContextValue | undefined>(undefined)

export function PermissionsProvider({ children }: { children: ReactNode }) {
    const { data: role } = useGetCurrentRole()

    const hasPermission = useCallback(
        (section: string, operation: Permissions) => {
            if (!role) return false
            return checkRolePermission(role, section, operation)
        },
        [role]
    )

    return (
        <PermissionContext.Provider value={{ role: role ?? null, hasPermission }}>
            {children}
        </PermissionContext.Provider>
    )
}

export function usePermissions() {
    const context = useContext(PermissionContext)
    if (!context) {
        throw new Error('usePermissions must be used within a PermissionsProvider')
    }
    return context
}
