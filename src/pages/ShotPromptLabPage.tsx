
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useShotPromptLab } from '@/hooks/useShotPromptLab';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { callDeepSeekAPI } from '@/utils/apiUtils';
import Navbar from '@/components/Navbar';
import ShotDetailsCard from '@/components/shot-prompt-lab/ShotDetailsCard';
import PromptEditor from '@/components/shot-prompt-lab/PromptEditor';
import VersionHistory from '@/components/shot-prompt-lab/VersionHistory';
import ConsistencyPrompts from '@/components/shot-prompt-lab/ConsistencyPrompts';
import PerspectiveSelector from '@/components/shot-prompt-lab/PerspectiveSelector';

type Shot = Tables<'structured_shots'>;

const ShotPromptLabPage = () => {
  const { shotId } = useParams<{ shotId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [shot, setShot] = useState<Shot | null>(null);
  const [isLoadingShot, setIsLoadingShot] = useState(true);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [isCreatingPerspective, setIsCreatingPerspective] = useState(false);

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
      fetchShotDetails();
      fetchPromptVersions();
      fetchConsistencyPrompts(user.id);
    }
  }, [shotId, user]);

  const fetchShotDetails = async () => {
    if (!shotId) return;
    
    setIsLoadingShot(true);
    try {
      const { data, error } = await supabase
        .from('structured_shots')
        .select('*')
        .eq('id', shotId)
        .single();

      if (error) {
        toast({ title: "加载分镜失败", description: error.message, variant: "destructive" });
        navigate('/dashboard');
      } else {
        setShot(data);
      }
    } catch (error) {
      toast({ title: "加载分镜出错", description: "请重试", variant: "destructive" });
      navigate('/dashboard');
    } finally {
      setIsLoadingShot(false);
    }
  };

  const generateVisualPrompt = async () => {
    if (!shot) return;
    
    setIsGeneratingPrompt(true);
    setCurrentPrompt('');

    const systemPromptImagePrompts = `You are a world-class AI visual production team, consisting of a meticulous Image Analyst and a creative AI Prompt Engineer. Your goal is to transform a simple shot description into a comprehensive, professional-grade visual production plan and a set of ready-to-use, bilingual (English and Chinese) prompts for generative AI models like Midjourney, DALL-E 3, or Sora.

Based on the user's provided shot details, follow this exact structure for your output:

---

### 1. 图像分析 (Image Analysis)
(Provide a detailed analysis of the visual elements described in the shot. Describe the architecture, atmosphere, characters, lighting, and key objects in English. This section is for deep understanding.)

### 2. 知识库 / 执行方案 (Knowledge Base / Execution Plan)
(This is the core creative and technical plan. Be specific and detailed.)

**- 整体概念 (Overall Concept):**
  (Break down the single shot into 2-3 distinct, cinematic camera angles or moments. e.g., an establishing shot, a medium shot, a close-up.)

**- 风格与情绪 (Style & Mood):**
  (Define the art style, e.g., "High-end 2.5-D animated concept-art look", "Photorealistic, gritty noir". Define the mood, e.g., "Dream-like, serene, mysterious".)

**- 保持一致性的关键元素 (Key Elements for Consistency):**
  (List specific visual details that MUST remain consistent across all generated images for this shot, e.g., character's clothing, architectural motifs, specific props.)

**- 构图与布局 (Layout & Composition):**
  (For each camera angle defined in the 'Overall Concept', describe the composition rules, e.g., "Rule-of-thirds", "Leading lines", "Shallow DOF".)

**- 调色板 (Color Palette):**
  (Suggest a specific color palette. You can use descriptive names or even HEX codes, e.g., "Jade-Teal (#2f7e7c), Dusky Sapphire (#122f57), Lantern Ember (#ff5c37)")

### 3. 图像生成提示词 (Image Generation Prompts)
(For each camera angle/moment from the 'Overall Concept', provide one final, detailed prompt. Each prompt MUST be bilingual.)

**- 镜头 1: [Angle Name]**
  **English:** [Detailed prompt in English. Start with resolution/aspect ratio, e.g., "16:9 cinematic". Include all elements from the knowledge base: subject, action, style, composition, lighting, color. Be extremely descriptive.]
  **中文:** [The exact same detailed prompt, translated into Chinese.]

**- 镜头 2: [Angle Name]**
  **English:** [Detailed prompt in English.]
  **中文:** [The exact same detailed prompt, translated into Chinese.]

---

Your output must be clear, well-structured, and ready for a professional production pipeline.`;

    let userPromptContent = `
请为以下分镜细节生成一份专业的视觉执行方案和对应的图像/视频提示词:
- 镜号: ${shot.shot_number || 'N/A'}
- 景别: ${shot.shot_type || 'N/A'}
- 画面内容: ${shot.scene_content}
${shot.dialogue && shot.dialogue !== "无" ? `- 对白/潜台词: ${shot.dialogue}` : ''}
${shot.camera_movement ? `- 运镜方式: ${shot.camera_movement}` : ''}
${shot.sound_music ? `- 音效/音乐参考: ${shot.sound_music}` : ''}
${shot.visual_style ? `- 画面风格参考: ${shot.visual_style}` : ''}
${shot.key_props ? `- 关键道具: ${shot.key_props}` : ''}
${shot.director_notes ? `- 导演注释: ${shot.director_notes}` : ''}

请严格按照系统指令的结构进行输出。`;

    // If this is a perspective variant, add perspective information
    if (shot.perspective_type === 'perspective' && shot.perspective_name) {
      userPromptContent += `

特别注意：这是一个视角变体镜头，请特别强调以下视角要求：
- 视角类型: ${shot.perspective_name}
- 在生成的所有提示词中都要融入这个特定视角的特点
- 确保最终的图像生成提示词能够准确体现 ${shot.perspective_name} 的视觉特征`;
    }

    const result = await callDeepSeekAPI(systemPromptImagePrompts, userPromptContent);
    if (result) {
      setCurrentPrompt(result);
      toast({ title: "视觉方案生成成功", description: "已生成详细视觉方案，您可以进一步编辑。" });
    } else {
      toast({ title: "视觉方案生成失败", description: "未能从AI获取方案。", variant: "destructive" });
    }
    setIsGeneratingPrompt(false);
  };

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

  const handleCreatePerspective = async (perspectiveId: string, perspectiveName: string, promptModifier: string) => {
    if (!shot) return;
    
    setIsCreatingPerspective(true);
    try {
      // Create perspective shot using database operation
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

      // Navigate to the new perspective shot
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

  if (isLoadingShot) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-4">正在加载分镜详情...</p>
        </div>
      </div>
    );
  }

  if (!shot) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-lg text-muted-foreground">分镜不存在</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回仪表板
          </Button>
          <h1 className="text-3xl font-bold">
            Prompt Lab - 分镜 {shot.shot_number}
            {shot.perspective_type === 'perspective' && (
              <span className="text-lg text-muted-foreground ml-2">
                ({shot.perspective_name})
              </span>
            )}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ShotDetailsCard shot={shot} />
          <PromptEditor
            currentPrompt={currentPrompt}
            setCurrentPrompt={setCurrentPrompt}
            isGeneratingPrompt={isGeneratingPrompt}
            onGeneratePrompt={generateVisualPrompt}
            onSavePrompt={handleSavePrompt}
          />
          {shot.perspective_type === 'main' && (
            <PerspectiveSelector
              onCreatePerspective={handleCreatePerspective}
              isCreating={isCreatingPerspective}
            />
          )}
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
      </div>
    </div>
  );
};

export default ShotPromptLabPage;
