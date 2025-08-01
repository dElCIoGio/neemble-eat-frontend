import type React from "react"

import { useState } from "react"
import { ArrowLeft, Tag, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {Link, useNavigate} from "react-router";
import {CategoryCreate} from "@/types/category";
import {useDashboardContext} from "@/context/dashboard-context";
import {useGetRestaurantMenus} from "@/api/endpoints/menu/hooks";
import {Loader} from "@/components/ui/loader";
import {showPromiseToast, showSuccessToast, showWarningToast} from "@/utils/notifications/toast";
import {categoryApi} from "@/api/endpoints/categories/requests";




export default function CreateCategoryPage() {

    const { restaurant } = useDashboardContext()
    const { data: menus, isLoading } = useGetRestaurantMenus(restaurant._id)

    const navigate = useNavigate()

    const [formData, setFormData] = useState<CategoryCreate & {tags: string[] }>({
        name: "",
        restaurantId: restaurant._id,
        description: "",
        menuId: "",
        tags: [],
    })

    const [errors, setErrors] = useState<Record<string, string>>({})
    const [currentTag, setCurrentTag] = useState<string>("")
    const [isActive, setIsActive] = useState<boolean>(true)

    const handleInputChange = (field: keyof typeof formData, value: string | string[]) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }))
        }
    }


    const addTag = () => {
        if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
            setFormData((prev) => ({
                ...prev,
                tags: [...prev.tags, currentTag.trim()],
            }))
            setCurrentTag("")
            showSuccessToast("Tag adicionada")
        }
    }

    const removeTag = (tagToRemove: string) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.filter((tag) => tag !== tagToRemove),
        }))
        showSuccessToast("Tag removida")
    }

    const handleTagKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault()
            addTag()
        }
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.name.trim()) {
            newErrors.name = "Category name is required"
        }

        if (!formData.restaurantId) {
            newErrors.restaurantId = "Restaurant is required"
        }

        if (!formData.menuId) {
            newErrors.menuId = "RestaurantMenu is required"
        }

        if (!formData.description.trim()) {
            newErrors.description = "Description is required"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            showWarningToast("Preencha todos os campos para criar a categoria")
            return
        }

        showPromiseToast(
            categoryApi.createCategory(formData).then(() => navigate("..")),
            {
                loading: `Criando categoria ${formData.name}...`,
                success: "Categoria criada com sucesso!",
                error: "Houve uma falha ao criar a categoria. Por favor, tente novamente."
            }
        );



    }

    if (isLoading){
        return <div className="flex-1 flex justify-center items-center">
            <Loader/>
        </div>
    }


    if (!menus){
        return <div className="flex-1 flex justify-center items-center">
            There was an error while fetching the data
        </div>
    }



    return (
        <div className="">
            <div className="mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link to="../..?tab=categories">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Voltar para Categorias
                        </Button>
                    </Link>
                </div>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Criar Nova Categoria</h1>
                    <p className="text-gray-600">Adicione uma nova categoria para organizar os itens do seu cardápio.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações Básicas</CardTitle>
                            <CardDescription>Insira os detalhes essenciais para sua nova categoria.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome da Categoria *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    placeholder="ex: Entradas, Sobremesas, Bebidas"
                                    className={errors.name ? "border-red-500" : ""}
                                />
                                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="menu">Cardápio *</Label>
                                <Select value={formData.menuId} onValueChange={(value) => handleInputChange("menuId", value)}>
                                    <SelectTrigger className={errors.menuId ? "border-red-500" : ""}>
                                        <SelectValue placeholder={ menus.find((menu) => menu._id == restaurant.currentMenuId)?.name ?? "Selecione um cardápio" } />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {menus.map((menu) => (
                                            <SelectItem key={menu._id} value={menu._id}>
                                                {menu.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.menuId && <p className="text-sm text-red-500">{errors.menuId}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Descrição *</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange("description", e.target.value)}
                                    placeholder="Descreva esta categoria e os itens que ela contém"
                                    rows={3}
                                    className={errors.description ? "border-red-500" : ""}
                                />
                                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch checked={isActive} onCheckedChange={setIsActive} />
                                <Label>Categoria Ativa</Label>
                                <p className="text-sm text-gray-500 ml-2">
                                    {isActive
                                        ? "Esta categoria estará visível para os clientes"
                                        : "Esta categoria estará oculta dos clientes"}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tags */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Tags</CardTitle>
                            <CardDescription>Adicione tags para ajudar a organizar e filtrar suas categorias (opcional).</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        placeholder="Adicione uma tag e pressione Enter"
                                        value={currentTag}
                                        onChange={(e) => setCurrentTag(e.target.value)}
                                        onKeyDown={handleTagKeyDown}
                                        className="pl-10"
                                    />
                                </div>
                                <Button type="button" variant="outline" onClick={addTag} disabled={!currentTag.trim()}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Adicionar
                                </Button>
                            </div>

                            {formData.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {formData.tags.map((tag) => (
                                        <Badge key={tag} variant="secondary" className="px-3 py-1 text-sm">
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                className="ml-2 text-gray-500 hover:text-gray-700"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}

                            {formData.tags.length === 0 && (
                                <p className="text-sm text-gray-500">
                                    No tags added yet. Tags can help with filtering and organization.
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <Button type="submit">Criar Categoria</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
