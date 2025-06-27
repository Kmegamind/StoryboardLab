
import { useState } from 'react';
import { toast } from "@/hooks/use-toast";
import { callDeepSeekAPI } from '@/utils/apiUtils';
import { Tables } from '@/integrations/supabase/types';

type Shot = Tables<'structured_shots'>;

export const usePromptGeneration = () => {
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);

  const generateVisualPrompt = async (shot: Shot) => {
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

  return {
    currentPrompt,
    setCurrentPrompt,
    isGeneratingPrompt,
    generateVisualPrompt,
  };
};
