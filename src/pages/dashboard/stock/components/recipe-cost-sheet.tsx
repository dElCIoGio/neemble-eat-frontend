import {Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {useStockContext} from "@/context/stock-context";
import type {Recipe} from "@/types/stock";
import type {Item} from "@/types/item";
import {formatCurrency} from "@/utils/format-currency";

interface RecipeCostSheetProps {
  recipe: Recipe | null;
  menuItem?: Item;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RecipeCostSheet({recipe, menuItem, open, onOpenChange}: RecipeCostSheetProps) {
  const {stockItems} = useStockContext();

  if (!recipe) return null;

  const totalCost = recipe.cost;
  const price = menuItem?.price ?? 0;
  const profit = price - totalCost;

  const ingredients = recipe.ingredients.map((ing) => {
    const product = stockItems.find((item) => item._id === ing.productId);
    const unitCost = product?.cost ?? 0;
    const cost = unitCost * ing.quantity;
    return {
      ...ing,
      unitCost,
      cost,
    };
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Custo de {menuItem?.name || recipe.dishName}</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Preço</span>
              <span>{formatCurrency(price)}</span>
            </div>
            <div className="flex justify-between">
              <span>Custo</span>
              <span>{formatCurrency(totalCost)}</span>
            </div>
            <div className="flex justify-between">
              <span>Lucro</span>
              <span className={profit < 0 ? "text-red-500" : undefined}>{formatCurrency(profit)}</span>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ingrediente</TableHead>
                <TableHead>Qtd.</TableHead>
                <TableHead>Custo</TableHead>
                <TableHead>%</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ingredients.map((ing) => (
                <TableRow key={ing.productId}>
                  <TableCell>{ing.productName}</TableCell>
                  <TableCell>{`${ing.quantity} ${ing.unit}`}</TableCell>
                  <TableCell>{formatCurrency(ing.cost)}</TableCell>
                  <TableCell>{totalCost ? `${((ing.cost / totalCost) * 100).toFixed(1)}%` : "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SheetContent>
    </Sheet>
  );
}

