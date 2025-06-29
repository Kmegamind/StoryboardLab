import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, PlusCircle, Edit, Trash2, Users, Camera, Box, Wand2 } from 'lucide-react';
import { ProjectAsset, ProjectAssetInsert, ProjectAssetUpdate } from '@/hooks/useProjectAssets';
import { AssetGenerationDialog } from './AssetGenerationDialog';
import { useAssetGeneration } from '@/hooks/useAssetGeneration';
import { useProject } from '@/hooks/useProject';
import { toast } from '@/hooks/use-toast';

interface ProjectAssetsCardProps {
  assets: ProjectAsset[];
  isLoading: boolean;
  onAddAsset: (assetData: Omit<ProjectAssetInsert, 'project_id' | 'id' | 'created_at' | 'updated_at'>) => Promise<any>;
  onUpdateAsset: (assetId: string, updates: ProjectAssetUpdate) => Promise<any>;
  onDeleteAsset: (assetId: string) => Promise<void>;
}

const AssetForm = ({
  asset,
  onSubmit,
  onCancel,
}: {
  asset?: ProjectAsset | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    asset_type: asset?.asset_type || 'character',
    asset_name: asset?.asset_name || '',
    description: asset?.description || '',
    reference_token: asset?.reference_token || '',
    reference_image_url: asset?.reference_image_url || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, asset_type: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit(formData);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="asset_name" className="text-right">名称</Label>
        <Input id="asset_name" value={formData.asset_name} onChange={handleChange} className="col-span-3" required />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="asset_type" className="text-right">类型</Label>
        <Select value={formData.asset_type} onValueChange={handleSelectChange}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="选择资产类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="character">角色 (Character)</SelectItem>
            <SelectItem value="scene">场景 (Scene)</SelectItem>
            <SelectItem value="prop">道具 (Prop)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="reference_token" className="text-right">Ref Token</Label>
        <Input id="reference_token" value={formData.reference_token!} onChange={handleChange} className="col-span-3" placeholder="例如 <my-character> 或 --cref URL" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">描述</Label>
        <Textarea id="description" value={formData.description!} onChange={handleChange} className="col-span-3" placeholder="资产的详细描述..." />
      </div>
       <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="reference_image_url" className="text-right">参考图URL</Label>
        <Input id="reference_image_url" value={formData.reference_image_url!} onChange={handleChange} className="col-span-3" placeholder="可选的图片链接..." />
      </div>
      <DialogFooter>
        <Button type="button" variant="ghost" onClick={onCancel}>取消</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          保存
        </Button>
      </DialogFooter>
    </form>
  );
};

const AssetIcon = ({ type, className }: { type: string, className?: string }) => {
  switch(type) {
    case 'character': return <Users className={className} />;
    case 'scene': return <Camera className={className} />;
    case 'prop': return <Box className={className} />;
    default: return <Box className={className} />;
  }
};

export const ProjectAssetsCard: React.FC<ProjectAssetsCardProps> = ({
  assets,
  isLoading,
  onAddAsset,
  onUpdateAsset,
  onDeleteAsset,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<ProjectAsset | null>(null);
  const [isGenerationDialogOpen, setIsGenerationDialogOpen] = useState(false);
  
  const { project } = useProject();
  const { extractedAssets, isGenerating, generateAssets, clearAssets } = useAssetGeneration();

  const handleOpenDialog = (asset: ProjectAsset | null = null) => {
    setEditingAsset(asset);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingAsset(null);
  };

  const handleSubmit = async (data: Omit<ProjectAssetInsert, 'project_id' | 'id' | 'created_at' | 'updated_at'>) => {
    if (editingAsset) {
      await onUpdateAsset(editingAsset.id, data);
    } else {
      await onAddAsset(data);
    }
    handleCloseDialog();
  };
  
  const handleDelete = async (assetId: string) => {
    if (window.confirm('确定要删除这个资产吗？此操作不可撤销。')) {
        await onDeleteAsset(assetId);
    }
  };

  const handleGenerateAssets = async (source: 'script' | 'shots' | 'custom', customText?: string) => {
    let content = '';
    
    if (source === 'script') {
      content = project?.screenwriter_output || '';
    } else if (source === 'shots') {
      content = project?.director_output_json || '';
    }

    await generateAssets(source, content, customText);
  };

  const handleConfirmAssets = async (assetsToAdd: ProjectAssetInsert[]) => {
    let successCount = 0;
    let errorCount = 0;

    for (const assetData of assetsToAdd) {
      try {
        await onAddAsset(assetData);
        successCount++;
      } catch (error) {
        errorCount++;
        console.error('添加资产失败:', error);
      }
    }

    if (successCount > 0) {
      toast({
        title: '资产添加完成',
        description: `成功添加 ${successCount} 个资产${errorCount > 0 ? `，${errorCount} 个失败` : ''}`,
      });
    }

    if (errorCount > 0 && successCount === 0) {
      toast({
        title: '添加失败',
        description: '所有资产添加失败，请检查是否存在重名资产。',
        variant: 'destructive',
      });
    }

    clearAssets();
  };

  const handleOpenGenerationDialog = () => {
    if (!project?.screenwriter_output && !project?.director_output_json) {
      toast({
        title: '无法生成资产',
        description: '请先完成剧本创作或分镜制作，然后再使用AI资产生成功能。',
        variant: 'destructive',
      });
      return;
    }
    
    setIsGenerationDialogOpen(true);
  };

  return (
    <>
      <Card className="mt-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">项目资产库</CardTitle>
            <CardDescription>管理项目中可复用的角色、场景和道具。</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleOpenGenerationDialog}>
              <Wand2 className="mr-2 h-4 w-4" /> AI智能生成
            </Button>
            <Button onClick={() => handleOpenDialog()}>
              <PlusCircle className="mr-2 h-4 w-4" /> 手动添加
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : assets.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                资产库是空的。您可以：
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={handleOpenGenerationDialog}>
                  <Wand2 className="mr-2 h-4 w-4" /> 使用AI智能生成
                </Button>
                <Button onClick={() => handleOpenDialog()}>
                  <PlusCircle className="mr-2 h-4 w-4" /> 手动添加资产
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {assets.map(asset => (
                <div key={asset.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4 overflow-hidden">
                    <AssetIcon type={asset.asset_type} className="h-6 w-6 text-primary flex-shrink-0" />
                    <div className="overflow-hidden">
                      <p className="font-semibold truncate" title={asset.asset_name}>{asset.asset_name}</p>
                      <p className="text-sm text-muted-foreground truncate" title={asset.reference_token || ""}>{asset.reference_token || '未设置Token'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(asset)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(asset.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 手动添加/编辑对话框 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
              <DialogHeader>
                  <DialogTitle>{editingAsset ? '编辑资产' : '手动添加资产'}</DialogTitle>
                  <DialogDescription>
                      {editingAsset ? '修改资产的详细信息。' : '手动添加一个新的资产到您的项目中。'}
                  </DialogDescription>
              </DialogHeader>
              <AssetForm asset={editingAsset} onSubmit={handleSubmit} onCancel={handleCloseDialog} />
          </DialogContent>
      </Dialog>

      {/* AI生成对话框 */}
      <AssetGenerationDialog
        open={isGenerationDialogOpen}
        onOpenChange={setIsGenerationDialogOpen}
        extractedAssets={extractedAssets}
        isGenerating={isGenerating}
        onGenerate={handleGenerateAssets}
        onConfirmAssets={handleConfirmAssets}
      />
    </>
  );
};
