
import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import type { Menu } from "@/types/menu"
import type { Category } from "@/types/category"

interface MenuFiltersProps {
  menus: Menu[]
  categories: Category[]
  onFiltersChange: (filters: unknown) => void
}

interface FilterState {
  priceRange: [number, number]
  availability: boolean[]
  menuIds: string[]
  categoryIds: string[]
  tags: string[]
}

export function MenuFilters({ menus, categories, onFiltersChange }: MenuFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 50],
    availability: [true, false],
    menuIds: [],
    categoryIds: [],
    tags: [],
  })

  const allTags = Array.from(new Set(categories.flatMap((c) => c.tags || [])))

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)
    onFiltersChange(updated)
  }

  const clearFilters = () => {
    const cleared = {
      priceRange: [0, 50] as [number, number],
      availability: [true, false],
      menuIds: [],
      categoryIds: [],
      tags: [],
    }
    setFilters(cleared)
    onFiltersChange(cleared)
  }

  const activeFiltersCount =
    (filters.menuIds.length > 0 ? 1 : 0) +
    (filters.categoryIds.length > 0 ? 1 : 0) +
    (filters.tags.length > 0 ? 1 : 0) +
    (filters.availability.length !== 2 ? 1 : 0) +
    (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 50 ? 1 : 0)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Advanced Filters</CardTitle>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && <Badge variant="secondary">{activeFiltersCount} active</Badge>}
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Price Range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Price Range</Label>
            <div className="px-2">
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
                max={50}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Availability</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="available"
                  checked={filters.availability.includes(true)}
                  onCheckedChange={(checked) => {
                    const newAvailability = checked
                      ? [...filters.availability.filter((a) => a !== true), true]
                      : filters.availability.filter((a) => a !== true)
                    updateFilters({ availability: newAvailability })
                  }}
                />
                <Label htmlFor="available" className="text-sm">
                  Available
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="unavailable"
                  checked={filters.availability.includes(false)}
                  onCheckedChange={(checked) => {
                    const newAvailability = checked
                      ? [...filters.availability.filter((a) => a !== false), false]
                      : filters.availability.filter((a) => a !== false)
                    updateFilters({ availability: newAvailability })
                  }}
                />
                <Label htmlFor="unavailable" className="text-sm">
                  Unavailable
                </Label>
              </div>
            </div>
          </div>

          {/* Menus */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Menus</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {menus.map((menu) => (
                <div key={menu.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`menu-${menu.id}`}
                    checked={filters.menuIds.includes(menu.id)}
                    onCheckedChange={(checked) => {
                      const newMenuIds = checked
                        ? [...filters.menuIds, menu.id]
                        : filters.menuIds.filter((id) => id !== menu.id)
                      updateFilters({ menuIds: newMenuIds })
                    }}
                  />
                  <Label htmlFor={`menu-${menu.id}`} className="text-sm">
                    {menu.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Tags</Label>
            <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={filters.tags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => {
                    const newTags = filters.tags.includes(tag)
                      ? filters.tags.filter((t) => t !== tag)
                      : [...filters.tags, tag]
                    updateFilters({ tags: newTags })
                  }}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
