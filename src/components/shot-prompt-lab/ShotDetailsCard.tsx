
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Camera } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

type Shot = Tables<'structured_shots'>;

interface ShotDetailsCardProps {
  shot: Shot;
}

const ShotDetailsCard: React.FC<ShotDetailsCardProps> = ({ shot }) => {
  const isMainShot = shot.perspective_type === 'main';
  const isPerspectiveVariant = shot.perspective_type === 'perspective';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {isPerspectiveVariant ? (
              <Eye className="h-5 w-5" />
            ) : (
              <Camera className="h-5 w-5" />
            )}
            分镜详情
          </CardTitle>
          <div className="flex gap-2">
            {isPerspectiveVariant && (
              <Badge variant="secondary">
                <Eye className="h-3 w-3 mr-1" />
                视角变体
              </Badge>
            )}
            {isMainShot && (
              <Badge variant="default">
                <Camera className="h-3 w-3 mr-1" />
                主镜头
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div><strong>镜号:</strong> {shot.shot_number || 'N/A'}</div>
        
        {isPerspectiveVariant && shot.perspective_name && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded">
            <strong className="text-blue-800 dark:text-blue-200">视角类型:</strong>
            <span className="ml-2 text-blue-700 dark:text-blue-300">{shot.perspective_name}</span>
          </div>
        )}
        
        <div><strong>景别:</strong> {shot.shot_type || 'N/A'}</div>
        <div><strong>画面内容:</strong> {shot.scene_content}</div>
        {shot.dialogue && shot.dialogue !== "无" && (
          <div><strong>对白:</strong> {shot.dialogue}</div>
        )}
        {shot.camera_movement && (
          <div><strong>运镜:</strong> {shot.camera_movement}</div>
        )}
        {shot.visual_style && (
          <div><strong>视觉风格:</strong> {shot.visual_style}</div>
        )}
        {shot.director_notes && (
          <div><strong>导演注释:</strong> {shot.director_notes}</div>
        )}
      </CardContent>
    </Card>
  );
};

export default ShotDetailsCard;
