/**
 * TASK INTERFACE - MAIN ENTITY
 * 
 * This interface defines the structure of the Task entity:
 * - Basic task fields
 * - Relationship with Category entity
 * - Control and priority fields
 * - Soft delete for deletion tracking
 * - File attachment support (Storage)
 * 
 */
export interface Task {
  id: number;                    // Unique identifier
  title: string;                 // Task title (required)
  description: string;           // Detailed description (required)
  priority: number;              // Priority (1-5)
  completed: boolean;            // Completion status
  categoryId: number;            // RELATIONSHIP: Category ID (required)
  deleted?: boolean;            // Soft delete - marks task as deleted
  fileUrl?: string;              // STORAGE: URL of attached file (image, video, pdf, etc)
  fileName?: string;             // STORAGE: Original file name
  created_at?: string;          // Creation date (Supabase)
  updated_at?: string;          // Update date (Supabase)
}
