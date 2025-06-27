
import React from 'react';
import { useVisualOverview } from '@/hooks/useVisualOverview';
import VisualOverviewLayout from '@/components/visual-overview/VisualOverviewLayout';
import VisualOverviewTable from '@/components/visual-overview/VisualOverviewTable';
import VisualOverviewToolbar from '@/components/visual-overview/VisualOverviewToolbar';
import { Loader2 } from 'lucide-react';

const VisualOverviewPage = () => {
  const {
    shots,
    isLoading,
    filters,
    sorting,
    selectedShots,
    setFilters,
    setSorting,
    setSelectedShots,
    handleExportPDF,
    handleExportExcel,
    handleBatchArchive,
    handleBatchSetFinal,
  } = useVisualOverview();

  if (isLoading) {
    return (
      <VisualOverviewLayout>
        <div className="flex justify-center items-center min-h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-4">正在加载视觉总览...</p>
        </div>
      </VisualOverviewLayout>
    );
  }

  return (
    <VisualOverviewLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">视觉总览</h1>
          <VisualOverviewToolbar
            selectedCount={selectedShots.length}
            onExportPDF={handleExportPDF}
            onExportExcel={handleExportExcel}
            onBatchArchive={handleBatchArchive}
            onBatchSetFinal={handleBatchSetFinal}
          />
        </div>

        <VisualOverviewTable
          shots={shots}
          filters={filters}
          sorting={sorting}
          selectedShots={selectedShots}
          onFiltersChange={setFilters}
          onSortingChange={setSorting}
          onSelectedShotsChange={setSelectedShots}
        />
      </div>
    </VisualOverviewLayout>
  );
};

export default VisualOverviewPage;
