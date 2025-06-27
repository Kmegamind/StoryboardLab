
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export const SecurityInfoCard: React.FC = () => {
  return (
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
  );
};
