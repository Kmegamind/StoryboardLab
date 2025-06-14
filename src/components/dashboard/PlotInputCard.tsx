
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, ArrowRight } from 'lucide-react';

interface PlotInputCardProps {
  plot: string;
  setPlot: (plot: string) => void;
  onProcessPlot: () => void;
  isLoadingScreenwriter: boolean;
}

const PlotInputCard: React.FC<PlotInputCardProps> = ({
  plot,
  setPlot,
  onProcessPlot,
  isLoadingScreenwriter,
}) => {
  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <CardTitle>1. 输入您的故事/情节</CardTitle>
        <CardDescription>在这里输入您的原创故事、小说片段或核心情节。</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="例如：在一个赛博朋克都市，一个失忆的侦探必须找回他的过去，同时揭露一个威胁整个城市的阴谋..."
          value={plot}
          onChange={(e) => setPlot(e.target.value)}
          className="min-h-[200px] text-base"
        />
        <Button
          onClick={onProcessPlot}
          className="mt-4 w-full"
          disabled={!plot || isLoadingScreenwriter}
        >
          {isLoadingScreenwriter ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="mr-2 h-4 w-4" />
          )}
          启动编剧 Agent
        </Button>
      </CardContent>
    </Card>
  );
};

export default PlotInputCard;
