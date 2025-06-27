
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Manually defining types as a workaround for potential type generation issues.
export type Project = {
    created_at: string;
    director_output_json: string | null;
    id: string;
    plot: string | null;
    screenwriter_output: string | null;
    status: string;
    title: string;
    updated_at: string;
    user_id: string;
};
export type ProjectUpdate = Partial<Project>;
export type ProjectInsert = Partial<Project>;

// Create a temporary project for unauthenticated users
const createTempProject = (): Project => ({
    id: 'temp-project',
    title: '临时项目',
    plot: '',
    screenwriter_output: '',
    director_output_json: '',
    status: 'new',
    user_id: 'temp-user',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
});

export const useProject = () => {
    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchLatestOrCreateProject = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            
            if (!user) {
                // For unauthenticated users, create a temporary project
                const tempProject = createTempProject();
                setProject(tempProject);
                setIsLoading(false);
                return;
            }

            const { data: projects, error } = await (supabase
                .from('projects') as any) // Using 'as any' to bypass type issue
                .select('*')
                .eq('user_id', user.id)
                .order('updated_at', { ascending: false })
                .limit(1);

            if (error) throw error;

            if (projects && projects.length > 0) {
                setProject(projects[0]);
            } else {
                const newProjectData: ProjectInsert = { user_id: user.id, title: `新项目 ${new Date().toLocaleDateString()}` };
                const { data: newProject, error: createError } = await (supabase
                    .from('projects') as any) // Using 'as any' to bypass type issue
                    .insert([newProjectData])
                    .select()
                    .single();
                if (createError) throw createError;
                setProject(newProject);
            }
        } catch (error: any) {
            toast({ title: '加载或创建项目时出错', description: error.message, variant: 'destructive' });
            // Even on error, provide a temporary project for unauthenticated users
            const tempProject = createTempProject();
            setProject(tempProject);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateProject = useCallback(async (updates: Partial<ProjectUpdate>) => {
        if (!project) {
            toast({ title: '更新项目失败', description: '当前没有可用的项目', variant: 'destructive' });
            return null;
        }

        // For temporary projects, just update the local state without saving to database
        if (project.id === 'temp-project') {
            const updatedProject = { ...project, ...updates, updated_at: new Date().toISOString() };
            setProject(updatedProject);
            return updatedProject;
        }

        try {
            const { data: updatedProject, error } = await (supabase
                .from('projects') as any) // Using 'as any' to bypass type issue
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('id', project.id)
                .select()
                .single();
            
            if (error) throw error;

            setProject(updatedProject);
            toast({ title: '项目已更新' });
            return updatedProject;

        } catch (error: any)
        {
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
