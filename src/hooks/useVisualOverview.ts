
import { useState, useCallback, useEffect, useMemo } from 'react';
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
    status: 'all',
    perspectiveType: 'all',
    shotType: '',
    searchText: '',
  });
  
  const [sorting, setSorting] = useState<VisualOverviewSorting>({
    field: 'shot_number',
    direction: 'asc',
  });

  // Memoize the filter and sorting keys to prevent unnecessary re-renders
  const filterKey = useMemo(() => 
    JSON.stringify([filters.status, filters.perspectiveType, filters.shotType, filters.searchText])
  , [filters.status, filters.perspectiveType, filters.shotType, filters.searchText]);

  const sortingKey = useMemo(() => 
    JSON.stringify([sorting.field, sorting.direction])
  , [sorting.field, sorting.direction]);

  const loadShotsWithPrompts = useCallback(async (page: number = 1) => {
    console.log('Loading shots with prompts...', { 
      projectId: project?.id, 
      hasProject: !!project,
      page
    });

    if (!project?.id) {
      console.log('No project ID available');
      setShots([]);
      setTotalCount(0);
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
        description: error.message || '加载分镜数据时出错',
        variant: 'destructive',
      });
      // Set empty state on error
      setShots([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [project?.id, filterKey, sortingKey]);

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
    console.log('Delete selected shots:', selectedShots);
  }, [selectedShots]);

  const handleExportPDF = useCallback(() => {
    if (selectedShots.length === 0) {
      toast({
        title: '提示',
        description: '请先选择要导出的分镜',
        variant: 'default',
      });
      return;
    }
    exportToPDF(selectedShots, shots);
  }, [selectedShots, shots]);

  const handleExportExcel = useCallback(() => {
    if (selectedShots.length === 0) {
      toast({
        title: '提示',
        description: '请先选择要导出的分镜',
        variant: 'default',
      });
      return;
    }
    exportToExcel(selectedShots, shots);
  }, [selectedShots, shots]);

  const handleBatchArchive = useCallback(async () => {
    if (selectedShots.length === 0) {
      toast({
        title: '提示',
        description: '请先选择要操作的分镜',
        variant: 'default',
      });
      return;
    }
    
    try {
      await batchArchiveShots(selectedShots, filters, () => {
        setSelectedShots([]);
        loadShotsWithPrompts(currentPage);
      });
    } catch (error) {
      console.error('Batch archive error:', error);
    }
  }, [selectedShots, filters, loadShotsWithPrompts, currentPage]);

  const handleBatchSetFinal = useCallback(async () => {
    if (selectedShots.length === 0) {
      toast({
        title: '提示',
        description: '请先选择要操作的分镜',
        variant: 'default',
      });
      return;
    }
    
    try {
      await batchSetFinalPrompts(selectedShots, shots, () => {
        setSelectedShots([]);
        loadShotsWithPrompts(currentPage);
      });
    } catch (error) {
      console.error('Batch set final error:', error);
    }
  }, [selectedShots, shots, loadShotsWithPrompts, currentPage]);

  const handlePageChange = useCallback((page: number) => {
    loadShotsWithPrompts(page);
  }, [loadShotsWithPrompts]);

  // Load data when project changes or filters/sorting change
  useEffect(() => {
    if (project?.id) {
      loadShotsWithPrompts(1);
    }
  }, [project?.id, filterKey, sortingKey]);

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
