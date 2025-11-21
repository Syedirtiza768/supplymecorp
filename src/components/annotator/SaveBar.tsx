"use client";

import { Button } from "@/components/ui/button";
import { Save, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SaveBarProps {
  hasChanges: boolean;
  onSave: () => void;
  isSaving?: boolean;
}

export function SaveBar({ hasChanges, onSave, isSaving }: SaveBarProps) {
  if (!hasChanges) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4">
      <div className={cn(
        "bg-card border-2 rounded-lg shadow-2xl px-6 py-3 flex items-center gap-4",
        hasChanges && "border-amber-500 bg-amber-50 dark:bg-amber-950"
      )}>
        <div className="flex items-center gap-2 text-sm">
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 animate-pulse" />
          <span className="font-semibold text-amber-900 dark:text-amber-100">Unsaved changes</span>
        </div>
        <Button
          onClick={onSave}
          disabled={isSaving}
          size="sm"
          className="gap-2 bg-amber-600 hover:bg-amber-700 text-white"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save Hotspots"}
        </Button>
        <span className="text-xs text-muted-foreground">
          Ctrl+S
        </span>
      </div>
    </div>
  );
}
