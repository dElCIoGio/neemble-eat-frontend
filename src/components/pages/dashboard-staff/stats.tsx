import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Clock, Users, XCircle } from "lucide-react"
import { useDashboardStaff } from "@/context/dashboard-staff-context"

export function Stats() {
    const { stats } = useDashboardStaff()

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total</p>
                            <p className="text-2xl font-bold">{stats.total}</p>
                        </div>
                        <Users className="w-8 h-8 text-blue-500" />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Ativos</p>
                            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Pendentes</p>
                            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                        </div>
                        <Clock className="w-8 h-8 text-yellow-500" />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Inativos</p>
                            <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
                        </div>
                        <XCircle className="w-8 h-8 text-red-500" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
} 