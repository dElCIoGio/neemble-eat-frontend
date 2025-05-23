export type Permissions = "view" | "create" | "update" | "delete";

export type SectionPermission = {
    id: string;
    createdAt: string;
    updatedAt: string;
    section: string;
    permissions: Permissions[];
};

export type Role = {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    description: string;
    permissions: SectionPermission[];
};
