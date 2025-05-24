"use client";

import React, { useState, useCallback } from "react";
import {
  PlusCircle,
  GripVertical,
  Star,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// This is a simplified example. In a real app, you'd use a library like react-dropzone
// and handle actual file uploads to a server or cloud storage.

interface ImageFile {
  id: string;
  name: string;
  url: string; // This would be a preview URL (e.g., from FileReader) or a URL from the server
  file?: File; // Actual file object for new uploads
}

interface ImageManagerProps {
  initialImages?: string[]; // Array of image URLs
  initialCoverImage?: string;
  onImagesChange: (imageUrls: string[]) => void;
  onCoverImageChange: (coverImageUrl: string | null) => void;
  maxFiles?: number;
}

export const ImageManager: React.FC<ImageManagerProps> = ({
  initialImages = [],
  initialCoverImage = "",
  onImagesChange,
  onCoverImageChange,
  maxFiles = 5,
}) => {
  const [images, setImages] = useState<ImageFile[]>(
    initialImages.map((url, index) => ({
      id: `initial-${index}-${Date.now()}`,
      name: url.substring(url.lastIndexOf("/") + 1),
      url,
    }))
  );
  const [coverImage, setCoverImage] = useState<string | null>(
    initialCoverImage
  );
  const [draggingItem, setDraggingItem] = useState<ImageFile | null>(null);
  const [uploading, setUploading] = useState<boolean>(false); // Added uploading state

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      if (images.length + filesArray.length > maxFiles) {
        toast.error(`You can upload a maximum of ${maxFiles} images.`);
        return;
      }

      setUploading(true);
      const uploadPromises = filesArray.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.message || `Failed to upload ${file.name}`
            );
          }

          const result = await response.json();
          if (!result.url) {
            throw new Error(
              `Upload successful but no URL returned for ${file.name}`
            );
          }

          return {
            id: `${file.name}-${Date.now()}`,
            name: file.name,
            url: result.url, // Use the URL from the server
            // file object is no longer needed here as it's uploaded
          };
        } catch (error) {
          console.error("Upload error:", error);
          toast.error(
            error instanceof Error
              ? error.message
              : `Could not upload ${file.name}`
          );
          return null; // Return null for failed uploads
        }
      });

      const uploadedImageFiles = (await Promise.all(uploadPromises)).filter(
        (img) => img !== null
      ) as ImageFile[];

      if (uploadedImageFiles.length > 0) {
        const updatedImages = [...images, ...uploadedImageFiles];
        setImages(updatedImages);
        onImagesChange(updatedImages.map((img) => img.url));
      }
      setUploading(false);
    }
  };

  const handleRemoveImage = (idToRemove: string) => {
    const updatedImages = images.filter((image) => image.id !== idToRemove);
    setImages(updatedImages);
    onImagesChange(updatedImages.map((img) => img.url));
    if (coverImage === images.find((img) => img.id === idToRemove)?.url) {
      const newCover = updatedImages.length > 0 ? updatedImages[0].url : null;
      setCoverImage(newCover);
      onCoverImageChange(newCover);
    }
  };

  const handleSetCoverImage = (url: string) => {
    setCoverImage(url);
    onCoverImageChange(url);
  };

  const handleDragStart = (image: ImageFile) => {
    setDraggingItem(image);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (targetItem: ImageFile) => {
    if (!draggingItem || draggingItem.id === targetItem.id) return;

    const currentIndex = images.findIndex((img) => img.id === draggingItem.id);
    const targetIndex = images.findIndex((img) => img.id === targetItem.id);

    const newImages = [...images];
    newImages.splice(currentIndex, 1);
    newImages.splice(targetIndex, 0, draggingItem);

    setImages(newImages);
    onImagesChange(newImages.map((img) => img.url));
    setDraggingItem(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Project Images</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative group border rounded-md overflow-hidden aspect-square bg-muted/30 flex items-center justify-center"
              draggable
              onDragStart={() => handleDragStart(image)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(image)}
            >
              <img
                src={image.url}
                alt={image.name}
                className="object-cover w-full h-full transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 space-y-1">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="text-white hover:bg-white/20 h-7 w-7"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSetCoverImage(image.url);
                  }}
                  title="Set as cover image"
                >
                  <Star
                    className={`h-4 w-4 ${coverImage === image.url ? "fill-yellow-400 text-yellow-400" : ""}`}
                  />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="text-white hover:bg-white/20 h-7 w-7"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRemoveImage(image.id);
                  }}
                  title="Remove image"
                >
                  <X className="h-4 w-4" />
                </Button>
                <GripVertical className="h-5 w-5 text-white/50 cursor-grab absolute bottom-1 right-1" />
              </div>
              {coverImage === image.url && (
                <div className="absolute top-1 left-1 bg-yellow-400 text-black text-xs px-1.5 py-0.5 rounded-sm font-semibold">
                  Cover
                </div>
              )}
            </div>
          ))}
          {images.length < maxFiles && (
            <Label
              htmlFor="image-upload"
              className="aspect-square border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors text-muted-foreground hover:text-primary"
            >
              <PlusCircle className="h-10 w-10 mb-2" />
              <span>Add Image</span>
              <span className="text-xs">({maxFiles - images.length} left)</span>
              {uploading && <p className="text-xs mt-1">Uploading...</p>}
            </Label>
          )}
        </div>
        <Input
          id="image-upload"
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={images.length >= maxFiles || uploading}
        />
        {images.length === 0 && !uploading && (
          <div className="text-center text-muted-foreground py-6 border border-dashed rounded-md">
            <ImageIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p>No images uploaded yet.</p>
            <p className="text-sm">
              Click the button above or drag and drop files here.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        You can upload up to {maxFiles} images. Drag to reorder. Click the star
        to set a cover image.
      </CardFooter>
    </Card>
  );
};
