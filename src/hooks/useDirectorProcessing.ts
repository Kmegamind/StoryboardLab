
import { useState } from 'react';
import { callAPIStream } from '@/utils/apiStreamUtils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";
import { Tables } from '@/integrations/supabase/types';

type Shot = Tables<'structured_shots'>;

export interface DirectorProcessingHookProps {
  onSaveComplete?: () => void;
}

export const useDirectorProcessing = (props?: DirectorProcessingHookProps) => {
  const [isLoadingDirector, setIsLoadingDirector] = useState<boolean>(false);
  const [isSavingShots, setIsSavingShots] = useState<boolean>(false);

  const processWithDirectorAgent = async (
    currentScreenwriterOutput: string,
    onChunk: (chunk: string) => void,
    onStreamComplete?: () => void,
  ) => {
    if (!currentScreenwriterOutput) return;
    setIsLoadingDirector(true);

    const systemPromptDirector = `你是一位经验丰富的电影导演。你的任务是将剧本分解为一系列具体的镜头，并以JSON数组的格式输出。

每个镜头对象应包含以下字段:
- "shot_number" (镜号)
- "shot_type" (景别)
- "scene_content" (画面内容)
- "dialogue" (台词)
- "estimated_duration" (预估时长)
- "camera_movement" (运镜方式)
- "sound_music" (音效/音乐)
- "visual_style" (画面风格参考)
- "key_props" (关键道具)
- "director_notes" (导演注释)

请确保你的输出是一个结构良好、完整的JSON数组字符串。如果剧本无法分镜，请返回 {"error": "无法处理该剧本进行分镜。"}`;

    await callAPIStream(
      'deepseek-proxy',
      { systemPrompt: systemPromptDirector, userPrompt: currentScreenwriterOutput },
      onChunk,
      (error) => {
        toast({ title: "导演 Agent 处理失败", description: error.message, variant: "destructive" });
        setIsLoadingDirector(false);
      },
      () => {
        setIsLoadingDirector(false);
        toast({
          title: "导演 Agent 处理完成",
          description: "已成功生成结构化分镜。",
        });
        if (onStreamComplete) {
          onStreamComplete();
        }
      }
    );
  };

  const saveShotsToDatabase = async (currentDirectorOutput: string, projectId: string) => {
    if (!currentDirectorOutput) {
      toast({ title: "没有可保存的分镜", description: "导演输出为空。", variant: "destructive"});
      return;
    }
    setIsSavingShots(true);
    const trimmedOutput = currentDirectorOutput.trim();
    if (!trimmedOutput.startsWith('[') || !trimmedOutput.endsWith(']')) {
      toast({
        title: "保存失败：格式错误",
        description: "导演输出的不是有效的JSON数组格式。",
        variant: "destructive",
      });
      setIsSavingShots(false);
      return;
    }
    try {
      const shots = JSON.parse(trimmedOutput) as Partial<Shot>[];
      if (!Array.isArray(shots) || shots.length === 0) {
        toast({ title: "保存失败：内容无效", description: "JSON不是有效数组或数组为空。", variant: "destructive"});
        setIsSavingShots(false);
        return;
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: "保存失败", description: "用户未登录。", variant: "destructive"});
        setIsSavingShots(false);
        return;
      }
      const shotsToInsert = shots.map(shot => ({
        user_id: user.id,
        project_id: projectId,
        shot_number: String(shot.shot_number || ''),
        shot_type: String(shot.shot_type || ''),
        scene_content: String(shot.scene_content || '无内容'),
        dialogue: String(shot.dialogue || ''),
        estimated_duration: String(shot.estimated_duration || ''),
        camera_movement: String(shot.camera_movement || ''),
        sound_music: String(shot.sound_music || ''),
        visual_style: String(shot.visual_style || ''),
        key_props: String(shot.key_props || ''),
        director_notes: String(shot.director_notes || ''),
      }));
      const { error } = await supabase.from('structured_shots').insert(shotsToInsert);
      if (error) {
        toast({ title: "保存分镜失败", description: `数据库错误: ${error.message}`, variant: "destructive"});
      } else {
        toast({ title: "分镜保存成功", description: `已成功将 ${shotsToInsert.length} 个分镜保存到数据库。`});
        props?.onSaveComplete?.();
      }
    } catch (parseError) {
      toast({ title: "保存失败：JSON解析错误", description: "导演输出的JSON格式有误。", variant: "destructive"});
    } finally {
      setIsSavingShots(false);
    }
  };

  return {
    isLoadingDirector,
    isSavingShots,
    processWithDirectorAgent,
    saveShotsToDatabase,
  };
};
