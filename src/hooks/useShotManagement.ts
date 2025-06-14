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
  const [cinematographerPlan, setCinematographerPlan] = useState<string | null>(null);
  const [isLoadingCinematographer, setIsLoadingCinematographer] = useState<boolean>(false);
  const [artDirectorPlan, setArtDirectorPlan] = useState<string | null>(null);
  const [isLoadingArtDirector, setIsLoadingArtDirector] = useState<boolean>(false);

  const fetchSavedShots = useCallback(async () => {
    setIsLoadingSavedShots(true);
    setSavedShots([]);
    setSelectedShot(null); // Reset selected shot when refetching
    setGeneratedImagePrompts(null); // Clear prompts
    setCinematographerPlan(null);
    setArtDirectorPlan(null);
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
    setCinematographerPlan(null);
    setArtDirectorPlan(null);
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
    const userPromptContent = `
请为以下分镜细节生成一份专业的视觉执行方案和对应的图像/视频提示词:
- 镜号: ${selectedShot.shot_number || 'N/A'}
- 景别: ${selectedShot.shot_type || 'N/A'}
- 画面内容: ${selectedShot.scene_content}
${selectedShot.dialogue && selectedShot.dialogue !== "无" ? `- 对白/潜台词: ${selectedShot.dialogue}` : ''}
${selectedShot.camera_movement ? `- 运镜方式: ${selectedShot.camera_movement}` : ''}
${selectedShot.sound_music ? `- 音效/音乐参考: ${selectedShot.sound_music}` : ''}
${selectedShot.visual_style ? `- 画面风格参考: ${selectedShot.visual_style}` : ''}
${selectedShot.key_props ? `- 关键道具: ${selectedShot.key_props}` : ''}
${selectedShot.director_notes ? `- 导演注释: ${selectedShot.director_notes}` : ''}

请严格按照系统指令的结构进行输出。`;

    const result = await callDeepSeekAPI(systemPromptImagePrompts, userPromptContent);
    if (result) {
      setGeneratedImagePrompts(result);
      toast({ title: "提示词方案生成成功", description: "已为选中分镜生成详细视觉方案。" });
    } else {
      toast({ title: "提示词方案生成失败", description: "未能从AI获取方案。", variant: "destructive"});
    }
    setIsLoadingImagePrompts(false);
  };
  
  const generateCinematographerPlan = async () => {
    if (!selectedShot) {
      toast({ title: "未选择分镜", description: "请先选择一个分镜。", variant: "destructive" });
      return;
    }
    setIsLoadingCinematographer(true);
    setCinematographerPlan(null);

    const systemPrompt = `You are a world-class AI Cinematographer. Your task is to analyze a shot description and provide a detailed cinematography plan.

Output format:

### 1. 镜头解读 (Shot Interpretation)
(Analyze the core emotion and narrative function of this shot.)

### 2. 摄影机设置 (Camera Setup)
**- 焦段 (Focal Length):** (e.g., "35mm for a natural field of view" or "85mm to compress background and isolate the character".)
**- 光圈 (Aperture):** (e.g., "f/2.8 for a shallow depth of field".)
**- 机位 (Camera Position):** (e.g., "Low-angle shot to empower the subject".)

### 3. 运镜设计 (Camera Movement)
(Describe the specific movement. e.g., "Slow push-in to build tension" or "Static shot to convey stillness".)

### 4. 光照方案 (Lighting Plan)
(Describe the lighting setup. e.g., "Three-point lighting with a soft key light, a fill light to reduce shadows, and a backlight for separation. Use a warm gel on the key light to simulate golden hour.")`;

    const userPrompt = `Analyze the following shot and provide a cinematography plan:
- 镜号: ${selectedShot.shot_number || 'N/A'}
- 景别: ${selectedShot.shot_type || 'N/A'}
- 画面内容: ${selectedShot.scene_content}
${selectedShot.director_notes ? `- 导演注释: ${selectedShot.director_notes}` : ''}`;

    const result = await callDeepSeekAPI(systemPrompt, userPrompt);
    if (result) {
      setCinematographerPlan(result);
      toast({ title: "摄像方案生成成功" });
    } else {
      toast({ title: "摄像方案生成失败", variant: "destructive"});
    }
    setIsLoadingCinematographer(false);
  };
  
  const generateArtDirectorPlan = async () => {
    if (!selectedShot) {
      toast({ title: "未选择分镜", description: "请先选择一个分镜。", variant: "destructive" });
      return;
    }
    setIsLoadingArtDirector(true);
    setArtDirectorPlan(null);

    const systemPrompt = `You are a world-class AI Art Director. Your task is to analyze a shot description and provide a detailed art direction plan.

Output format:

### 1. 风格定位 (Style Definition)
(Define the overall visual style. e.g., "Cyberpunk noir with retro-futuristic elements" or "Minimalist Scandinavian design".)

### 2. 色彩脚本 (Color Script)
**- 主色板 (Main Palette):** (List 3-5 key colors with HEX codes and descriptions. e.g., "Deep Indigo (#2c3e50), Neon Pink (#e84393), Muted Gold (#f1c40f)".)
**- 情绪色彩 (Emotional Color):** (Explain how color will be used to convey emotion in this shot.)

### 3. 场景设计 (Set Design)
(Describe key elements of the set, including furniture, architecture, and textures.)

### 4. 道具与服装 (Props & Costumes)
(Detail crucial props and character costume design that align with the overall style.)`;
    
    const userPrompt = `Analyze the following shot and provide an art direction plan:
- 镜号: ${selectedShot.shot_number || 'N/A'}
- 画面内容: ${selectedShot.scene_content}
- 画面风格参考: ${selectedShot.visual_style || 'Not specified'}
${selectedShot.director_notes ? `- 导演注释: ${selectedShot.director_notes}` : ''}`;
    
    const result = await callDeepSeekAPI(systemPrompt, userPrompt);
    if (result) {
      setArtDirectorPlan(result);
      toast({ title: "美术方案生成成功" });
    } else {
      toast({ title: "美术方案生成失败", variant: "destructive"});
    }
    setIsLoadingArtDirector(false);
  };
  
  const clearSelectedShotAndPrompts = () => {
    setSelectedShot(null);
    setGeneratedImagePrompts(null);
    setCinematographerPlan(null);
    setArtDirectorPlan(null);
  };

  return {
    savedShots,
    isLoadingSavedShots,
    selectedShot,
    generatedImagePrompts,
    isLoadingImagePrompts,
    cinematographerPlan,
    isLoadingCinematographer,
    artDirectorPlan,
    isLoadingArtDirector,
    fetchSavedShots,
    selectShot,
    generatePromptsForSelectedShot,
    generateCinematographerPlan,
    generateArtDirectorPlan,
    clearSelectedShotAndPrompts,
  };
};
