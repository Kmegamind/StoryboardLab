
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Star, Trash2, History, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { useShotPromptLab } from '@/hooks/useShotPromptLab';
import { useProject } from '@/hooks/useProject';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type Shot = Tables<'structured_shots'>;

const ShotPromptLabPage: React.FC = () => {
  const { shotId } = useParams<{ shotId: string }>();
  const navigate = useNavigate();
  const { project } = useProject();
  const [shot, setShot] = useState<Shot | null>(null);
  const [currentPromptText, setCurrentPromptText] = useState('');
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);

  const {
    prompts,
    consistencyPrompts,
    selectedPrompt,
    isLoading,
    isSaving,
    setSelectedPrompt,
    fetchConsistencyPrompts,
    createPromptVersion,
    updatePrompt,
    setFinalVersion,
    deletePrompt,
  } = useShotPromptLab(shotId || '');

  useEffect(() => {
    if (shotId) {
      fetchShot();
    }
  }, [shotId]);

  useEffect(() => {
    if (project?.id) {
      fetchConsistencyPrompts(project.id);
    }
  }, [project?.id, fetchConsistencyPrompts]);

  useEffect(() => {
    if (selectedPrompt) {
      setCurrentPromptText(selectedPrompt.prompt_text);
      setIsEditingPrompt(false);
    }
  }, [selectedPrompt]);

  const fetchShot = async () => {
    if (!shotId) return;
    try {
      const { data, error } = await supabase
        .from('structured_shots')
        .select('*')
        .eq('id', shotId)
        .single();

      if (error) throw error;
      setShot(data);
    } catch (error: any) {
      toast({
        title: '获取分镜信息失败',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleSavePrompt = async () => {
    if (!currentPromptText.trim()) {
      toast({ title: '请输入提示词内容', variant: 'destructive' });
      return;
    }

    if (isEditingPrompt && selectedPrompt) {
      await updatePrompt(selectedPrompt.id, { prompt_text: currentPromptText });
    } else {
      await createPromptVersion(currentPromptText);
    }
    setIsEditingPrompt(false);
  };

  const handleCreateNewVersion = async () => {
    if (!currentPromptText.trim()) {
      toast({ title: '请输入提示词内容', variant: 'destructive' });
      return;
    }
    await createPromptVersion(currentPromptText);
  };

  const handleCopyPrompt = (promptText: string) => {
    navigator.clipboard.writeText(promptText);
    toast({ title: '提示词已复制到剪贴板' });
  };

  const insertConsistencyPrompt = (consistencyPrompt: string) => {
    const newText = currentPromptText + (currentPromptText ? '\n\n' : '') + consistencyPrompt;
    setCurrentPromptText(newText);
  };

  if (!shotId) {
    return <div>无效的分镜ID</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回控制台
            </Button>
            <div>
              <h1 className="text-2xl font-bold">分镜 Prompt Lab</h1>
              {shot && (
                <p className="text-muted-foreground">
                  镜号: {shot.shot_number || 'N/A'} | {shot.shot_type || 'N/A'}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 左侧：版本历史 */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  版本历史
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p className="text-sm text-muted-foreground">加载中...</p>
                ) : prompts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">暂无版本</p>
                ) : (
                  <div className="space-y-2">
                    {prompts.map((prompt) => (
                      <div
                        key={prompt.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedPrompt?.id === prompt.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedPrompt(prompt)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">v{prompt.version_number}</span>
                          <div className="flex items-center gap-1">
                            {prompt.is_final && (
                              <Badge variant="secondary" className="text-xs">
                                <Star className="h-3 w-3 mr-1" />
                                最终
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {prompt.prompt_text.substring(0, 60)}...
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(prompt.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 中间：提示词编辑区 */}
          <div className="lg:col-span-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {selectedPrompt 
                      ? `提示词 v${selectedPrompt.version_number}${selectedPrompt.is_final ? ' (最终版)' : ''}`
                      : '新建提示词'
                    }
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {selectedPrompt && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyPrompt(currentPromptText)}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          复制
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setFinalVersion(selectedPrompt.id)}
                          disabled={selectedPrompt.is_final || isSaving}
                        >
                          <Star className="h-4 w-4 mr-1" />
                          设为最终版
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deletePrompt(selectedPrompt.id)}
                          disabled={isSaving}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    value={currentPromptText}
                    onChange={(e) => {
                      setCurrentPromptText(e.target.value);
                      if (selectedPrompt && !isEditingPrompt) {
                        setIsEditingPrompt(true);
                      }
                    }}
                    placeholder="输入或编辑提示词内容..."
                    className="min-h-[300px] resize-none"
                  />
                  
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={handleSavePrompt}
                      disabled={!currentPromptText.trim() || isSaving}
                    >
                      {isSaving ? '保存中...' : isEditingPrompt ? '更新当前版本' : '保存为新版本'}
                    </Button>
                    
                    {selectedPrompt && isEditingPrompt && (
                      <Button
                        variant="outline"
                        onClick={handleCreateNewVersion}
                        disabled={!currentPromptText.trim() || isSaving}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        另存为新版本
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：项目资产快速插入 */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>项目资产</CardTitle>
              </CardHeader>
              <CardContent>
                {consistencyPrompts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">暂无一致性提示词</p>
                ) : (
                  <div className="space-y-4">
                    {['character', 'location', 'style', 'props'].map((assetType) => {
                      const typePrompts = consistencyPrompts.filter(p => p.asset_type === assetType);
                      if (typePrompts.length === 0) return null;
                      
                      return (
                        <div key={assetType}>
                          <h4 className="text-sm font-medium mb-2 capitalize">
                            {assetType === 'character' ? '角色' : 
                             assetType === 'location' ? '场景' :
                             assetType === 'style' ? '风格' : '道具'}
                          </h4>
                          <div className="space-y-1">
                            {typePrompts.map((prompt) => (
                              <Button
                                key={prompt.id}
                                variant="outline"
                                size="sm"
                                className="w-full justify-start text-left h-auto p-2"
                                onClick={() => insertConsistencyPrompt(prompt.consistency_prompt)}
                              >
                                <div>
                                  <div className="font-medium text-xs">{prompt.asset_name}</div>
                                  <div className="text-xs text-muted-foreground line-clamp-2">
                                    {prompt.consistency_prompt.substring(0, 40)}...
                                  </div>
                                </div>
                              </Button>
                            ))}
                          </div>
                          <Separator className="mt-2" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShotPromptLabPage;
