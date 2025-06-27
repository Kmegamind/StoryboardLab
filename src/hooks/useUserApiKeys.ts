
import { useCallback } from 'react';
import { useApiKeyStorage, UserApiKey } from './useApiKeyStorage';
import { useApiKeyTesting } from './useApiKeyTesting';
import { ApiKeyTestResult } from '@/utils/apiKeyTester';

export { UserApiKey };

export const useUserApiKeys = () => {
  const {
    apiKeys,
    isLoading,
    saveApiKey,
    deleteApiKey,
    getDecryptedApiKey,
    refetch,
  } = useApiKeyStorage();

  const {
    isTesting,
    testResult,
    testApiKey,
    testExistingApiKey: testExistingKey,
    setTestResult,
  } = useApiKeyTesting();

  const testExistingApiKey = useCallback(async (provider: string) => {
    const apiKey = getDecryptedApiKey(provider);
    return await testExistingKey(apiKey);
  }, [getDecryptedApiKey, testExistingKey]);

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
    refetch,
    setTestResult,
  };
};
