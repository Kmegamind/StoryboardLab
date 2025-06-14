
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

type Shot = Tables<'structured_shots'>;

interface FutureAreaCardProps {
  savedShots: Shot[];
  isLoadingSavedShots: boolean;
}

const FutureAreaCard: React.FC<FutureAreaCardProps> = ({
  savedShots,
  isLoadingSavedShots,
}) => {
  return (
    <Card className="mt-12">
      <CardHeader>
        <CardTitle className="text-2xl">已保存分镜列表</CardTitle>
        <CardDescription>
          这里展示了您已保存到数据库的分镜。您可以选择一个分镜进行后续的 AI 生图或生视频操作 (功能规划中)。
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
                {/* <TableHead className="w-[100px]">操作</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {savedShots.map((shot) => (
                <TableRow key={shot.id}>
                  <TableCell>{shot.shot_number || 'N/A'}</TableCell>
                  <TableCell>{shot.shot_type || 'N/A'}</TableCell>
                  <TableCell className="max-w-xs truncate" title={shot.scene_content || undefined}>
                    {shot.scene_content || '无内容'}
                  </TableCell>
                  <TableCell>{shot.estimated_duration || 'N/A'}</TableCell>
                  {/* <TableCell>
                    <Button variant="outline" size="sm" disabled>选择</Button>
                  </TableCell> */}
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
