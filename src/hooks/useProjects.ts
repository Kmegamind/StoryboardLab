import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Project } from '@/hooks/useProject';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setProjects([]);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      setProjects(data || []);
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      toast({
        title: '加载项目失败',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProject = useCallback(async (title: string): Promise<Project | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: '创建项目失败',
          description: '请先登录',
          variant: 'destructive',
        });
        return null;
      }

      const { data, error } = await supabase
        .from('projects')
        .insert([
          {
            title,
            user_id: user.id,
            status: 'new',
          }
        ])
        .select()
        .single();

      if (error) throw error;

      const newProject = data as Project;
      setProjects(prev => [newProject, ...prev]);
      
      toast({
        title: '项目创建成功',
        description: `项目 "${title}" 已创建`,
      });

      return newProject;
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast({
        title: '创建项目失败',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }
  }, []);

  const updateProject = useCallback(async (projectId: string, updates: Partial<Project>): Promise<Project | null> => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', projectId)
        .select()
        .single();

      if (error) throw error;

      const updatedProject = data as Project;
      setProjects(prev => prev.map(p => p.id === projectId ? updatedProject : p));

      return updatedProject;
    } catch (error: any) {
      console.error('Error updating project:', error);
      toast({
        title: '更新项目失败',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }
  }, []);

  const deleteProject = useCallback(async (projectId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      setProjects(prev => prev.filter(p => p.id !== projectId));
      
      toast({
        title: '项目已删除',
        description: '项目及相关数据已被永久删除',
      });

      return true;
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast({
        title: '删除项目失败',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  }, []);

  const getProject = useCallback(async (projectId: string): Promise<Project | null> => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) throw error;

      return data as Project;
    } catch (error: any) {
      console.error('Error fetching project:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    isLoading,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    getProject,
  };
};