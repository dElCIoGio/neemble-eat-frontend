import { Item } from "@/types/item"
import { Category } from "@/types/category"
import { Button } from "@/components/ui/button"
import { Plus, Settings } from "lucide-react"

interface ItemsSectionProps {
    items: Item[]
    selectedCategory: Category | null
    showCategoryName: boolean
    categories: Category[]
}

export function ItemsSection({ items, selectedCategory, showCategoryName, categories }: ItemsSectionProps) {
    const getCategoryName = (categoryId: string) => {
        const category = categories.find((cat) => cat._id === categoryId)
        return category?.name || "Categoria Desconhecida"
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                    {selectedCategory ? selectedCategory.name : "Itens"}
                </h2>
                <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Item
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => (
                    <div
                        key={item._id}
                        className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium">{item.name}</h3>
                                <p className="text-sm text-gray-500">{item.description}</p>
                                {showCategoryName && (
                                    <p className="text-xs text-gray-400 mt-1">
                                        {getCategoryName(item.categoryId)}
                                    </p>
                                )}
                                <p className="text-sm font-medium mt-2">
                                    {item.price.toLocaleString("pt-PT", {
                                        style: "currency",
                                        currency: "EUR",
                                    })}
                                </p>
                            </div>
                            <Button variant="ghost" size="sm">
                                <Settings className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
} 