
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useOptionalAuth } from '@/hooks/useOptionalAuth';

export interface UserApiKey {
  id: string;
  user_id: string;
  api_key_encrypted: string;
  provider: string;
  created_at: string;
  updated_at: string;
}

export const useApiKeyStorage = () => {
  const { user, isAuthenticated } = useOptionalAuth();
  const [apiKeys, setApiKeys] = useState<UserApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchApiKeys = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_api_keys')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setApiKeys(data || []);
    } catch (error: any) {
      toast({
        title: 'Failed to fetch API keys',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, isAuthenticated]);

  const saveApiKey = useCallback(async (provider: string, apiKey: string, testResult?: any) => {
    if (!isAuthenticated || !user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to save API keys',
        variant: 'destructive',
      });
      return false;
    }

    // 如果没有测试结果，要求先测试
    if (!testResult || !testResult.success) {
      toast({
        title: '请先测试API密钥',
        description: '只有测试成功的API密钥才能保存',
        variant: 'destructive',
      });
      return false;
    }

    try {
      // Simple encryption - in production, you'd want proper encryption
      const encrypted = btoa(apiKey);

      const { data, error } = await supabase
        .from('user_api_keys')
        .upsert({
          user_id: user.id,
          provider,
          api_key_encrypted: encrypted,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'API密钥保存成功',
        description: `${provider} API密钥已成功保存并验证`,
      });

      await fetchApiKeys();
      return true;
    } catch (error: any) {
      toast({
        title: 'Failed to save API key',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  }, [user, isAuthenticated, fetchApiKeys]);

  const deleteApiKey = useCallback(async (id: string) => {
    if (!isAuthenticated) return false;

    try {
      const { error } = await supabase
        .from('user_api_keys')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'API Key deleted',
        description: 'API key has been deleted successfully',
      });

      await fetchApiKeys();
      return true;
    } catch (error: any) {
      toast({
        title: 'Failed to delete API key',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  }, [isAuthenticated, fetchApiKeys]);

  const getDecryptedApiKey = useCallback((provider: string): string | null => {
    const apiKeyRecord = apiKeys.find(key => key.provider === provider);
    if (!apiKeyRecord) return null;

    try {
      return atob(apiKeyRecord.api_key_encrypted);
    } catch {
      return null;
    }
  }, [apiKeys]);

  useEffect(() => {
    fetchApiKeys();
  }, [fetchApiKeys]);

  return {
    apiKeys,
    isLoading,
    saveApiKey,
    deleteApiKey,
    getDecryptedApiKey,
    refetch: fetchApiKeys,
  };
};
