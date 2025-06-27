
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Key, Trash2, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useUserApiKeys } from '@/hooks/useUserApiKeys';
import { useOptionalAuth } from '@/hooks/useOptionalAuth';
import Navbar from '@/components/Navbar';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const UserSettingsPage = () => {
  const { isAuthenticated } = useOptionalAuth();
  const { apiKeys, isLoading, saveApiKey, deleteApiKey } = useUserApiKeys();
  const [newApiKey, setNewApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const hasDeepSeekKey = apiKeys.some(key => key.provider === 'deepseek');

  const handleSaveApiKey = async () => {
    if (!newApiKey.trim()) {
      toast({
        title: 'API Key required',
        description: 'Please enter a valid API key',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    const success = await saveApiKey('deepseek', newApiKey.trim());
    if (success) {
      setNewApiKey('');
    }
    setIsSaving(false);
  };

  const handleDeleteApiKey = async (id: string) => {
    if (confirm('Are you sure you want to delete this API key?')) {
      await deleteApiKey(id);
    }
  };

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
                      onClick={handleSaveApiKey}
                      disabled={isSaving || !newApiKey.trim()}
                    >
                      {isSaving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Save'
                      )}
                    </Button>
                  </div>
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
                          <div>
                            <p className="font-medium capitalize flex items-center gap-2">
                              {key.provider}
                              {key.provider === 'deepseek' && (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Added {new Date(key.created_at).toLocaleDateString()}
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
