
import { useState } from "react"
import { Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { Menu } from "@/types/menu"

interface MenuPreferencesEditorProps {
  menu: Menu
  onUpdateMenu: (menu: Menu) => void
}

export function MenuPreferencesEditor({ menu, onUpdateMenu }: MenuPreferencesEditorProps) {
  const [preferences, setPreferences] = useState(menu.preferences)
  const [hasChanges, setHasChanges] = useState(false)

  const handlePreferenceChange = (key: keyof typeof preferences, value: boolean) => {
    const newPreferences = { ...preferences, [key]: value }
    setPreferences(newPreferences)
    setHasChanges(true)
  }

  const handleSave = () => {
    onUpdateMenu({
      ...menu,
      preferences,
    })
    setHasChanges(false)
  }

  const handleReset = () => {
    setPreferences(menu.preferences)
    setHasChanges(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Menu Preferences</h2>
          <p className="text-muted-foreground">Configure how this menu is displayed to customers</p>
        </div>
        {hasChanges && (
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleReset}>
              <X className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Display Options</CardTitle>
            <CardDescription>Control what information is shown to customers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Show Prices</Label>
                <div className="text-sm text-muted-foreground">Display item prices on the menu</div>
              </div>
              <Switch
                checked={preferences.showPrices}
                onCheckedChange={(checked) => handlePreferenceChange("showPrices", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Show Item Images</Label>
                <div className="text-sm text-muted-foreground">Display images for menu items</div>
              </div>
              <Switch
                checked={preferences.showItemImages}
                onCheckedChange={(checked) => handlePreferenceChange("showItemImages", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Highlight Featured Items</Label>
                <div className="text-sm text-muted-foreground">Emphasize special or recommended items</div>
              </div>
              <Switch
                checked={preferences.highlightFeaturedItems}
                onCheckedChange={(checked) => handlePreferenceChange("highlightFeaturedItems", checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>See how your menu will appear to customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
              <div className="text-lg font-semibold">{menu.name}</div>
              <div className="text-sm text-muted-foreground">{menu.description}</div>

              <div className="space-y-3">
                <div className="font-medium">Sample Category</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-background rounded border">
                    <div className="flex items-center gap-3">
                      {preferences.showItemImages && <div className="w-12 h-12 bg-muted rounded"></div>}
                      <div>
                        <div className="font-medium">Sample Menu Item</div>
                        <div className="text-sm text-muted-foreground">Delicious sample description</div>
                      </div>
                    </div>
                    {preferences.showPrices && <div className="font-semibold text-green-600">$12.99</div>}
                  </div>

                  {preferences.highlightFeaturedItems && (
                    <div className="flex items-center justify-between p-2 bg-primary/10 rounded border border-primary/20">
                      <div className="flex items-center gap-3">
                        {preferences.showItemImages && <div className="w-12 h-12 bg-muted rounded"></div>}
                        <div>
                          <div className="font-medium">Featured Item ⭐</div>
                          <div className="text-sm text-muted-foreground">Special recommended dish</div>
                        </div>
                      </div>
                      {preferences.showPrices && <div className="font-semibold text-green-600">$18.99</div>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
