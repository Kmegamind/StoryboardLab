
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useOptionalAuth } from '@/hooks/useOptionalAuth';
import { testDeepSeekApiKey, ApiKeyTestResult } from '@/utils/apiKeyTester';

export interface UserApiKey {
  id: string;
  user_id: string;
  api_key_encrypted: string;
  provider: string;
  created_at: string;
  updated_at: string;
}

export const useUserApiKeys = () => {
  const { user, isAuthenticated } = useOptionalAuth();
  const [apiKeys, setApiKeys] = useState<UserApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<ApiKeyTestResult | null>(null);

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

  const testApiKey = useCallback(async (apiKey: string) => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const result = await testDeepSeekApiKey(apiKey);
      setTestResult(result);
      
      if (result.success) {
        toast({
          title: '测试成功',
          description: result.message,
        });
      } else {
        toast({
          title: '测试失败',
          description: result.message,
          variant: 'destructive',
        });
      }
      
      return result;
    } catch (error) {
      const errorResult: ApiKeyTestResult = {
        success: false,
        message: '测试过程中发生错误',
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date(),
      };
      setTestResult(errorResult);
      
      toast({
        title: '测试失败',
        description: errorResult.message,
        variant: 'destructive',
      });
      
      return errorResult;
    } finally {
      setIsTesting(false);
    }
  }, []);

  const saveApiKey = useCallback(async (provider: string, apiKey: string, testResult?: ApiKeyTestResult) => {
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

  const testExistingApiKey = useCallback(async (provider: string) => {
    const apiKey = getDecryptedApiKey(provider);
    if (!apiKey) {
      toast({
        title: '未找到API密钥',
        description: '请先保存API密钥',
        variant: 'destructive',
      });
      return null;
    }
    
    return await testApiKey(apiKey);
  }, [getDecryptedApiKey, testApiKey]);

  useEffect(() => {
    fetchApiKeys();
  }, [fetchApiKeys]);

  return {
    apiKeys,
    isLoading,
    isTesting,
    testResult,
    saveApiKey,
    deleteApiKey,
    getDecryptedApiKey,
    testApiKey,
    testExistingApiKey,
    refetch: fetchApiKeys,
  };
};
