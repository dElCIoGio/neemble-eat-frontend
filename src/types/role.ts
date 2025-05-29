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


export interface TeamMember {
    id: string
    name: string
    email: string
    phone: string
    role: string
    status: "ativo" | "pendente" | "desativado"
    permissions: string[]
    lastAccess: string
    avatar?: string
    joinDate: string
    department: string
}
