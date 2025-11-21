"use client";

import { Hotspot, Product } from "@/lib/hotspots";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductSearch } from "@/components/common/ProductSearch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HotspotPropertiesPanelProps {
  selectedHotspot: Hotspot | null;
  onChange: (partial: Partial<Hotspot>) => void;
  onDelete: () => void;
}

export function HotspotPropertiesPanel({
  selectedHotspot,
  onChange,
  onDelete,
}: HotspotPropertiesPanelProps) {
  if (!selectedHotspot) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Hotspot Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Select a hotspot on the page to edit its properties or draw a new
            rectangle to create one.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleNumericChange =
    (key: keyof Hotspot) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value || "0");
      onChange({ [key]: value } as Partial<Hotspot>);
    };

  const handleProductChange = (product: Product | null) => {
    onChange({
      productId: product?.id ?? null,
      product: product,
    });
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Hotspot #{selectedHotspot.id.slice(0, 6)}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-medium">X</label>
            <Input
              type="number"
              value={selectedHotspot.x}
              onChange={handleNumericChange("x")}
            />
          </div>
          <div>
            <label className="text-xs font-medium">Y</label>
            <Input
              type="number"
              value={selectedHotspot.y}
              onChange={handleNumericChange("y")}
            />
          </div>
          <div>
            <label className="text-xs font-medium">Width</label>
            <Input
              type="number"
              value={selectedHotspot.width}
              onChange={handleNumericChange("width")}
            />
          </div>
          <div>
            <label className="text-xs font-medium">Height</label>
            <Input
              type="number"
              value={selectedHotspot.height}
              onChange={handleNumericChange("height")}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium">Product</label>
          <ProductSearch
            value={selectedHotspot.product ?? null}
            onChange={handleProductChange}
          />
        </div>

        <div className="pt-4">
          <Button
            type="button"
            variant="destructive"
            className="w-full"
            onClick={onDelete}
          >
            Delete hotspot
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
