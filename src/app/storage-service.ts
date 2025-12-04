import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { getSupabaseClient } from './supabase-client';

/**
 * STORAGE SERVICE - FILE UPLOAD AND DOWNLOAD
 * 
 * This service handles:
 * - Upload files to Supabase Storage
 * - Download files from Supabase Storage
 * - Delete files from Supabase Storage
 * - Get public URL of files
 * 
 * Bucket: 'tarefas-arquivos'
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly BUCKET_NAME = 'tarefas-arquivos';

  /**
   * UPLOAD - Upload file to Supabase Storage
   * @param file - File to upload (must be a File object, NOT FormData!)
   * @param taskId - Task ID to associate the file
   * @returns Observable with file path
   */
  uploadFile(file: File, taskId: number): Observable<{ path: string; url: string }> {
    const supabase = getSupabaseClient();
    
    // Validate that we have a File object, not FormData
    if (!(file instanceof File)) {
      console.error('Invalid file type. Expected File object, got:', typeof file);
      throw new Error('Arquivo inválido. Deve ser um objeto File.');
    }
    
    // Generate unique file name: taskId-timestamp-originalname
    const fileExt = file.name.split('.').pop();
    const fileName = `${taskId}-${Date.now()}.${fileExt}`;
    const filePath = `${taskId}/${fileName}`;

    // Get correct MIME type from file
    const mimeType = file.type || this.getMimeTypeFromExtension(fileExt || '');

    console.log('Uploading file:', {
      fileName: file.name,
      filePath,
      mimeType,
      size: file.size,
      type: file.type,
      isFile: file instanceof File
    });

    // CRITICAL: Read file as ArrayBuffer to ensure clean binary data
    // This prevents any multipart form-data from being included
    return from(
      file.arrayBuffer()
        .then(arrayBuffer => {
          // Convert ArrayBuffer to Blob with correct MIME type
          const blob = new Blob([arrayBuffer], { type: mimeType });
          
          // Upload the Blob (clean binary data, no multipart headers)
          return supabase.storage
            .from(this.BUCKET_NAME)
            .upload(filePath, blob, {
              cacheControl: '3600',
              upsert: false,
              contentType: mimeType // IMPORTANTE: Define o tipo MIME correto
            });
        })
        .then(async (result) => {
          if (result.error) {
            console.error('Upload error:', result.error);
            throw result.error;
          }

          console.log('Upload successful:', result.data);

          // Get public URL
          const { data: urlData } = supabase.storage
            .from(this.BUCKET_NAME)
            .getPublicUrl(filePath);

          console.log('Public URL:', urlData.publicUrl);

          return {
            path: filePath,
            url: urlData.publicUrl
          };
        })
    );
  }

  /**
   * Get MIME type from file extension
   */
  private getMimeTypeFromExtension(ext: string): string {
    const extLower = ext.toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'txt': 'text/plain',
      'zip': 'application/zip',
      'mp4': 'video/mp4',
      'avi': 'video/x-msvideo',
      'mov': 'video/quicktime'
    };
    return mimeTypes[extLower] || 'application/octet-stream';
  }

  /**
   * DOWNLOAD - Get public URL for file download
   * @param filePath - Path of the file in storage
   * @returns Public URL
   */
  getFileUrl(filePath: string): string {
    const supabase = getSupabaseClient();
    const { data } = supabase.storage
      .from(this.BUCKET_NAME)
      .getPublicUrl(filePath);
    return data.publicUrl;
  }

  /**
   * DELETE - Delete file from Supabase Storage
   * @param filePath - Path of the file to delete
   * @returns Observable with success status
   */
  deleteFile(filePath: string): Observable<boolean> {
    const supabase = getSupabaseClient();
    return from(
      supabase.storage
        .from(this.BUCKET_NAME)
        .remove([filePath])
        .then(result => {
          if (result.error) {
            throw result.error;
          }
          return true;
        })
    );
  }

  /**
   * DOWNLOAD - Download file as blob
   * @param filePath - Path of the file to download
   * @returns Observable with blob data
   */
  downloadFile(filePath: string): Observable<Blob> {
    const supabase = getSupabaseClient();
    return from(
      supabase.storage
        .from(this.BUCKET_NAME)
        .download(filePath)
        .then(result => {
          if (result.error) {
            console.error('Storage download error:', result.error);
            throw new Error(`Erro ao baixar arquivo: ${result.error.message}. Verifique se o arquivo existe e se você tem permissão.`);
          }
          if (!result.data) {
            throw new Error('Arquivo não encontrado ou vazio.');
          }
          return result.data;
        })
    );
  }

  /**
   * Check if file exists
   * @param filePath - Path of the file to check
   * @returns Observable with boolean indicating if file exists
   */
  fileExists(filePath: string): Observable<boolean> {
    const supabase = getSupabaseClient();
    return from(
      supabase.storage
        .from(this.BUCKET_NAME)
        .list(filePath.split('/')[0]) // List files in the folder
        .then(result => {
          if (result.error) {
            console.error('Storage list error:', result.error);
            return false;
          }
          const fileName = filePath.split('/').pop();
          return result.data?.some(file => file.name === fileName) || false;
        })
    );
  }

  /**
   * Extract file path from full Supabase Storage URL
   * @param fileUrl - Full URL or path
   * @returns File path (e.g., "4/4-1764815718886.PNG")
   */
  extractFilePath(fileUrl: string): string {
    if (!fileUrl) return '';
    
    // If it's already a path (no http), return as is
    if (!fileUrl.startsWith('http')) {
      return fileUrl;
    }
    
    // Extract path from URL: https://...supabase.co/storage/v1/object/public/tarefas-arquivos/4/4-1764815718886.PNG
    const urlParts = fileUrl.split('/tarefas-arquivos/');
    if (urlParts.length > 1) {
      return urlParts[1].split('?')[0]; // Remove query params if any
    }
    
    // Try alternative patterns
    if (fileUrl.includes('tarefas-arquivos/')) {
      const altParts = fileUrl.split('tarefas-arquivos/');
      if (altParts.length > 1) {
        return altParts[1].split('?')[0];
      }
    }
    
    // If no pattern matches, return empty (invalid URL)
    console.warn('Could not extract file path from URL:', fileUrl);
    return '';
  }
}

