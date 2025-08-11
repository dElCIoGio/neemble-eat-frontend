import {Button} from "@/components/ui/button";
import {Card, CardHeader, CardTitle, CardContent, CardFooter} from "@/components/ui/card";
import {Trash2} from "lucide-react";
import {Recipe} from "@/types/stock";
import type {Item} from "@/types/item";
import {formatCurrency} from "@/utils/format-currency";

interface RecipeCardProps {
    recipe: Recipe;
    menuItems: Item[];
    onEdit: (recipe: Recipe) => void;
    onDelete: (id: string) => void;
}

export function RecipeCard({recipe, menuItems, onEdit, onDelete}: RecipeCardProps) {
    const item = menuItems.find(i => i._id === recipe.menuItemId);
    const dishName = item?.name || recipe.dishName;
    const profit = (item?.price ?? 0) - recipe.cost;
    return (
        <Card>
            <CardHeader>
                <CardTitle>{dishName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
                <div className="flex justify-between">
                    <span>Porções:</span>
                    <span>{recipe.servings}</span>
                </div>
                <div className="flex justify-between">
                    <span>Custo:</span>
                    <span>{formatCurrency(recipe.cost)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Lucro:</span>
                    <span className={profit < 0 ? "text-red-500" : undefined}>{formatCurrency(profit)}</span>
                </div>
            </CardContent>
            <CardFooter className="justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => onEdit(recipe)}>
                    Editar
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(recipe._id)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    );
}

