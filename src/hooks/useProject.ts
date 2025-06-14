
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { toast } from '@/components/ui/use-toast';

export type Project = Tables<'projects'>;

export const useProject = () => {
    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchLatestOrCreateProject = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                // If not logged in, do nothing. UI should handle this.
                setIsLoading(false);
                return;
            }

            const { data: projects, error } = await supabase
                .from('projects')
                .select('*')
                .eq('user_id', user.id)
                .order('updated_at', { ascending: false })
                .limit(1);

            if (error) throw error;

            if (projects && projects.length > 0) {
                setProject(projects[0]);
            } else {
                const newProjectData: TablesInsert<'projects'> = { user_id: user.id, title: `新项目 ${new Date().toLocaleDateString()}` };
                const { data: newProject, error: createError } = await supabase
                    .from('projects')
                    .insert(newProjectData)
                    .select()
                    .single();
                if (createError) throw createError;
                setProject(newProject);
            }
        } catch (error: any) {
            toast({ title: '加载或创建项目失败', description: error.message, variant: 'destructive' });
            setProject(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateProject = useCallback(async (updates: Partial<TablesUpdate<'projects'>>) => {
        if (!project) {
            toast({ title: '更新失败', description: '没有选中的项目。', variant: 'destructive' });
            return null;
        }
        try {
            const { data: updatedProject, error } = await supabase
                .from('projects')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('id', project.id)
                .select()
                .single();
            
            if (error) throw error;

            setProject(updatedProject);
            toast({ title: '项目已保存' });
            return updatedProject;

        } catch (error: any) {
            toast({ title: '项目更新失败', description: error.message, variant: 'destructive' });
            return null;
        }
    }, [project]);

    useEffect(() => {
        fetchLatestOrCreateProject();
    }, [fetchLatestOrCreateProject]);

    return {
        project,
        isLoadingProject: isLoading,
        fetchProject: fetchLatestOrCreateProject,
        updateProject,
        setProject,
    };
};
