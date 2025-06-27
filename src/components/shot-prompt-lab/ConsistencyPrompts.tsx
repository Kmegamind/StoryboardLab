
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Loader2 } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

type ConsistencyPrompt = Tables<'project_consistency_prompts'>;

interface ConsistencyPromptsProps {
  consistencyPrompts: ConsistencyPrompt[];
  isLoadingConsistency: boolean;
  onInsertPrompt: (promptText: string) => void;
}

const ConsistencyPrompts: React.FC<ConsistencyPromptsProps> = ({
  consistencyPrompts,
  isLoadingConsistency,
  onInsertPrompt,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>项目一致性提示词</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoadingConsistency ? (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : consistencyPrompts.length === 0 ? (
          <p className="text-muted-foreground">暂无一致性提示词</p>
        ) : (
          <div className="space-y-3">
            {consistencyPrompts.map((prompt) => (
              <div key={prompt.id} className="p-3 border rounded">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge>{prompt.asset_type}</Badge>
                    <span className="font-medium">{prompt.asset_name}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onInsertPrompt(prompt.consistency_prompt)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      插入
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {prompt.consistency_prompt}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConsistencyPrompts;
