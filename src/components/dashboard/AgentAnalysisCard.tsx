
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface AgentAnalysisCardProps {
  title: string;
  isLoading: boolean;
  analysis: string | null;
  icon?: React.ReactNode;
}

const AgentAnalysisCard: React.FC<AgentAnalysisCardProps> = ({ title, isLoading, analysis, icon }) => {
  if (!isLoading && !analysis) {
    return null;
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          {icon && <span className="mr-3">{icon}</span>}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center text-muted-foreground py-8">
            <Loader2 className="mr-2 h-8 w-8 animate-spin" />
            正在生成方案...
          </div>
        ) : (
          analysis && (
            <div className="p-4 bg-muted/20 border rounded-md text-sm min-h-[150px]">
              <pre className="whitespace-pre-wrap font-sans">{analysis}</pre>
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
};

export default AgentAnalysisCard;
