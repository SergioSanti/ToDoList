import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { getSupabaseClient } from './supabase-client';

/**
 * EDGE FUNCTIONS SERVICE - BUSINESS FUNCTIONALITY
 * 
 * This service handles:
 * - Calling Supabase Edge Functions
 * - Processing business logic in the cloud
 * - Getting task statistics and reports
 * 
 * Edge Function: 'resumo-tarefas'
 */
@Injectable({
  providedIn: 'root'
})
export class EdgeFunctionsService {

  /**
   * Call Edge Function to get task summary/statistics
   * BUSINESS FUNCTIONALITY: Processes data in cloud and returns statistics
   * @returns Observable with task summary data
   */
  getTaskSummary(): Observable<any> {
    const supabase = getSupabaseClient();
    
    return from(
      supabase.functions.invoke('resumo-tarefas', {
        method: 'POST',
        body: {}
      }).then(result => {
        if (result.error) {
          throw result.error;
        }
        return result.data;
      })
    );
  }

  /**
   * Call Edge Function to generate task report
   * BUSINESS FUNCTIONALITY: Generates detailed report of tasks
   * @param categoryId - Optional category ID to filter
   * @returns Observable with report data
   */
  generateTaskReport(categoryId?: number): Observable<any> {
    const supabase = getSupabaseClient();
    
    return from(
      supabase.functions.invoke('resumo-tarefas', {
        method: 'POST',
        body: {
          categoryId: categoryId || null
        }
      }).then(result => {
        if (result.error) {
          throw result.error;
        }
        return result.data;
      })
    );
  }
}

