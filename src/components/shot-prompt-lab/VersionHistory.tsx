
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Star, Loader2 } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

type ShotPrompt = Tables<'shot_prompts'>;

interface VersionHistoryProps {
  promptVersions: ShotPrompt[];
  isLoadingVersions: boolean;
  onLoadVersion: (promptText: string) => void;
  onSetFinalVersion: (versionId: string) => void;
  onDeleteVersion: (versionId: string) => void;
}

const VersionHistory: React.FC<VersionHistoryProps> = ({
  promptVersions,
  isLoadingVersions,
  onLoadVersion,
  onSetFinalVersion,
  onDeleteVersion,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>版本历史</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoadingVersions ? (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : promptVersions.length === 0 ? (
          <p className="text-muted-foreground">暂无版本历史</p>
        ) : (
          <div className="space-y-3">
            {promptVersions.map((version) => (
              <div key={version.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-2">
                  <span>版本 {version.version_number}</span>
                  {version.is_final && <Badge variant="secondary"><Star className="h-3 w-3" /></Badge>}
                  <span className="text-sm text-muted-foreground">
                    {new Date(version.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onLoadVersion(version.prompt_text)}
                  >
                    加载
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSetFinalVersion(version.id)}
                  >
                    设为最终版
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDeleteVersion(version.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VersionHistory;
