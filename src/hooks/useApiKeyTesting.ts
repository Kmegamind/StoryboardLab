
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { testDeepSeekApiKey, ApiKeyTestResult } from '@/utils/apiKeyTester';

export const useApiKeyTesting = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<ApiKeyTestResult | null>(null);

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

  const testExistingApiKey = useCallback(async (apiKey: string | null) => {
    if (!apiKey) {
      toast({
        title: '未找到API密钥',
        description: '请先保存API密钥',
        variant: 'destructive',
      });
      return null;
    }
    
    return await testApiKey(apiKey);
  }, [testApiKey]);

  return {
    isTesting,
    testResult,
    testApiKey,
    testExistingApiKey,
    setTestResult,
  };
};
