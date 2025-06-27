
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ShotWithPrompts, VisualOverviewFilters } from '@/types/visualOverview';

export const batchArchiveShots = async (
  selectedShots: string[],
  filters: VisualOverviewFilters,
  onSuccess: () => void
) => {
  if (selectedShots.length === 0) return;

  try {
    const newArchivedStatus = filters.status !== 'archived';
    const { error } = await supabase
      .from('structured_shots')
      .update({ is_archived: newArchivedStatus })
      .in('id', selectedShots);

    if (error) throw error;

    toast({ title: `已批量${newArchivedStatus ? '存档' : '恢复'} ${selectedShots.length} 个分镜` });
    onSuccess();
  } catch (error: any) {
    toast({
      title: '批量操作失败',
      description: error.message,
      variant: 'destructive',
    });
  }
};

export const batchSetFinalPrompts = async (
  selectedShots: string[],
  shots: ShotWithPrompts[],
  onSuccess: () => void
) => {
  if (selectedShots.length === 0) return;

  try {
    for (const shotId of selectedShots) {
      const shot = shots.find(s => s.id === shotId);
      if (shot?.latest_prompt) {
        // Unset all other final versions for this shot
        await supabase
          .from('shot_prompts')
          .update({ is_final: false })
          .eq('shot_id', shotId);

        // Set latest as final
        await supabase
          .from('shot_prompts')
          .update({ is_final: true })
          .eq('id', shot.latest_prompt.id);
      }
    }

    toast({ title: `已批量设置 ${selectedShots.length} 个分镜的最终版本` });
    onSuccess();
  } catch (error: any) {
    toast({
      title: '批量设置失败',
      description: error.message,
      variant: 'destructive',
    });
  }
};
