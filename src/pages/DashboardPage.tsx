import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// import { Input } from '@/components/ui/input'; // Removed Input
import { toast } from "@/components/ui/use-toast";
import { ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client'; // Ensure supabase client is imported

// const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions'; // Not needed here anymore

const DashboardPage = () => {
  const [plot, setPlot] = useState<string>('');
  // const [apiKey, setApiKey] = useState<string>('sk-169ffc0001d9470a9b313d4312d90183'); // Removed API Key state
  const [screenwriterOutput, setScreenwriterOutput] = useState<string>('');
  const [directorOutput, setDirectorOutput] = useState<string>('');
  const [finalPrompts, setFinalPrompts] = useState<string>('');

  const [isLoadingScreenwriter, setIsLoadingScreenwriter] = useState<boolean>(false);
  const [isLoadingDirector, setIsLoadingDirector] = useState<boolean>(false);
  const [isLoadingFinalPrompts, setIsLoadingFinalPrompts] = useState<boolean>(false);

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

      // The Edge Function should return a JSON object.
      // If successful, it might look like { "content": "..." }
      // If error within Edge Function (e.g., DeepSeek API error), it might be { "error": "message" }
      if (data && data.content) {
        return data.content;
      } else if (data && data.error) {
        // This handles errors returned by the DeepSeek API via our Edge Function
        console.error('API Error from Edge Function:', data.error);
        toast({
          title: "API 请求失败 (通过 Edge Function)",
          // data.error could be a string or an object like { message: "...", type: "..." }
          description: `错误: ${typeof data.error === 'string' ? data.error : data.error.message || '未知 API 错误'}`,
          variant: "destructive",
        });
        return null;
      } else {
        // This case handles unexpected responses from the Edge Function itself
        toast({
          title: "Edge Function 响应格式错误",
          description: "未能从 Edge Function 获取有效回复。",
          variant: "destructive",
        });
        return null;
      }
    } catch (error) { // Catches network errors when trying to reach the Edge Function
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

    const systemPromptScreenwriter = `你是一位专业的电影编剧和AI提示词工程师。请根据用户提供的故事/情节，将其详细分解为一系列镜头。对于每个镜头，请提供以下信息，并尽量使用清晰的结构化文本格式输出，例如Markdown表格或编号列表：
- **镜号**: (例如：1, 2, 3...)
- **景别**: (例如：全景, 中景, 近景, 特写, 大特写, 远景)
- **画面内容**: (详细描述画面中看到的内容，包括环境、角色、角色动作与表情、光线氛围等)
- **台词**: (如果该镜头有台词，请注明说话人)
- **预估时长**: (例如：3秒, 5-7秒)
- **运镜方式**: (例如：固定镜头, 推镜头, 拉镜头, 摇镜头, 跟随镜头, 升降镜头, 旋转镜头, 主观镜头)
- **音效/音乐**: (关键的声音元素，环境音，或背景音乐的风格和情绪描述)
- **画面风格参考**: (例如：电影《银翼杀手》的霓虹赛博朋克风格, 宫崎骏动画的明亮温暖童话风格, 黑白胶片质感的悬疑风格)
- **关键道具**: (镜头中出现的对情节或视觉重要的道具)
- **情绪识别点/导演注释**: (例如：角色A惊讶, 整体氛围紧张, 此处特写角色B的眼神以表达其内心挣扎)

在镜头列表之前，你可以选择性地提供一个总体的故事简介、主要角色介绍和故事大纲。请确保每个镜头信息尽可能完整、具体，结构清晰，方便后续生成图像。`;
    const result = await callDeepSeekAPI(systemPromptScreenwriter, plot);

    if (result) {
      setScreenwriterOutput(result);
      toast({
        title: "编剧 Agent 处理完成",
        description: "已成功生成初步的结构化剧本概要。",
      });
    }
    setIsLoadingScreenwriter(false);
  };

  const handleDirectorProcessing = async () => {
    if (!screenwriterOutput) return;
    setIsLoadingDirector(true);
    setDirectorOutput('');

    const systemPromptDirector = "你是一位经验丰富的电影导演。用户将提供一份由编剧 Agent 处理过的结构化剧本（可能包含镜号、景别、画面内容、台词等信息）。请仔细审阅这份剧本，并针对每个或重要的镜头，补充或优化以下内容：\n- **分镜建议细化**: 基于编剧的描述，给出更具体的分镜构图想法，例如视觉焦点、角色位置关系、前景/背景元素。\n- **视觉风格确认与延展**: 对编剧提出的风格参考进行确认，或提出更具体的视觉风格元素（色彩、光影、质感）。如果编剧未提供，请给出你的建议。\n- **拍摄要点**: 针对关键场景，指出拍摄时的注意事项，例如特殊摄影技巧、灯光布置要点。\n- **节奏控制建议**: 对场景或连续镜头的节奏提出建议，例如快切、慢节奏、镜头时长等。\n- **情绪与氛围强化**: 如何通过视觉和听觉元素进一步强化场景所需的情绪和氛围。\n请以清晰、有条理的方式输出你的导演意见，可以直接在编剧提供的结构上进行补充或评论。";
    const result = await callDeepSeekAPI(systemPromptDirector, screenwriterOutput);

    if (result) {
      setDirectorOutput(result);
      toast({
        title: "导演 Agent 处理完成",
        description: "已成功生成导演处理意见。",
      });
    }
    setIsLoadingDirector(false);
  };
  
  const handleGenerateFinalPrompts = async () => {
    if (!directorOutput) return;
    setIsLoadingFinalPrompts(true);
    setFinalPrompts('');

    const systemPromptFinal = "你是一个顶级的 AI 图像生成提示词工程师。用户将提供一份经过编剧和导演处理的详细电影场景描述，这份描述可能已经包含了镜号、景别、详细画面内容、角色动作表情、台词、运镜方式、音效音乐氛围、画面风格参考、关键道具以及导演的关键注释和情绪识别点。\n你的任务是：根据这些极其详尽的输入，为每一个镜头或关键画面生成一个或多个可以直接用于先进 AI 图像生成工具（如 Midjourney v6+, DALL-E 3, Stable Diffusion XL/Flux）的、高质量的英文提示词 (prompts)。\n**提示词要求**：\n1.  **高度具体**：包含场景（室内/室外，具体地点）、时间（白天/夜晚/黄昏）、角色（外貌特征、服装、姿势、表情、情绪）、物体、构图（景别如 close-up, medium shot, full shot, establishing shot；摄像机角度如 low angle, high angle, eye-level）、光照（如 cinematic lighting, soft light, rim lighting, volumetric lighting）、色彩（如 vibrant colors, monochrome, pastel palette）、艺术风格（如 photorealistic, hyperrealistic, anime style, impressionistic, cyberpunk, fantasy art, specific artist's style like Greg Rutkowski or Alphonse Mucha）、以及任何能增强画面效果的关键词（如 8K, ultra-detailed, sharp focus, dramatic atmosphere）。\n2.  **英文输出**：所有提示词必须是英文。\n3.  **结构化**：如果输入是分镜头的，请为每个镜头生成对应的提示词，并清晰标注对应的镜号或场景描述，以便用户对应。\n4.  **参数化（可选）**: 可以适当使用 Midjourney/SD 的参数，如 `--ar` (aspect ratio), `--style raw`, `--stylize`, `--chaos`, `--v 6.0` 等，如果这些参数有助于实现导演的意图。\n5.  **避免空泛**: 不要使用过于主观或AI难以理解的描述，力求画面元素的可实现性。\n6.  **多个提示词**: 对于复杂的场景，可以生成多个略有差异的提示词，给用户更多选择。\n请直接输出提示词列表。";
    const result = await callDeepSeekAPI(systemPromptFinal, directorOutput);
    
    if (result) {
      setFinalPrompts(result);
      toast({
        title: "最终提示词生成完毕",
        description: "已成功生成AI绘图提示词系列。",
      });
    }
    setIsLoadingFinalPrompts(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-24 min-h-screen">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-bold text-primary">AI电影创作工作台</h1>
        <p className="text-xl text-muted-foreground mt-2">
          输入您的故事灵感，让AI Agent逐步细化，最终生成惊艳的视觉提示词。
        </p>
      </header>

      {/* API Key Card Removed */}
      {/* ... keep existing code (API Key Card commented out) ... */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>1. 输入您的故事/情节</CardTitle>
            <CardDescription>在这里输入您的原创故事、小说片段或核心情节。</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="例如：在一个赛博朋克都市，一个失忆的侦探必须找回他的过去，同时揭露一个威胁整个城市的阴谋..."
              value={plot}
              onChange={(e) => setPlot(e.target.value)}
              className="min-h-[200px] text-base"
            />
            <Button 
              onClick={handleProcessPlot} 
              className="mt-4 w-full" 
              disabled={!plot || isLoadingScreenwriter} // Removed !apiKey
            >
              {isLoadingScreenwriter ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="mr-2 h-4 w-4" />
              )}
              启动编剧 Agent
            </Button>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>2. 编剧 Agent 处理</CardTitle>
              <CardDescription>角色设定、故事大纲、对话脚本等。AI将尝试按结构化格式输出。</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingScreenwriter && !screenwriterOutput && (
                <div className="flex items-center justify-center text-muted-foreground">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  处理中...
                </div>
              )}
              {screenwriterOutput ? (
                <>
                  <p className="text-muted-foreground mb-2">处理结果 (可编辑):</p>
                  <Textarea 
                    value={screenwriterOutput} 
                    onChange={(e) => setScreenwriterOutput(e.target.value)}
                    className="min-h-[100px] bg-muted/30" 
                  />
                  <Button 
                    onClick={handleDirectorProcessing} 
                    className="mt-4 w-full"
                    disabled={isLoadingDirector || !screenwriterOutput} 
                  >
                    {isLoadingDirector ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowRight className="mr-2 h-4 w-4" />
                    )}
                    移交导演 Agent
                  </Button>
                </>
              ) : (
                !isLoadingScreenwriter && <p className="text-muted-foreground">等待主要情节输入并启动处理...</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. 导演 Agent 处理</CardTitle>
              <CardDescription>分镜脚本、视觉风格建议、节奏控制等。</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingDirector && !directorOutput && (
                 <div className="flex items-center justify-center text-muted-foreground">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  处理中...
                </div>
              )}
              {directorOutput ? (
                <>
                  <p className="text-muted-foreground mb-2">处理结果 (可编辑):</p>
                  <Textarea 
                    value={directorOutput} 
                    onChange={(e) => setDirectorOutput(e.target.value)}
                    className="min-h-[100px] bg-muted/30" 
                  />
                  <Button 
                    onClick={handleGenerateFinalPrompts} 
                    className="mt-4 w-full"
                    disabled={isLoadingFinalPrompts || !directorOutput}
                  >
                     {isLoadingFinalPrompts ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowRight className="mr-2 h-4 w-4" />
                    )}
                     生成最终提示词
                  </Button>
                </>
              ) : (
                !isLoadingDirector && <p className="text-muted-foreground">等待编剧 Agent 完成处理...</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-12">
        <CardHeader>
          <CardTitle className="text-2xl">最终输出：AI生图提示词系列</CardTitle>
          <CardDescription>
            这里将展示根据您的创意和Agent处理结果生成的、可用于AI绘画工具的详细提示词 (可编辑)。
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingFinalPrompts && !finalPrompts && (
            <div className="flex items-center justify-center text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              生成中...
            </div>
          )}
          {finalPrompts ? (
            <Textarea 
              value={finalPrompts} 
              onChange={(e) => setFinalPrompts(e.target.value)}
              className="min-h-[150px] bg-muted/30 text-lg" 
            />
          ) : (
            !isLoadingFinalPrompts && <p className="text-muted-foreground">等待所有Agent处理完成...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
