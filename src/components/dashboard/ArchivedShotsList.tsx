
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { ArchiveRestore, History } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Tables } from '@/integrations/supabase/types';

type Shot = Tables<'structured_shots'>;

interface ArchivedShotsListProps {
  archivedShots: Shot[];
  onToggleArchive: (shot: Shot) => void;
}

const ArchivedShotsList: React.FC<ArchivedShotsListProps> = ({
  archivedShots,
  onToggleArchive,
}) => {
  if (archivedShots.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <Collapsible>
        <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between cursor-pointer rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center">
                    <History className="mr-4 h-6 w-6 text-muted-foreground" />
                    <div>
                        <h3 className="text-lg font-semibold">已存档分镜 ({archivedShots.length})</h3>
                        <p className="text-sm text-muted-foreground">
                            这里存放了您暂时不用的分镜。点击展开/折叠。
                        </p>
                    </div>
                </div>
                <Button variant="ghost" size="sm">展开/折叠</Button>
            </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card className="mt-2">
            <CardContent className="pt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">镜号</TableHead>
                    <TableHead>画面内容</TableHead>
                    <TableHead className="w-[120px] text-center">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {archivedShots.map((shot) => (
                    <TableRow key={shot.id}>
                      <TableCell>{shot.shot_number || 'N/A'}</TableCell>
                      <TableCell className="max-w-xs truncate" title={shot.scene_content || undefined}>
                        {shot.scene_content || '无内容'}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => onToggleArchive(shot)}
                          title="恢复此分镜"
                        >
                          <ArchiveRestore className="mr-2 h-4 w-4" />
                          恢复
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default ArchivedShotsList;
