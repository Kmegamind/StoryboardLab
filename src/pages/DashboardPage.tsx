import React, { useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import PlotInputCard from '@/components/dashboard/PlotInputCard';
import ScreenwriterOutputCard from '@/components/dashboard/ScreenwriterOutputCard';
import DirectorOutputCard from '@/components/dashboard/DirectorOutputCard';
import FutureAreaCard from '@/components/dashboard/FutureAreaCard';
import SelectedShotActionsCard from '@/components/dashboard/SelectedShotActionsCard';
import { Tables } from '@/integrations/supabase/types';

type Shot = Tables<'structured_shots'>;

const DashboardPage = () => {
  const [plot, setPlot] = useState<string>('');
  const [screenwriterOutput, setScreenwriterOutput] = useState<string>('');
  const [directorOutput, setDirectorOutput] = useState<string>('');
  
  const [isLoadingScreenwriter, setIsLoadingScreenwriter] = useState<boolean>(false);
  const [isLoadingDirector, setIsLoadingDirector] = useState<boolean>(false);
  const [isSavingShots, setIsSavingShots] = useState<boolean>(false);

  const [savedShots, setSavedShots] = useState<Shot[]>([]);
  const [isLoadingSavedShots, setIsLoadingSavedShots] = useState<boolean>(false);

  // New states for selected shot and prompt generation
  const [selectedShot, setSelectedShot] = useState<Shot | null>(null);
  const [generatedImagePrompts, setGeneratedImagePrompts] = useState<string | null>(null);
  const [isLoadingImagePrompts, setIsLoadingImagePrompts] = useState<boolean>(false);

  const fetchSavedShots = async () => {
    setIsLoadingSavedShots(true);
    setSavedShots([]); // Clear previous shots
    // Reset selected shot when refetching
    setSelectedShot(null);
    setGeneratedImagePrompts(null);
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
        console.error("Error fetching saved shots:", error);
        toast({
          title: "加载分镜失败",
          description: `数据库错误: ${error.message}`,
          variant: "destructive",
        });
        setSavedShots([]);
      } else {
        setSavedShots(data || []);
      }
    } catch (e) {
      console.error("Exception fetching saved shots:", e);
      toast({
        title: "加载分镜出错",
        description: "加载过程中发生未知错误。",
        variant: "destructive",
      });
      setSavedShots([]);
    } finally {
      setIsLoadingSavedShots(false);
    }
  };

  useEffect(() => {
    fetchSavedShots();
  }, []);

  const callDeepSeekAPI = async (systemPrompt: string, userPrompt: string) => {
    try {
      console.log("Invoking deepseek-proxy function with:", { systemPrompt, userPrompt });
      const { data, error } = await supabase.functions.invoke('deepseek-proxy', {
        body: { systemPrompt, userPrompt },
      });

      if (error) {
        console.error('Edge Function Error:', error);
        toast({
          title: "Edge Function 调用失败",
          description: `错误: ${error.message}`,
          variant: "destructive",
        });
        return null;
      }

      console.log("Edge Function response data:", data);

      if (data && data.content) {
        return data.content;
      } else if (data && data.error) {
        console.error('API Error from Edge Function:', data.error);
        toast({
          title: "API 请求失败 (通过 Edge Function)",
          description: `错误: ${typeof data.error === 'string' ? data.error : data.error.message || '未知 API 错误'}`,
          variant: "destructive",
        });
        return null;
      } else {
        toast({
          title: "Edge Function 响应格式错误",
          description: "未能从 Edge Function 获取有效回复。",
          variant: "destructive",
        });
        return null;
      }
    } catch (error) { 
      console.error('Error invoking Edge Function:', error);
      toast({
        title: "调用 Edge Function 出错",
        description: `请求 Edge Function 时发生网络或未知错误: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      });
      return null;
    }
  };

  const handleProcessPlot = async () => {
    if (!plot) return;
    setIsLoadingScreenwriter(true);
    setScreenwriterOutput('');
    setDirectorOutput(''); 
    setSelectedShot(null);
    setGeneratedImagePrompts(null);

    const systemPromptScreenwriter = "你是一位才华横溢的电影编剧。请根据用户提供的故事梗概或情节，创作一段富有叙事性、包含场景描述、角色行为和对话的初步剧本。请注重故事的流畅性和画面的想象力，暂时不需要严格按照镜头号或非常结构化的格式输出。你的输出将交给导演进行进一步的专业处理和分镜设计。";
    const result = await callDeepSeekAPI(systemPromptScreenwriter, plot);

    if (result) {
      setScreenwriterOutput(result);
      toast({
        title: "编剧 Agent 处理完成",
        description: "已成功生成初步剧本内容。",
      });
    }
    setIsLoadingScreenwriter(false);
  };

  const handleDirectorProcessing = async () => {
    if (!screenwriterOutput) return;
    setIsLoadingDirector(true);
    setDirectorOutput('');
    setSelectedShot(null);
    setGeneratedImagePrompts(null);
    // ... rest of the function
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
    const result = await callDeepSeekAPI(systemPromptDirector, screenwriterOutput);

    if (result) {
      setDirectorOutput(result); // Store the raw JSON string
      toast({
        title: "导演 Agent 处理完成",
        description: "已成功生成结构化分镜 (JSON格式)。",
      });
    }
    setIsLoadingDirector(false);
  };

  const handleDirectorOutputCardGeneratePrompts = async () => {
    // This is the button on DirectorOutputCard. Keep its existing behavior.
    toast({
        title: "功能提示",
        description: "此按钮用于处理导演Agent的直接输出。若要为已保存的单个分镜生成提示词，请先在下方列表中选择分镜。",
        variant: "default"
    });
  };

  const handleSaveShotsToDatabase = async () => {
    if (!directorOutput) {
        toast({ title: "没有可保存的分镜", description: "请先让导演 Agent 处理剧本。", variant: "destructive"});
        return;
    }
    setIsSavingShots(true);
    console.log("Attempting to save shots. Raw director output:", directorOutput);

    const trimmedOutput = directorOutput.trim();
    if (!trimmedOutput.startsWith('[') || !trimmedOutput.endsWith(']')) {
        toast({
            title: "保存失败：格式错误",
            description: "导演输出的不是有效的JSON数组格式。请检查导演Agent的输出。",
            variant: "destructive",
        });
        setIsSavingShots(false);
        return;
    }

    try {
        const shots = JSON.parse(trimmedOutput); 

        if (!Array.isArray(shots) || shots.length === 0) {
            toast({
                title: "保存失败：内容无效",
                description: "导演输出的JSON不是有效的数组或数组为空。",
                variant: "destructive",
            });
            setIsSavingShots(false);
            return;
        }
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            toast({ title: "保存失败", description: "用户未登录，无法保存分镜。", variant: "destructive"});
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
            console.error("Error saving shots to database:", error);
            toast({
                title: "保存分镜失败",
                description: `数据库错误: ${error.message}`,
                variant: "destructive",
            });
        } else {
            toast({
                title: "分镜保存成功",
                description: `已成功将 ${shotsToInsert.length} 个分镜保存到数据库。`,
            });
            fetchSavedShots(); // Refresh the list of saved shots
        }

    } catch (parseError) {
        console.error("Error parsing director output JSON:", parseError);
        toast({
            title: "保存失败：JSON解析错误",
            description: "导演输出的JSON格式有误，无法解析。请检查并修正。",
            variant: "destructive",
        });
    } finally {
        setIsSavingShots(false);
    }
  };

  // New handler for selecting a shot from FutureAreaCard
  const handleSelectShot = (shot: Shot) => {
    setSelectedShot(shot);
    setGeneratedImagePrompts(null); // Clear previous prompts when a new shot is selected
    toast({
      title: "分镜已选择",
      description: `已选择镜号: ${shot.shot_number || 'N/A'}. 现在可以为其生成图像提示词。`,
    });
  };

  // New handler for generating prompts for the selected shot
  const handleGeneratePromptsForSelectedShot = async () => {
    if (!selectedShot) {
      toast({ title: "未选择分镜", description: "请先从下方列表中选择一个分镜。", variant: "destructive" });
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

请确保每个提示词都非常详细，能够指导AI生成高质量的视觉内容。
`;

    const result = await callDeepSeekAPI(systemPromptImagePrompts, userPromptContent);

    if (result) {
      setGeneratedImagePrompts(result);
      toast({
        title: "提示词生成成功",
        description: "已为选中分镜生成图像/视频提示词。",
      });
    } else {
      toast({
        title: "提示词生成失败",
        description: "未能从AI获取提示词，请稍后重试。",
        variant: "destructive"
      });
    }
    setIsLoadingImagePrompts(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-24 min-h-screen">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-bold text-primary">AI电影创作工作台</h1>
        <p className="text-xl text-muted-foreground mt-2">
          输入您的故事灵感，让AI Agent逐步细化，最终生成惊艳的视觉提示词。
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <PlotInputCard
          plot={plot}
          setPlot={setPlot}
          onProcessPlot={handleProcessPlot}
          isLoadingScreenwriter={isLoadingScreenwriter}
        />

        <div className="md:col-span-2 space-y-8">
          <ScreenwriterOutputCard
            screenwriterOutput={screenwriterOutput}
            setScreenwriterOutput={setScreenwriterOutput}
            onDirectorProcessing={handleDirectorProcessing}
            isLoadingScreenwriter={isLoadingScreenwriter}
            isLoadingDirector={isLoadingDirector}
          />
          <DirectorOutputCard
            directorOutput={directorOutput}
            setDirectorOutput={setDirectorOutput}
            onSaveShotsToDatabase={handleSaveShotsToDatabase}
            onGenerateFinalPrompts={handleDirectorOutputCardGeneratePrompts} // Keep existing handler for this button
            isLoadingDirector={isLoadingDirector}
            isSavingShots={isSavingShots}
            isLoadingFinalPrompts={false} 
          />
        </div>
      </div>

      <FutureAreaCard
        savedShots={savedShots}
        isLoadingSavedShots={isLoadingSavedShots}
        onSelectShot={handleSelectShot} // Pass handler
        selectedShotId={selectedShot?.id} // Pass selected shot ID
      />

      {/* New card for selected shot actions */}
      {selectedShot && (
        <SelectedShotActionsCard
          selectedShot={selectedShot}
          onGeneratePrompts={handleGeneratePromptsForSelectedShot}
          isLoadingPrompts={isLoadingImagePrompts}
          generatedPrompts={generatedImagePrompts}
        />
      )}
    </div>
  );
};

export default DashboardPage;
