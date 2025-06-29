
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { extractAssetsFromScript, ExtractedAssets } from '@/utils/assetExtractionAgent';

export const useAssetGeneration = () => {
  const [extractedAssets, setExtractedAssets] = useState<ExtractedAssets | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateAssets = async (source: 'script' | 'shots' | 'custom', scriptContent?: string, customText?: string) => {
    let contentToAnalyze = '';

    if (source === 'custom' && customText) {
      contentToAnalyze = customText;
    } else if (source === 'script' && scriptContent) {
      contentToAnalyze = scriptContent;
    } else if (source === 'shots' && scriptContent) {
      // 如果是分镜JSON，尝试提取文本内容
      try {
        const shotsData = JSON.parse(scriptContent);
        if (Array.isArray(shotsData)) {
          contentToAnalyze = shotsData.map(shot => 
            `场景: ${shot.scene_content || ''} ${shot.dialogue || ''} ${shot.director_notes || ''}`
          ).join('\n');
        }
      } catch {
        // 如果不是JSON，直接使用原文本
        contentToAnalyze = scriptContent;
      }
    }

    if (!contentToAnalyze.trim()) {
      toast({
        title: '无法生成资产',
        description: '没有找到可分析的内容，请确保项目包含剧本或分镜内容。',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const assets = await extractAssetsFromScript(contentToAnalyze);
      
      if (!assets) {
        throw new Error('AI未能提取到资产信息');
      }

      // 检查是否提取到任何资产
      const totalAssets = assets.characters.length + assets.scenes.length + assets.props.length;
      if (totalAssets === 0) {
        toast({
          title: '未找到资产',
          description: '在提供的内容中未能识别出明确的角色、场景或道具信息。',
          variant: 'destructive',
        });
        return;
      }

      setExtractedAssets(assets);
      toast({
        title: '资产提取成功',
        description: `成功提取 ${assets.characters.length} 个角色，${assets.scenes.length} 个场景，${assets.props.length} 个道具。`,
      });
    } catch (error: any) {
      console.error('资产生成失败:', error);
      toast({
        title: '资产生成失败',
        description: error.message || '请检查网络连接和API配置后重试。',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const clearAssets = () => {
    setExtractedAssets(null);
  };

  return {
    extractedAssets,
    isGenerating,
    generateAssets,
    clearAssets,
  };
};
