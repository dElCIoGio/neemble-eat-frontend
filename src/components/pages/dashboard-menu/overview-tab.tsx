import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Edit2, Check, X } from "lucide-react"
import {Menu} from "@/types/menu";

interface OverviewTabProps {
    menu: Menu
    onUpdate: (updatedMenu: Partial<Menu>) => void
}

export function OverviewTab({ menu, onUpdate }: OverviewTabProps) {
    const [isEditingName, setIsEditingName] = useState(false)
    const [isEditingDescription, setIsEditingDescription] = useState(false)
    const [tempName, setTempName] = useState(menu.name)
    const [tempDescription, setTempDescription] = useState(menu.description)

    const handleNameSave = () => {
        onUpdate({ name: tempName })
        setIsEditingName(false)
    }

    const handleNameCancel = () => {
        setTempName(menu.name)
        setIsEditingName(false)
    }

    const handleDescriptionSave = () => {
        onUpdate({ description: tempDescription })
        setIsEditingDescription(false)
    }

    const handleDescriptionCancel = () => {
        setTempDescription(menu.description)
        setIsEditingDescription(false)
    }

    const handleBlur = (field: "name" | "description") => (e: React.FocusEvent<HTMLElement>) => {
        const related = e.relatedTarget as HTMLElement | null
        const isFieldName = field === "name";
        if (related?.dataset?.action === "cancel") {
            if (isFieldName)
                handleNameCancel()
            else
                handleDescriptionCancel()
        } else {
            if (isFieldName)
                handleNameSave()
            else
                handleDescriptionSave()
        }
    }

    const handlePreferenceChange = (key: keyof typeof menu.preferences, value: boolean) => {
        onUpdate({
            preferences: {
                ...menu.preferences,
                [key]: value,
            },
        })
    }

    return (
        <div className="space-y-6">
            {/* Informações Básicas */}
            <Card>
                <CardHeader>
                    <CardTitle>Informações Básicas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Nome do Menu */}
                    <div className="space-y-2">
                        <Label htmlFor="menu-name">Nome do Cardápio</Label>
                        {isEditingName ? (
                            <div className="flex items-center gap-2">
                                <Input
                                    id="menu-name"
                                    value={tempName}
                                    onChange={(e) => setTempName(e.target.value)}
                                    onBlur={handleBlur("name")}
                                    className="flex-1"
                                    autoFocus
                                />
                                <Button size="sm" onClick={handleNameSave}>
                                    <Check className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline" data-action="cancel" onClick={handleNameCancel}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 group" onClick={() => setIsEditingName(true)}>
                                <div className="flex-1 p-2 border border-transparent rounded-md hover:border-gray-200 transition-colors cursor-text">
                                    <span className="text-sm font-medium">{menu.name}</span>
                                </div>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setIsEditingName(true)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Descrição do Menu */}
                    <div className="space-y-2">
                        <Label htmlFor="menu-description">Descrição</Label>
                        {isEditingDescription ? (
                            <div className="space-y-2">
                                <Textarea
                                    id="menu-description"
                                    value={tempDescription}
                                    onChange={(e) => setTempDescription(e.target.value)}
                                    onBlur={handleBlur("description")}
                                    rows={3}
                                    autoFocus
                                />
                                <div className="flex items-center gap-2">
                                    <Button size="sm" onClick={handleDescriptionSave}>
                                        <Check className="h-4 w-4 mr-2" />
                                        Salvar
                                    </Button>
                                    <Button size="sm" variant="outline" data-action="cancel" onClick={handleDescriptionCancel}>
                                        <X className="h-4 w-4 mr-2" />
                                        Cancelar
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="group" onClick={() => setIsEditingDescription(true)}>
                                <div className="p-2 border border-transparent rounded-md hover:border-gray-200 transition-colors min-h-[80px] flex items-start justify-between cursor-text">
                                    <p className="text-sm text-gray-600 flex-1">{menu.description}</p>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setIsEditingDescription(true)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Preferências de Exibição */}
            <Card className="hidden">
                <CardHeader>
                    <CardTitle>Preferências de Exibição</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Destaque os Itens em Destaque</Label>
                            <p className="text-sm text-gray-500">Mostrar itens em destaque de forma proeminente no cardápio</p>
                        </div>
                        <Switch
                            checked={menu.preferences.highlightFeaturedItems}
                            onCheckedChange={(checked) => handlePreferenceChange("highlightFeaturedItems", checked)}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Mostrar Preços</Label>
                            <p className="text-sm text-gray-500">Exibir os preços dos itens para os clientes</p>
                        </div>
                        <Switch
                            checked={menu.preferences.showPrices}
                            onCheckedChange={(checked) => handlePreferenceChange("showPrices", checked)}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Mostrar Imagens dos Itens</Label>
                            <p className="text-sm text-gray-500">Exibir imagens para os itens do cardápio</p>
                        </div>
                        <Switch
                            checked={menu.preferences.showItemImages}
                            onCheckedChange={(checked) => handlePreferenceChange("showItemImages", checked)}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Estatísticas do Cardápio */}
            <Card className="bg-white shadow-sm rounded-xl border border-gray-200">
                <CardHeader className="border-b border-gray-100">
                    <CardTitle className="text-lg font-semibold text-gray-800">Estatísticas do Cardápio</CardTitle>
                </CardHeader>
                <CardContent className="px-6 ">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center space-y-1">
                            <div className="text-3xl font-medium text-gray-900">{menu.categoryIds.length}</div>
                            <div className="text-sm text-gray-400">Categorias</div>
                        </div>
                        <div className="text-center space-y-1">
                            <div className="text-3xl font-medium text-gray-900">13</div>
                            <div className="text-sm text-gray-400">Itens</div>
                        </div>
                        <div className="text-center space-y-1">
                            <div
                                className={`text-3xl font-medium ${
                                    menu.isActive ? "text-gray-900" : "text-gray-400"
                                }`}
                            >
                                {menu.isActive ? "Ativo" : "Inativo"}
                            </div>
                            <div className="text-sm text-gray-400">Status</div>
                        </div>
                        <div className="text-center space-y-1">
                            <div className="text-3xl font-medium text-gray-900">
                                {new Date(menu.updatedAt).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-400">Última atualização</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

        </div>
    )
}
