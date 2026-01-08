"use client";

import { useEffect, useState } from "react";
import { useServiceWorker } from "@/hooks/useServiceWorker";

export default function CacheToolsPage() {
  const { isSupported, isRegistered, isReady, clearCache, getCacheStatus } = useServiceWorker();
  const [status, setStatus] = useState<Record<string, number> | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const refresh = async () => {
    setBusy(true);
    try {
      const s = (await getCacheStatus()) as Record<string, number> | null;
      setStatus(s);
      setMessage(s ? "Fetched cache status" : "No service worker controller yet");
    } catch (e: any) {
      setMessage(e?.message || "Failed to get cache status");
    } finally {
      setBusy(false);
    }
  };

  const handleClear = async () => {
    setBusy(true);
    try {
      clearCache();
      // give SW a moment to clear
      setTimeout(refresh, 500);
      setMessage("Requested cache clear");
    } finally {
      setBusy(false);
    }
  };

  const unregisterSW = async () => {
    if (!('serviceWorker' in navigator)) return;
    setBusy(true);
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r => r.unregister()));
      // Clear caches too
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((n) => caches.delete(n)));
      setStatus(null);
      setMessage("Service worker unregistered and caches cleared");
    } catch (e: any) {
      setMessage(e?.message || "Failed to unregister SW");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    // Fetch initial status when ready
    if (isReady) refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Cache Tools</h1>
      <div className="mb-4 text-sm text-gray-600">
        <div>Supported: {String(isSupported)}</div>
        <div>Registered: {String(isRegistered)}</div>
        <div>Ready: {String(isReady)}</div>
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={refresh}
          disabled={busy || !isReady}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Refresh Status
        </button>
        <button
          onClick={handleClear}
          disabled={busy || !isReady}
          className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
        >
          Clear All Caches
        </button>
        <button
          onClick={unregisterSW}
          disabled={busy}
          className="px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600 disabled:opacity-50"
        >
          Unregister SW + Clear
        </button>
      </div>

      {message && <div className="mb-4 text-sm">{message}</div>}

      <div className="border rounded p-4">
        <h2 className="font-medium mb-2">Cache Status</h2>
        {!status && <div className="text-sm text-gray-500">No data</div>}
        {status && (
          <ul className="text-sm list-disc pl-5">
            {Object.entries(status).map(([name, count]) => (
              <li key={name}>
                <span className="font-mono">{name}</span>: {count} item(s)
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
