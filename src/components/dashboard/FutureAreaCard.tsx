
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, Archive } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import { cn } from '@/lib/utils';

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
  return (
    <Card className="mt-12">
      <CardHeader>
        <CardTitle className="text-2xl">已保存分镜列表</CardTitle>
        <CardDescription>
          这里展示了您已保存到数据库的分镜。请选择一个分镜以生成图像/视频的详细提示词。
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingSavedShots ? (
          <div className="flex items-center justify-center text-muted-foreground py-8">
            <Loader2 className="mr-2 h-8 w-8 animate-spin" />
            正在加载分镜...
          </div>
        ) : savedShots.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">镜号</TableHead>
                <TableHead className="w-[120px]">景别</TableHead>
                <TableHead>画面内容</TableHead>
                <TableHead className="w-[100px]">预估时长</TableHead>
                <TableHead className="w-[120px] text-center">选择</TableHead>
                <TableHead className="w-[80px] text-center">存档</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {savedShots.map((shot) => (
                <TableRow 
                  key={shot.id}
                  className={cn(shot.id === selectedShotId ? "bg-primary/10" : "", "hover:bg-muted/50")}
                  onClick={() => onSelectShot(shot)}
                  style={{cursor: 'pointer'}}
                >
                  <TableCell>{shot.shot_number || 'N/A'}</TableCell>
                  <TableCell>{shot.shot_type || 'N/A'}</TableCell>
                  <TableCell className="max-w-xs truncate" title={shot.scene_content || undefined}>
                    {shot.scene_content || '无内容'}
                  </TableCell>
                  <TableCell>{shot.estimated_duration || 'N/A'}</TableCell>
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
              ))}
            </TableBody>
          </Table>
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
