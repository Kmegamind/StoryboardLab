
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Key, Eye, EyeOff, TestTube, Loader2 } from 'lucide-react';
import { ApiKeyTestResult } from '@/utils/apiKeyTester';

interface ApiKeyManagementCardProps {
  newApiKey: string;
  setNewApiKey: (value: string) => void;
  showApiKey: boolean;
  setShowApiKey: (value: boolean) => void;
  isTesting: boolean;
  isSaving: boolean;
  currentTestResult: ApiKeyTestResult | null;
  onTestApiKey: () => void;
  onSaveApiKey: () => void;
}

export const ApiKeyManagementCard: React.FC<ApiKeyManagementCardProps> = ({
  newApiKey,
  setNewApiKey,
  showApiKey,
  setShowApiKey,
  isTesting,
  isSaving,
  currentTestResult,
  onTestApiKey,
  onSaveApiKey,
}) => {
  return (
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
                onClick={onTestApiKey}
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
                onClick={onSaveApiKey}
                disabled={isSaving || !newApiKey.trim() || !currentTestResult?.success}
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
      </CardContent>
    </Card>
  );
};
