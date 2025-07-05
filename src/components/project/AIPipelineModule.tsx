import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Zap, Camera, Save } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AIPipelineModuleProps {
  screenwriterOutput: string;
  directorOutput: string;
  setDirectorOutput: (output: string) => void;
  onDirectorProcessing: () => void;
  onSaveShotsToDatabase: () => void;
  isLoadingDirector: boolean;
  isSavingShots: boolean;
  isProcessing: boolean;
}

const AIPipelineModule = ({
  screenwriterOutput,
  directorOutput,
  setDirectorOutput,
  onDirectorProcessing,
  onSaveShotsToDatabase,
  isLoadingDirector,
  isSavingShots,
  isProcessing,
}: AIPipelineModuleProps) => {
  return (
    <div className="space-y-6">
      {/* 流水线状态 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>AI处理流水线</span>
          </CardTitle>
          <CardDescription>
            自动化的AI处理流程：编剧 → 导演 → 分镜生成
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Badge variant={screenwriterOutput ? "default" : "secondary"}>
              编剧完成
            </Badge>
            <div className="h-px bg-border flex-1" />
            <Badge variant={directorOutput ? "default" : "secondary"}>
              导演完成
            </Badge>
            <div className="h-px bg-border flex-1" />
            <Badge variant="secondary">
              分镜保存
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* 导演处理 */}
      {screenwriterOutput && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Camera className="h-5 w-5" />
              <span>导演智能体</span>
            </CardTitle>
            <CardDescription>
              基于编剧脚本生成详细的分镜脚本
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={onDirectorProcessing}
              disabled={!screenwriterOutput || isProcessing}
              className="w-full"
            >
              {isLoadingDirector ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  导演智能体处理中...
                </>
              ) : (
                <>
                  <Camera className="mr-2 h-4 w-4" />
                  开始导演处理
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* 导演输出 */}
      {directorOutput && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>导演输出</CardTitle>
                <CardDescription>
                  导演智能体生成的分镜脚本，您可以进行编辑调整
                </CardDescription>
              </div>
              <Button
                onClick={onSaveShotsToDatabase}
                disabled={!directorOutput || isProcessing}
                variant="default"
              >
                {isSavingShots ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    保存中...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    保存分镜
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="director-output">分镜脚本 (JSON格式)</Label>
              <Textarea
                id="director-output"
                value={directorOutput}
                onChange={(e) => setDirectorOutput(e.target.value)}
                rows={20}
                className="resize-none font-mono text-sm"
                placeholder="导演输出将显示在这里..."
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIPipelineModule;