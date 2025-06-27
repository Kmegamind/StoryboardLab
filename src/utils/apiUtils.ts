
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
    // Priority order: 1. Database saved key, 2. localStorage key, 3. Default service
    let userApiKey = await getUserApiKey('deepseek');
    
    if (!userApiKey) {
      userApiKey = localStorage.getItem('deepseek_api_key');
    }
    
    if (userApiKey) {
      // 使用用户的API密钥直接调用DeepSeek API
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
    } else {
      // 使用默认的Edge Function
      console.log("使用默认服务调用 deepseek-proxy function");
      const { data, error } = await supabase.functions.invoke('deepseek-proxy', {
        body: { systemPrompt, userPrompt, stream: false },
      });

      if (error) {
        console.error('Edge Function Error:', error);
        toast({
          title: "服务调用失败",
          description: `错误: ${error.message}`,
          variant: "destructive",
        });
        return null;
      }

      console.log("Edge Function response data:", data);

      if (data && data.content) {
        return data.content;
      } else if (data && data.error) {
        console.error('API Error from Edge Function:', data.error);
        toast({
          title: "API 请求失败",
          description: `错误: ${typeof data.error === 'string' ? data.error : data.error.message || '未知错误'}`,
          variant: "destructive",
        });
        return null;
      } else {
        toast({
          title: "服务响应格式错误",
          description: "未能获取有效回复，请检查网络连接或稍后重试",
          variant: "destructive",
        });
        return null;
      }
    }
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
