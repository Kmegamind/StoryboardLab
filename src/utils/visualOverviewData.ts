
import { supabase } from '@/integrations/supabase/client';
import { ShotWithPrompts, VisualOverviewFilters, VisualOverviewSorting } from '@/types/visualOverview';

export const fetchShotsWithPrompts = async (
  projectId: string,
  filters: VisualOverviewFilters,
  sorting: VisualOverviewSorting
): Promise<ShotWithPrompts[]> => {
  // Fetch shots
  const { data: shotsData, error: shotsError } = await supabase
    .from('structured_shots')
    .select('*')
    .eq('project_id', projectId)
    .eq('is_archived', filters.status === 'archived')
    .order(sorting.field, { ascending: sorting.direction === 'asc' });

  if (shotsError) throw shotsError;

  // Fetch prompts for each shot
  const shotsWithPrompts: ShotWithPrompts[] = [];
  
  for (const shot of shotsData || []) {
    const { data: prompts } = await supabase
      .from('shot_prompts')
      .select('*')
      .eq('shot_id', shot.id)
      .order('version_number', { ascending: false });

    const latestPrompt = prompts?.[0];
    const finalPrompt = prompts?.find(p => p.is_final);

    shotsWithPrompts.push({
      ...shot,
      latest_prompt: latestPrompt,
      final_prompt: finalPrompt,
    });
  }

  return shotsWithPrompts;
};
