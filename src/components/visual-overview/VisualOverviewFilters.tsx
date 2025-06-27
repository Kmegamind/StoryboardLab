
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VisualOverviewFilters } from '@/types/visualOverview';

interface VisualOverviewFiltersProps {
  filters: VisualOverviewFilters;
  uniqueShotTypes: string[];
  onFiltersChange: (filters: VisualOverviewFilters) => void;
}

const VisualOverviewFiltersComponent: React.FC<VisualOverviewFiltersProps> = ({
  filters,
  uniqueShotTypes,
  onFiltersChange,
}) => {
  return (
    <div className="flex gap-4 items-center">
      <Input
        placeholder="搜索镜头号、场景内容或提示词..."
        value={filters.searchText}
        onChange={(e) => onFiltersChange({ ...filters, searchText: e.target.value })}
        className="max-w-sm"
      />
      
      <Select
        value={filters.status}
        onValueChange={(value: any) => onFiltersChange({ ...filters, status: value })}
      >
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全部状态</SelectItem>
          <SelectItem value="active">活跃</SelectItem>
          <SelectItem value="archived">已存档</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.perspectiveType}
        onValueChange={(value: any) => onFiltersChange({ ...filters, perspectiveType: value })}
      >
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全部类型</SelectItem>
          <SelectItem value="main">主镜头</SelectItem>
          <SelectItem value="perspective">视角变体</SelectItem>
        </SelectContent>
      </Select>

      {uniqueShotTypes.length > 0 && (
        <Select
          value={filters.shotType}
          onValueChange={(value) => onFiltersChange({ ...filters, shotType: value === 'all-types' ? '' : value })}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="镜头类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-types">全部类型</SelectItem>
            {uniqueShotTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default VisualOverviewFiltersComponent;
