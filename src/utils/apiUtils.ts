
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";

export const callDeepSeekAPI = async (systemPrompt: string, userPrompt: string): Promise<string | null> => {
  try {
    console.log("Invoking deepseek-proxy function with: stream: false");
    const { data, error } = await supabase.functions.invoke('deepseek-proxy', {
      body: { systemPrompt, userPrompt, stream: false },
    });

    if (error) {
      console.error('Edge Function Error:', error);
      toast({
        title: "Edge Function 调用失败",
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
        title: "API 请求失败 (通过 Edge Function)",
        description: `错误: ${typeof data.error === 'string' ? data.error : data.error.message || '未知 API 错误'}`,
        variant: "destructive",
      });
      return null;
    } else {
      toast({
        title: "Edge Function 响应格式错误",
        description: "未能从 Edge Function 获取有效回复。请检查 Edge Function 日志了解详情。",
        variant: "destructive",
      });
      return null;
    }
  } catch (error) {
    console.error('Error invoking Edge Function:', error);
    toast({
      title: "调用 Edge Function 出错",
      description: `请求 Edge Function 时发生网络或未知错误: ${error instanceof Error ? error.message : String(error)}`,
      variant: "destructive",
    });
    return null;
  }
};
