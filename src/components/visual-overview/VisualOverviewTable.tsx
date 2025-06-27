
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShotWithPrompts, VisualOverviewFilters, VisualOverviewSorting } from '@/types/visualOverview';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import VisualOverviewFiltersComponent from './VisualOverviewFilters';
import VisualOverviewTableCore from './VisualOverviewTableCore';

interface VisualOverviewTableProps {
  shots: ShotWithPrompts[];
  filters: VisualOverviewFilters;
  sorting: VisualOverviewSorting;
  selectedShots: string[];
  uniqueShotTypes: string[];
  onFiltersChange: (filters: VisualOverviewFilters) => void;
  onSortingChange: (sorting: VisualOverviewSorting) => void;
  onSelectedShotsChange: (selectedShots: string[]) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onDeleteSelected: () => void;
}

const VisualOverviewTable: React.FC<VisualOverviewTableProps> = ({
  shots,
  filters,
  sorting,
  selectedShots,
  uniqueShotTypes,
  onFiltersChange,
  onSortingChange,
  onSelectedShotsChange,
  onSelectAll,
  onClearSelection,
  onDeleteSelected,
}) => {
  // Enable keyboard shortcuts
  useKeyboardShortcuts({
    onSelectAll,
    onClearSelection,
    onDeleteSelected,
    hasSelection: selectedShots.length > 0,
    isEnabled: true,
  });

  const filteredData = useMemo(() => {
    return shots.filter(shot => {
      if (filters.status === 'active' && shot.is_archived) return false;
      if (filters.status === 'archived' && !shot.is_archived) return false;
      if (filters.perspectiveType === 'main' && shot.perspective_type !== 'main') return false;
      if (filters.perspectiveType === 'perspective' && shot.perspective_type !== 'perspective') return false;
      if (filters.shotType && shot.shot_type !== filters.shotType) return false;
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        return (
          shot.shot_number?.toLowerCase().includes(searchLower) ||
          shot.scene_content?.toLowerCase().includes(searchLower) ||
          shot.latest_prompt?.prompt_text?.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  }, [shots, filters]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>分镜列表</CardTitle>
        <VisualOverviewFiltersComponent
          filters={filters}
          uniqueShotTypes={uniqueShotTypes}
          onFiltersChange={onFiltersChange}
        />
      </CardHeader>
      
      <CardContent>
        <VisualOverviewTableCore
          data={filteredData}
          selectedShots={selectedShots}
          onSelectedShotsChange={onSelectedShotsChange}
        />
        
        {filteredData.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {filters.status !== 'all' || filters.searchText || filters.shotType || filters.perspectiveType !== 'all' 
              ? '当前筛选条件下暂无数据，请尝试调整筛选条件' 
              : '暂无分镜数据，请先创建分镜'}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VisualOverviewTable;
