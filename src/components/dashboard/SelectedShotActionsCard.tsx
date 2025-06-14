
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Tables } from '@/integrations/supabase/types';

type Shot = Tables<'structured_shots'>;

interface SelectedShotActionsCardProps {
  selectedShot: Shot | null;
  onGeneratePrompts: () => void;
  isLoadingPrompts: boolean;
  generatedPrompts: string | null;
}

const SelectedShotActionsCard: React.FC<SelectedShotActionsCardProps> = ({
  selectedShot,
  onGeneratePrompts,
  isLoadingPrompts,
  generatedPrompts,
}) => {
  if (!selectedShot) {
    return null; // Don't render anything if no shot is selected
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-2xl">为选中分镜生成提示词</CardTitle>
        <CardDescription>
          已选择分镜号: <span className="font-semibold text-primary">{selectedShot.shot_number || 'N/A'}</span>. 
          点击下方按钮，AI 将根据此分镜的详细信息生成用于图像或视频模型的提示词。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-1">分镜详情:</h4>
            <p className="text-sm text-muted-foreground"><strong>景别:</strong> {selectedShot.shot_type || 'N/A'}</p>
            <p className="text-sm text-muted-foreground"><strong>画面内容:</strong> {selectedShot.scene_content || 'N/A'}</p>
            {selectedShot.visual_style && <p className="text-sm text-muted-foreground"><strong>画面风格参考:</strong> {selectedShot.visual_style}</p>}
            {selectedShot.director_notes && <p className="text-sm text-muted-foreground"><strong>导演注释:</strong> {selectedShot.director_notes}</p>}
          </div>
          
          <Button
            onClick={onGeneratePrompts}
            disabled={isLoadingPrompts}
            className="w-full"
          >
            {isLoadingPrompts ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            生成图像/视频提示词
          </Button>

          {isLoadingPrompts && !generatedPrompts && (
            <div className="flex items-center justify-center text-muted-foreground py-4">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              正在生成提示词...
            </div>
          )}

          {generatedPrompts && (
            <div>
              <h4 className="font-semibold mt-6 mb-2">生成的提示词:</h4>
              <Textarea
                value={generatedPrompts}
                readOnly
                className="min-h-[150px] bg-muted/20 border-primary/50"
                placeholder="生成的提示词将显示在此处..."
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SelectedShotActionsCard;
