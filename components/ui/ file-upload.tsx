"use client";

import { cn } from "@/lib/utils";
import {
  FileIcon,
  FileTextIcon,
  FileVideoIcon,
  ImageIcon,
  Upload,
  X,
} from "lucide-react";
import * as React from "react";
import { Button } from "./button";
import { Progress } from "./progress";

interface FileUploadProps {
  onFileSelect?: (files: File[]) => void;
  onFileRemove?: (index: number) => void;
  accept?: string;
  maxSize?: number; // in MB
  maxFiles?: number;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  showPreview?: boolean;
  uploadProgress?: number; // 0-100
  isUploading?: boolean;
}

interface FileWithPreview extends File {
  preview?: string;
}

const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      onFileSelect,
      onFileRemove,
      accept = ".jpg,.jpeg,.png,.pdf,.doc,.docx",
      maxSize = 50, // 50 MB default
      maxFiles = 1,
      multiple = false,
      disabled = false,
      className,
      showPreview = true,
      uploadProgress = 0,
      isUploading = false,
    },
    ref
  ) => {
    const [files, setFiles] = React.useState<FileWithPreview[]>([]);
    const [isDragging, setIsDragging] = React.useState(false);
    const [error, setError] = React.useState<string>("");
    const inputRef = React.useRef<HTMLInputElement>(null);

    const acceptedFormats = accept
      .split(",")
      .map((format) => format.trim().toUpperCase().replace(".", ""))
      .join(", ");

    const getFileIcon = (file: File) => {
      const type = file.type;
      if (type.startsWith("image/")) return <ImageIcon className="h-8 w-8" />;
      if (type.startsWith("video/"))
        return <FileVideoIcon className="h-8 w-8" />;
      if (type === "application/pdf")
        return <FileTextIcon className="h-8 w-8" />;
      return <FileIcon className="h-8 w-8" />;
    };

    const validateFile = (file: File): string | null => {
      const sizeInMB = file.size / (1024 * 1024);
      if (sizeInMB > maxSize) {
        return `File size exceeds ${maxSize} MB`;
      }

      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
      const acceptedExtensions = accept
        .split(",")
        .map((ext) => ext.trim().toLowerCase());

      if (
        acceptedExtensions.length > 0 &&
        !acceptedExtensions.includes(fileExtension)
      ) {
        return `File type not accepted. Accepted formats: ${acceptedFormats}`;
      }

      return null;
    };

    const handleFiles = (newFiles: FileList | null) => {
      if (!newFiles) return;

      const fileArray = Array.from(newFiles);

      // Check max files limit
      if (files.length + fileArray.length > maxFiles) {
        setError(`Maximum ${maxFiles} file${maxFiles > 1 ? "s" : ""} allowed`);
        return;
      }

      const validFiles: FileWithPreview[] = [];
      let hasError = false;

      fileArray.forEach((file) => {
        const validationError = validateFile(file);
        if (validationError) {
          setError(validationError);
          hasError = true;
          return;
        }

        // Create preview for images
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const fileWithPreview = Object.assign(file, {
              preview: reader.result as string,
            });
            validFiles.push(fileWithPreview);

            if (validFiles.length === fileArray.length && !hasError) {
              const updatedFiles = [...files, ...validFiles];
              setFiles(updatedFiles);
              onFileSelect?.(updatedFiles);
              setError("");
            }
          };
          reader.readAsDataURL(file);
        } else {
          validFiles.push(file);
        }
      });

      // Handle non-image files immediately
      if (fileArray.every((f) => !f.type.startsWith("image/"))) {
        const updatedFiles = [...files, ...validFiles];
        setFiles(updatedFiles);
        onFileSelect?.(updatedFiles);
        setError("");
      }
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setIsDragging(true);
      }
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled) return;

      const droppedFiles = e.dataTransfer.files;
      handleFiles(droppedFiles);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
    };

    const handleRemoveFile = (index: number) => {
      const updatedFiles = files.filter((_, i) => i !== index);
      setFiles(updatedFiles);
      onFileRemove?.(index);
      setError("");

      // Reset input
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    };

    const handleBrowseClick = () => {
      inputRef.current?.click();
    };

    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
    };

    return (
      <div ref={ref} className={cn("w-full space-y-4", className)}>
        {/* Upload Area */}
        {files.length < maxFiles && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 bg-background",
              disabled && "cursor-not-allowed opacity-50",
              !disabled && "cursor-pointer hover:border-primary/50"
            )}
            onClick={!disabled ? handleBrowseClick : undefined}
          >
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              multiple={multiple}
              onChange={handleInputChange}
              disabled={disabled}
              className="hidden"
            />

            <Upload className="h-10 w-10 text-muted-foreground mb-4" />

            <div className="text-center space-y-2">
              <p className="text-sm font-medium">
                Choose a file or drag & drop it here.
              </p>
              <p className="text-xs text-muted-foreground">
                {acceptedFormats} formats, up to {maxSize} MB.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation();
                handleBrowseClick();
              }}
            >
              Browse File
            </Button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* File Preview and Progress */}
        {files.length > 0 && showPreview && (
          <div className="space-y-3">
            {files.map((file, index) => (
              <div
                key={index}
                className="relative flex items-center gap-4 rounded-lg border bg-card p-4"
              >
                {/* File Icon/Preview */}
                <div className="flex-shrink-0">
                  {file.type.startsWith("image/") && file.preview ? (
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="h-16 w-16 rounded object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded bg-muted text-muted-foreground">
                      {getFileIcon(file)}
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>

                    {/* Remove Button */}
                    {!isUploading && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleRemoveFile(index)}
                        className="flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {isUploading && (
                    <div className="space-y-1">
                      <Progress value={uploadProgress} className="h-1.5" />
                      <p className="text-xs text-muted-foreground">
                        {uploadProgress < 100
                          ? `Uploading... ${uploadProgress}%`
                          : "Upload complete"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

FileUpload.displayName = "FileUpload";

export { FileUpload, type FileUploadProps };
