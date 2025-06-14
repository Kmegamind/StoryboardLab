
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

const DashboardPage = () => {
  const [plot, setPlot] = useState<string>('');
  const [screenwriterOutput, setScreenwriterOutput] = useState<string>('');
  const [directorOutput, setDirectorOutput] = useState<string>('');
  const [finalPrompts, setFinalPrompts] = useState<string>('');

  const handleProcessPlot = () => {
    // Placeholder for processing logic
    console.log('Processing plot:', plot);
    // Simulate agent processing
    setScreenwriterOutput(`编剧 Agent 根据 "${plot.substring(0, 20)}..." 生成的剧本概要...`);
  };

  const handleDirectorProcessing = () => {
    // Placeholder
    setDirectorOutput(`导演 Agent 根据编剧输出 "${screenwriterOutput.substring(0,20)}..." 生成的分镜建议...`);
  };
  
  const handleGenerateFinalPrompts = () => {
    // Placeholder
    setFinalPrompts(`根据导演输出 "${directorOutput.substring(0,20)}..." 生成的AI绘图提示词系列...`);
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-24 min-h-screen"> {/* Added pt-24 for navbar */}
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-bold text-primary">AI电影创作工作台</h1>
        <p className="text-xl text-muted-foreground mt-2">
          输入您的故事灵感，让AI Agent逐步细化，最终生成惊艳的视觉提示词。
        </p>
      </header>

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
            <Button onClick={handleProcessPlot} className="mt-4 w-full" disabled={!plot}>
              启动编剧 Agent <ArrowRight className="ml-2 h-4 w-4" />
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
              {screenwriterOutput ? (
                <>
                  <p className="text-muted-foreground mb-2">处理结果:</p>
                  <Textarea value={screenwriterOutput} readOnly className="min-h-[100px] bg-muted/30" />
                  <Button onClick={handleDirectorProcessing} className="mt-4 w-full">
                    移交导演 Agent <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </>
              ) : (
                <p className="text-muted-foreground">等待主要情节输入并启动处理...</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. 导演 Agent 处理</CardTitle>
              <CardDescription>分镜脚本、视觉风格建议、节奏控制等。</CardDescription>
            </CardHeader>
            <CardContent>
              {directorOutput ? (
                <>
                  <p className="text-muted-foreground mb-2">处理结果:</p>
                  <Textarea value={directorOutput} readOnly className="min-h-[100px] bg-muted/30" />
                   {/* Placeholder for further agent interactions e.g. cinematographer, art director */}
                  <Button onClick={handleGenerateFinalPrompts} className="mt-4 w-full">
                     生成最终提示词 <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </>
              ) : (
                <p className="text-muted-foreground">等待编剧 Agent 完成处理...</p>
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
          {finalPrompts ? (
            <Textarea value={finalPrompts} readOnly className="min-h-[150px] bg-muted/30 text-lg" />
          ) : (
            <p className="text-muted-foreground">等待所有Agent处理完成...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;

