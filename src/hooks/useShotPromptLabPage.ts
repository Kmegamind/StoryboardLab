
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/useAuth';
import { useShotDetails } from '@/hooks/useShotDetails';
import { usePromptGeneration } from '@/hooks/usePromptGeneration';
import { useShotPromptLab } from '@/hooks/useShotPromptLab';

export const useShotPromptLabPage = () => {
  const { shotId } = useParams<{ shotId: string }>();
  const { user } = useAuth();
  
  const { shot, isLoadingShot } = useShotDetails(shotId, user?.id);
  const { currentPrompt, setCurrentPrompt, isGeneratingPrompt, generateVisualPrompt } = usePromptGeneration();

  const {
    prompts: promptVersions,
    consistencyPrompts,
    isLoading: isLoadingVersions,
    isSaving: isLoadingConsistency,
    fetchPrompts: fetchPromptVersions,
    fetchConsistencyPrompts,
    createPromptVersion: savePromptVersion,
    deletePrompt: deletePromptVersion,
    setFinalVersion,
    createConsistencyPrompt: saveConsistencyPrompt,
  } = useShotPromptLab(shotId || '');

  useEffect(() => {
    if (shotId && user) {
      fetchPromptVersions();
      fetchConsistencyPrompts(user.id);
    }
  }, [shotId, user]);

  const handleSavePrompt = async () => {
    if (!currentPrompt.trim() || !shotId || !user) return;
    
    const success = await savePromptVersion(currentPrompt);
    if (success) {
      toast({ title: "提示词已保存", description: "已保存为新版本" });
      fetchPromptVersions();
    }
  };

  const handleLoadVersion = (promptText: string) => {
    setCurrentPrompt(promptText);
    toast({ title: "版本已加载", description: "提示词已加载到编辑器" });
  };

  const insertConsistencyPrompt = (promptText: string) => {
    setCurrentPrompt(prev => prev + '\n\n' + promptText);
    toast({ title: "一致性提示词已插入" });
  };

  const handleGeneratePrompt = () => {
    if (shot) {
      generateVisualPrompt(shot);
    }
  };

  return {
    shot,
    isLoadingShot,
    currentPrompt,
    setCurrentPrompt,
    isGeneratingPrompt,
    promptVersions,
    consistencyPrompts,
    isLoadingVersions,
    isLoadingConsistency,
    handleSavePrompt,
    handleLoadVersion,
    insertConsistencyPrompt,
    handleGeneratePrompt,
    setFinalVersion,
    deletePromptVersion,
  };
};
