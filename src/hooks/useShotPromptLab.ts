
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type ShotPrompt = Tables<'shot_prompts'>;
export type ShotPromptInsert = TablesInsert<'shot_prompts'>;
export type ShotPromptUpdate = TablesUpdate<'shot_prompts'>;

export type ConsistencyPrompt = Tables<'project_consistency_prompts'>;
export type ConsistencyPromptInsert = TablesInsert<'project_consistency_prompts'>;

export const useShotPromptLab = (shotId: string) => {
  const [prompts, setPrompts] = useState<ShotPrompt[]>([]);
  const [consistencyPrompts, setConsistencyPrompts] = useState<ConsistencyPrompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<ShotPrompt | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchPrompts = useCallback(async () => {
    if (!shotId) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('shot_prompts')
        .select('*')
        .eq('shot_id', shotId)
        .order('version_number', { ascending: false });

      if (error) throw error;
      setPrompts(data || []);
      
      // Select the latest version by default
      if (data && data.length > 0) {
        setSelectedPrompt(data[0]);
      }
    } catch (error: any) {
      toast({
        title: '获取提示词版本失败',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [shotId]);

  const fetchConsistencyPrompts = useCallback(async (projectId: string) => {
    if (!projectId) return;
    try {
      const { data, error } = await supabase
        .from('project_consistency_prompts')
        .select('*')
        .eq('project_id', projectId)
        .order('asset_type', { ascending: true });

      if (error) throw error;
      setConsistencyPrompts(data || []);
    } catch (error: any) {
      toast({
        title: '获取一致性提示词失败',
        description: error.message,
        variant: 'destructive',
      });
    }
  }, []);

  const createPromptVersion = async (promptText: string, isFinal: boolean = false) => {
    if (!shotId) return null;
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('用户未登录');

      // Get the next version number
      const maxVersion = prompts.length > 0 ? Math.max(...prompts.map(p => p.version_number)) : 0;
      const nextVersion = maxVersion + 1;

      const { data, error } = await supabase
        .from('shot_prompts')
        .insert([{
          shot_id: shotId,
          user_id: user.id,
          prompt_text: promptText,
          version_number: nextVersion,
          is_final: isFinal,
        }])
        .select()
        .single();

      if (error) throw error;

      await fetchPrompts(); // Refresh list
      setSelectedPrompt(data);
      toast({ title: '提示词版本已保存' });
      return data;
    } catch (error: any) {
      toast({
        title: '保存提示词版本失败',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const updatePrompt = async (promptId: string, updates: ShotPromptUpdate) => {
    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('shot_prompts')
        .update(updates)
        .eq('id', promptId)
        .select()
        .single();

      if (error) throw error;

      await fetchPrompts(); // Refresh list
      toast({ title: '提示词已更新' });
      return data;
    } catch (error: any) {
      toast({
        title: '更新提示词失败',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const setFinalVersion = async (promptId: string) => {
    setIsSaving(true);
    try {
      // First, unset all other final versions
      await supabase
        .from('shot_prompts')
        .update({ is_final: false })
        .eq('shot_id', shotId);

      // Then set the selected one as final
      const { error } = await supabase
        .from('shot_prompts')
        .update({ is_final: true })
        .eq('id', promptId);

      if (error) throw error;

      await fetchPrompts(); // Refresh list
      toast({ title: '已设为最终版本' });
    } catch (error: any) {
      toast({
        title: '设置最终版本失败',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const deletePrompt = async (promptId: string) => {
    try {
      const { error } = await supabase
        .from('shot_prompts')
        .delete()
        .eq('id', promptId);

      if (error) throw error;

      await fetchPrompts(); // Refresh list
      
      // If deleted prompt was selected, select another one
      if (selectedPrompt?.id === promptId) {
        const remaining = prompts.filter(p => p.id !== promptId);
        setSelectedPrompt(remaining.length > 0 ? remaining[0] : null);
      }
      
      toast({ title: '提示词版本已删除' });
    } catch (error: any) {
      toast({
        title: '删除提示词版本失败',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const createConsistencyPrompt = async (projectId: string, assetType: string, assetName: string, consistencyPrompt: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('用户未登录');

      const { data, error } = await supabase
        .from('project_consistency_prompts')
        .upsert([{
          project_id: projectId,
          user_id: user.id,
          asset_type: assetType,
          asset_name: assetName,
          consistency_prompt: consistencyPrompt,
        }])
        .select()
        .single();

      if (error) throw error;

      await fetchConsistencyPrompts(projectId); // Refresh list
      toast({ title: '一致性提示词已保存' });
      return data;
    } catch (error: any) {
      toast({
        title: '保存一致性提示词失败',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }
  };

  useEffect(() => {
    if (shotId) {
      fetchPrompts();
    }
  }, [shotId, fetchPrompts]);

  return {
    prompts,
    consistencyPrompts,
    selectedPrompt,
    isLoading,
    isSaving,
    setSelectedPrompt,
    fetchPrompts,
    fetchConsistencyPrompts,
    createPromptVersion,
    updatePrompt,
    setFinalVersion,
    deletePrompt,
    createConsistencyPrompt,
  };
};
