
import { useState } from 'react';
import { callDeepSeekAPI } from '@/utils/apiUtils';
import { toast } from "@/components/ui/use-toast";

export interface PlotProcessingHookProps {
  initialPlot?: string;
}

export const usePlotProcessing = (props?: PlotProcessingHookProps) => {
  const [plot, setPlot] = useState<string>(props?.initialPlot || '');
  const [screenwriterOutput, setScreenwriterOutput] = useState<string>('');
  const [isLoadingScreenwriter, setIsLoadingScreenwriter] = useState<boolean>(false);

  const processPlotWithScreenwriter = async (currentPlot: string) => {
    if (!currentPlot) return;
    setIsLoadingScreenwriter(true);
    setScreenwriterOutput(''); // Clear previous output

    const systemPromptScreenwriter = "你是一位才华横溢的电影编剧。请根据用户提供的故事梗概或情节，创作一段富有叙事性、包含场景描述、角色行为和对话的初步剧本。请注重故事的流畅性和画面的想象力，暂时不需要严格按照镜头号或非常结构化的格式输出。你的输出将交给导演进行进一步的专业处理和分镜设计。";
    const result = await callDeepSeekAPI(systemPromptScreenwriter, currentPlot);

    if (result) {
      setScreenwriterOutput(result);
      toast({
        title: "编剧 Agent 处理完成",
        description: "已成功生成初步剧本内容。",
      });
    }
    setIsLoadingScreenwriter(false);
  };

  return {
    plot,
    setPlot,
    screenwriterOutput,
    setScreenwriterOutput,
    isLoadingScreenwriter,
    processPlotWithScreenwriter,
  };
};
