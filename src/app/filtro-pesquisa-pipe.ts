import { Pipe, PipeTransform } from '@angular/core';
import { Task } from './tasks';
import { Category } from './category';

/**
 * SEARCH FILTER PIPE - SEARCH FUNCTIONALITY
 * 
 * This pipe implements a comprehensive search/filter functionality for tasks:
 * - Filters tasks by title, description, ID, category name, and priority
 * - Case-insensitive search (ignores uppercase/lowercase)
 * - Returns all tasks if there's no search text
 * - Searches in all fields simultaneously
 * 
 */
@Pipe({name: 'searchFilter'})
export class SearchFilterPipe implements PipeTransform {
  
  /**
   * Transform task list applying search filter
   * FUNCTIONALITY: Search by multiple fields (title, description, ID, category, priority)
   * 
   * @param tasks - Array of tasks to filter
   * @param text - Search text (optional)
   * @param categories - Array of categories for category name lookup (optional)
   * @returns Filtered array of tasks
   */
  transform(tasks: Task[], text: string, categories?: Category[]): Task[] {
    // If there's no search text, return all tasks
    if(!text || text.trim() === '') return tasks;
    
    const searchText = text.toLowerCase().trim();
    
    // Filter tasks that match in any field
    return tasks.filter(task => {
      // Search in title
      if (task.title?.toLowerCase().includes(searchText)) return true;
      
      // Search in description
      if (task.description?.toLowerCase().includes(searchText)) return true;
      
      // Search in ID (convert to string)
      if (task.id?.toString().includes(searchText)) return true;
      
      // Search in priority (convert to string)
      if (task.priority?.toString().includes(searchText)) return true;
      
      // Search in category name (if categories provided)
      if (categories && categories.length > 0) {
        const category = categories.find(c => c.id === task.categoryId);
        if (category?.name?.toLowerCase().includes(searchText)) return true;
      }
      
      return false;
    });
  }
}
