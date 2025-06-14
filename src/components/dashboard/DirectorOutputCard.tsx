
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Save } from 'lucide-react';

interface DirectorOutputCardProps {
  directorOutput: string;
  setDirectorOutput: (output: string) => void;
  onSaveShotsToDatabase: () => void;
  isLoadingDirector: boolean;
  isSavingShots: boolean;
  disabled?: boolean;
}

const DirectorOutputCard: React.FC<DirectorOutputCardProps> = ({
  directorOutput,
  setDirectorOutput,
  onSaveShotsToDatabase,
  isLoadingDirector,
  isSavingShots,
  disabled = false,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>3. 导演 Agent 处理 (结构化分镜)</CardTitle>
        <CardDescription>AI将把剧本分解为结构化的分镜列表（JSON格式），处理完成后可保存。</CardDescription>
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
            <p className="text-muted-foreground mb-2">结构化分镜列表 (JSON格式, 可编辑):</p>
            <Textarea
              value={directorOutput}
              onChange={(e) => setDirectorOutput(e.target.value)}
              className="min-h-[150px] bg-muted/30 font-mono text-sm"
              placeholder="导演 Agent 将在此处输出JSON格式的结构化分镜列表..."
              disabled={disabled}
            />
            <Button
              onClick={onSaveShotsToDatabase}
              className="mt-4 w-full"
              disabled={disabled || isSavingShots || !directorOutput}
            >
              {isSavingShots ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              保存分镜到数据库
            </Button>
          </>
        ) : (
          !isLoadingDirector && <p className="text-muted-foreground">等待编剧 Agent 完成处理，或导演 Agent 生成结构化分镜...</p>
        )}
      </CardContent>
    </Card>
  );
};

export default DirectorOutputCard;
