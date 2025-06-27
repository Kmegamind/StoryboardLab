
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";

// Function to get user's saved API key from database
const getUserApiKey = async (provider: string = 'deepseek'): Promise<string | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_api_keys')
      .select('api_key_encrypted')
      .eq('user_id', user.id)
      .eq('provider', provider)
      .single();

    if (error || !data) return null;

    // Simple decryption - in production, use proper decryption
    return atob(data.api_key_encrypted);
  } catch (error) {
    console.error('Error fetching user API key:', error);
    return null;
  }
};

export const callDeepSeekAPI = async (systemPrompt: string, userPrompt: string): Promise<string | null> => {
  try {
    // Priority order: 1. Database saved key, 2. localStorage key
    let userApiKey = await getUserApiKey('deepseek');
    
    if (!userApiKey) {
      userApiKey = localStorage.getItem('deepseek_api_key');
    }
    
    if (!userApiKey) {
      // No API key found - show error and guide user to settings
      toast({
        title: "需要配置 API 密钥",
        description: "请先在设置页面配置您的 DeepSeek API 密钥后再使用 AI 功能",
        variant: "destructive",
      });
      return null;
    }
    
    // Use user's API key to call DeepSeek API directly
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userApiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('DeepSeek API error:', errorData);
      toast({
        title: "API 调用失败",
        description: `请检查您的API密钥是否正确：${errorData}`,
        variant: "destructive",
      });
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      console.error('No content in API response:', data);
      toast({
        title: "API 响应异常",
        description: "未能获取有效回复，请重试",
        variant: "destructive",
      });
      return null;
    }

    return content;
  } catch (error) {
    console.error('Error calling DeepSeek API:', error);
    toast({
      title: "调用失败",
      description: `网络错误或服务异常: ${error instanceof Error ? error.message : String(error)}`,
      variant: "destructive",
    });
    return null;
  }
};
