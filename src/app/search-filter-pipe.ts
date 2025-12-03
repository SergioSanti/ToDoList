import { Pipe, PipeTransform } from '@angular/core';
import { Task } from './tasks';

/**
 * SEARCH FILTER PIPE - SEARCH FUNCTIONALITY
 * 
 * This pipe implements a search/filter functionality for tasks:
 * - Filters tasks by title
 * - Case-insensitive search (ignores uppercase/lowercase)
 * - Returns all tasks if there's no search text
 * 
 */
@Pipe({name: 'searchFilter'})
export class SearchFilterPipe implements PipeTransform {
  
  /**
   * Transform task list applying search filter
   * FUNCTIONALITY: Search by task title
   * 
   * @param tasks - Array of tasks to filter
   * @param text - Search text (optional)
   * @returns Filtered array of tasks
   */
  transform(tasks: Task[], text: string): Task[] {
    // If there's no search text, return all tasks
    if(!text) return tasks;
    
    // Filter tasks whose title contains the search text (case-insensitive)
    return tasks.filter(t => 
      t.title.toLowerCase().includes(text.toLowerCase())
    );
  }
}
