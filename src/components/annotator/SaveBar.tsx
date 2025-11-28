"use client";

import { Button } from "@/components/ui/button";
import { Save, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SaveBarProps {
  hasChanges: boolean;
  onSave: () => void;
  isSaving?: boolean;
  lastSavedAt?: number;
  errorMessage?: string | null;
}

export function SaveBar({ hasChanges, onSave, isSaving, lastSavedAt, errorMessage }: SaveBarProps) {
  // Bar visibility is now controlled by parent component via showSaveBar state
  // This component just renders the appropriate state

  const handleClick = () => {
    onSave();
  };

  // Determine current state for styling
  const showSavedState = !hasChanges && !isSaving && !errorMessage && lastSavedAt;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className={cn(
        "bg-card border-2 rounded-lg shadow-2xl px-6 py-3 flex items-center gap-4 transition-colors duration-200",
        errorMessage && "border-red-500 bg-red-50 dark:bg-red-950",
        isSaving && "border-blue-500 bg-blue-50 dark:bg-blue-950",
        hasChanges && !isSaving && !errorMessage && "border-amber-500 bg-amber-50 dark:bg-amber-950",
        showSavedState && "border-emerald-500 bg-emerald-50 dark:bg-emerald-950"
      )}>
        <div className="flex items-center gap-2 text-sm min-w-[140px]">
          {errorMessage ? (
            <>
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <span className="font-semibold text-red-800 dark:text-red-100">Save failed</span>
            </>
          ) : isSaving ? (
            <>
              <div className="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="font-semibold text-blue-800 dark:text-blue-100">Saving...</span>
            </>
          ) : hasChanges ? (
            <>
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <span className="font-semibold text-amber-900 dark:text-amber-100">Unsaved changes</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-semibold text-emerald-800 dark:text-emerald-100">Saved</span>
            </>
          )}
        </div>
        <Button
          onClick={handleClick}
          disabled={isSaving || (!hasChanges && !errorMessage)}
          size="sm"
          className={cn(
            "gap-2 text-white transition-colors",
            hasChanges ? "bg-amber-600 hover:bg-amber-700" : "bg-gray-400 cursor-not-allowed"
          )}
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save Hotspots"}
        </Button>
        <div className="flex flex-col items-end">
          <span className="text-xs text-muted-foreground">Ctrl+S</span>
          {lastSavedAt && !isSaving && (
            <span className="text-[10px] text-muted-foreground mt-1">
              {new Date(lastSavedAt).toLocaleTimeString()}
            </span>
          )}
          {errorMessage && (
            <span className="text-[10px] text-red-600 dark:text-red-400 mt-1 max-w-[160px] line-clamp-2">
              {errorMessage}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
