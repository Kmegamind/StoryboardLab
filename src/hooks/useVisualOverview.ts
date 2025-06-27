import { useState, useCallback, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useOptionalAuth } from '@/hooks/useOptionalAuth';
import { useProject } from '@/hooks/useProject';
import { ShotWithPrompts, VisualOverviewFilters, VisualOverviewSorting } from '@/types/visualOverview';
import { fetchShotsWithPrompts, getUniqueShotTypes } from '@/utils/visualOverviewData';
import { exportToPDF, exportToExcel } from '@/utils/visualOverviewExport';
import { batchArchiveShots, batchSetFinalPrompts } from '@/utils/visualOverviewBatch';

export const useVisualOverview = () => {
  const { isAuthenticated, user } = useOptionalAuth();
  const { project } = useProject();
  const [shots, setShots] = useState<ShotWithPrompts[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedShots, setSelectedShots] = useState<string[]>([]);
  const [uniqueShotTypes, setUniqueShotTypes] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;
  
  const [filters, setFilters] = useState<VisualOverviewFilters>({
    status: 'all', // 改为默认显示所有分镜
    perspectiveType: 'all',
    shotType: '',
    searchText: '',
  });
  
  const [sorting, setSorting] = useState<VisualOverviewSorting>({
    field: 'shot_number',
    direction: 'asc',
  });

  const loadShotsWithPrompts = useCallback(async (page: number = 1) => {
    console.log('Loading shots with prompts...', { 
      projectId: project?.id, 
      isAuthenticated, 
      userId: user?.id 
    });

    if (!project?.id || !isAuthenticated) {
      console.log('Missing requirements:', { projectId: project?.id, isAuthenticated });
      return;
    }

    setIsLoading(true);
    try {
      const result = await fetchShotsWithPrompts(project.id, filters, sorting, page, pageSize);
      setShots(result.shots);
      setTotalCount(result.totalCount);
      setCurrentPage(page);
      
      console.log('Shots loaded successfully:', { 
        shotsCount: result.shots.length, 
        totalCount: result.totalCount 
      });
      
      // Load unique shot types for filter
      const types = await getUniqueShotTypes(project.id);
      setUniqueShotTypes(types);
    } catch (error: any) {
      console.error('Error loading shots:', error);
      toast({
        title: '加载失败',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [project?.id, isAuthenticated, user?.id, filters, sorting]);

  const handleSelectAll = useCallback(() => {
    if (selectedShots.length === shots.length) {
      setSelectedShots([]);
    } else {
      setSelectedShots(shots.map(shot => shot.id));
    }
  }, [shots, selectedShots]);

  const handleClearSelection = useCallback(() => {
    setSelectedShots([]);
  }, []);

  const handleDeleteSelected = useCallback(() => {
    // This would trigger the delete confirmation dialog
    // Implementation depends on the delete functionality requirement
    console.log('Delete selected shots:', selectedShots);
  }, [selectedShots]);

  const handleExportPDF = useCallback(() => {
    exportToPDF(selectedShots, shots);
  }, [selectedShots, shots]);

  const handleExportExcel = useCallback(() => {
    exportToExcel(selectedShots, shots);
  }, [selectedShots, shots]);

  const handleBatchArchive = useCallback(async () => {
    await batchArchiveShots(selectedShots, filters, () => {
      setSelectedShots([]);
      loadShotsWithPrompts(currentPage);
    });
  }, [selectedShots, filters, loadShotsWithPrompts, currentPage]);

  const handleBatchSetFinal = useCallback(async () => {
    await batchSetFinalPrompts(selectedShots, shots, () => {
      setSelectedShots([]);
      loadShotsWithPrompts(currentPage);
    });
  }, [selectedShots, shots, loadShotsWithPrompts, currentPage]);

  const handlePageChange = useCallback((page: number) => {
    loadShotsWithPrompts(page);
  }, [loadShotsWithPrompts]);

  useEffect(() => {
    loadShotsWithPrompts(1);
  }, [loadShotsWithPrompts]);

  return {
    shots,
    isLoading,
    filters,
    sorting,
    selectedShots,
    uniqueShotTypes,
    totalCount,
    currentPage,
    pageSize,
    setFilters,
    setSorting,
    setSelectedShots,
    handleSelectAll,
    handleClearSelection,
    handleDeleteSelected,
    handleExportPDF,
    handleExportExcel,
    handleBatchArchive,
    handleBatchSetFinal,
    handlePageChange,
  };
};
