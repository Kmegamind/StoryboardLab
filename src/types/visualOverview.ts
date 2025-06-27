
import { Tables } from '@/integrations/supabase/types';

type Shot = Tables<'structured_shots'>;
type ShotPrompt = Tables<'shot_prompts'>;

export interface ShotWithPrompts extends Shot {
  latest_prompt?: ShotPrompt;
  final_prompt?: ShotPrompt;
}

export interface VisualOverviewFilters {
  status: 'all' | 'active' | 'archived';
  perspectiveType: 'all' | 'main' | 'perspective';
  shotType: string;
  searchText: string;
}

export interface VisualOverviewSorting {
  field: 'shot_number' | 'created_at' | 'updated_at';
  direction: 'asc' | 'desc';
}
