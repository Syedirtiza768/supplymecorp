"use client";

import { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { uploadPageImage, ensureFlipbook, listPages } from "@/lib/flipbooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function UploadPage() {
    // Single file upload state
    const [singleFile, setSingleFile] = useState<File | null>(null);
    const [singlePreviewUrl, setSinglePreviewUrl] = useState<string>("");
    const singleFileInputRef = useRef<HTMLInputElement>(null);

    const handleSingleFileSelect = (files: FileList | null) => {
      if (!files || files.length === 0) {
        setSingleFile(null);
        setSinglePreviewUrl("");
        return;
      }
      const file = files[0];
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file",
          description: `File ${file.name} is not an image (JPG, PNG, etc.)`,
          variant: "destructive",
        });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `File ${file.name} is over 10MB`,
          variant: "destructive",
        });
        return;
      }
      setSingleFile(file);
      setSinglePreviewUrl(URL.createObjectURL(file));
    };

    const handleSingleUpload = async () => {
      if (!singleFile || !pageNumber) {
        toast({
          title: "Missing information",
          description: "Please select an image and enter a page number",
          variant: "destructive",
        });
        return;
      }
      setUploading(true);
      try {
        await ensureFlipbook(flipbookId);
        await uploadPageImage(flipbookId, singleFile, pageNumber);
        toast({
          title: "Success",
          description: `Page uploaded successfully`,
        });
        router.push(`/admin/flipbooks/${flipbookId}/pages/${pageNumber}/annotate`);
      } catch (error) {
        console.error("Upload failed:", error);
        toast({
          title: "Upload failed",
          description: error instanceof Error ? error.message : "Failed to upload page",
          variant: "destructive",
        });
      } finally {
        setUploading(false);
      }
    };
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const flipbookId = (params.flipbookId as string) || "2025-Catalog-Spring-Summer";

  const [pageNumber, setPageNumber] = useState<number>(1);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) {
      setSelectedFiles([]);
      setPreviewUrls([]);
      return;
    }
    const validFiles: File[] = [];
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file",
          description: `File ${file.name} is not an image (JPG, PNG, etc.)`,
          variant: "destructive",
        });
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `File ${file.name} is over 10MB`,
          variant: "destructive",
        });
        continue;
      }
      validFiles.push(file);
      urls.push(URL.createObjectURL(file));
    }
    setSelectedFiles(validFiles);
    setPreviewUrls(urls);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleUpload = async () => {
    if (!selectedFiles.length || !pageNumber) {
      toast({
        title: "Missing information",
        description: "Please select one or more images and enter a starting page number",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      await ensureFlipbook(flipbookId);
      let currentPage = pageNumber;
      for (const file of selectedFiles) {
        await uploadPageImage(flipbookId, file, currentPage);
        currentPage++;
      }
      toast({
        title: "Success",
        description: `${selectedFiles.length} page(s) uploaded successfully`,
      });
      // Redirect to annotate first uploaded page
      router.push(`/admin/flipbooks/${flipbookId}/pages/${pageNumber}/annotate`);
    } catch (error) {
      console.error("Upload failed:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload page(s)",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleGetNextPageNumber = async () => {
    try {
      const pages = await listPages(flipbookId);
      const maxPage = Math.max(0, ...pages.map((p) => p.pageNumber));
      setPageNumber(maxPage + 1);
      toast({
        title: "Page number set",
        description: `Next available page: ${maxPage + 1}`,
      });
    } catch (error) {
      console.error("Failed to get pages:", error);
      // Default to page 1 if error
      setPageNumber(1);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Upload Flipbook Page</h1>
          <p className="text-muted-foreground mt-2">
            Upload a new page image for <span className="font-mono text-sm">{flipbookId}</span>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Page Details</CardTitle>
            <CardDescription>Specify the page number for this image</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <Label htmlFor="pageNumber">Page Number</Label>
                <Input
                  id="pageNumber"
                  type="number"
                  min={1}
                  value={pageNumber}
                  onChange={(e) => setPageNumber(Number(e.target.value))}
                  placeholder="Enter page number"
                  className="mt-1"
                />
              </div>
              <Button
                variant="outline"
                onClick={handleGetNextPageNumber}
                disabled={uploading}
              >
                Get Next Available
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Single file upload */}
        <Card>
          <CardHeader>
            <CardTitle>Single Page Upload</CardTitle>
            <CardDescription>Upload a single page image (JPG, PNG, max 10MB)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              onClick={() => singleFileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                singlePreviewUrl
                  ? "border-green-500 bg-green-50"
                  : "border-border hover:border-blue-400 hover:bg-muted"
              )}
            >
              {singlePreviewUrl ? (
                <div className="flex flex-col items-center space-y-2">
                  <img
                    src={singlePreviewUrl}
                    alt="Preview"
                    className="max-h-40 mx-auto rounded-md shadow-md"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {singleFile?.name}
                    <span className="mx-1">•</span>
                    {(singleFile?.size! / 1024 / 1024).toFixed(2)} MB
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={e => {
                      e.stopPropagation();
                      setSingleFile(null);
                      setSinglePreviewUrl("");
                    }}
                  >Change File</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="rounded-full bg-muted p-4">
                      <ImageIcon className="h-10 w-10 text-muted-foreground" />
                    </div>
                  </div>
                  <div>
                    <p className="text-lg font-medium">Click to select a single image</p>
                  </div>
                </div>
              )}
            </div>
            <input
              ref={singleFileInputRef}
              type="file"
              accept="image/*"
              onChange={e => handleSingleFileSelect(e.target.files)}
              className="hidden"
            />
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => router.push(`/admin/flipbooks/${flipbookId}`)}
                disabled={uploading}
              >Cancel</Button>
              <Button
                onClick={handleSingleUpload}
                disabled={!singleFile || !pageNumber || uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload & Annotate
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Multi-file/folder upload (existing) */}
        <Card>
          <CardHeader>
            <CardTitle>Multi-Page/Folder Upload</CardTitle>
            <CardDescription>
              Drag and drop or click to select multiple images or a folder (JPG, PNG, max 10MB each)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors",
                isDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-border hover:border-blue-400 hover:bg-muted"
              )}
            >
              {previewUrls.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {previewUrls.map((url, idx) => (
                      <div key={url} className="flex flex-col items-center">
                        <img
                          src={url}
                          alt={`Preview ${idx + 1}`}
                          className="max-h-40 mx-auto rounded-md shadow-md"
                        />
                        <div className="text-xs text-muted-foreground mt-1">
                          {selectedFiles[idx]?.name}
                          <span className="mx-1">•</span>
                          {(selectedFiles[idx]?.size! / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFiles([]);
                      setPreviewUrls([]);
                    }}
                  >
                    Change Files
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="rounded-full bg-muted p-4">
                      <ImageIcon className="h-10 w-10 text-muted-foreground" />
                    </div>
                  </div>
                  <div>
                    <p className="text-lg font-medium">Drop your images here</p>
                    <p className="text-sm text-muted-foreground">or click to browse (multiple or folder supported)</p>
                  </div>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              webkitdirectory="true"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => router.push(`/admin/flipbooks/${flipbookId}`)}
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={selectedFiles.length === 0 || !pageNumber || uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload & Annotate
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
