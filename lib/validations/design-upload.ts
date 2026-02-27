// lib/validations/design-upload.ts
// Zod schema for design file uploads
// Validates file type, size, and metadata

import { z } from "zod";

// Allowed file types for design uploads
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "application/postscript", // .ai files
  "application/x-photoshop", // .psd files
  "image/vnd.adobe.photoshop", // .psd alternative
  "application/illustrator", // .ai alternative
] as const;

const ALLOWED_EXTENSIONS = [
  ".pdf",
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".svg",
  ".ai",
  ".psd",
] as const;

// Max file size: 50MB
const MAX_FILE_SIZE = 50 * 1024 * 1024;

/**
 * Schema for validating a design file upload.
 * Used on product detail page when customer uploads their artwork.
 */
export const designFileSchema = z.object({
  file: z
    .custom<File>((val) => val instanceof File, "Please select a file")
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      `File size must be less than 50MB`,
    )
    .refine(
      (file) => {
        const ext = "." + file.name.split(".").pop()?.toLowerCase();
        return ALLOWED_EXTENSIONS.includes(
          ext as (typeof ALLOWED_EXTENSIONS)[number],
        );
      },
      `Allowed file types: ${ALLOWED_EXTENSIONS.join(", ")}`,
    ),
});

export type DesignFileFormData = z.infer<typeof designFileSchema>;

/**
 * Metadata schema for uploaded design files.
 * Stored alongside the file reference in the order.
 */
export const designFileMetadataSchema = z.object({
  fileName: z.string(),
  fileSize: z.number().positive(),
  fileUrl: z.string().url(),
  mimeType: z.string(),
  uploadedAt: z.string().datetime(),
});

export type DesignFileMetadata = z.infer<typeof designFileMetadataSchema>;

export { ALLOWED_EXTENSIONS, ALLOWED_MIME_TYPES, MAX_FILE_SIZE };
