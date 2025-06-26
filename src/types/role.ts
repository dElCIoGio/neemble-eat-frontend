export type Permissions = "view" | "create" | "update" | "delete";

export type SectionPermission = {
    description?: string
    section: string;
    permissions: Permissions[];
};

export type RoleCreate = {
    name: string;
    description: string;
    permissions: SectionPermission[];
    restaurantId: string;
    level: number
}

export type Role = {
    _id: string;
    createdAt: string;
    updatedAt: string;
} & RoleCreate;

type OptionalRoleFields = Partial<Omit<Role, '_id' | 'createdAt' | 'updatedAt'>>;

export type PartialRole = OptionalRoleFields & {
    _id: string;
    createdAt: string;
    updatedAt: string;
};