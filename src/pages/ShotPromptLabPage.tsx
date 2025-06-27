
import React from 'react';
import { useShotPromptLabPage } from '@/hooks/useShotPromptLabPage';
import ShotPromptLabLoading from '@/components/shot-prompt-lab/ShotPromptLabLoading';
import ShotPromptLabNotFound from '@/components/shot-prompt-lab/ShotPromptLabNotFound';
import ShotPromptLabContent from '@/components/shot-prompt-lab/ShotPromptLabContent';

const ShotPromptLabPage = () => {
  const {
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
  } = useShotPromptLabPage();

  if (isLoadingShot) {
    return <ShotPromptLabLoading />;
  }

  if (!shot) {
    return <ShotPromptLabNotFound />;
  }

  return (
    <ShotPromptLabContent
      shot={shot}
      currentPrompt={currentPrompt}
      setCurrentPrompt={setCurrentPrompt}
      isGeneratingPrompt={isGeneratingPrompt}
      promptVersions={promptVersions}
      consistencyPrompts={consistencyPrompts}
      isLoadingVersions={isLoadingVersions}
      isLoadingConsistency={isLoadingConsistency}
      onSavePrompt={handleSavePrompt}
      onLoadVersion={handleLoadVersion}
      insertConsistencyPrompt={insertConsistencyPrompt}
      onGeneratePrompt={handleGeneratePrompt}
      onSetFinalVersion={setFinalVersion}
      onDeleteVersion={deletePromptVersion}
    />
  );
};

export default ShotPromptLabPage;
