
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

  const createPerspectiveShot = async (
    parentShot: Shot,
    perspectiveName: string,
    promptModifier: string
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: "创建失败", description: "用户未登录", variant: "destructive" });
        return null;
      }

      // Generate new shot number for perspective variant
      const perspectiveShotNumber = `${parentShot.shot_number}-${perspectiveName}`;

      const newPerspectiveShot = {
        project_id: parentShot.project_id,
        user_id: user.id,
        parent_shot_id: parentShot.id,
        perspective_type: 'perspective' as const,
        perspective_name: perspectiveName,
        shot_number: perspectiveShotNumber,
        shot_type: parentShot.shot_type,
        scene_content: parentShot.scene_content,
        dialogue: parentShot.dialogue,
        estimated_duration: parentShot.estimated_duration,
        camera_movement: parentShot.camera_movement,
        sound_music: parentShot.sound_music,
        visual_style: parentShot.visual_style,
        key_props: parentShot.key_props,
        director_notes: `${parentShot.director_notes || ''}\n\n[视角变体] ${perspectiveName}: ${promptModifier}`.trim(),
      };

      const { data, error } = await supabase
        .from('structured_shots')
        .insert([newPerspectiveShot])
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setSavedShots(prev => [...prev, data].sort((a, b) => (a.shot_number || "").localeCompare(b.shot_number || "")));
      
      toast({
        title: "视角变体已创建",
        description: `已创建 ${perspectiveName} 视角变体`,
      });

      return data;
    } catch (error: any) {
      toast({
        title: "创建视角变体失败",
        description: error.message,
        variant: "destructive",
      });
      return null;
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
    createPerspectiveShot,
  };
};
