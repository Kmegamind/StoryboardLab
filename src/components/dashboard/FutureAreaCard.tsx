
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface FutureAreaCardProps {
  finalPrompts: string;
  // setFinalPrompts: (prompts: string) => void; // This setter seems unused in the original display logic if placeholder is shown
  isLoadingFinalPrompts: boolean; // To decide if placeholder or prompt area is shown
}

const FutureAreaCard: React.FC<FutureAreaCardProps> = ({
  finalPrompts,
  // setFinalPrompts,
  isLoadingFinalPrompts,
}) => {
  return (
    <Card className="mt-12">
      <CardHeader>
        <CardTitle className="text-2xl">AI生图/生视频素材区 (规划中)</CardTitle>
        <CardDescription>
          这里将展示从数据库加载的已保存分镜列表。您可以选择某个分镜，然后使用AI生成图像提示词或进行视频生成操作。
        </CardDescription>
      </CardHeader>
      <CardContent>
        {finalPrompts ? (
          <Textarea
            value={finalPrompts}
            readOnly // Assuming this is display-only as per previous logic
            className="min-h-[100px] bg-muted/30 text-sm"
            placeholder="旧版全局提示词输出区域（此功能已调整）"
          />
        ) : !isLoadingFinalPrompts ? (
          <p className="text-muted-foreground">等待导演 Agent 完成结构化分镜处理，并保存到数据库后，可在此处进行后续操作...</p>
        ) : null}
        {/* If isLoadingFinalPrompts is true and no finalPrompts, nothing specific is shown here based on original logic */}
      </CardContent>
    </Card>
  );
};

export default FutureAreaCard;
