import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpDown } from "lucide-react"
import { useDashboardStaff } from "@/context/dashboard-staff-context"
import MemberRow from "@/components/pages/dashboard-staff/member-row";



export function MembersTable() {

    const {
        paginatedMembers,
        selectedMembers,
        handleSelectAll,
        handleSort
    } = useDashboardStaff()

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-12">
                        <Checkbox
                            checked={selectedMembers.length === paginatedMembers.length && paginatedMembers.length > 0}
                            onCheckedChange={handleSelectAll}
                        />
                    </TableHead>
                    <TableHead>
                        <Button variant="ghost" onClick={() => handleSort("firstName")} className="h-auto p-0 font-medium">
                            Membro
                            <ArrowUpDown className="w-4 h-4 ml-2" />
                        </Button>
                    </TableHead>
                    <TableHead>
                        <Button variant="ghost" onClick={() => handleSort("email")} className="h-auto p-0 font-medium">
                            Função
                            <ArrowUpDown className="w-4 h-4 ml-2" />
                        </Button>
                    </TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>
                        <Button variant="ghost" onClick={() => handleSort("isActive")} className="h-auto p-0 font-medium">
                            Estado
                            <ArrowUpDown className="w-4 h-4 ml-2" />
                        </Button>
                    </TableHead>
                    <TableHead>
                        <Button variant="ghost" onClick={() => handleSort("updatedAt")} className="h-auto p-0 font-medium">
                            Último Acesso
                            <ArrowUpDown className="w-4 h-4 ml-2" />
                        </Button>
                    </TableHead>
                    <TableHead className="w-12"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {paginatedMembers.map((member) => (
                    <MemberRow key={member._id} user={member}/>
                ))}
            </TableBody>
        </Table>
    )
}

