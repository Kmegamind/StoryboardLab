
import React, { useState, useEffect } from 'react';
import { useUserApiKeys } from '@/hooks/useUserApiKeys';
import { useOptionalAuth } from '@/hooks/useOptionalAuth';
import { useAccountDeletion } from '@/hooks/useAccountDeletion';
import Navbar from '@/components/Navbar';
import { toast } from '@/hooks/use-toast';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { ApiKeyStatusAlert } from '@/components/user-settings/ApiKeyStatusAlert';
import { ApiKeyBindingCard } from '@/components/user-settings/ApiKeyBindingCard';
import { ApiKeyManagementCard } from '@/components/user-settings/ApiKeyManagementCard';
import { TestResultDisplay } from '@/components/user-settings/TestResultDisplay';
import { SecurityInfoCard } from '@/components/user-settings/SecurityInfoCard';
import { ApiKeyListCard } from '@/components/user-settings/ApiKeyListCard';
import { DangerousOperationsCard } from '@/components/user-settings/DangerousOperationsCard';
import { Card, CardContent } from '@/components/ui/card';

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
  const { isDeleting, deleteAccount } = useAccountDeletion();
  
  const [newApiKey, setNewApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [currentTestResult, setCurrentTestResult] = useState<any>(null);
  const [testedApiKey, setTestedApiKey] = useState(''); // 追踪已测试的API密钥
  
  // Dialog states
  const [showUnbindDialog, setShowUnbindDialog] = useState(false);
  const [showDeleteAccountDialog, setShowDeleteAccountDialog] = useState(false);
  const [selectedKeyId, setSelectedKeyId] = useState<string>('');

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
    if (result.success) {
      setTestedApiKey(newApiKey.trim()); // 记录成功测试的API密钥
    }
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
      setTestedApiKey('');
    }
    setIsSaving(false);
  };

  const handleUnbindApiKey = (id: string) => {
    setSelectedKeyId(id);
    setShowUnbindDialog(true);
  };

  const confirmUnbindApiKey = async () => {
    if (selectedKeyId) {
      await deleteApiKey(selectedKeyId);
      setCurrentTestResult(null);
      setTestedApiKey('');
      setSelectedKeyId('');
    }
  };

  const handleTestExistingKey = async () => {
    await testExistingApiKey('deepseek');
  };

  const handleDeleteAccount = () => {
    setShowDeleteAccountDialog(true);
  };

  const confirmDeleteAccount = async () => {
    await deleteAccount();
  };

  // 只在API密钥值真正变化时才清空测试结果
  useEffect(() => {
    if (currentTestResult && newApiKey.trim() !== testedApiKey) {
      setCurrentTestResult(null);
      setTestedApiKey('');
    }
  }, [newApiKey, currentTestResult, testedApiKey]);

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
          <ApiKeyStatusAlert hasDeepSeekKey={hasDeepSeekKey} />

          {hasDeepSeekKey && deepSeekKey && (
            <ApiKeyBindingCard
              deepSeekKey={deepSeekKey}
              isTesting={isTesting}
              onTestExistingKey={handleTestExistingKey}
            />
          )}

          <ApiKeyManagementCard
            newApiKey={newApiKey}
            setNewApiKey={setNewApiKey}
            showApiKey={showApiKey}
            setShowApiKey={setShowApiKey}
            isTesting={isTesting}
            isSaving={isSaving}
            currentTestResult={currentTestResult}
            onTestApiKey={handleTestApiKey}
            onSaveApiKey={handleSaveApiKey}
          />

          {(currentTestResult || testResult) && (
            <TestResultDisplay testResult={currentTestResult || testResult} />
          )}

          <SecurityInfoCard />

          <ApiKeyListCard
            apiKeys={apiKeys}
            isLoading={isLoading}
            onUnbindApiKey={handleUnbindApiKey}
          />

          <DangerousOperationsCard
            isDeleting={isDeleting}
            onDeleteAccount={handleDeleteAccount}
          />
        </div>
      </div>

      <ConfirmationDialog
        open={showUnbindDialog}
        onOpenChange={setShowUnbindDialog}
        title="确认解除API密钥绑定"
        description="确认删除此API密钥？删除后将无法使用AI功能，您需要重新配置API密钥才能继续使用相关服务。"
        confirmText="解除绑定"
        cancelText="取消"
        onConfirm={confirmUnbindApiKey}
        variant="destructive"
      />

      <ConfirmationDialog
        open={showDeleteAccountDialog}
        onOpenChange={setShowDeleteAccountDialog}
        title="确认注销账号"
        description="这是永久操作，将删除所有数据和API密钥绑定。删除后无法恢复任何数据。注销前会自动清理所有API密钥。"
        confirmText="永久删除账号"
        cancelText="取消"
        onConfirm={confirmDeleteAccount}
        variant="destructive"
        requiresTextConfirmation={true}
        confirmationText="DELETE"
      />
    </div>
  );
};

export default UserSettingsPage;
