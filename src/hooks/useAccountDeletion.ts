
import { useState } from 'react';
import { useUserApiKeys } from './useUserApiKeys';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useAccountDeletion = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { apiKeys, deleteApiKey } = useUserApiKeys();

  const cleanupLocalStorage = () => {
    // 清理所有可能的认证和API相关的localStorage项
    const keysToRemove = [
      'deepseek_api_key',
      'supabase.auth.token',
      'user_preferences',
    ];

    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });

    // 清理所有以supabase开头的键
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
  };

  const deleteAllApiKeys = async () => {
    const deletePromises = apiKeys.map(key => deleteApiKey(key.id));
    await Promise.all(deletePromises);
  };

  const deleteAccount = async () => {
    setIsDeleting(true);
    
    try {
      // 1. 删除所有API密钥
      await deleteAllApiKeys();
      
      // 2. 清理本地存储
      cleanupLocalStorage();
      
      // 3. 调用Supabase删除用户账号
      const { error } = await supabase.auth.updateUser({
        data: { deleted_at: new Date().toISOString() }
      });

      if (error) {
        throw error;
      }

      // 4. 登出用户
      await supabase.auth.signOut({ scope: 'global' });
      
      toast({
        title: '账号注销成功',
        description: '您的账号和所有相关数据已被删除',
      });

      // 5. 重定向到首页
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);

      return true;
    } catch (error: any) {
      console.error('Account deletion error:', error);
      toast({
        title: '账号注销失败',
        description: error.message || '删除过程中发生错误，请重试',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isDeleting,
    deleteAccount,
    cleanupLocalStorage,
  };
};
