
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';
import { useShotPromptLab } from '@/hooks/useShotPromptLab';
import { useAuth } from '@/hooks/useAuth';
import { useShotDetails } from '@/hooks/useShotDetails';
import { usePromptGeneration } from '@/hooks/usePromptGeneration';
import ShotPromptLabLayout from '@/components/shot-prompt-lab/ShotPromptLabLayout';
import ShotDetailsCard from '@/components/shot-prompt-lab/ShotDetailsCard';
import PromptEditor from '@/components/shot-prompt-lab/PromptEditor';
import VersionHistory from '@/components/shot-prompt-lab/VersionHistory';
import ConsistencyPrompts from '@/components/shot-prompt-lab/ConsistencyPrompts';
import PerspectiveCreationHandler from '@/components/shot-prompt-lab/PerspectiveCreationHandler';

const ShotPromptLabPage = () => {
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

  if (isLoadingShot) {
    return (
      <ShotPromptLabLayout>
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-4">正在加载分镜详情...</p>
        </div>
      </ShotPromptLabLayout>
    );
  }

  if (!shot) {
    return (
      <ShotPromptLabLayout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-lg text-muted-foreground">分镜不存在</p>
        </div>
      </ShotPromptLabLayout>
    );
  }

  return (
    <ShotPromptLabLayout shot={shot}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ShotDetailsCard shot={shot} />
        <PromptEditor
          currentPrompt={currentPrompt}
          setCurrentPrompt={setCurrentPrompt}
          isGeneratingPrompt={isGeneratingPrompt}
          onGeneratePrompt={handleGeneratePrompt}
          onSavePrompt={handleSavePrompt}
        />
        <PerspectiveCreationHandler shot={shot} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <VersionHistory
          promptVersions={promptVersions}
          isLoadingVersions={isLoadingVersions}
          onLoadVersion={handleLoadVersion}
          onSetFinalVersion={setFinalVersion}
          onDeleteVersion={deletePromptVersion}
        />
        <ConsistencyPrompts
          consistencyPrompts={consistencyPrompts}
          isLoadingConsistency={isLoadingConsistency}
          onInsertPrompt={insertConsistencyPrompt}
        />
      </div>
    </ShotPromptLabLayout>
  );
};

export default ShotPromptLabPage;
