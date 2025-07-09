import {createContext, useContext, useState, ReactNode, JSX, useEffect} from "react"
import { User } from "@/types/user"

import { InvitationCreate } from "@/types/invitation"
import { useDashboardContext } from "@/context/dashboard-context"
import { useGetAllMembers } from "@/hooks/use-get-all-members"
import { useListRestaurantRoles } from "@/hooks/use-list-restaurant-roles"
import { showSuccessToast, showErrorToast } from "@/utils/notifications/toast"
import { useUpdateMemberRole } from "@/api/endpoints/memberships/hooks"
import { Badge } from "@/components/ui/badge"
import { restaurantApi } from "@/api/endpoints/restaurants/requests"
import { useIsMobile } from "@/hooks/use-mobile"

type SortableUserFields = keyof Pick<User, 'firstName' | 'lastName' | 'email' | 'isActive' | 'updatedAt'>

interface DashboardStaffContextType {
    // State
    searchTerm: string
    setSearchTerm: (term: string) => void
    statusFilter: string
    setStatusFilter: (status: string) => void
    isInviteDialogOpen: boolean
    setIsInviteDialogOpen: (open: boolean) => void
    selectedMember: User | null
    setSelectedMember: (member: User | null) => void
    isEditDialogOpen: boolean
    setIsEditDialogOpen: (open: boolean) => void
    selectedMembers: string[]
    setSelectedMembers: (members: string[]) => void
    sortField: SortableUserFields
    setSortField: (field: SortableUserFields) => void
    sortDirection: "asc" | "desc"
    setSortDirection: (direction: "asc" | "desc") => void
    currentPage: number
    setCurrentPage: (page: number) => void
    itemsPerPage: number
    viewMode: "table" | "cards"
    setViewMode: (mode: "table" | "cards") => void
    inviteForm: InvitationCreate
    setInviteForm: (form: InvitationCreate) => void
    // Computed values
    stats: {
        total: number
        active: number
        pending: number
        inactive: number
    }
    sortedMembers: User[]
    paginatedMembers: User[]
    totalPages: number
    // Functions
    handleSort: (field: SortableUserFields) => void
    handleSelectMember: (memberId: string) => void
    handleSelectAll: (checked: boolean) => void
    handleEditMember: (member: User) => void
    handleDeleteMember: (member: User) => void
    updateMemberRole: (memberId: string, roleId: string) => void
    getRoleName: (roleId: string) => string
    getStatusBadge: (status: string) => JSX.Element
    handleBulkAction: (action: string) => void
}

const DashboardStaffContext = createContext<DashboardStaffContextType | undefined>(undefined)

export function DashboardStaffProvider({ children }: { children: ReactNode }) {
    const isMobile = useIsMobile()
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("todos")
    const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
    const [selectedMember, setSelectedMember] = useState<User | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [selectedMembers, setSelectedMembers] = useState<string[]>([])
    const [sortField, setSortField] = useState<SortableUserFields>("firstName")
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(10)
    const [viewMode, setViewMode] = useState<"table" | "cards">(isMobile ? "cards" : "table")

    useEffect(() => {
        if (isMobile) setViewMode("cards")
    }, [isMobile])

    const { user, restaurant } = useDashboardContext()

    const [inviteForm, setInviteForm] = useState<InvitationCreate>({
        name: "",
        roleId: "",
        managerId: user._id,
        restaurantId: restaurant._id
    })


    const { data: roles } = useListRestaurantRoles(restaurant._id)
    const updateMemberRoleMutation = useUpdateMemberRole()
    const { data: users = [] } = useGetAllMembers({
        restaurantId: restaurant._id
    })

    const filteredMembers = users.filter((member) => {
        const matchesSearch =
            member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (member.email?.toLowerCase() || "").includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "todos" || member.isActive === (statusFilter === "ativo")
        return matchesSearch && matchesStatus
    })

    const sortedMembers = [...filteredMembers].sort((a, b) => {
        const aValue = a[sortField]
        const bValue = b[sortField]
        
        if (aValue === undefined || bValue === undefined) return 0
        
        if (sortDirection === "asc") {
            return String(aValue) < String(bValue) ? -1 : String(aValue) > String(bValue) ? 1 : 0
        } else {
            return String(aValue) > String(bValue) ? -1 : String(aValue) < String(bValue) ? 1 : 0
        }
    })

    const paginatedMembers = sortedMembers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    const totalPages = Math.ceil(sortedMembers.length / itemsPerPage)

    const stats = {
        total: users.length,
        active: users.filter((m) => m.isActive).length,
        pending: users.filter((m) => !m.isActive && m.isVerified).length,
        inactive: users.filter((m) => !m.isActive && !m.isVerified).length,
    }

    const handleSort = (field: SortableUserFields) => {
        if (field === sortField) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortDirection("asc")
        }
    }

    const handleSelectMember = (memberId: string) => {
        setSelectedMembers(prev =>
            prev.includes(memberId)
                ? prev.filter(id => id !== memberId)
                : [...prev, memberId]
        )
    }

    const handleBulkAction = (action: string) => {
        showSuccessToast(`${action} aplicado a ${selectedMembers.length} membro(s)`)
        setSelectedMembers([])
    }

    const handleSelectAll = (checked: boolean) => {
        setSelectedMembers(checked ? paginatedMembers.map(member => member._id) : [])
    }

    const handleEditMember = (member: User) => {
        setSelectedMember(member)
        setIsEditDialogOpen(true)
    }

    const handleDeleteMember = async (member: User) => {
        try {
            await restaurantApi.removeMember(restaurant._id, member._id)
            showSuccessToast("Membro removido com sucesso!")
        } catch {
            showErrorToast("Erro ao remover membro")
        }
    }

    const updateMemberRole = (memberId: string, roleId: string) => {
        updateMemberRoleMutation.mutate({
            userId: memberId,
            restaurantId: restaurant._id,
            roleId
        })
    }

    const getRoleName = (roleId: string) => {
        if (!roleId) return "Sem função"
        const role = roles?.find(r => r._id === roleId)
        if (!role || role.name === "no_role") return "Sem função"
        return role.name
    }


    const getStatusBadge = (status: string) => {
        switch (status) {
            case "ativo":
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Ativo</Badge>
            case "pendente":
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pendente</Badge>
            case "desativado":
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Desativado</Badge>
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    }

    return (
        <DashboardStaffContext.Provider value={{
            searchTerm,
            setSearchTerm,
            statusFilter,
            setStatusFilter,
            isInviteDialogOpen,
            setIsInviteDialogOpen,
            selectedMember,
            setSelectedMember,
            isEditDialogOpen,
            setIsEditDialogOpen,
            selectedMembers,
            setSelectedMembers,
            sortField,
            setSortField,
            sortDirection,
            setSortDirection,
            currentPage,
            setCurrentPage,
            itemsPerPage,
            viewMode,
            setViewMode,
            inviteForm,
            setInviteForm,
            stats,
            sortedMembers,
            paginatedMembers,
            totalPages,
            handleSort,
            handleSelectMember,
            handleSelectAll,
            handleEditMember,
            handleDeleteMember,
            updateMemberRole,
            getRoleName,
            getStatusBadge,
            handleBulkAction
        }}>
            {children}
        </DashboardStaffContext.Provider>
    )
}

export function useDashboardStaff() {
    const context = useContext(DashboardStaffContext)
    if (context === undefined) {
        throw new Error("useDashboardStaff must be used within a DashboardStaffProvider")
    }
    return context
} 