
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Save, Sparkles, Loader2 } from 'lucide-react';

interface PromptEditorProps {
  currentPrompt: string;
  setCurrentPrompt: (prompt: string) => void;
  isGeneratingPrompt: boolean;
  onGeneratePrompt: () => void;
  onSavePrompt: () => void;
}

const PromptEditor: React.FC<PromptEditorProps> = ({
  currentPrompt,
  setCurrentPrompt,
  isGeneratingPrompt,
  onGeneratePrompt,
  onSavePrompt,
}) => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>提示词编辑器</CardTitle>
          <div className="flex gap-2">
            <Button 
              onClick={onGeneratePrompt}
              disabled={isGeneratingPrompt}
              variant="outline"
            >
              {isGeneratingPrompt ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              生成视觉方案
            </Button>
            <Button onClick={onSavePrompt} disabled={!currentPrompt.trim()}>
              <Save className="h-4 w-4 mr-2" />
              保存版本
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Textarea
          value={currentPrompt}
          onChange={(e) => setCurrentPrompt(e.target.value)}
          placeholder="在这里编辑您的提示词，或点击生成视觉方案开始..."
          className="min-h-[400px] font-mono text-sm"
        />
      </CardContent>
    </Card>
  );
};

export default PromptEditor;
