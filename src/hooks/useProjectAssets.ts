
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type ProjectAsset = Tables<'project_assets'>;
export type ProjectAssetInsert = TablesInsert<'project_assets'>;
export type ProjectAssetUpdate = TablesUpdate<'project_assets'>;

export const useProjectAssets = (projectId: string | undefined) => {
    const [assets, setAssets] = useState<ProjectAsset[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchAssets = useCallback(async () => {
        if (!projectId) return;
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('project_assets')
                .select('*')
                .eq('project_id', projectId)
                .order('asset_type', { ascending: true })
                .order('created_at', { ascending: true });

            if (error) throw error;
            setAssets(data || []);
        } catch (error: any) {
            toast({
                title: '获取资产失败',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        if (projectId) {
            fetchAssets();
        }
    }, [projectId, fetchAssets]);

    const addAsset = async (assetData: Omit<ProjectAssetInsert, 'project_id'>) => {
        if (!projectId) return null;
        try {
            const { data, error } = await supabase
                .from('project_assets')
                .insert([{ ...assetData, project_id: projectId }])
                .select()
                .single();
            
            if (error) throw error;

            toast({ title: '资产已添加' });
            await fetchAssets(); // Refresh list
            return data;
        } catch (error: any) {
             toast({
                title: '添加资产失败',
                description: error.message.includes('unique_asset_name_per_project') ? '该项目下已存在同名资产。' : error.message,
                variant: 'destructive',
            });
            return null;
        }
    };

    const updateAsset = async (assetId: string, updates: ProjectAssetUpdate) => {
        try {
            const { data, error } = await supabase
                .from('project_assets')
                .update(updates)
                .eq('id', assetId)
                .select()
                .single();

            if (error) throw error;

            toast({ title: '资产已更新' });
            await fetchAssets(); // Refresh list
            return data;
        } catch (error: any) {
             toast({
                title: '更新资产失败',
                description: error.message.includes('unique_asset_name_per_project') ? '该项目下已存在同名资产。' : error.message,
                variant: 'destructive',
            });
            return null;
        }
    };

    const deleteAsset = async (assetId: string) => {
         try {
            const { error } = await supabase
                .from('project_assets')
                .delete()
                .eq('id', assetId);

            if (error) throw error;
            
            toast({ title: '资产已删除' });
            await fetchAssets(); // Refresh list
        } catch (error: any) {
             toast({
                title: '删除资产失败',
                description: error.message,
                variant: 'destructive',
            });
        }
    };

    return {
        assets,
        isLoadingAssets: isLoading,
        addAsset,
        updateAsset,
        deleteAsset,
    };
};
