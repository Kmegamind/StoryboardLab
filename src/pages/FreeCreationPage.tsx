
import React, { useState } from 'react';
import { useOptionalAuth } from '@/hooks/useOptionalAuth';
import { usePlotProcessing } from '@/hooks/usePlotProcessing';
import LoginPromptDialog from '@/components/LoginPromptDialog';
import ApiSettingsDialog from '@/components/ApiSettingsDialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Settings, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const FreeCreationPage = () => {
  const { isAuthenticated } = useOptionalAuth();
  const { isLoadingScreenwriter, processPlotWithScreenwriter } = usePlotProcessing();
  
  const [plot, setPlot] = useState('');
  const [screenwriterOutput, setScreenwriterOutput] = useState('');
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
    const result = await processPlotWithScreenwriter(plot);
    if (result) {
      setScreenwriterOutput(result);
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

  return (
    <div className="container mx-auto px-4 py-8 pt-24 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">AI创作工作台</h1>
          <p className="text-lg text-muted-foreground">
            输入您的故事情节，AI将帮您创作精彩内容
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 故事输入区 */}
          <Card>
            <CardHeader>
              <CardTitle>故事情节输入</CardTitle>
              <CardDescription>
                请输入您的故事梗概或详细情节
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="例如：一个年轻的程序员发现了一个能够预测未来的神秘算法..."
                value={plot}
                onChange={(e) => setPlot(e.target.value)}
                className="min-h-[200px] text-base"
                disabled={isLoadingScreenwriter}
              />
              <Button
                onClick={handleProcessPlot}
                className="mt-4 w-full"
                disabled={!plot.trim() || isLoadingScreenwriter}
              >
                {isLoadingScreenwriter ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="mr-2 h-4 w-4" />
                )}
                开始AI创作
              </Button>
            </CardContent>
          </Card>

          {/* 创作结果区 */}
          <Card>
            <CardHeader>
              <CardTitle>AI创作结果</CardTitle>
              <CardDescription>
                AI根据您的故事情节生成的初步剧本
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingScreenwriter ? (
                <div className="flex items-center justify-center h-[200px]">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">AI正在创作中...</span>
                </div>
              ) : screenwriterOutput ? (
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap bg-muted p-4 rounded-lg text-sm">
                    {screenwriterOutput}
                  </pre>
                </div>
              ) : (
                <div className="text-center text-muted-foreground h-[200px] flex items-center justify-center">
                  输入故事情节后，AI创作结果将在这里显示
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {!isAuthenticated && hasStartedCreation && (
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-center">
              💡 提示：登录后可以保存您的创作内容，建议您创建账户以便随时查看和编辑作品。
            </p>
          </div>
        )}
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
