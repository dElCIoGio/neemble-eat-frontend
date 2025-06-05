import { Category } from "@/types/category"
import { Button } from "@/components/ui/button"
import { Plus, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

interface CategoriesTableProps {
    categories: Category[]
    selectedCategory: Category | null
    onCategorySelect: (category: Category) => void
}

export function CategoriesTable({ categories, selectedCategory, onCategorySelect }: CategoriesTableProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Categorias</h2>
                <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Categoria
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                    <div
                        key={category._id}
                        className={cn(
                            "p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors",
                            selectedCategory?._id === category._id && "border-purple-500 bg-purple-50"
                        )}
                        onClick={() => onCategorySelect(category)}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium">{category.name}</h3>
                                <p className="text-sm text-gray-500">{category.description}</p>
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