
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Key, Trash2, Eye, EyeOff, AlertCircle, CheckCircle, TestTube, Shield, Clock, Activity } from 'lucide-react';
import { useUserApiKeys } from '@/hooks/useUserApiKeys';
import { useOptionalAuth } from '@/hooks/useOptionalAuth';
import Navbar from '@/components/Navbar';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { formatApiKeyForDisplay } from '@/utils/apiKeyTester';

const UserSettingsPage = () => {
  const { isAuthenticated } = useOptionalAuth();
  const { 
    apiKeys, 
    isLoading, 
    isTesting, 
    testResult, 
    saveApiKey, 
    deleteApiKey, 
    testApiKey, 
    testExistingApiKey 
  } = useUserApiKeys();
  
  const [newApiKey, setNewApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [currentTestResult, setCurrentTestResult] = useState<any>(null);

  const hasDeepSeekKey = apiKeys.some(key => key.provider === 'deepseek');
  const deepSeekKey = apiKeys.find(key => key.provider === 'deepseek');

  const handleTestApiKey = async () => {
    if (!newApiKey.trim()) {
      toast({
        title: 'API密钥不能为空',
        description: '请输入有效的API密钥',
        variant: 'destructive',
      });
      return;
    }

    const result = await testApiKey(newApiKey.trim());
    setCurrentTestResult(result);
  };

  const handleSaveApiKey = async () => {
    if (!currentTestResult || !currentTestResult.success) {
      toast({
        title: '请先测试API密钥',
        description: '只有测试成功的API密钥才能保存',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    const success = await saveApiKey('deepseek', newApiKey.trim(), currentTestResult);
    if (success) {
      setNewApiKey('');
      setCurrentTestResult(null);
    }
    setIsSaving(false);
  };

  const handleDeleteApiKey = async (id: string) => {
    if (confirm('确定要删除这个API密钥吗？删除后将无法使用AI功能。')) {
      await deleteApiKey(id);
      setCurrentTestResult(null);
    }
  };

  const handleTestExistingKey = async () => {
    await testExistingApiKey('deepseek');
  };

  // 清理测试结果当输入改变时
  useEffect(() => {
    if (currentTestResult && newApiKey !== '') {
      setCurrentTestResult(null);
    }
  }, [newApiKey, currentTestResult]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="container mx-auto px-4 py-8 pt-24">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">
                Please log in to access user settings
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* API Key Status Alert */}
          <Alert variant={hasDeepSeekKey ? "default" : "destructive"}>
            {hasDeepSeekKey ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertTitle>
              {hasDeepSeekKey ? "API 密钥已配置" : "需要配置 API 密钥"}
            </AlertTitle>
            <AlertDescription>
              {hasDeepSeekKey ? (
                "您已成功配置 DeepSeek API 密钥，可以正常使用所有 AI 功能。"
              ) : (
                "为了使用 AI 功能，您必须配置自己的 DeepSeek API 密钥。我们不再提供默认的共享服务。"
              )}
            </AlertDescription>
          </Alert>

          {/* API Key Binding Status */}
          {hasDeepSeekKey && deepSeekKey && (
            <Card className="border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-300">
                  <Shield className="h-5 w-5" />
                  账号绑定状态
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-green-800 dark:text-green-300">
                      您的账号已绑定 DeepSeek API
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      密钥: {formatApiKeyForDisplay(deepSeekKey.api_key_encrypted)}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleTestExistingKey}
                    disabled={isTesting}
                    className="text-green-700 border-green-300 hover:bg-green-100 dark:text-green-300 dark:border-green-700 dark:hover:bg-green-800"
                  >
                    {isTesting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <TestTube className="h-4 w-4" />
                    )}
                    {isTesting ? '测试中...' : '重新测试'}
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <span>绑定时间: {new Date(deepSeekKey.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-3 w-3" />
                    <span>最后更新: {new Date(deepSeekKey.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* API Key Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Key Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="deepseek-api-key">
                    DeepSeek API Key <span className="text-red-500">*必需</span>
                  </Label>
                  <div className="flex gap-2 mt-1">
                    <div className="relative flex-1">
                      <Input
                        id="deepseek-api-key"
                        type={showApiKey ? 'text' : 'password'}
                        value={newApiKey}
                        onChange={(e) => setNewApiKey(e.target.value)}
                        placeholder="sk-..."
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowApiKey(!showApiKey)}
                      >
                        {showApiKey ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <Button
                      onClick={handleTestApiKey}
                      disabled={isTesting || !newApiKey.trim()}
                      variant="outline"
                    >
                      {isTesting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <TestTube className="h-4 w-4" />
                      )}
                      {isTesting ? '测试中...' : '测试连接'}
                    </Button>
                    <Button
                      onClick={handleSaveApiKey}
                      disabled={isSaving || !newApiKey.trim() || !currentTestResult?.success}
                    >
                      {isSaving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Save'
                      )}
                    </Button>
                  </div>
                  
                  {/* Test Result Display */}
                  {(currentTestResult || testResult) && (
                    <div className="mt-3">
                      <Alert variant={(currentTestResult || testResult)?.success ? "default" : "destructive"}>
                        {(currentTestResult || testResult)?.success ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <AlertCircle className="h-4 w-4" />
                        )}
                        <AlertTitle>
                          {(currentTestResult || testResult)?.success ? "测试成功" : "测试失败"}
                        </AlertTitle>
                        <AlertDescription>
                          <div className="space-y-1">
                            <p>{(currentTestResult || testResult)?.message}</p>
                            {(currentTestResult || testResult)?.details && (
                              <p className="text-xs opacity-75">{(currentTestResult || testResult)?.details}</p>
                            )}
                            <p className="text-xs opacity-50">
                              测试时间: {(currentTestResult || testResult)?.timestamp?.toLocaleString()}
                            </p>
                          </div>
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                  
                  <div className="space-y-2 mt-2">
                    <p className="text-sm text-muted-foreground">
                      Get your API key from{' '}
                      <a
                        href="https://platform.deepseek.com/api_keys"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        DeepSeek Platform
                      </a>
                    </p>
                    <p className="text-sm font-medium text-orange-600">
                      ⚠️ 配置API密钥后，您将直接使用自己的额度，请合理使用以控制成本。
                    </p>
                  </div>
                </div>
              </div>

              {/* Security Information */}
              <Card className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div className="space-y-2">
                      <h4 className="font-medium text-blue-800 dark:text-blue-300">API密钥安全说明</h4>
                      <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                        <p>• 您的API密钥采用加密方式存储，我们无法查看原始密钥</p>
                        <p>• 密钥仅用于您的AI功能调用，不会被分享给其他用户</p>
                        <p>• 建议定期检查API密钥的使用情况和安全性</p>
                        <p>• 如有安全疑虑，请及时在DeepSeek平台重新生成密钥</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {isLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Saved API Keys</h3>
                  {apiKeys.length === 0 ? (
                    <div className="p-4 border border-dashed rounded-lg text-center">
                      <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground font-medium">
                        尚未配置任何 API 密钥
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        请配置 DeepSeek API 密钥以使用 AI 功能
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {apiKeys.map((key) => (
                        <div
                          key={key.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="font-medium capitalize flex items-center gap-2">
                              {key.provider}
                              {key.provider === 'deepseek' && (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Added {new Date(key.created_at).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Key: {formatApiKeyForDisplay(atob(key.api_key_encrypted))}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteApiKey(key.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserSettingsPage;
