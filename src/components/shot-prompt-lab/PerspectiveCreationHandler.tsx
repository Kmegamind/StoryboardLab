
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import PerspectiveSelector from './PerspectiveSelector';

type Shot = Tables<'structured_shots'>;

interface PerspectiveCreationHandlerProps {
  shot: Shot;
}

const PerspectiveCreationHandler: React.FC<PerspectiveCreationHandlerProps> = ({ shot }) => {
  const [isCreatingPerspective, setIsCreatingPerspective] = useState(false);
  const navigate = useNavigate();

  const handleCreatePerspective = async (perspectiveId: string, perspectiveName: string, promptModifier: string) => {
    setIsCreatingPerspective(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: "创建失败", description: "用户未登录", variant: "destructive" });
        return;
      }

      const perspectiveShotNumber = `${shot.shot_number}-${perspectiveName}`;

      const newPerspectiveShot = {
        project_id: shot.project_id,
        user_id: user.id,
        parent_shot_id: shot.id,
        perspective_type: 'perspective' as const,
        perspective_name: perspectiveName,
        shot_number: perspectiveShotNumber,
        shot_type: shot.shot_type,
        scene_content: shot.scene_content,
        dialogue: shot.dialogue,
        estimated_duration: shot.estimated_duration,
        camera_movement: shot.camera_movement,
        sound_music: shot.sound_music,
        visual_style: shot.visual_style,
        key_props: shot.key_props,
        director_notes: `${shot.director_notes || ''}\n\n[视角变体] ${perspectiveName}: ${promptModifier}`.trim(),
      };

      const { data, error } = await supabase
        .from('structured_shots')
        .insert([newPerspectiveShot])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "视角变体已创建",
        description: `已创建 ${perspectiveName} 视角变体，正在跳转...`,
      });

      setTimeout(() => {
        navigate(`/shot-prompt-lab/${data.id}`);
      }, 1000);

    } catch (error: any) {
      toast({
        title: "创建视角变体失败",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsCreatingPerspective(false);
    }
  };

  if (shot.perspective_type !== 'main') {
    return null;
  }

  return (
    <PerspectiveSelector
      onCreatePerspective={handleCreatePerspective}
      isCreating={isCreatingPerspective}
    />
  );
};

export default PerspectiveCreationHandler;
