
import { supabase } from '@/integrations/supabase/client';
import { ShotWithPrompts, VisualOverviewFilters, VisualOverviewSorting } from '@/types/visualOverview';

export const fetchShotsWithPrompts = async (
  projectId: string,
  filters: VisualOverviewFilters,
  sorting: VisualOverviewSorting,
  page: number = 1,
  pageSize: number = 50
): Promise<{ shots: ShotWithPrompts[]; totalCount: number }> => {
  console.log('Fetching shots with filters:', { projectId, filters, sorting, page, pageSize });
  
  try {
    // First, get the basic shots data with count
    let query = supabase
      .from('structured_shots')
      .select('*', { count: 'exact' })
      .eq('project_id', projectId);

    // Apply filters
    if (filters.status === 'archived') {
      query = query.eq('is_archived', true);
    } else if (filters.status === 'active') {
      query = query.eq('is_archived', false);
    }

    if (filters.perspectiveType === 'main') {
      query = query.eq('perspective_type', 'main');
    } else if (filters.perspectiveType === 'perspective') {
      query = query.eq('perspective_type', 'perspective');
    }

    if (filters.shotType) {
      query = query.eq('shot_type', filters.shotType);
    }

    if (filters.searchText) {
      const searchTerm = `%${filters.searchText}%`;
      query = query.or(`shot_number.ilike.${searchTerm},scene_content.ilike.${searchTerm}`);
    }

    // Apply sorting
    if (sorting.field === 'shot_number') {
      // Use natural sorting for shot numbers (convert text to numeric for proper sorting)
      const orderDirection = sorting.direction === 'asc' ? 'asc' : 'desc';
      query = query.order(`CASE 
        WHEN shot_number ~ '^[0-9]+$' THEN shot_number::integer 
        ELSE 999999 
      END`, { ascending: sorting.direction === 'asc' })
      .order('shot_number', { ascending: sorting.direction === 'asc' });
    } else {
      query = query.order(sorting.field, { ascending: sorting.direction === 'asc' });
    }

    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data: shotsData, error: shotsError, count } = await query;

    if (shotsError) {
      console.error('Query error:', shotsError);
      throw shotsError;
    }

    console.log('Shots fetched:', { shotsCount: shotsData?.length || 0, totalCount: count || 0 });

    // Now fetch prompts for these shots
    const shotIds = shotsData?.map(shot => shot.id) || [];
    let shotsWithPrompts: ShotWithPrompts[] = [];

    if (shotIds.length > 0) {
      // Get all prompts for these shots
      const { data: promptsData, error: promptsError } = await supabase
        .from('shot_prompts')
        .select('*')
        .in('shot_id', shotIds)
        .order('version_number', { ascending: false });

      if (promptsError) {
        console.error('Prompts query error:', promptsError);
        // Continue without prompts if there's an error
      }

      // Process the results to get latest and final prompts
      shotsWithPrompts = (shotsData || []).map(shot => {
        const shotPrompts = promptsData?.filter(p => p.shot_id === shot.id) || [];
        
        // Get latest prompt (highest version number)
        const latestPrompt = shotPrompts.length > 0 ? shotPrompts[0] : undefined;
        
        // Get final prompt (where is_final = true)
        const finalPrompt = shotPrompts.find(p => p.is_final) || undefined;

        return {
          ...shot,
          latest_prompt: latestPrompt,
          final_prompt: finalPrompt,
        };
      });
    } else {
      shotsWithPrompts = shotsData || [];
    }

    console.log('Processed shots:', shotsWithPrompts.length);
    
    return {
      shots: shotsWithPrompts,
      totalCount: count || 0,
    };
  } catch (error) {
    console.error('Error in fetchShotsWithPrompts:', error);
    throw error;
  }
};

export const getUniqueShotTypes = async (projectId: string): Promise<string[]> => {
  console.log('Fetching unique shot types for project:', projectId);
  
  try {
    const { data, error } = await supabase
      .from('structured_shots')
      .select('shot_type')
      .eq('project_id', projectId)
      .not('shot_type', 'is', null);

    if (error) {
      console.error('Error fetching shot types:', error);
      throw error;
    }

    const uniqueTypes = [...new Set(data.map(item => item.shot_type).filter(Boolean))];
    console.log('Unique shot types:', uniqueTypes);
    
    return uniqueTypes;
  } catch (error) {
    console.error('Error in getUniqueShotTypes:', error);
    return [];
  }
};
