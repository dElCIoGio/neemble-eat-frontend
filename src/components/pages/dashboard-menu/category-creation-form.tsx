
import type React from "react"

import { Trash2, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

interface NewCategory {
    name: string
    description: string
    imageUrl: string
    position: number
    isActive: boolean
    tags: string[]
    tempId: string
}

interface CategoryCreationFormProps {
    category: NewCategory
    index: number
    onUpdate: (updates: Partial<NewCategory>) => void
    onRemove: () => void
    onDragStart: () => void
    onDragOver: (e: React.DragEvent) => void
    onDrop: (e: React.DragEvent) => void
}

export function CategoryCreationForm({
                                         category,
                                         index,
                                         onUpdate,
                                         onRemove,
                                         onDragStart,
                                         onDragOver,
                                         onDrop,
                                     }: CategoryCreationFormProps) {
    const handleTagAdd = (tag: string) => {
        if (tag.trim() && !category.tags.includes(tag.trim())) {
            onUpdate({ tags: [...category.tags, tag.trim()] })
        }
    }

    const handleTagRemove = (tagToRemove: string) => {
        onUpdate({ tags: category.tags.filter((tag) => tag !== tagToRemove) })
    }

    return (
        <Card
            className="transition-all duration-200 hover:shadow-md"
            draggable
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
        >
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                        <CardTitle className="text-lg">
                            Category {index + 1}
                            {category.name && `: ${category.name}`}
                        </CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline">Position {category.position}</Badge>
                        <Button variant="ghost" size="sm" onClick={onRemove} className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor={`category-name-${category.tempId}`}>Category Name *</Label>
                        <Input
                            id={`category-name-${category.tempId}`}
                            value={category.name}
                            onChange={(e) => onUpdate({ name: e.target.value })}
                            placeholder="e.g., Appetizers, Main Courses"
                            className={category.name.trim() === "" ? "border-destructive" : ""}
                        />
                        {category.name.trim() === "" && <p className="text-sm text-destructive">Category name is required</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`category-image-${category.tempId}`}>Image URL</Label>
                        <Input
                            id={`category-image-${category.tempId}`}
                            value={category.imageUrl}
                            onChange={(e) => onUpdate({ imageUrl: e.target.value })}
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor={`category-description-${category.tempId}`}>Description</Label>
                    <Textarea
                        id={`category-description-${category.tempId}`}
                        value={category.description}
                        onChange={(e) => onUpdate({ description: e.target.value })}
                        placeholder="Brief description of this category..."
                        rows={3}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {category.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => handleTagRemove(tag)}>
                                {tag} ×
                            </Badge>
                        ))}
                    </div>
                    <Input
                        placeholder="Add tags (press Enter)"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault()
                                handleTagAdd(e.currentTarget.value)
                                e.currentTarget.value = ""
                            }
                        }}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label className="text-base">Active</Label>
                        <div className="text-sm text-muted-foreground">Make this category visible to customers</div>
                    </div>
                    <Switch checked={category.isActive} onCheckedChange={(checked) => onUpdate({ isActive: checked })} />
                </div>

                {category.imageUrl && (
                    <div className="space-y-2">
                        <Label>Preview</Label>
                        <div className="w-full h-32 rounded-lg overflow-hidden bg-muted">
                            <img
                                src={category.imageUrl || "/placeholder.svg"}
                                alt={category.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = "none"
                                }}
                            />
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
