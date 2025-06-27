
import React from 'react';
import { Tables } from '@/integrations/supabase/types';
import ShotPromptLabLayout from './ShotPromptLabLayout';
import ShotDetailsCard from './ShotDetailsCard';
import PromptEditor from './PromptEditor';
import PerspectiveCreationHandler from './PerspectiveCreationHandler';
import VersionHistory from './VersionHistory';
import ConsistencyPrompts from './ConsistencyPrompts';

type Shot = Tables<'structured_shots'>;
type ShotPrompt = Tables<'shot_prompts'>;
type ConsistencyPrompt = Tables<'project_consistency_prompts'>;

interface ShotPromptLabContentProps {
  shot: Shot;
  currentPrompt: string;
  setCurrentPrompt: (prompt: string) => void;
  isGeneratingPrompt: boolean;
  promptVersions: ShotPrompt[];
  consistencyPrompts: ConsistencyPrompt[];
  isLoadingVersions: boolean;
  isLoadingConsistency: boolean;
  onSavePrompt: () => void;
  onLoadVersion: (promptText: string) => void;
  insertConsistencyPrompt: (promptText: string) => void;
  onGeneratePrompt: () => void;
  onSetFinalVersion: (versionId: string) => void;
  onDeleteVersion: (versionId: string) => void;
}

const ShotPromptLabContent: React.FC<ShotPromptLabContentProps> = ({
  shot,
  currentPrompt,
  setCurrentPrompt,
  isGeneratingPrompt,
  promptVersions,
  consistencyPrompts,
  isLoadingVersions,
  isLoadingConsistency,
  onSavePrompt,
  onLoadVersion,
  insertConsistencyPrompt,
  onGeneratePrompt,
  onSetFinalVersion,
  onDeleteVersion,
}) => {
  return (
    <ShotPromptLabLayout shot={shot}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ShotDetailsCard shot={shot} />
        <PromptEditor
          currentPrompt={currentPrompt}
          setCurrentPrompt={setCurrentPrompt}
          isGeneratingPrompt={isGeneratingPrompt}
          onGeneratePrompt={onGeneratePrompt}
          onSavePrompt={onSavePrompt}
        />
        <PerspectiveCreationHandler shot={shot} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <VersionHistory
          promptVersions={promptVersions}
          isLoadingVersions={isLoadingVersions}
          onLoadVersion={onLoadVersion}
          onSetFinalVersion={onSetFinalVersion}
          onDeleteVersion={onDeleteVersion}
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

export default ShotPromptLabContent;
