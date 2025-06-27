import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Save, Plus, Trash2, Star, Loader2, Sparkles } from 'lucide-react';
import { useShotPromptLab } from '@/hooks/useShotPromptLab';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { callDeepSeekAPI } from '@/utils/apiUtils';
import Navbar from '@/components/Navbar';

type Shot = Tables<'structured_shots'>;

const ShotPromptLabPage = () => {
  const { shotId } = useParams<{ shotId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [shot, setShot] = useState<Shot | null>(null);
  const [isLoadingShot, setIsLoadingShot] = useState(true);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);

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

    const userPromptContent = `
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
          <h1 className="text-3xl font-bold">Prompt Lab - 分镜 {shot.shot_number}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>分镜详情</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div><strong>景别:</strong> {shot.shot_type || 'N/A'}</div>
              <div><strong>画面内容:</strong> {shot.scene_content}</div>
              {shot.dialogue && shot.dialogue !== "无" && (
                <div><strong>对白:</strong> {shot.dialogue}</div>
              )}
              {shot.camera_movement && (
                <div><strong>运镜:</strong> {shot.camera_movement}</div>
              )}
              {shot.visual_style && (
                <div><strong>视觉风格:</strong> {shot.visual_style}</div>
              )}
              {shot.director_notes && (
                <div><strong>导演注释:</strong> {shot.director_notes}</div>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>提示词编辑器</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    onClick={generateVisualPrompt}
                    disabled={isGeneratingPrompt}
                    variant="outline"
                  >
                    {isGeneratingPrompt ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    生成视觉方案
                  </Button>
                  <Button onClick={handleSavePrompt} disabled={!currentPrompt.trim()}>
                    <Save className="h-4 w-4 mr-2" />
                    保存版本
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={currentPrompt}
                onChange={(e) => setCurrentPrompt(e.target.value)}
                placeholder="在这里编辑您的提示词，或点击生成视觉方案开始..."
                className="min-h-[400px] font-mono text-sm"
              />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>版本历史</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingVersions ? (
                <div className="flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : promptVersions.length === 0 ? (
                <p className="text-muted-foreground">暂无版本历史</p>
              ) : (
                <div className="space-y-3">
                  {promptVersions.map((version) => (
                    <div key={version.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-2">
                        <span>版本 {version.version_number}</span>
                        {version.is_final && <Badge variant="secondary"><Star className="h-3 w-3" /></Badge>}
                        <span className="text-sm text-muted-foreground">
                          {new Date(version.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleLoadVersion(version.prompt_text)}
                        >
                          加载
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setFinalVersion(version.id)}
                        >
                          设为最终版
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deletePromptVersion(version.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>项目一致性提示词</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingConsistency ? (
                <div className="flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : consistencyPrompts.length === 0 ? (
                <p className="text-muted-foreground">暂无一致性提示词</p>
              ) : (
                <div className="space-y-3">
                  {consistencyPrompts.map((prompt) => (
                    <div key={prompt.id} className="p-3 border rounded">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge>{prompt.asset_type}</Badge>
                          <span className="font-medium">{prompt.asset_name}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => insertConsistencyPrompt(prompt.consistency_prompt)}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            插入
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {prompt.consistency_prompt}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ShotPromptLabPage;
