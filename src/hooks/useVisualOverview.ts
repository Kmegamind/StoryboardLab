
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useOptionalAuth } from '@/hooks/useOptionalAuth';
import { useProject } from '@/hooks/useProject';
import { Tables } from '@/integrations/supabase/types';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

type Shot = Tables<'structured_shots'>;
type ShotPrompt = Tables<'shot_prompts'>;

export interface ShotWithPrompts extends Shot {
  latest_prompt?: ShotPrompt;
  final_prompt?: ShotPrompt;
}

export interface VisualOverviewFilters {
  status: 'all' | 'active' | 'archived';
  perspectiveType: 'all' | 'main' | 'perspective';
  shotType: string;
  searchText: string;
}

export interface VisualOverviewSorting {
  field: 'shot_number' | 'created_at' | 'updated_at';
  direction: 'asc' | 'desc';
}

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

  const fetchShotsWithPrompts = useCallback(async () => {
    if (!project?.id || !isAuthenticated) return;

    setIsLoading(true);
    try {
      // Fetch shots
      const { data: shotsData, error: shotsError } = await supabase
        .from('structured_shots')
        .select('*')
        .eq('project_id', project.id)
        .eq('is_archived', filters.status === 'archived')
        .order(sorting.field, { ascending: sorting.direction === 'asc' });

      if (shotsError) throw shotsError;

      // Fetch prompts for each shot
      const shotsWithPrompts: ShotWithPrompts[] = [];
      
      for (const shot of shotsData || []) {
        const { data: prompts } = await supabase
          .from('shot_prompts')
          .select('*')
          .eq('shot_id', shot.id)
          .order('version_number', { ascending: false });

        const latestPrompt = prompts?.[0];
        const finalPrompt = prompts?.find(p => p.is_final);

        shotsWithPrompts.push({
          ...shot,
          latest_prompt: latestPrompt,
          final_prompt: finalPrompt,
        });
      }

      setShots(shotsWithPrompts);
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
    if (selectedShots.length === 0) {
      toast({ title: '请选择要导出的分镜', variant: 'destructive' });
      return;
    }

    const doc = new jsPDF();
    const selectedShotsData = shots.filter(shot => selectedShots.includes(shot.id));

    doc.setFontSize(16);
    doc.text('分镜视觉总览', 20, 20);

    let yPosition = 40;
    selectedShotsData.forEach((shot, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(12);
      doc.text(`镜头 ${shot.shot_number || index + 1}`, 20, yPosition);
      doc.setFontSize(10);
      doc.text(`类型: ${shot.shot_type || 'N/A'}`, 20, yPosition + 10);
      doc.text(`内容: ${shot.scene_content?.substring(0, 100) || 'N/A'}...`, 20, yPosition + 20);
      
      if (shot.latest_prompt?.prompt_text) {
        doc.text(`提示词: ${shot.latest_prompt.prompt_text.substring(0, 100)}...`, 20, yPosition + 30);
      }

      yPosition += 50;
    });

    doc.save(`分镜总览_${new Date().toISOString().split('T')[0]}.pdf`);
    toast({ title: 'PDF 导出成功' });
  }, [selectedShots, shots]);

  const handleExportExcel = useCallback(() => {
    if (selectedShots.length === 0) {
      toast({ title: '请选择要导出的分镜', variant: 'destructive' });
      return;
    }

    const selectedShotsData = shots.filter(shot => selectedShots.includes(shot.id));
    const worksheetData = selectedShotsData.map(shot => ({
      '镜头号': shot.shot_number || '',
      '镜头类型': shot.shot_type || '',
      '场景内容': shot.scene_content || '',
      '对话': shot.dialogue || '',
      '预估时长': shot.estimated_duration || '',
      '运镜方式': shot.camera_movement || '',
      '视觉风格': shot.visual_style || '',
      '关键道具': shot.key_props || '',
      '导演备注': shot.director_notes || '',
      '最新提示词': shot.latest_prompt?.prompt_text || '',
      '是否最终版': shot.final_prompt ? '是' : '否',
      '创建时间': new Date(shot.created_at).toLocaleDateString('zh-CN'),
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '分镜总览');
    XLSX.writeFile(workbook, `分镜总览_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    toast({ title: 'Excel 导出成功' });
  }, [selectedShots, shots]);

  const handleBatchArchive = useCallback(async () => {
    if (selectedShots.length === 0) return;

    try {
      const newArchivedStatus = filters.status !== 'archived';
      const { error } = await supabase
        .from('structured_shots')
        .update({ is_archived: newArchivedStatus })
        .in('id', selectedShots);

      if (error) throw error;

      toast({ title: `已批量${newArchivedStatus ? '存档' : '恢复'} ${selectedShots.length} 个分镜` });
      setSelectedShots([]);
      fetchShotsWithPrompts();
    } catch (error: any) {
      toast({
        title: '批量操作失败',
        description: error.message,
        variant: 'destructive',
      });
    }
  }, [selectedShots, filters.status, fetchShotsWithPrompts]);

  const handleBatchSetFinal = useCallback(async () => {
    if (selectedShots.length === 0) return;

    try {
      for (const shotId of selectedShots) {
        const shot = shots.find(s => s.id === shotId);
        if (shot?.latest_prompt) {
          // Unset all other final versions for this shot
          await supabase
            .from('shot_prompts')
            .update({ is_final: false })
            .eq('shot_id', shotId);

          // Set latest as final
          await supabase
            .from('shot_prompts')
            .update({ is_final: true })
            .eq('id', shot.latest_prompt.id);
        }
      }

      toast({ title: `已批量设置 ${selectedShots.length} 个分镜的最终版本` });
      setSelectedShots([]);
      fetchShotsWithPrompts();
    } catch (error: any) {
      toast({
        title: '批量设置失败',
        description: error.message,
        variant: 'destructive',
      });
    }
  }, [selectedShots, shots, fetchShotsWithPrompts]);

  useEffect(() => {
    fetchShotsWithPrompts();
  }, [fetchShotsWithPrompts]);

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
