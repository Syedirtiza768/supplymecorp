'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Flipbook {
  id: string;
  title: string;
  createdAt: string;
}

export default function FlipbookUploadPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [flipbooks, setFlipbooks] = useState<Flipbook[]>([]);
  const [selectedFlipbook, setSelectedFlipbook] = useState<string>('');
  const [newFlipbookTitle, setNewFlipbookTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pageNumber, setPageNumber] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  useEffect(() => {
    loadFlipbooks();
  }, []);

  const loadFlipbooks = async () => {
    try {
      const res = await fetch(`${apiUrl}/flipbooks`);
      if (res.ok) {
        const data = await res.json();
        setFlipbooks(data);
      }
    } catch (error) {
      console.error('Failed to load flipbooks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFlipbook = async () => {
    if (!newFlipbookTitle.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a flipbook title',
        variant: 'destructive',
      });
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/flipbooks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newFlipbookTitle }),
      });

      if (res.ok) {
        const flipbook = await res.json();
        setFlipbooks([flipbook, ...flipbooks]);
        setSelectedFlipbook(flipbook.id);
        setNewFlipbookTitle('');
        toast({
          title: 'Success',
          description: `Flipbook "${flipbook.title}" created`,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create flipbook',
        variant: 'destructive',
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFlipbook) {
      toast({
        title: 'Error',
        description: 'Please select or create a flipbook first',
        variant: 'destructive',
      });
      return;
    }

    if (!selectedFile) {
      toast({
        title: 'Error',
        description: 'Please select an image file',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      let url = `${apiUrl}/flipbooks/${selectedFlipbook}/pages/upload`;
      if (pageNumber) {
        url += `?pageNumber=${pageNumber}`;
      }

      const res = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const page = await res.json();
        toast({
          title: 'Success',
          description: `Page ${page.pageNumber} uploaded successfully`,
        });

        // Redirect to annotator
        setTimeout(() => {
          router.push(
            `/admin/flipbooks/${selectedFlipbook}/pages/${page.pageNumber}/annotate`
          );
        }, 1000);
      } else {
        const error = await res.json();
        throw new Error(error.message || 'Upload failed');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload image',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Upload Flipbook Page</h1>

      <div className="grid gap-6">
        {/* Flipbook Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Select Flipbook</CardTitle>
            <CardDescription>
              Choose an existing flipbook or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Existing Flipbooks */}
            {flipbooks.length > 0 && (
              <div className="space-y-2">
                <Label>Existing Flipbooks</Label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={selectedFlipbook}
                  onChange={(e) => setSelectedFlipbook(e.target.value)}
                >
                  <option value="">-- Select Flipbook --</option>
                  {flipbooks.map((fb) => (
                    <option key={fb.id} value={fb.id}>
                      {fb.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Create New */}
            <div className="space-y-2">
              <Label>Or Create New Flipbook</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter flipbook title..."
                  value={newFlipbookTitle}
                  onChange={(e) => setNewFlipbookTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreateFlipbook();
                  }}
                />
                <Button onClick={handleCreateFlipbook}>Create</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Upload Image</CardTitle>
            <CardDescription>
              Select an image file for the new page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file">Image File</Label>
              <Input
                id="file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={!selectedFlipbook}
              />
              {selectedFile && (
                <p className="text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 inline mr-1" />
                  {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pageNumber">
                Page Number (optional - auto-assigns if left empty)
              </Label>
              <Input
                id="pageNumber"
                type="number"
                min="1"
                placeholder="Auto-assign next number"
                value={pageNumber}
                onChange={(e) => setPageNumber(e.target.value)}
                disabled={!selectedFlipbook}
              />
            </div>

            <Button
              onClick={handleUpload}
              disabled={!selectedFlipbook || !selectedFile || uploading}
              className="w-full"
              size="lg"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload & Annotate
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
