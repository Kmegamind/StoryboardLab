import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Package } from 'lucide-react';
import { ProjectAssetsCard } from '@/components/dashboard/ProjectAssetsCard';

interface AssetsManagementModuleProps {
  assets: any[];
  isLoading: boolean;
  onAddAsset: any;
  onUpdateAsset: any;
  onDeleteAsset: any;
}

const AssetsManagementModule = ({
  assets,
  isLoading,
  onAddAsset,
  onUpdateAsset,
  onDeleteAsset,
}: AssetsManagementModuleProps) => {
  return (
    <div className="space-y-6">
      {/* 资产管理概览 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>资产管理</span>
          </CardTitle>
          <CardDescription>
            管理项目中的角色、道具、场景等资产，用于生成一致性提示词
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                总资产数量: {assets.length}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              角色: {assets.filter(a => a.asset_type === 'character').length} |
              道具: {assets.filter(a => a.asset_type === 'prop').length} |
              场景: {assets.filter(a => a.asset_type === 'location').length}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 资产详细管理 */}
      <ProjectAssetsCard
        assets={assets}
        isLoading={isLoading}
        onAddAsset={onAddAsset}
        onUpdateAsset={onUpdateAsset}
        onDeleteAsset={onDeleteAsset}
      />
    </div>
  );
};

export default AssetsManagementModule;