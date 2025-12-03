/**
 * CATEGORY INTERFACE - RELATED ENTITY
 * 
 * This interface defines the structure of the Category entity:
 * - Basic category fields
 * - Custom color for visual display
 * - Relationship with Task entity
 * 
 */
export interface Category {
  id: number;                    // Unique identifier
  name: string;                  // Category name
  description: string;           // Category description
  color: string;                 // Color in hexadecimal for display
}

