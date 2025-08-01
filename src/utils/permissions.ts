import { Role } from '@/types/role'
import { Permissions } from '@/types/role'
import { hasPermission as roleHasPermission } from '@/utils/user/has-permission'

export function hasPermission(role: Role | null | undefined, section: string, operation: Permissions): boolean {
    if (!role) return false
    return roleHasPermission(role, section, operation)
}

export function canView(role: Role | null | undefined, section: string): boolean {
    return hasPermission(role, section, 'view')
}

export function canEdit(role: Role | null | undefined, section: string): boolean {
    return hasPermission(role, section, 'update')
}

export function canDelete(role: Role | null | undefined, section: string): boolean {
    return hasPermission(role, section, 'delete')
}
