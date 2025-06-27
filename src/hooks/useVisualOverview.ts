
import { useState, useCallback, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useOptionalAuth } from '@/hooks/useOptionalAuth';
import { useProject } from '@/hooks/useProject';
import { ShotWithPrompts, VisualOverviewFilters, VisualOverviewSorting } from '@/types/visualOverview';
import { fetchShotsWithPrompts } from '@/utils/visualOverviewData';
import { exportToPDF, exportToExcel } from '@/utils/visualOverviewExport';
import { batchArchiveShots, batchSetFinalPrompts } from '@/utils/visualOverviewBatch';

export const useVisualOverview = () => {
  const { isAuthenticated } = useOptionalAuth();
  const { project } = useProject();
  const [shots, setShots] = useState<ShotWithPrompts[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedShots, setSelectedShots] = useState<string[]>([]);
  const [filters, setFilters] = useState<VisualOverviewFilters>({
    status: 'active',
    perspectiveType: 'all',
    shotType: '',
    searchText: '',
  });
  const [sorting, setSorting] = useState<VisualOverviewSorting>({
    field: 'shot_number',
    direction: 'asc',
  });

  const loadShotsWithPrompts = useCallback(async () => {
    if (!project?.id || !isAuthenticated) return;

    setIsLoading(true);
    try {
      const shotsData = await fetchShotsWithPrompts(project.id, filters, sorting);
      setShots(shotsData);
    } catch (error: any) {
      toast({
        title: '加载失败',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [project?.id, isAuthenticated, filters.status, sorting]);

  const handleExportPDF = useCallback(() => {
    exportToPDF(selectedShots, shots);
  }, [selectedShots, shots]);

  const handleExportExcel = useCallback(() => {
    exportToExcel(selectedShots, shots);
  }, [selectedShots, shots]);

  const handleBatchArchive = useCallback(async () => {
    await batchArchiveShots(selectedShots, filters, () => {
      setSelectedShots([]);
      loadShotsWithPrompts();
    });
  }, [selectedShots, filters, loadShotsWithPrompts]);

  const handleBatchSetFinal = useCallback(async () => {
    await batchSetFinalPrompts(selectedShots, shots, () => {
      setSelectedShots([]);
      loadShotsWithPrompts();
    });
  }, [selectedShots, shots, loadShotsWithPrompts]);

  useEffect(() => {
    loadShotsWithPrompts();
  }, [loadShotsWithPrompts]);

  return {
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
  };
};
