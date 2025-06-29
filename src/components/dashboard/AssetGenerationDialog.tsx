
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Users, Camera, Box, Wand2 } from 'lucide-react';
import { ExtractedAssets, ExtractedAsset } from '@/utils/assetExtractionAgent';
import { ProjectAssetInsert } from '@/hooks/useProjectAssets';

interface AssetGenerationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  extractedAssets: ExtractedAssets | null;
  isGenerating: boolean;
  onGenerate: (source: 'script' | 'shots' | 'custom', customText?: string) => Promise<void>;
  onConfirmAssets: (assets: ProjectAssetInsert[]) => Promise<void>;
}

const AssetIcon = ({ type }: { type: string }) => {
  switch(type) {
    case 'character': return <Users className="h-4 w-4" />;
    case 'scene': return <Camera className="h-4 w-4" />;
    case 'prop': return <Box className="h-4 w-4" />;
    default: return <Box className="h-4 w-4" />;
  }
};

export const AssetGenerationDialog: React.FC<AssetGenerationDialogProps> = ({
  open,
  onOpenChange,
  extractedAssets,
  isGenerating,
  onGenerate,
  onConfirmAssets,
}) => {
  const [selectedAssets, setSelectedAssets] = useState<{[key: string]: boolean}>({});
  const [editedAssets, setEditedAssets] = useState<{[key: string]: ExtractedAsset}>({});
  const [customText, setCustomText] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);

  const getAssetKey = (type: string, index: number) => `${type}-${index}`;

  const handleAssetToggle = (type: string, index: number, checked: boolean) => {
    const key = getAssetKey(type, index);
    setSelectedAssets(prev => ({ ...prev, [key]: checked }));
  };

  const handleAssetEdit = (type: string, index: number, field: string, value: string) => {
    const key = getAssetKey(type, index);
    setEditedAssets(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: value }
    }));
  };

  const getAssetData = (type: string, index: number, originalAsset: ExtractedAsset) => {
    const key = getAssetKey(type, index);
    return editedAssets[key] || originalAsset;
  };

  const handleConfirm = async () => {
    if (!extractedAssets) return;

    setIsConfirming(true);
    try {
      const assetsToAdd: ProjectAssetInsert[] = [];

      // 处理角色
      extractedAssets.characters.forEach((asset, index) => {
        const key = getAssetKey('character', index);
        if (selectedAssets[key]) {
          const assetData = getAssetData('character', index, asset);
          assetsToAdd.push({
            asset_type: 'character',
            asset_name: assetData.name,
            description: assetData.description,
            reference_token: assetData.reference_token,
          });
        }
      });

      // 处理场景
      extractedAssets.scenes.forEach((asset, index) => {
        const key = getAssetKey('scene', index);
        if (selectedAssets[key]) {
          const assetData = getAssetData('scene', index, asset);
          assetsToAdd.push({
            asset_type: 'scene',
            asset_name: assetData.name,
            description: assetData.description,
            reference_token: assetData.reference_token,
          });
        }
      });

      // 处理道具
      extractedAssets.props.forEach((asset, index) => {
        const key = getAssetKey('prop', index);
        if (selectedAssets[key]) {
          const assetData = getAssetData('prop', index, asset);
          assetsToAdd.push({
            asset_type: 'prop',
            asset_name: assetData.name,
            description: assetData.description,
            reference_token: assetData.reference_token,
          });
        }
      });

      await onConfirmAssets(assetsToAdd);
      onOpenChange(false);
      
      // 重置状态
      setSelectedAssets({});
      setEditedAssets({});
      setCustomText('');
    } catch (error) {
      console.error('确认资产失败:', error);
    } finally {
      setIsConfirming(false);
    }
  };

  const renderAssetSection = (title: string, assets: ExtractedAsset[], type: string, icon: React.ReactNode) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {icon}
        <h4 className="font-medium">{title} ({assets.length})</h4>
      </div>
      {assets.map((asset, index) => {
        const key = getAssetKey(type, index);
        const assetData = getAssetData(type, index, asset);
        
        return (
          <div key={index} className="border rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedAssets[key] || false}
                onCheckedChange={(checked) => handleAssetToggle(type, index, checked as boolean)}
              />
              <Input
                value={assetData.name}
                onChange={(e) => handleAssetEdit(type, index, 'name', e.target.value)}
                className="font-medium"
                placeholder="资产名称"
              />
            </div>
            <Textarea
              value={assetData.description}
              onChange={(e) => handleAssetEdit(type, index, 'description', e.target.value)}
              placeholder="描述"
              className="text-sm"
              rows={2}
            />
            <Input
              value={assetData.reference_token}
              onChange={(e) => handleAssetEdit(type, index, 'reference_token', e.target.value)}
              placeholder="参考Token"
              className="text-sm"
            />
          </div>
        );
      })}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            AI智能资产生成
          </DialogTitle>
          <DialogDescription>
            从剧本内容中智能提取角色、场景和道具，生成项目资产库。
          </DialogDescription>
        </DialogHeader>

        {!extractedAssets && !isGenerating && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => onGenerate('script')}
                className="h-20 flex flex-col gap-2"
                variant="outline"
              >
                <Users className="h-6 w-6" />
                从编剧输出生成
              </Button>
              <Button
                onClick={() => onGenerate('shots')}
                className="h-20 flex flex-col gap-2"
                variant="outline"
              >
                <Camera className="h-6 w-6" />
                从分镜脚本生成
              </Button>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">或输入自定义文本：</h4>
              <Textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="粘贴您的剧本或故事内容..."
                className="min-h-[120px]"
              />
              <Button
                onClick={() => onGenerate('custom', customText)}
                disabled={!customText.trim()}
                className="w-full"
              >
                <Wand2 className="mr-2 h-4 w-4" />
                从自定义文本生成
              </Button>
            </div>
          </div>
        )}

        {isGenerating && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-lg font-medium">AI正在分析内容...</p>
            <p className="text-sm text-muted-foreground">正在提取角色、场景和道具信息</p>
          </div>
        )}

        {extractedAssets && !isGenerating && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">提取的资产预览</h3>
              <p className="text-sm text-muted-foreground">
                请选择要添加的资产，可以编辑名称和描述
              </p>
            </div>

            <div className="space-y-6">
              {renderAssetSection(
                '角色',
                extractedAssets.characters,
                'character',
                <Users className="h-4 w-4 text-blue-600" />
              )}
              
              {renderAssetSection(
                '场景',
                extractedAssets.scenes,
                'scene',
                <Camera className="h-4 w-4 text-green-600" />
              )}
              
              {renderAssetSection(
                '道具',
                extractedAssets.props,
                'prop',
                <Box className="h-4 w-4 text-orange-600" />
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                取消
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={isConfirming || Object.keys(selectedAssets).filter(key => selectedAssets[key]).length === 0}
                className="flex-1"
              >
                {isConfirming && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                确认添加 ({Object.keys(selectedAssets).filter(key => selectedAssets[key]).length} 个资产)
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
