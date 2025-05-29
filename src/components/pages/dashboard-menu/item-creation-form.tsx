
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

interface NewItem {
    name: string
    description: string
    price: number
    imageUrl: string
    categoryTempId: string
    isAvailable: boolean
    tempId: string
}

interface ItemCreationFormProps {
    item: NewItem
    onUpdate: (updates: Partial<NewItem>) => void
    onRemove: () => void
}

export function ItemCreationForm({ item, onUpdate, onRemove }: ItemCreationFormProps) {
    return (
        <Card className="transition-all duration-200 hover:shadow-md">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{item.name || "New Item"}</CardTitle>
                    <Button variant="ghost" size="sm" onClick={onRemove} className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor={`item-name-${item.tempId}`}>Item Name *</Label>
                        <Input
                            id={`item-name-${item.tempId}`}
                            value={item.name}
                            onChange={(e) => onUpdate({ name: e.target.value })}
                            placeholder="e.g., Grilled Chicken Breast"
                            className={item.name.trim() === "" ? "border-destructive" : ""}
                        />
                        {item.name.trim() === "" && <p className="text-sm text-destructive">Item name is required</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`item-price-${item.tempId}`}>Price ($) *</Label>
                        <Input
                            id={`item-price-${item.tempId}`}
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.price}
                            onChange={(e) => onUpdate({ price: Number.parseFloat(e.target.value) || 0 })}
                            placeholder="0.00"
                            className={item.price <= 0 ? "border-destructive" : ""}
                        />
                        {item.price <= 0 && <p className="text-sm text-destructive">Price must be greater than 0</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor={`item-description-${item.tempId}`}>Description</Label>
                    <Textarea
                        id={`item-description-${item.tempId}`}
                        value={item.description}
                        onChange={(e) => onUpdate({ description: e.target.value })}
                        placeholder="Describe the item, ingredients, preparation method..."
                        rows={3}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor={`item-image-${item.tempId}`}>Image URL</Label>
                    <Input
                        id={`item-image-${item.tempId}`}
                        value={item.imageUrl}
                        onChange={(e) => onUpdate({ imageUrl: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label className="text-base">Available</Label>
                        <div className="text-sm text-muted-foreground">Make this item available for ordering</div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Switch checked={item.isAvailable} onCheckedChange={(checked) => onUpdate({ isAvailable: checked })} />
                        <Badge variant={item.isAvailable ? "default" : "secondary"}>
                            {item.isAvailable ? "Available" : "Unavailable"}
                        </Badge>
                    </div>
                </div>

                {item.imageUrl && (
                    <div className="space-y-2">
                        <Label>Preview</Label>
                        <div className="w-full h-32 rounded-lg overflow-hidden bg-muted">
                            <img
                                src={item.imageUrl || "/placeholder.svg"}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = "none"
                                }}
                            />
                        </div>
                    </div>
                )}

                <div className="pt-2 border-t">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Item Price:</span>
                        <span className="font-semibold text-green-600">${item.price.toFixed(2)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
