
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, PlusCircle, Edit, Trash2, Users, Camera, Box } from 'lucide-react';
import { ProjectAsset, ProjectAssetInsert, ProjectAssetUpdate } from '@/hooks/useProjectAssets';

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
  }

  return (
    <>
      <Card className="mt-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">项目资产库</CardTitle>
            <CardDescription>管理项目中可复用的角色、场景和道具。</CardDescription>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" /> 新增资产
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : assets.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              资产库是空的。点击 "新增资产" 来添加第一个资产。
            </p>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
              <DialogHeader>
                  <DialogTitle>{editingAsset ? '编辑资产' : '新增资产'}</DialogTitle>
                  <DialogDescription>
                      {editingAsset ? '修改资产的详细信息。' : '添加一个新的可复用资产到您的项目中。'}
                  </DialogDescription>
              </DialogHeader>
              <AssetForm asset={editingAsset} onSubmit={handleSubmit} onCancel={handleCloseDialog} />
          </DialogContent>
      </Dialog>
    </>
  );
};
