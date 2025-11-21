"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  getPageWithHotspots,
  savePageHotspots,
  listPages,
  HotspotInput,
  Hotspot,
  FlipbookPage,
} from "@/lib/flipbooks";
import { FlipbookCanvas } from "@/components/annotator/FlipbookCanvas";
import { ProductSearch } from "@/components/annotator/ProductSearch";
import { SaveBar } from "@/components/annotator/SaveBar";
import { Button } from "@/components/ui/button";
import { Checkbox, CheckboxProps } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Plus, Eye, EyeOff, Upload, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { deletePage, deletePages } from "@/lib/flipbooks";
import { cn } from "@/lib/utils";
export default function AnnotatePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const flipbookId = (params.flipbookId as string) || "2025-Catalog-Spring-Summer";
  const pageNumber = Number(params.pageNumber ?? 1);

  // State hooks
  const [page, setPage] = useState<FlipbookPage | null>(null);
  const [pages, setPages] = useState<FlipbookPage[]>([]);
  const [hotspots, setHotspots] = useState<HotspotInput[]>([]);
  const [originalHotspots, setOriginalHotspots] = useState<HotspotInput[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [previewMode, setPreviewMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  // Multi-select for pages
  const [selectedPages, setSelectedPages] = useState<number[]>([]);

  const togglePageSelection = (pageNum: number) => {
    setSelectedPages((prev) =>
      prev.includes(pageNum) ? prev.filter((n) => n !== pageNum) : [...prev, pageNum]
    );
  };

  const handleDeleteSelectedPages = async () => {
    if (selectedPages.length === 0) return;
    if (!window.confirm(`Delete ${selectedPages.length} selected page(s)? This cannot be undone.`)) return;
    try {
      await deletePages(flipbookId, selectedPages);
      toast({
        title: "Pages deleted",
        description: `${selectedPages.length} page(s) deleted successfully.`,
      });
      // Refresh page list and redirect if current page is deleted
      const allPages = await listPages(flipbookId);
      setPages(allPages);
      if (!allPages.find((p) => p.pageNumber === pageNumber)) {
        if (allPages.length === 0) {
          router.push(`/admin/flipbooks/${flipbookId}/pages/upload`);
        } else {
          router.push(`/admin/flipbooks/${flipbookId}/pages/${allPages[0].pageNumber}/annotate`);
        }
      }
      setSelectedPages([]);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to delete pages',
        variant: "destructive",
      });
    }
  };

  const selectedHotspot = hotspots.find((h) => h.id === selectedId);
  const hasChanges = JSON.stringify(hotspots) !== JSON.stringify(originalHotspots);

  const currentPageIndex = pages.findIndex((p) => p.pageNumber === pageNumber);
  const hasPrevPage = currentPageIndex > 0;
  const hasNextPage = currentPageIndex < pages.length - 1;

  const goToPrevPage = () => {
    if (hasPrevPage) {
      const prevPage = pages[currentPageIndex - 1];
      router.push(`/admin/flipbooks/${flipbookId}/pages/${prevPage.pageNumber}/annotate`);
    }
  };

  const goToNextPage = () => {
    if (hasNextPage) {
      const nextPage = pages[currentPageIndex + 1];
      router.push(`/admin/flipbooks/${flipbookId}/pages/${nextPage.pageNumber}/annotate`);
    }
  };

  // Delete current page handler
  const handleDeletePage = async () => {
    if (!page) return;
    if (!window.confirm(`Delete page ${page.pageNumber}? This cannot be undone.`)) return;
    try {
      await deletePage(flipbookId, page.pageNumber);
      toast({
        title: "Page deleted",
        description: `Page ${page.pageNumber} was deleted successfully.`,
      });
      // Refresh page list and redirect
      const allPages = await listPages(flipbookId);
      setPages(allPages);
      if (allPages.length === 0) {
        router.push(`/admin/flipbooks/${flipbookId}/pages/upload`);
      } else {
        // Go to previous page if possible, else first page
        const prev = allPages.find((p) => p.pageNumber < page.pageNumber);
        const next = allPages.find((p) => p.pageNumber > page.pageNumber);
        const goto = prev || next || allPages[0];
        router.push(`/admin/flipbooks/${flipbookId}/pages/${goto.pageNumber}/annotate`);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to delete page',
        variant: "destructive",
      });
    }
  };

  const loadPage = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getPageWithHotspots(flipbookId, pageNumber);
      setPage(result.page);
      setHotspots(result.hotspots as HotspotInput[]);
      setOriginalHotspots(result.hotspots as HotspotInput[]);
    } catch (error) {
      console.error("Failed to load page:", error);
      toast({
        title: "Error",
        description: "Failed to load page and hotspots",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [flipbookId, pageNumber, toast]);

  const loadPages = useCallback(async () => {
    try {
      const allPages = await listPages(flipbookId);
      setPages(allPages);
    } catch (error) {
      console.error("Failed to load pages:", error);
    }
  }, [flipbookId]);

  useEffect(() => {
    loadPage();
    loadPages();
  }, [loadPage, loadPages]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + Left Arrow: Previous page
      if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevPage();
      }
      // Alt + Right Arrow: Next page
      if (e.altKey && e.key === 'ArrowRight') {
        e.preventDefault();
        goToNextPage();
      }
      // P: Toggle preview
      if (e.key === 'p' || e.key === 'P') {
        if (!(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
          e.preventDefault();
          setPreviewMode(prev => !prev);
        }
      }
      // Ctrl/Cmd + S: Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (hasChanges && !saving) {
          handleSave();
        }
      }
      // Delete: Delete selected hotspot
      if (e.key === 'Delete' && selectedId) {
        if (!(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
          e.preventDefault();
          handleDeleteHotspot(selectedId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasPrevPage, hasNextPage, hasChanges, saving, selectedId]);

  const handleSave = async () => {
    if (!page) return;
    
    setSaving(true);
    try {
      const savedHotspots = await savePageHotspots(flipbookId, pageNumber, hotspots);
      console.log('Hotspots saved successfully:', savedHotspots);
      
      // Reload to confirm save
      await loadPage();
      
      toast({
        title: "Success",
        description: `${hotspots.length} hotspot(s) saved successfully`,
      });
    } catch (error) {
      console.error("Save failed:", error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save hotspots';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateHotspot = (id: string, updates: Partial<HotspotInput>) => {
    setHotspots((prev) =>
      prev.map((h) => (h.id === id ? { ...h, ...updates } : h))
    );
  };

  const handleDeleteHotspot = (id: string) => {
    setHotspots((prev) => prev.filter((h) => h.id !== id));
    setSelectedId(null);
  };

  const handleDuplicateHotspot = () => {
    if (!selectedHotspot) return;
    const newHotspot: HotspotInput = {
      ...selectedHotspot,
      id: `temp-${Date.now()}`,
      x: selectedHotspot.x + 2,
      y: selectedHotspot.y + 2,
    };
    setHotspots((prev) => [...prev, newHotspot]);
    setSelectedId(newHotspot.id!);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading page...</p>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Page not found</p>
        <Button onClick={() => router.push(`/admin/flipbooks/${flipbookId}/pages/upload`)}>
          <Upload className="mr-2 h-4 w-4" />
          Upload New Page
        </Button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="border-b px-6 py-3 flex items-center justify-between bg-background">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/admin/flipbooks')}
            title="Back to Flipbooks"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div>
            <h1 className="text-lg font-semibold">Flipbook Annotator</h1>
            <p className="text-sm text-muted-foreground">
              {flipbookId} • Page {pageNumber} of {pages.length}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDeletePage}
            title="Delete This Page"
            disabled={pages.length <= 1}
          >
            <Trash2 className="h-5 w-5 text-destructive" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevPage}
            disabled={!hasPrevPage}
            title="Previous Page (Alt+Left)"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={!hasNextPage}
            title="Next Page (Alt+Right)"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Button
            variant={previewMode ? "default" : "outline"}
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
            title="Toggle Preview Mode (P)"
          >
            {previewMode ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
            {previewMode ? "Preview" : "Edit"}
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-64 border-r flex flex-col">
          <div className="p-4 space-y-4">
            <div>
              <Label className="text-xs">Zoom</Label>
              <Slider
                value={[zoom * 100]}
                onValueChange={([val]) => setZoom(val / 100)}
                min={25}
                max={200}
                step={5}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">{Math.round(zoom * 100)}%</p>
            </div>

            <Separator />

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                const newHotspot: HotspotInput = {
                  id: `temp-${Date.now()}`,
                  productSku: "",
                  x: 10,
                  y: 10,
                  width: 20,
                  height: 15,
                  zIndex: hotspots.length,
                };
                setHotspots((prev) => [...prev, newHotspot]);
                setSelectedId(newHotspot.id!);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Hotspot
            </Button>

            <div className="text-xs text-muted-foreground space-y-1 pt-2">
              <p className="font-semibold">Shortcuts:</p>
              <p>• Draw: Click & drag on canvas</p>
              <p>• Save: Ctrl/Cmd + S</p>
              <p>• Preview: P</p>
              <p>• Delete: Delete key</p>
              <p>• Next/Prev: Alt + Arrow</p>
            </div>
          </div>

          <Separator />

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={pages.length > 0 && selectedPages.length === pages.length}
                    indeterminate={selectedPages.length > 0 && selectedPages.length < pages.length}
                    onCheckedChange={() => {
                      if (selectedPages.length === pages.length) {
                        setSelectedPages([]);
                      } else {
                        setSelectedPages(pages.map((p) => p.pageNumber));
                      }
                    }}
                    aria-label="Select all pages"
                  />
                  <Label className="text-xs font-semibold select-none cursor-pointer">Pages</Label>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="ml-2 px-2 py-1 h-7"
                  onClick={handleDeleteSelectedPages}
                  disabled={selectedPages.length === 0}
                  title="Delete selected pages"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              {pages.map((p) => (
                <div key={p.id} className="flex items-center gap-2 mb-1">
                  <Checkbox
                    checked={selectedPages.includes(p.pageNumber)}
                    onCheckedChange={() => togglePageSelection(p.pageNumber)}
                    aria-label={`Select page ${p.pageNumber}`}
                  />
                  <Button
                    variant={p.pageNumber === pageNumber ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => router.push(`/admin/flipbooks/${flipbookId}/pages/${p.pageNumber}/annotate`)}
                  >
                    Page {p.pageNumber}
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </aside>

        {/* Center Canvas */}
        <main className="flex-1 overflow-auto bg-muted/20 p-8">
          <FlipbookCanvas
            imageUrl={page.imageUrl}
            hotspots={hotspots}
            selectedId={selectedId}
            zoom={zoom}
            previewMode={previewMode}
            onHotspotsChange={setHotspots}
            onSelectHotspot={setSelectedId}
          />
        </main>

        {/* Right Sidebar */}
        <aside className="w-80 border-l flex flex-col">
          <ScrollArea className="flex-1">
            {selectedHotspot ? (
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Hotspot Properties</h3>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleDuplicateHotspot}
                      title="Duplicate"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteHotspot(selectedHotspot.id!)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="product">Product</Label>
                    <ProductSearch
                      value={selectedHotspot.label || selectedHotspot.productSku}
                      onSelect={(sku, name) => {
                        handleUpdateHotspot(selectedHotspot.id!, {
                          productSku: sku,
                          label: name,
                          linkUrl: `/shop/${sku}`,
                        });
                      }}
                    />
                  </div>

                  <div>
                    <Label htmlFor="label">Label</Label>
                    <Input
                      id="label"
                      value={selectedHotspot.label || ""}
                      onChange={(e) =>
                        handleUpdateHotspot(selectedHotspot.id!, { label: e.target.value })
                      }
                      placeholder="Optional display label"
                    />
                  </div>

                  <div>
                    <Label htmlFor="linkUrl">Link URL</Label>
                    <Input
                      id="linkUrl"
                      value={selectedHotspot.linkUrl || ""}
                      onChange={(e) =>
                        handleUpdateHotspot(selectedHotspot.id!, { linkUrl: e.target.value })
                      }
                      placeholder="Optional link"
                    />
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">X (%)</Label>
                      <Input
                        type="number"
                        value={selectedHotspot.x.toFixed(2)}
                        onChange={(e) =>
                          handleUpdateHotspot(selectedHotspot.id!, { x: Number(e.target.value) })
                        }
                        step={0.1}
                        className="text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Y (%)</Label>
                      <Input
                        type="number"
                        value={selectedHotspot.y.toFixed(2)}
                        onChange={(e) =>
                          handleUpdateHotspot(selectedHotspot.id!, { y: Number(e.target.value) })
                        }
                        step={0.1}
                        className="text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Width (%)</Label>
                      <Input
                        type="number"
                        value={selectedHotspot.width.toFixed(2)}
                        onChange={(e) =>
                          handleUpdateHotspot(selectedHotspot.id!, { width: Number(e.target.value) })
                        }
                        step={0.1}
                        className="text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Height (%)</Label>
                      <Input
                        type="number"
                        value={selectedHotspot.height.toFixed(2)}
                        onChange={(e) =>
                          handleUpdateHotspot(selectedHotspot.id!, { height: Number(e.target.value) })
                        }
                        step={0.1}
                        className="text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="zIndex" className="text-xs">Z-Index</Label>
                    <Input
                      id="zIndex"
                      type="number"
                      value={selectedHotspot.zIndex ?? 0}
                      onChange={(e) =>
                        handleUpdateHotspot(selectedHotspot.id!, { zIndex: Number(e.target.value) })
                      }
                      className="text-xs"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                <h3 className="font-semibold">All Hotspots ({hotspots.length})</h3>
                <Separator />
                {hotspots.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No hotspots yet. Draw on the canvas or click "New Hotspot".
                  </p>
                ) : (
                  <div className="space-y-2">
                    {hotspots.map((h, idx) => (
                      <button
                        key={h.id}
                        onClick={() => setSelectedId(h.id!)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-md border text-sm transition-colors",
                          selectedId === h.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-border hover:bg-muted"
                        )}
                      >
                        <div className="font-medium truncate">
                          {h.label || h.productSku || `Hotspot ${idx + 1}`}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {h.productSku && `SKU: ${h.productSku}`}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </aside>
      </div>

      <SaveBar hasChanges={hasChanges} onSave={handleSave} isSaving={saving} />
    </div>
  );
}
