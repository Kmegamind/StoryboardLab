
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, ArrowRight } from 'lucide-react';

interface ScreenwriterOutputCardProps {
  screenwriterOutput: string;
  setScreenwriterOutput: (output: string) => void;
  onDirectorProcessing: () => void;
  isLoadingScreenwriter: boolean;
  isLoadingDirector: boolean;
}

const ScreenwriterOutputCard: React.FC<ScreenwriterOutputCardProps> = ({
  screenwriterOutput,
  setScreenwriterOutput,
  onDirectorProcessing,
  isLoadingScreenwriter,
  isLoadingDirector,
}) => {
  return (
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
              onClick={onDirectorProcessing}
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
  );
};

export default ScreenwriterOutputCard;
