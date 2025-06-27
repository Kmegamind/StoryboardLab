
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface ApiKeyStatusAlertProps {
  hasDeepSeekKey: boolean;
}

export const ApiKeyStatusAlert: React.FC<ApiKeyStatusAlertProps> = ({ hasDeepSeekKey }) => {
  return (
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
  );
};
