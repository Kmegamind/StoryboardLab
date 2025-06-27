
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Eye, Plus, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Tables } from '@/integrations/supabase/types';

type ShotPerspective = Tables<'shot_perspectives'>;

interface PerspectiveSelectorProps {
  onCreatePerspective: (perspectiveId: string, perspectiveName: string, promptModifier: string) => void;
  isCreating: boolean;
}

const PerspectiveSelector: React.FC<PerspectiveSelectorProps> = ({
  onCreatePerspective,
  isCreating,
}) => {
  const [perspectives, setPerspectives] = useState<ShotPerspective[]>([]);
  const [selectedPerspectiveId, setSelectedPerspectiveId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPerspectives();
  }, []);

  const fetchPerspectives = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('shot_perspectives')
        .select('*')
        .order('category', { ascending: true })
        .order('perspective_name', { ascending: true });

      if (error) throw error;
      setPerspectives(data || []);
    } catch (error: any) {
      toast({
        title: '获取视角模板失败',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePerspective = () => {
    const selectedPerspective = perspectives.find(p => p.id === selectedPerspectiveId);
    if (selectedPerspective) {
      onCreatePerspective(
        selectedPerspective.id,
        selectedPerspective.perspective_name,
        selectedPerspective.prompt_modifier
      );
    }
  };

  const groupedPerspectives = perspectives.reduce((acc, perspective) => {
    if (!acc[perspective.category]) {
      acc[perspective.category] = [];
    }
    acc[perspective.category].push(perspective);
    return acc;
  }, {} as Record<string, ShotPerspective[]>);

  const selectedPerspective = perspectives.find(p => p.id === selectedPerspectiveId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          创建视角变体
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <>
            <div>
              <label className="text-sm font-medium mb-2 block">选择视角类型</label>
              <Select value={selectedPerspectiveId} onValueChange={setSelectedPerspectiveId}>
                <SelectTrigger>
                  <SelectValue placeholder="选择一个视角..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(groupedPerspectives).map(([category, perspectiveList]) => (
                    <div key={category}>
                      <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase">
                        {category === 'angle' ? '角度' : category === 'distance' ? '距离' : '风格'}
                      </div>
                      {perspectiveList.map((perspective) => (
                        <SelectItem key={perspective.id} value={perspective.id}>
                          <div className="flex items-center gap-2">
                            <span>{perspective.perspective_name}</span>
                            <Badge variant="outline" className="text-xs">
                              {category === 'angle' ? '角度' : category === 'distance' ? '距离' : '风格'}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedPerspective && (
              <div className="p-3 bg-muted/50 rounded border">
                <div className="flex items-center gap-2 mb-2">
                  <strong>{selectedPerspective.perspective_name}</strong>
                  <Badge>{selectedPerspective.category === 'angle' ? '角度' : selectedPerspective.category === 'distance' ? '距离' : '风格'}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {selectedPerspective.description}
                </p>
                <div className="text-xs text-muted-foreground">
                  <strong>提示词修饰符:</strong> {selectedPerspective.prompt_modifier}
                </div>
              </div>
            )}

            <Button
              onClick={handleCreatePerspective}
              disabled={!selectedPerspectiveId || isCreating}
              className="w-full"
            >
              {isCreating ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              创建视角变体
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PerspectiveSelector;
