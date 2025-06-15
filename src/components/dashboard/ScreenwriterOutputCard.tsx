
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, ArrowRight } from 'lucide-react';

interface ScreenwriterOutputCardProps {
  screenwriterOutput: string;
  setScreenwriterOutput: (output: string) => void;
  onDirectorProcessing: () => void;
  isLoadingScreenwriter: boolean;
  isLoadingDirector: boolean;
  disabled?: boolean;
}

const ScreenwriterOutputCard: React.FC<ScreenwriterOutputCardProps> = ({
  screenwriterOutput,
  setScreenwriterOutput,
  onDirectorProcessing,
  isLoadingScreenwriter,
  isLoadingDirector,
  disabled = false,
}) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboardCards.screenwriterOutput.title')}</CardTitle>
        <CardDescription>{t('dashboardCards.screenwriterOutput.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingScreenwriter && !screenwriterOutput && (
          <div className="flex items-center justify-center text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            {t('dashboardCards.screenwriterOutput.processing')}
          </div>
        )}
        {screenwriterOutput ? (
          <>
            <p className="text-muted-foreground mb-2">{t('dashboardCards.screenwriterOutput.label')}</p>
            <Textarea
              value={screenwriterOutput}
              onChange={(e) => setScreenwriterOutput(e.target.value)}
              className="min-h-[100px] bg-muted/30"
              disabled={disabled}
            />
            <Button
              onClick={onDirectorProcessing}
              className="mt-4 w-full"
              disabled={disabled || isLoadingDirector || !screenwriterOutput}
            >
              {isLoadingDirector ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="mr-2 h-4 w-4" />
              )}
              {t('dashboardCards.screenwriterOutput.button')}
            </Button>
          </>
        ) : (
          !isLoadingScreenwriter && <p className="text-muted-foreground">{t('dashboardCards.screenwriterOutput.waiting')}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ScreenwriterOutputCard;
