
import { callDeepSeekAPI } from '@/utils/apiUtils';

export interface ExtractedAsset {
  name: string;
  description: string;
  reference_token: string;
}

export interface ExtractedAssets {
  characters: ExtractedAsset[];
  scenes: ExtractedAsset[];
  props: ExtractedAsset[];
}

const ASSET_EXTRACTION_SYSTEM_PROMPT = `你是一位专业的影视制作资产管理专家。请仔细分析剧本内容，提取出所有重要的制作资产。

要求：
1. 角色：提取主要人物，包括主角、配角和重要群演
2. 场景：提取重要拍摄地点和环境
3. 道具：提取故事中的关键物品、工具等

请严格按以下JSON格式输出（不要添加任何markdown格式或其他文字）：
{
  "characters": [
    {
      "name": "角色名称",
      "description": "详细描述包括外貌、年龄、性格特点",
      "reference_token": "<角色英文名>"
    }
  ],
  "scenes": [
    {
      "name": "场景名称",
      "description": "环境描述、时间、氛围",
      "reference_token": "<场景英文描述>"
    }
  ],
  "props": [
    {
      "name": "道具名称",
      "description": "物品描述、用途、特征",
      "reference_token": "<道具英文描述>"
    }
  ]
}`;

export const extractAssetsFromScript = async (scriptContent: string): Promise<ExtractedAssets | null> => {
  if (!scriptContent.trim()) {
    return null;
  }

  const userPrompt = `请分析以下剧本内容并提取资产：

${scriptContent}`;

  try {
    const response = await callDeepSeekAPI(ASSET_EXTRACTION_SYSTEM_PROMPT, userPrompt);
    
    if (!response) {
      return null;
    }

    // 尝试解析JSON响应
    let cleanedResponse = response.trim();
    
    // 移除可能的markdown代码块标记
    const jsonMatch = cleanedResponse.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      cleanedResponse = jsonMatch[1].trim();
    }

    const extractedAssets = JSON.parse(cleanedResponse);
    
    // 验证响应格式
    if (!extractedAssets.characters || !extractedAssets.scenes || !extractedAssets.props) {
      throw new Error('响应格式不正确');
    }

    return extractedAssets;
  } catch (error) {
    console.error('资产提取失败:', error);
    throw new Error('AI资产提取失败，请重试');
  }
};
