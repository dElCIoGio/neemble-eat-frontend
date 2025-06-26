import { Role, Permissions } from "@/types/role";



/**
 * Check if a role has permission to perform an operation on a section
 *
 * @param role The role object
 * @param section The section name (e.g., "orders", "menu", etc.)
 * @param operation The operation to check (e.g., "view", "create", etc.)
 * @returns boolean indicating if the operation is allowed
 */
export function hasPermission(
    role: Role,
    section: string,
    operation: Permissions
): boolean {
    const sectionPermission = role.permissions.find((p) => p.section === section);
    if (!sectionPermission) return false;

    switch (operation) {
        case "view":
            return sectionPermission.permissions.canView;
        case "create":
        case "update":
            return sectionPermission.permissions.canEdit;
        case "delete":
            return sectionPermission.permissions.canDelete;
        default:
            return false;
    }
}