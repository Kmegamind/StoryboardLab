
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Beaker } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

type Shot = Tables<'structured_shots'>;

interface SelectedShotActionsCardProps {
  selectedShot: Shot | null;
}

const SelectedShotActionsCard: React.FC<SelectedShotActionsCardProps> = ({
  selectedShot,
}) => {
  const navigate = useNavigate();

  if (!selectedShot) {
    return null;
  }

  const handleEnterPromptLab = () => {
    navigate(`/shot-lab/${selectedShot.id}`);
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-2xl">分镜详情</CardTitle>
        <CardDescription>
          已选择分镜号: <span className="font-semibold text-primary">{selectedShot.shot_number || 'N/A'}</span>. 
          进入 Prompt Lab 来生成和编辑这个分镜的视觉方案。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">分镜详情:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <p className="text-muted-foreground"><strong>景别:</strong> {selectedShot.shot_type || 'N/A'}</p>
              <p className="text-muted-foreground"><strong>预估时长:</strong> {selectedShot.estimated_duration || 'N/A'}</p>
              <p className="text-muted-foreground col-span-full"><strong>画面内容:</strong> {selectedShot.scene_content || 'N/A'}</p>
              {selectedShot.dialogue && selectedShot.dialogue !== "无" && (
                <p className="text-muted-foreground col-span-full"><strong>对白:</strong> {selectedShot.dialogue}</p>
              )}
              {selectedShot.camera_movement && (
                <p className="text-muted-foreground"><strong>运镜:</strong> {selectedShot.camera_movement}</p>
              )}
              {selectedShot.sound_music && (
                <p className="text-muted-foreground"><strong>音效:</strong> {selectedShot.sound_music}</p>
              )}
              {selectedShot.visual_style && (
                <p className="text-muted-foreground col-span-full"><strong>视觉风格:</strong> {selectedShot.visual_style}</p>
              )}
              {selectedShot.key_props && (
                <p className="text-muted-foreground col-span-full"><strong>关键道具:</strong> {selectedShot.key_props}</p>
              )}
              {selectedShot.director_notes && (
                <p className="text-muted-foreground col-span-full"><strong>导演注释:</strong> {selectedShot.director_notes}</p>
              )}
            </div>
          </div>
          
          <div className="pt-4">
            <Button
              onClick={handleEnterPromptLab}
              variant="default"
              size="lg"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Beaker className="h-5 w-5 mr-2" />
              进入 Prompt Lab
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SelectedShotActionsCard;
