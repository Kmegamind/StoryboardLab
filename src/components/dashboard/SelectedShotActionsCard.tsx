
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Camera, Palette } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Tables } from '@/integrations/supabase/types';

type Shot = Tables<'structured_shots'>;

interface SelectedShotActionsCardProps {
  selectedShot: Shot | null;
  onGeneratePrompts: () => void;
  isLoadingPrompts: boolean;
  generatedPrompts: string | null;
  onGenerateCinematographerPlan: () => void;
  isLoadingCinematographer: boolean;
  onGenerateArtDirectorPlan: () => void;
  isLoadingArtDirector: boolean;
}

const SelectedShotActionsCard: React.FC<SelectedShotActionsCardProps> = ({
  selectedShot,
  onGeneratePrompts,
  isLoadingPrompts,
  generatedPrompts,
  onGenerateCinematographerPlan,
  isLoadingCinematographer,
  onGenerateArtDirectorPlan,
  isLoadingArtDirector,
}) => {
  if (!selectedShot) {
    return null; // Don't render anything if no shot is selected
  }

  const isAnyLoading = isLoadingPrompts || isLoadingCinematographer || isLoadingArtDirector;

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-2xl">为选中分镜生成 AI 方案</CardTitle>
        <CardDescription>
          已选择分镜号: <span className="font-semibold text-primary">{selectedShot.shot_number || 'N/A'}</span>. 
          点击下方按钮，让不同的 AI Agent 为此分镜生成专业方案。
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
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Button
              onClick={onGeneratePrompts}
              disabled={isAnyLoading}
            >
              {isLoadingPrompts ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Sparkles />
              )}
              生成视觉方案
            </Button>
            <Button
              onClick={onGenerateCinematographerPlan}
              disabled={isAnyLoading}
              variant="secondary"
            >
              {isLoadingCinematographer ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Camera />
              )}
              移交摄像 Agent
            </Button>
            <Button
              onClick={onGenerateArtDirectorPlan}
              disabled={isAnyLoading}
              variant="secondary"
            >
              {isLoadingArtDirector ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Palette />
              )}
              移交美术 Agent
            </Button>
          </div>

          {generatedPrompts && (
            <div>
              <h4 className="font-semibold mt-6 mb-2">生成的视觉方案:</h4>
              <div className="p-4 bg-muted/20 border border-primary/50 rounded-md min-h-[150px] max-h-[600px] overflow-y-auto text-sm">
                <pre className="whitespace-pre-wrap font-sans">{generatedPrompts}</pre>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SelectedShotActionsCard;
