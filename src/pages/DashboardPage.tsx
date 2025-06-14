import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from "@/components/ui/use-toast";
import { ArrowRight, Loader2, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const DashboardPage = () => {
  const [plot, setPlot] = useState<string>('');
  const [screenwriterOutput, setScreenwriterOutput] = useState<string>('');
  const [directorOutput, setDirectorOutput] = useState<string>(''); // This will hold the structured JSON string or Markdown
  const [finalPrompts, setFinalPrompts] = useState<string>(''); // Kept for now, but its generation is disabled

  const [isLoadingScreenwriter, setIsLoadingScreenwriter] = useState<boolean>(false);
  const [isLoadingDirector, setIsLoadingDirector] = useState<boolean>(false);
  const [isLoadingFinalPrompts, setIsLoadingFinalPrompts] = useState<boolean>(false); // Kept for now
  const [isSavingShots, setIsSavingShots] = useState<boolean>(false); // New state for saving shots

  const callDeepSeekAPI = async (systemPrompt: string, userPrompt: string) => {
    // ... keep existing code (callDeepSeekAPI function)
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
    setDirectorOutput(''); // Clear subsequent steps
    setFinalPrompts('');  // Clear subsequent steps

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
    setFinalPrompts(''); // Clear subsequent steps

    const systemPromptDirector = "你是一位经验丰富的电影导演和AI提示词工程师。你将收到一份由编剧撰写的初步剧本。你的任务是：\n1.  仔细阅读和理解剧本内容。\n2.  将剧本详细分解为一系列具体的镜头。\n3.  对于每一个镜头，请以清晰、结构化的方式提供以下信息。**强烈建议为每个镜头生成一个JSON对象，并将所有镜头的JSON对象组织在一个JSON数组中。如果无法输出JSON数组，请使用Markdown表格，确保每一行代表一个镜头，并且列的顺序和名称严格如下：**\n    *   `shot_number` (镜号): (例如：1, 2, 3A, 3B...)\n    *   `shot_type` (景别): (例如：全景, 中景, 近景, 特写, 大特写, 远景)\n    *   `scene_content` (画面内容): (详细描述画面中看到的内容，包括环境、角色、角色动作与表情、光线氛围等)\n    *   `dialogue` (台词): (如果该镜头有台词，请注明说话人；如无，则留空或注明“无”)\n    *   `estimated_duration` (预估时长): (例如：3秒, 5-7秒)\n    *   `camera_movement` (运镜方式): (例如：固定镜头, 推镜头, 拉镜头, 摇镜头, 跟随镜头, 升降镜头, 旋转镜头, 主观镜头；如无特定要求，可留空)\n    *   `sound_music` (音效/音乐): (关键的声音元素，环境音，或背景音乐的风格和情绪描述)\n    *   `visual_style` (画面风格参考): (例如：电影《银翼杀手》的霓虹赛博朋克风格, 宫崎骏动画的明亮温暖童话风格, 黑白胶片质感的悬疑风格)\n    *   `key_props` (关键道具): (镜头中出现的对情节或视觉重要的道具)\n    *   `director_notes` (情绪识别点/导演注释): (例如：角色A惊讶, 整体氛围紧张, 此处特写角色B的眼神以表达其内心挣扎)\n\n请确保输出的结构化信息完整、具体，方便后续进行数据库存储和AI图像生成。\n例如，JSON数组的格式应为：\n```json\n[\n  {\n    \"shot_number\": \"1\",\n    \"shot_type\": \"全景\",\n    \"scene_content\": \"夜晚的赛博朋克都市，霓虹灯闪烁，雨水湿润街道，一艘飞行车载着主角低空掠过。\",\n    \"dialogue\": \"无\",\n    \"estimated_duration\": \"5秒\",\n    \"camera_movement\": \"跟随镜头\",\n    \"sound_music\": \"电子合成器音乐，雨声，飞行器引擎声\",\n    \"visual_style\": \"《银翼杀手2049》风格，冷色调，高对比度\",\n    \"key_props\": \"飞行车, 全息广告牌\",\n    \"director_notes\": \"营造神秘和广阔的都市氛围，主角显得渺小。\"\n  },\n  {\n    \"shot_number\": \"2\"\n    // ... more fields ...\n  }\n]\n```";
    const result = await callDeepSeekAPI(systemPromptDirector, screenwriterOutput);

    if (result) {
      setDirectorOutput(result);
      toast({
        title: "导演 Agent 处理完成",
        description: "已成功生成结构化分镜建议。",
      });
    }
    setIsLoadingDirector(false);
  };
  
  const handleGenerateFinalPrompts = async () => {
    // This function is now effectively disabled and will be repurposed later
    toast({
        title: "功能调整中",
        description: "此功能将调整为针对数据库中选定的单个分镜生成提示词。",
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
    // TODO: Implement parsing of directorOutput (JSON string or Markdown) into an array of shot objects.
    // TODO: Get user_id from Supabase auth: const { data: { user } } = await supabase.auth.getUser(); if (!user) {toast error and return} Make sure auth is implemented in the app.
    // TODO: Map parsed shots to the structure required by 'structured_shots' table, including user_id.
    // TODO: const { error } = await supabase.from('structured_shots').insert(parsedShotsWithUserId);
    // TODO: Handle success/error with toasts.

    toast({
      title: "保存功能待实现",
      description: "正在开发将结构化分镜保存到数据库的功能。当前输出已在控制台打印。请确保应用已集成用户认证。",
    });
    console.log("Simulating save for director output: ", directorOutput);
    
    setTimeout(() => {
      setIsSavingShots(false);
    }, 2000);
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
              disabled={!plot || isLoadingScreenwriter}
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
              <CardDescription>AI将根据您的情节生成初步的叙事性剧本。</CardDescription>
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
                  <p className="text-muted-foreground mb-2">初步剧本 (可编辑):</p>
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
                    移交导演 Agent (生成结构化分镜)
                  </Button>
                </>
              ) : (
                !isLoadingScreenwriter && <p className="text-muted-foreground">等待主要情节输入并启动处理...</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. 导演 Agent 处理 (结构化分镜)</CardTitle>
              <CardDescription>AI将把剧本分解为结构化的分镜列表（建议输出为JSON格式）。</CardDescription>
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
                  <p className="text-muted-foreground mb-2">结构化分镜列表 (可编辑, 建议JSON格式):</p>
                  <Textarea 
                    value={directorOutput} 
                    onChange={(e) => setDirectorOutput(e.target.value)}
                    className="min-h-[150px] bg-muted/30"
                  />
                  <Button 
                    onClick={handleSaveShotsToDatabase} 
                    className="mt-4 w-full"
                    disabled={isSavingShots || !directorOutput}
                  >
                     {isSavingShots ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                     保存分镜到数据库 (待实现)
                  </Button>
                  <Button 
                    onClick={handleGenerateFinalPrompts} 
                    className="mt-2 w-full"
                    disabled={true} // Button is disabled
                    variant="outline"
                  >
                     {isLoadingFinalPrompts ? ( // Kept loader for consistency if re-enabled
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowRight className="mr-2 h-4 w-4" />
                    )}
                     (后续功能) 生成选中分镜的图像提示词
                  </Button>
                </>
              ) : (
                !isLoadingDirector && <p className="text-muted-foreground">等待编剧 Agent 完成处理，或导演 Agent 生成结构化分镜...</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-12">
        <CardHeader>
          <CardTitle className="text-2xl">AI生图/生视频素材区 (规划中)</CardTitle>
          <CardDescription>
            这里将展示从数据库加载的已保存分镜列表。您可以选择某个分镜，然后使用AI生成图像提示词或进行视频生成操作。
          </CardDescription>
        </CardHeader>
        <CardContent>
          {finalPrompts && ( // Display old finalPrompts if they exist, but generation is disabled
             <Textarea 
              value={finalPrompts} 
              onChange={(e) => setFinalPrompts(e.target.value)}
              className="min-h-[100px] bg-muted/30 text-sm" 
              placeholder="旧版全局提示词输出区域（此功能已调整）"
            />
          )}
          {!finalPrompts && !isLoadingFinalPrompts && ( // Updated placeholder text
            <p className="text-muted-foreground">等待导演 Agent 完成结构化分镜处理，并保存到数据库后，可在此处进行后续操作...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
