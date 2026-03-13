import { createClient } from "./client";

export interface UploadedFile {
  name: string;
  url: string;
  size: number;
}

/**
 * Uploads design files to Supabase Storage bucket.
 * Organized by cartLineId (unique session identifier).
 */
export async function uploadDesignFiles(
  cartLineId: string,
  files: File[],
): Promise<UploadedFile[]> {
  const supabase = createClient();
  const bucketName = "design-assets";
  const uploadedFiles: UploadedFile[] = [];

  for (const file of files) {
    try {
      // Create a unique path: folder(cartLineId) / timestamp-filename
      const timestamp = new Date().getTime();
      
      // Sanitize cartLineId for storage path (remove illegal characters)
      const sanitizedFolder = cartLineId.replace(/[:|() ]/g, "_").replace(/_{2,}/g, "_");
      
      const cleanFileName = file.name.replace(/[^\x00-\x7F]/g, "").replace(/[:|() ]/g, "_");
      const filePath = `${sanitizedFolder}/${timestamp}-${cleanFileName}`;

      const { error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error(`Error uploading ${file.name}:`, error);
        continue;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucketName).getPublicUrl(filePath);

      uploadedFiles.push({
        name: file.name,
        url: publicUrl,
        size: file.size,
      });
    } catch (err) {
      console.error(`Failed to process ${file.name}:`, err);
    }
  }

  return uploadedFiles;
}
