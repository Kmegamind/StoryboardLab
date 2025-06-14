
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast"; // Corrected import path
import { Tables } from '@/integrations/supabase/types';
import { callDeepSeekAPI } from '@/utils/apiUtils';

type Shot = Tables<'structured_shots'>;

export const useShotManagement = () => {
  const [savedShots, setSavedShots] = useState<Shot[]>([]);
  const [isLoadingSavedShots, setIsLoadingSavedShots] = useState<boolean>(false);
  const [selectedShot, setSelectedShot] = useState<Shot | null>(null);
  const [generatedImagePrompts, setGeneratedImagePrompts] = useState<string | null>(null);
  const [isLoadingImagePrompts, setIsLoadingImagePrompts] = useState<boolean>(false);

  const fetchSavedShots = useCallback(async () => {
    setIsLoadingSavedShots(true);
    setSavedShots([]);
    setSelectedShot(null); // Reset selected shot when refetching
    setGeneratedImagePrompts(null); // Clear prompts
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoadingSavedShots(false);
        return;
      }
      const { data, error } = await supabase
        .from('structured_shots')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) {
        toast({ title: "加载分镜失败", description: `数据库错误: ${error.message}`, variant: "destructive"});
        setSavedShots([]);
      } else {
        setSavedShots(data || []);
      }
    } catch (e) {
      toast({ title: "加载分镜出错", description: "加载过程中发生未知错误。", variant: "destructive"});
      setSavedShots([]);
    } finally {
      setIsLoadingSavedShots(false);
    }
  }, []);

  const selectShot = (shot: Shot) => {
    setSelectedShot(shot);
    setGeneratedImagePrompts(null); // Clear previous prompts
    toast({
      title: "分镜已选择",
      description: `已选择镜号: ${shot.shot_number || 'N/A'}.`,
    });
  };

  const generatePromptsForSelectedShot = async () => {
    if (!selectedShot) {
      toast({ title: "未选择分镜", description: "请先选择一个分镜。", variant: "destructive" });
      return;
    }
    setIsLoadingImagePrompts(true);
    setGeneratedImagePrompts(null);

    const systemPromptImagePrompts = "你是一位AI提示词工程师，专门为文生图或文生视频模型（如DALL-E, Midjourney, Stable Diffusion, Sora）创作高质量的视觉提示词。根据用户提供的分镜细节，你的任务是生成2-3个独特且富有想象力的详细提示词。每个提示词应独立成段，包含场景、主体、动作、构图、光线、色彩、氛围、艺术风格等关键视觉元素。请确保提示词具有强烈的画面感和可执行性。";
    const userPromptContent = `
请为以下分镜细节生成2-3个详细的图像/视频提示词:
- 镜号: ${selectedShot.shot_number || 'N/A'}
- 景别: ${selectedShot.shot_type || 'N/A'}
- 画面内容: ${selectedShot.scene_content}
${selectedShot.dialogue && selectedShot.dialogue !== "无" ? `- 对白/潜台词: ${selectedShot.dialogue}` : ''}
${selectedShot.camera_movement ? `- 运镜方式: ${selectedShot.camera_movement}` : ''}
${selectedShot.sound_music ? `- 音效/音乐参考: ${selectedShot.sound_music}` : ''}
${selectedShot.visual_style ? `- 画面风格参考: ${selectedShot.visual_style}` : ''}
${selectedShot.key_props ? `- 关键道具: ${selectedShot.key_props}` : ''}
${selectedShot.director_notes ? `- 导演注释: ${selectedShot.director_notes}` : ''}

请确保每个提示词都非常详细，能够指导AI生成高质量的视觉内容。`;

    const result = await callDeepSeekAPI(systemPromptImagePrompts, userPromptContent);
    if (result) {
      setGeneratedImagePrompts(result);
      toast({ title: "提示词生成成功", description: "已为选中分镜生成提示词。" });
    } else {
      toast({ title: "提示词生成失败", description: "未能从AI获取提示词。", variant: "destructive"});
    }
    setIsLoadingImagePrompts(false);
  };
  
  const clearSelectedShotAndPrompts = () => {
    setSelectedShot(null);
    setGeneratedImagePrompts(null);
  };

  return {
    savedShots,
    isLoadingSavedShots,
    selectedShot,
    generatedImagePrompts,
    isLoadingImagePrompts,
    fetchSavedShots,
    selectShot,
    generatePromptsForSelectedShot,
    clearSelectedShotAndPrompts, // Add this to be used by other hooks
  };
};
