import { useState } from 'react';
import { callDeepSeekAPI } from '@/utils/apiUtils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";
import { Tables } from '@/integrations/supabase/types';

type Shot = Tables<'structured_shots'>;

export interface DirectorProcessingHookProps {
  onSaveComplete?: () => void; 
}

export const useDirectorProcessing = (props?: DirectorProcessingHookProps) => {
  const [directorOutput, setDirectorOutput] = useState<string>('');
  const [isLoadingDirector, setIsLoadingDirector] = useState<boolean>(false);
  const [isSavingShots, setIsSavingShots] = useState<boolean>(false);

  const processWithDirectorAgent = async (currentScreenwriterOutput: string) => {
    if (!currentScreenwriterOutput) return;
    setIsLoadingDirector(true);
    setDirectorOutput(''); // Clear previous output

    const systemPromptDirector = `你是一位经验丰富的电影导演和AI提示词工程师。你将收到一份由编剧撰写的初步剧本。你的任务是：
1.  仔细阅读和理解剧本内容。
2.  将剧本详细分解为一系列具体的镜头。
3.  对于每一个镜头，请以JSON数组的格式输出。数组中的每个对象代表一个镜头，并包含以下字段：
    *   \`shot_number\` (镜号): (例如： "1", "2", "3A")
    *   \`shot_type\` (景别): (例如： "全景", "中景", "近景")
    *   \`scene_content\` (画面内容): (详细描述画面中看到的内容，包括环境、角色、角色动作与表情、光线氛围等)
    *   \`dialogue\` (台词): (如果该镜头有台词，请注明说话人；如无，则为 "无" 或 null)
    *   \`estimated_duration\` (预估时长): (例如： "3秒", "5-7秒")
    *   \`camera_movement\` (运镜方式): (例如："固定镜头", "推镜头", "跟随镜头")
    *   \`sound_music\` (音效/音乐): (关键的声音元素，环境音，或背景音乐的风格和情绪描述)
    *   \`visual_style\` (画面风格参考): (例如："电影《银翼杀手》的霓虹赛博朋克风格")
    *   \`key_props\` (关键道具): (镜头中出现的对情节或视觉重要的道具)
    *   \`director_notes\` (导演注释): (例如："角色A惊讶", "整体氛围紧张", "此处特写角色B的眼神")

请确保输出是一个完整的JSON数组字符串，例如：
\`\`\`json
[
  {
    "shot_number": "1",
    "shot_type": "全景",
    "scene_content": "夜晚的赛博朋克都市，霓虹灯闪烁，雨水湿润街道，一艘飞行车载着主角低空掠过。",
    "dialogue": "无",
    "estimated_duration": "5秒",
    "camera_movement": "跟随镜头",
    "sound_music": "电子合成器音乐，雨声，飞行器引擎声",
    "visual_style": "《银翼杀手2049》风格，冷色调，高对比度",
    "key_props": "飞行车, 全息广告牌",
    "director_notes": "营造神秘和广阔的都市氛围，主角显得渺小。"
  }
]
\`\`\`
如果剧本内容无法有效分镜，请返回一个包含错误信息的JSON对象： \`{"error": "无法处理该剧本进行分镜。"}\`
`;
    const result = await callDeepSeekAPI(systemPromptDirector, currentScreenwriterOutput);

    if (result) {
      setDirectorOutput(result);
      toast({
        title: "导演 Agent 处理完成",
        description: "已成功生成结构化分镜 (JSON格式)。",
      });
    }
    setIsLoadingDirector(false);
  };

  const saveShotsToDatabase = async (currentDirectorOutput: string) => {
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
    directorOutput,
    setDirectorOutput,
    isLoadingDirector,
    isSavingShots,
    processWithDirectorAgent,
    saveShotsToDatabase,
  };
};
