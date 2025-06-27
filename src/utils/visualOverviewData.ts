
import { supabase } from '@/integrations/supabase/client';
import { ShotWithPrompts, VisualOverviewFilters, VisualOverviewSorting } from '@/types/visualOverview';

export const fetchShotsWithPrompts = async (
  projectId: string,
  filters: VisualOverviewFilters,
  sorting: VisualOverviewSorting,
  page: number = 1,
  pageSize: number = 50
): Promise<{ shots: ShotWithPrompts[]; totalCount: number }> => {
  let query = supabase
    .from('structured_shots')
    .select(`
      *,
      latest_prompt:shot_prompts!shot_prompts_shot_id_fkey(
        id,
        version_number,
        prompt_text,
        is_final,
        created_at
      ),
      final_prompt:shot_prompts!shot_prompts_shot_id_fkey!inner(
        id,
        version_number,
        prompt_text,
        is_final,
        created_at
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

  if (shotsError) throw shotsError;

  // Process the results to get latest and final prompts
  const shotsWithPrompts: ShotWithPrompts[] = (shotsData || []).map(shot => {
    // Get latest prompt (highest version number)
    const latestPrompt = shot.latest_prompt
      ?.sort((a: any, b: any) => b.version_number - a.version_number)[0];

    // Get final prompt (where is_final = true)
    const finalPrompt = shot.final_prompt
      ?.find((p: any) => p.is_final);

    return {
      ...shot,
      latest_prompt: latestPrompt,
      final_prompt: finalPrompt,
    };
  });

  return {
    shots: shotsWithPrompts,
    totalCount: count || 0,
  };
};

export const getUniqueShotTypes = async (projectId: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from('structured_shots')
    .select('shot_type')
    .eq('project_id', projectId)
    .not('shot_type', 'is', null);

  if (error) throw error;

  const uniqueTypes = [...new Set(data.map(item => item.shot_type).filter(Boolean))];
  return uniqueTypes;
};
