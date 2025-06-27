
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
  
  let query = supabase
    .from('structured_shots')
    .select(`
      *,
      latest_prompt:shot_prompts!shot_prompts_shot_id_fkey(
        id,
        shot_id,
        user_id,
        version_number,
        prompt_text,
        is_final,
        created_at,
        updated_at
      ),
      final_prompt:shot_prompts!shot_prompts_shot_id_fkey(
        id,
        shot_id,
        user_id,
        version_number,
        prompt_text,
        is_final,
        created_at,
        updated_at
      )
    `, { count: 'exact' })
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
  query = query.order(sorting.field, { ascending: sorting.direction === 'asc' });

  // Apply pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data: shotsData, error: shotsError, count } = await query;

  console.log('Query result:', { shotsData, shotsError, count });

  if (shotsError) {
    console.error('Query error:', shotsError);
    throw shotsError;
  }

  // Process the results to get latest and final prompts
  const shotsWithPrompts: ShotWithPrompts[] = (shotsData || []).map(shot => {
    // Get latest prompt (highest version number)
    const latestPrompt = shot.latest_prompt && shot.latest_prompt.length > 0
      ? shot.latest_prompt.sort((a: any, b: any) => b.version_number - a.version_number)[0]
      : undefined;

    // Get final prompt (where is_final = true)
    const finalPrompt = shot.final_prompt && shot.final_prompt.length > 0
      ? shot.final_prompt.find((p: any) => p.is_final)
      : undefined;

    return {
      ...shot,
      latest_prompt: latestPrompt || undefined,
      final_prompt: finalPrompt || undefined,
    };
  });

  console.log('Processed shots:', shotsWithPrompts.length);
  
  return {
    shots: shotsWithPrompts,
    totalCount: count || 0,
  };
};

export const getUniqueShotTypes = async (projectId: string): Promise<string[]> => {
  console.log('Fetching unique shot types for project:', projectId);
  
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
};
