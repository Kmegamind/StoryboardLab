
import { useState } from 'react';
import { callDeepSeekAPI } from '@/utils/apiUtils';
import { toast } from "@/hooks/use-toast";

export const usePlotProcessing = () => {
  const [isLoadingScreenwriter, setIsLoadingScreenwriter] = useState<boolean>(false);

  const processPlotWithScreenwriter = async (currentPlot: string): Promise<string | null> => {
    if (!currentPlot) {
      toast({ title: '请输入故事情节', variant: "destructive" });
      return null;
    }
    setIsLoadingScreenwriter(true);
    try {
      const systemPromptScreenwriter = "你是一位才华横溢的电影编剧。请根据用户提供的故事梗概或情节，创作一段富有叙事性、包含场景描述、角色行为和对话的初步剧本。请注重故事的流畅性和画面的想象力，暂时不需要严格按照镜头号或非常结构化的格式输出。你的输出将交给导演进行进一步的专业处理和分镜设计。";
      const result = await callDeepSeekAPI(systemPromptScreenwriter, currentPlot);

      if (result) {
        toast({
          title: '编剧处理完成',
          description: '故事情节已成功转化为初步剧本',
        });
        return result;
      } else {
        toast({ title: '编剧处理失败', description: '请检查网络连接或稍后重试', variant: "destructive" });
        return null;
      }
    } catch (error: any) {
      toast({ title: '编剧处理异常', description: error.message, variant: "destructive" });
      return null;
    } finally {
      setIsLoadingScreenwriter(false);
    }
  };

  return {
    isLoadingScreenwriter,
    processPlotWithScreenwriter,
  };
};
