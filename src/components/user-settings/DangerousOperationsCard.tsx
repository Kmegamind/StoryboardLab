
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, UserX, Loader2 } from 'lucide-react';

interface DangerousOperationsCardProps {
  isDeleting: boolean;
  onDeleteAccount: () => void;
}

export const DangerousOperationsCard: React.FC<DangerousOperationsCardProps> = ({
  isDeleting,
  onDeleteAccount,
}) => {
  return (
    <Card className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-300">
          <AlertTriangle className="h-5 w-5" />
          危险操作
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="p-4 border border-red-200 rounded-lg bg-white dark:bg-red-900/10">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h4 className="font-medium text-red-800 dark:text-red-300">
                  注销账号
                </h4>
                <div className="text-sm text-red-700 dark:text-red-300 space-y-1">
                  <p>• 这是永久操作，将删除所有数据和API密钥绑定</p>
                  <p>• 删除后无法恢复任何数据</p>
                  <p>• 注销前会自动清理所有API密钥</p>
                </div>
              </div>
              <Button
                variant="destructive"
                onClick={onDeleteAccount}
                disabled={isDeleting}
                className="ml-4"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    注销中...
                  </>
                ) : (
                  <>
                    <UserX className="h-4 w-4 mr-2" />
                    注销账号
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
