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
   * @param file - File to upload
   * @param taskId - Task ID to associate the file
   * @returns Observable with file path
   */
  uploadFile(file: File, taskId: number): Observable<{ path: string; url: string }> {
    const supabase = getSupabaseClient();
    
    // Generate unique file name: taskId-timestamp-originalname
    const fileExt = file.name.split('.').pop();
    const fileName = `${taskId}-${Date.now()}.${fileExt}`;
    const filePath = `${taskId}/${fileName}`;

    return from(
      supabase.storage
        .from(this.BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })
        .then(async (result) => {
          if (result.error) {
            throw result.error;
          }

          // Get public URL
          const { data: urlData } = supabase.storage
            .from(this.BUCKET_NAME)
            .getPublicUrl(filePath);

          return {
            path: filePath,
            url: urlData.publicUrl
          };
        })
    );
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
            throw result.error;
          }
          return result.data;
        })
    );
  }
}

