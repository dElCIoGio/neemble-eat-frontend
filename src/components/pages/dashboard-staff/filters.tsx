import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDashboardStaff } from "@/context/dashboard-staff-context"

export function Filters() {
    const {
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,
        viewMode,
        setViewMode,
    } = useDashboardStaff()

    return (
        <Card className="mb-6">
            <CardHeader className="pb-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <CardTitle className="text-lg">Filtros</CardTitle>
                        <CardDescription>Pesquise e filtre os membros da equipa por critérios específicos.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant={viewMode === "table" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setViewMode(viewMode === "table" ? "cards" : "table")}
                            className="hidden lg:flex"
                        >
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Tabela
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    <div className="lg:col-span-2">
                        <Label htmlFor="search">Pesquisar por nome ou email</Label>
                        <div className="relative mt-1">
                            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                id="search"
                                placeholder="Digite o nome ou email do membro..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="status">Estado</Label>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="mt-1">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">Todos</SelectItem>
                                <SelectItem value="ativo">Ativo</SelectItem>
                                <SelectItem value="pendente">Pendente</SelectItem>
                                <SelectItem value="desativado">Desativado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
} 