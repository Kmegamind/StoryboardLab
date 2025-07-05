import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, FileText, Play } from 'lucide-react';

interface PlotProcessingModuleProps {
  plot: string;
  setPlot: (plot: string) => void;
  onProcessPlot: () => void;
  isLoadingScreenwriter: boolean;
  screenwriterOutput: string;
  setScreenwriterOutput: (output: string) => void;
  isProcessing: boolean;
}

const PlotProcessingModule = ({
  plot,
  setPlot,
  onProcessPlot,
  isLoadingScreenwriter,
  screenwriterOutput,
  setScreenwriterOutput,
  isProcessing,
}: PlotProcessingModuleProps) => {
  return (
    <div className="space-y-6">
      {/* 情节输入 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>故事情节</span>
          </CardTitle>
          <CardDescription>
            输入您的故事情节，系统将自动生成编剧脚本
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="plot-input">情节描述</Label>
            <Textarea
              id="plot-input"
              value={plot}
              onChange={(e) => setPlot(e.target.value)}
              placeholder="在这里输入您的故事情节..."
              rows={6}
              className="resize-none"
            />
          </div>
          <Button
            onClick={onProcessPlot}
            disabled={!plot.trim() || isProcessing}
            className="w-full"
          >
            {isLoadingScreenwriter ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                编剧智能体处理中...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                开始编剧处理
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* 编剧输出 */}
      {screenwriterOutput && (
        <Card>
          <CardHeader>
            <CardTitle>编剧输出</CardTitle>
            <CardDescription>
              编剧智能体生成的脚本内容，您可以进行编辑调整
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={screenwriterOutput}
              onChange={(e) => setScreenwriterOutput(e.target.value)}
              rows={15}
              className="resize-none font-mono text-sm"
              placeholder="编剧输出将显示在这里..."
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PlotProcessingModule;