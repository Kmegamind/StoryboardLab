
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tables } from '@/integrations/supabase/types';

type Shot = Tables<'structured_shots'>;

interface ShotDetailsCardProps {
  shot: Shot;
}

const ShotDetailsCard: React.FC<ShotDetailsCardProps> = ({ shot }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>分镜详情</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
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
