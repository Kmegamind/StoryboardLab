import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, Archive, Eye, Camera, ChevronRight } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

type Shot = Tables<'structured_shots'>;

interface FutureAreaCardProps {
  savedShots: Shot[];
  isLoadingSavedShots: boolean;
  onSelectShot: (shot: Shot) => void;
  selectedShotId?: string | null;
  onToggleArchive: (shot: Shot) => void;
}

const FutureAreaCard: React.FC<FutureAreaCardProps> = ({
  savedShots,
  isLoadingSavedShots,
  onSelectShot,
  selectedShotId,
  onToggleArchive,
}) => {
  const navigate = useNavigate();

  // Group shots by main shots and their perspective variants
  const groupedShots = React.useMemo(() => {
    const mainShots = savedShots.filter(shot => shot.perspective_type === 'main');
    const perspectiveShots = savedShots.filter(shot => shot.perspective_type === 'perspective');
    
    return mainShots.map(mainShot => ({
      main: mainShot,
      perspectives: perspectiveShots.filter(p => p.parent_shot_id === mainShot.id)
    }));
  }, [savedShots]);

  const renderShotRow = (shot: Shot, isVariant: boolean = false) => (
    <TableRow 
      key={shot.id}
      className={cn(
        shot.id === selectedShotId ? "bg-primary/10" : "", 
        "hover:bg-muted/50",
        isVariant ? "bg-muted/30" : ""
      )}
      onClick={() => onSelectShot(shot)}
      style={{cursor: 'pointer'}}
    >
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          {isVariant && <ChevronRight className="h-3 w-3 text-muted-foreground ml-4" />}
          {shot.perspective_type === 'main' ? (
            <Camera className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
          <span>{shot.shot_number || 'N/A'}</span>
          {shot.perspective_type === 'perspective' && (
            <span className="text-xs text-muted-foreground">({shot.perspective_name})</span>
          )}
        </div>
      </TableCell>
      <TableCell>{shot.shot_type || 'N/A'}</TableCell>
      <TableCell className="max-w-xs">
        <div className="truncate" title={shot.scene_content || undefined}>
          {shot.scene_content || '无内容'}
        </div>
      </TableCell>
      <TableCell className="max-w-xs">
        <div className="truncate" title={shot.dialogue || undefined}>
          {shot.dialogue || '无'}
        </div>
      </TableCell>
      <TableCell>{shot.estimated_duration || 'N/A'}</TableCell>
      <TableCell className="max-w-xs">
        <div className="truncate" title={shot.camera_movement || undefined}>
          {shot.camera_movement || '无'}
        </div>
      </TableCell>
      <TableCell className="max-w-xs">
        <div className="truncate" title={shot.sound_music || undefined}>
          {shot.sound_music || '无'}
        </div>
      </TableCell>
      <TableCell className="max-w-xs">
        <div className="truncate" title={shot.visual_style || undefined}>
          {shot.visual_style || '无'}
        </div>
      </TableCell>
      <TableCell className="max-w-xs">
        <div className="truncate" title={shot.key_props || undefined}>
          {shot.key_props || '无'}
        </div>
      </TableCell>
      <TableCell className="max-w-xs">
        <div className="truncate" title={shot.director_notes || undefined}>
          {shot.director_notes || '无'}
        </div>
      </TableCell>
      <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
        <Button 
          variant={shot.id === selectedShotId ? "default" : "outline"} 
          size="sm" 
          onClick={() => onSelectShot(shot)}
          className="w-full"
        >
          {shot.id === selectedShotId ? <CheckCircle className="mr-2 h-4 w-4" /> : null}
          {shot.id === selectedShotId ? '已选择' : '选择'}
        </Button>
      </TableCell>
      <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onToggleArchive(shot)}
          title="存档此分镜"
          className="text-muted-foreground hover:text-foreground"
        >
          <Archive className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>已生成的分镜</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate('/visual-overview')}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              视觉总览
            </Button>
          </div>
        </div>
        <CardDescription>
          管理您的分镜，点击选择分镜进行详细查看和编辑
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingSavedShots ? (
          <div className="flex items-center justify-center text-muted-foreground py-8">
            <Loader2 className="mr-2 h-8 w-8 animate-spin" />
            正在加载分镜...
          </div>
        ) : groupedShots.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">镜号</TableHead>
                  <TableHead className="w-[80px]">景别</TableHead>
                  <TableHead className="min-w-[200px]">画面内容</TableHead>
                  <TableHead className="w-[120px]">台词</TableHead>
                  <TableHead className="w-[80px]">预估时长</TableHead>
                  <TableHead className="w-[100px]">运镜方式</TableHead>
                  <TableHead className="w-[120px]">音效/音乐</TableHead>
                  <TableHead className="w-[100px]">画面风格</TableHead>
                  <TableHead className="w-[100px]">关键道具</TableHead>
                  <TableHead className="w-[120px]">导演注释</TableHead>
                  <TableHead className="w-[80px] text-center">选择</TableHead>
                  <TableHead className="w-[60px] text-center">存档</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupedShots.map(({ main, perspectives }) => (
                  <React.Fragment key={main.id}>
                    {renderShotRow(main)}
                    {perspectives.map(perspective => renderShotRow(perspective, true))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            您还没有保存任何分镜，或者您需要先登录。请先使用导演 Agent 生成并保存分镜。
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default FutureAreaCard;
