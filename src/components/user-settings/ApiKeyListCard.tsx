
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';
import { UserApiKey } from '@/hooks/useUserApiKeys';
import { formatApiKeyForDisplay } from '@/utils/apiKeyTester';

interface ApiKeyListCardProps {
  apiKeys: UserApiKey[];
  isLoading: boolean;
  onUnbindApiKey: (id: string) => void;
}

export const ApiKeyListCard: React.FC<ApiKeyListCardProps> = ({
  apiKeys,
  isLoading,
  onUnbindApiKey,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
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
                onClick={() => onUnbindApiKey(key.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                解除绑定
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
