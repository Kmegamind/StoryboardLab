
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input'; // Added
import { toast } from "@/components/ui/use-toast"; // Added
import { ArrowRight, Loader2 } from 'lucide-react'; // Added Loader2

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

const DashboardPage = () => {
  const [plot, setPlot] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('sk-169ffc0001d9470a9b313d4312d90183'); // Added API Key state with default
  const [screenwriterOutput, setScreenwriterOutput] = useState<string>('');
  const [directorOutput, setDirectorOutput] = useState<string>('');
  const [finalPrompts, setFinalPrompts] = useState<string>('');

  const [isLoadingScreenwriter, setIsLoadingScreenwriter] = useState<boolean>(false); // Added loading state
  const [isLoadingDirector, setIsLoadingDirector] = useState<boolean>(false); // Added loading state
  const [isLoadingFinalPrompts, setIsLoadingFinalPrompts] = useState<boolean>(false); // Added loading state

  const callDeepSeekAPI = async (systemPrompt: string, userPrompt: string) => {
    if (!apiKey) {
      toast({
        title: "API 密钥缺失",
        description: "请输入您的 DeepSeek API 密钥。",
        variant: "destructive",
      });
      return null;
    }

    try {
      const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        toast({
          title: "API 请求失败",
          description: `错误: ${errorData.error?.message || response.statusText}`,
          variant: "destructive",
        });
        return null;
      }

      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content;
      } else {
        toast({
          title: "API 响应格式错误",
          description: "未能从API获取有效回复。",
          variant: "destructive",
        });
        return null;
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      toast({
        title: "网络请求错误",
        description: `请求API时发生错误: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      });
      return null;
    }
  };

  const handleProcessPlot = async () => {
    if (!plot) return;
    setIsLoadingScreenwriter(true);
    setScreenwriterOutput(''); // Clear previous output

    const systemPromptScreenwriter = "你是一位专业的电影编剧。请根据用户提供的故事/情节，生成一份详细的剧本概要，包括主要角色介绍、故事大纲、开端、发展、高潮和结局。请确保内容结构清晰，引人入胜。";
    const result = await callDeepSeekAPI(systemPromptScreenwriter, plot);

    if (result) {
      setScreenwriterOutput(result);
      toast({
        title: "编剧 Agent 处理完成",
        description: "已成功生成剧本概要。",
      });
    }
    setIsLoadingScreenwriter(false);
  };

  const handleDirectorProcessing = async () => {
    if (!screenwriterOutput) return;
    setIsLoadingDirector(true);
    setDirectorOutput(''); // Clear previous output

    const systemPromptDirector = "你是一位经验丰富的电影导演。用户将提供一份剧本概要。请根据这份概要，提出分镜建议、视觉风格参考（例如，参考哪些电影的风格）、以及关键场景的拍摄要点和节奏控制建议。";
    const result = await callDeepSeekAPI(systemPromptDirector, screenwriterOutput);

    if (result) {
      setDirectorOutput(result);
      toast({
        title: "导演 Agent 处理完成",
        description: "已成功生成分镜和视觉建议。",
      });
    }
    setIsLoadingDirector(false);
  };
  
  const handleGenerateFinalPrompts = async () => {
    if (!directorOutput) return;
    setIsLoadingFinalPrompts(true);
    setFinalPrompts(''); // Clear previous output

    const systemPromptFinal = "你是一个 AI 提示词工程师。用户将提供导演处理后的分镜和视觉建议。请根据这些信息，生成一系列详细的、可以直接用于 AI 图像生成工具（如 Midjourney, Stable Diffusion）的提示词 (prompts)。每个提示词应该专注于一个具体的镜头或场景，并包含场景描述、人物动作、情绪氛围、画面构图、光线、色彩、以及可能的艺术风格。请确保提示词具体、丰富，能够引导 AI 生成高质量、符合要求的图像。请输出多个提示词，每个提示词占一行。";
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

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>API 设置</CardTitle>
          <CardDescription>请输入您的 DeepSeek API 密钥。请注意：此密钥仅存储在您的浏览器中，用于本次会话。为了安全，请勿在生产环境的前端代码中硬编码密钥。</CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            type="password" // Mask the API key
            placeholder="输入您的 DeepSeek API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="text-base"
          />
          <p className="text-xs text-muted-foreground mt-2">
            推荐使用 Supabase Edge Functions 等后端方案管理 API 密钥以确保安全。
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Column 1: Input */}
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
              disabled={!plot || !apiKey || isLoadingScreenwriter}
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

        {/* Column 2: Agent Processing Steps */}
        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>2. 编剧 Agent 处理</CardTitle>
              <CardDescription>角色设定、故事大纲、对话脚本等。</CardDescription>
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
                  <p className="text-muted-foreground mb-2">处理结果:</p>
                  <Textarea value={screenwriterOutput} readOnly className="min-h-[100px] bg-muted/30" />
                  <Button 
                    onClick={handleDirectorProcessing} 
                    className="mt-4 w-full"
                    disabled={isLoadingDirector || !apiKey}
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
                  <p className="text-muted-foreground mb-2">处理结果:</p>
                  <Textarea value={directorOutput} readOnly className="min-h-[100px] bg-muted/30" />
                  <Button 
                    onClick={handleGenerateFinalPrompts} 
                    className="mt-4 w-full"
                    disabled={isLoadingFinalPrompts || !apiKey}
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

      {/* Final Output Section */}
      <Card className="mt-12">
        <CardHeader>
          <CardTitle className="text-2xl">最终输出：AI生图提示词系列</CardTitle>
          <CardDescription>
            这里将展示根据您的创意和Agent处理结果生成的、可用于AI绘画工具的详细提示词。
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
            <Textarea value={finalPrompts} readOnly className="min-h-[150px] bg-muted/30 text-lg" />
          ) : (
            !isLoadingFinalPrompts && <p className="text-muted-foreground">等待所有Agent处理完成...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
