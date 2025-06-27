
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, TestTube, Clock, Activity, Loader2 } from 'lucide-react';
import { UserApiKey } from '@/hooks/useUserApiKeys';
import { formatApiKeyForDisplay } from '@/utils/apiKeyTester';

interface ApiKeyBindingCardProps {
  deepSeekKey: UserApiKey;
  isTesting: boolean;
  onTestExistingKey: () => void;
}

export const ApiKeyBindingCard: React.FC<ApiKeyBindingCardProps> = ({
  deepSeekKey,
  isTesting,
  onTestExistingKey,
}) => {
  return (
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
            onClick={onTestExistingKey}
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
  );
};
