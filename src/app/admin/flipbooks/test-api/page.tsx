"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
const AUTH_HEADER = process.env.NEXT_PUBLIC_CUSTOMERS_AUTH || "";

export default function TestAPIPage() {
  const [flipbookId, setFlipbookId] = useState("2025-Catalog-Spring-Summer");
  const [pageNumber, setPageNumber] = useState("1");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const testGetHotspots = async () => {
    setLoading(true);
    try {
      const url = `${API_URL}/flipbooks/${flipbookId}/pages/${pageNumber}/hotspots`;
      console.log("GET:", url);
      const res = await fetch(url, {
        headers: { Authorization: AUTH_HEADER },
      });
      const data = await res.json();
      setResult(JSON.stringify({ status: res.status, data }, null, 2));
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testSaveHotspots = async () => {
    setLoading(true);
    try {
      const testHotspots = [
        {
          productSku: "TEST-001",
          label: "Test Hotspot",
          x: 10,
          y: 10,
          width: 20,
          height: 15,
          zIndex: 0,
        },
      ];
      const url = `${API_URL}/flipbooks/${flipbookId}/pages/${pageNumber}/hotspots`;
      console.log("PUT:", url, testHotspots);
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: AUTH_HEADER,
        },
        body: JSON.stringify({ hotspots: testHotspots }),
      });
      const data = await res.json();
      setResult(JSON.stringify({ status: res.status, data }, null, 2));
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Flipbook API Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Flipbook ID</label>
              <Input
                value={flipbookId}
                onChange={(e) => setFlipbookId(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Page Number</label>
              <Input
                type="number"
                value={pageNumber}
                onChange={(e) => setPageNumber(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={testGetHotspots} disabled={loading}>
              Test GET Hotspots
            </Button>
            <Button onClick={testSaveHotspots} disabled={loading} variant="secondary">
              Test SAVE Hotspots
            </Button>
          </div>

          <div>
            <label className="text-sm font-medium">Result:</label>
            <Textarea
              value={result}
              readOnly
              className="font-mono text-xs mt-2"
              rows={20}
            />
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>API URL:</strong> {API_URL}</p>
            <p><strong>Auth Header:</strong> {AUTH_HEADER ? "Set" : "Not set"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
