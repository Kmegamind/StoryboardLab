
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import { Tables } from '@/integrations/supabase/types';

type Shot = Tables<'structured_shots'>;

export const useShotManagement = () => {
  const [savedShots, setSavedShots] = useState<Shot[]>([]); // Active shots
  const [archivedShots, setArchivedShots] = useState<Shot[]>([]); // Archived shots
  const [isLoadingSavedShots, setIsLoadingSavedShots] = useState<boolean>(false);
  const [selectedShot, setSelectedShot] = useState<Shot | null>(null);

  const clearSelectedShotAndPrompts = useCallback(() => {
    setSelectedShot(null);
  }, []);

  const fetchSavedShots = useCallback(async (projectId: string) => {
    setIsLoadingSavedShots(true);
    setSavedShots([]);
    setArchivedShots([]);
    clearSelectedShotAndPrompts();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoadingSavedShots(false);
        return;
      }
      const { data, error } = await supabase
        .from('structured_shots')
        .select('*')
        .eq('project_id', projectId)
        .order('shot_number', { ascending: true, nullsFirst: false });
        
      if (error) {
        toast({ title: "加载分镜失败", description: `数据库错误: ${error.message}`, variant: "destructive"});
        setSavedShots([]);
        setArchivedShots([]);
      } else {
        const allShots = data || [];
        const active = allShots.filter(shot => !shot.is_archived);
        const archived = allShots.filter(shot => shot.is_archived);
        setSavedShots(active);
        setArchivedShots(archived);
      }
    } catch (e) {
      toast({ title: "加载分镜出错", description: "加载过程中发生未知错误。", variant: "destructive"});
      setSavedShots([]);
      setArchivedShots([]);
    } finally {
      setIsLoadingSavedShots(false);
    }
  }, [clearSelectedShotAndPrompts]);

  const selectShot = (shot: Shot) => {
    setSelectedShot(shot);
    toast({
      title: "分镜已选择",
      description: `已选择镜号: ${shot.shot_number || 'N/A'}.`,
    });
  };

  const toggleShotArchiveStatus = async (shot: Shot) => {
    const currentStatus = shot.is_archived;

    // Optimistic UI update
    if (currentStatus) { // Unarchiving
      setArchivedShots(prev => prev.filter(s => s.id !== shot.id));
      setSavedShots(prev => [...prev, { ...shot, is_archived: false }].sort((a, b) => (a.shot_number || "").localeCompare(b.shot_number || "")));
    } else { // Archiving
      setSavedShots(prev => prev.filter(s => s.id !== shot.id));
      setArchivedShots(prev => [...prev, { ...shot, is_archived: true }].sort((a, b) => (a.shot_number || "").localeCompare(b.shot_number || "")));
      if (selectedShot?.id === shot.id) {
        clearSelectedShotAndPrompts();
      }
    }

    const { error } = await supabase
      .from('structured_shots')
      .update({ is_archived: !currentStatus })
      .eq('id', shot.id);

    if (error) {
      toast({ title: "操作失败", description: `网络错误: ${error.message}`, variant: "destructive" });
      // Revert UI on failure
      if (currentStatus) { // Failed to unarchive
        setSavedShots(prev => prev.filter(s => s.id !== shot.id));
        setArchivedShots(prev => [...prev, shot].sort((a, b) => (a.shot_number || "").localeCompare(b.shot_number || "")));
      } else { // Failed to archive
        setArchivedShots(prev => prev.filter(s => s.id !== shot.id));
        setSavedShots(prev => [...prev, shot].sort((a, b) => (a.shot_number || "").localeCompare(b.shot_number || "")));
      }
    } else {
        toast({ title: `分镜已成功${!currentStatus ? '存档' : '恢复'}.` });
    }
  };

  return {
    savedShots,
    archivedShots,
    isLoadingSavedShots,
    selectedShot,
    fetchSavedShots,
    selectShot,
    toggleShotArchiveStatus,
    clearSelectedShotAndPrompts,
  };
};
