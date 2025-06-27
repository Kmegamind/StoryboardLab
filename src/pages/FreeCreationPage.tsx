
import React, { useState } from 'react';
import { useOptionalAuth } from '@/hooks/useOptionalAuth';
import { usePlotProcessing } from '@/hooks/usePlotProcessing';
import { useDirectorProcessing } from '@/hooks/useDirectorProcessing';
import LoginPromptDialog from '@/components/LoginPromptDialog';
import ApiSettingsDialog from '@/components/ApiSettingsDialog';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Settings, ArrowRight, Loader2, Film, Camera, Palette } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const FreeCreationPage = () => {
  const { isAuthenticated } = useOptionalAuth();
  const { isLoadingScreenwriter, processPlotWithScreenwriter } = usePlotProcessing();
  const { isLoadingDirector, processWithDirectorAgent } = useDirectorProcessing();
  
  const [plot, setPlot] = useState('');
  const [screenwriterOutput, setScreenwriterOutput] = useState('');
  const [directorOutput, setDirectorOutput] = useState('');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showApiSettings, setShowApiSettings] = useState(false);
  const [hasStartedCreation, setHasStartedCreation] = useState(false);

  const handleProcessPlot = async () => {
    if (!plot.trim()) {
      toast({ title: '请输入故事情节', variant: 'destructive' });
      return;
    }

    // 如果是第一次创作且未登录，显示登录提示
    if (!hasStartedCreation && !isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    setHasStartedCreation(true);
    setScreenwriterOutput('');
    setDirectorOutput('');
    
    const result = await processPlotWithScreenwriter(plot);
    if (result) {
      setScreenwriterOutput(result);
    }
  };

  const handleDirectorProcessing = async () => {
    if (!screenwriterOutput) {
      toast({ title: '请先完成编剧处理', variant: 'destructive' });
      return;
    }

    setDirectorOutput('');
    const result = await processWithDirectorAgent(screenwriterOutput);
    if (result) {
      setDirectorOutput(result);
    }
  };

  const handleContinueWithoutLogin = () => {
    setShowLoginPrompt(false);
    setHasStartedCreation(true);
    // 继续处理创作
    processPlotWithScreenwriter(plot).then(result => {
      if (result) {
        setScreenwriterOutput(result);
      }
    });
  };

  const isProcessing = isLoadingScreenwriter || isLoadingDirector;

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">AI多智能体创作工作台</h1>
            <p className="text-lg text-muted-foreground">
              体验完整的AI影视创作流程：编剧 → 导演 → 摄像 → 美术
            </p>
            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                onClick={() => setShowApiSettings(true)}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                API 设置
              </Button>
            </div>
          </header>

          {/* 创作流程展示 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* 故事输入 & 编剧处理 */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Film className="h-5 w-5 text-primary" />
                  编剧智能体
                </CardTitle>
                <CardDescription>
                  将故事情节转化为专业剧本
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="例如：一个年轻的程序员发现了一个能够预测未来的神秘算法..."
                  value={plot}
                  onChange={(e) => setPlot(e.target.value)}
                  className="min-h-[150px] text-base mb-4"
                  disabled={isProcessing}
                />
                <Button
                  onClick={handleProcessPlot}
                  className="w-full"
                  disabled={!plot.trim() || isProcessing}
                >
                  {isLoadingScreenwriter ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowRight className="mr-2 h-4 w-4" />
                  )}
                  编剧处理
                </Button>
              </CardContent>
            </Card>

            {/* 导演处理 */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-primary" />
                  导演智能体
                </CardTitle>
                <CardDescription>
                  将剧本分解为结构化分镜
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingScreenwriter ? (
                  <div className="flex items-center justify-center h-[150px]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2">编剧创作中...</span>
                  </div>
                ) : screenwriterOutput ? (
                  <div className="space-y-4">
                    <div className="bg-muted p-3 rounded-lg h-[150px] overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-xs">
                        {screenwriterOutput.slice(0, 200)}...
                      </pre>
                    </div>
                    <Button
                      onClick={handleDirectorProcessing}
                      className="w-full"
                      disabled={isProcessing}
                    >
                      {isLoadingDirector ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <ArrowRight className="mr-2 h-4 w-4" />
                      )}
                      导演分镜
                    </Button>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground h-[150px] flex items-center justify-center">
                    等待编剧完成...
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 分镜结果 */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" />
                  分镜结果
                </CardTitle>
                <CardDescription>
                  结构化的分镜脚本
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingDirector ? (
                  <div className="flex items-center justify-center h-[150px]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2">导演分镜中...</span>
                  </div>
                ) : directorOutput ? (
                  <div className="space-y-4">
                    <div className="bg-muted p-3 rounded-lg h-[150px] overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-xs">
                        {directorOutput.slice(0, 200)}...
                      </pre>
                    </div>
                    {isAuthenticated && (
                      <Button variant="outline" className="w-full">
                        保存到工作台
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground h-[150px] flex items-center justify-center">
                    等待导演完成分镜...
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 完整输出展示区 */}
          {(screenwriterOutput || directorOutput) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {screenwriterOutput && (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle>编剧输出</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted p-4 rounded-lg max-h-[400px] overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm">
                        {screenwriterOutput}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              )}

              {directorOutput && (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle>导演分镜输出</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted p-4 rounded-lg max-h-[400px] overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm">
                        {directorOutput}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* 登录提示 */}
          {!isAuthenticated && hasStartedCreation && (
            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-center">
                💡 提示：登录后可以保存您的创作内容到工作台，并使用完整的摄像、美术等智能体功能。
              </p>
            </div>
          )}
        </div>
      </div>

      <LoginPromptDialog
        open={showLoginPrompt}
        onOpenChange={setShowLoginPrompt}
        onContinueWithoutLogin={handleContinueWithoutLogin}
      />

      <ApiSettingsDialog
        open={showApiSettings}
        onOpenChange={setShowApiSettings}
      />
    </div>
  );
};

export default FreeCreationPage;
