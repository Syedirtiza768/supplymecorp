"use client";

import { useEffect, useState } from "react";
import { searchProducts, Product } from "@/lib/hotspots";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductSearchProps {
  value?: Product | null;
  onChange: (product: Product | null) => void;
}

export function ProductSearch({ value, onChange }: ProductSearchProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      return;
    }

    const handle = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await searchProducts(search);
        setResults(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(handle);
  }, [search]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          className="w-full justify-between"
        >
          {value ? (
            <span>
              {value.name}
              {value.sku ? ` (${value.sku})` : ""}
            </span>
          ) : (
            "Link product"
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0">
        <Command>
          <CommandInput
            placeholder="Search by name / SKU / OEM..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {loading && <CommandEmpty>Searching...</CommandEmpty>}
            {!loading && (
              <>
                <CommandEmpty>No products found.</CommandEmpty>
                <CommandGroup>
                  {results.map((product) => (
                    <CommandItem
                      key={product.id}
                      onSelect={() => {
                        onChange(product);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value?.id === product.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <span>
                        {product.name}
                        {product.sku ? ` (${product.sku})` : ""}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
