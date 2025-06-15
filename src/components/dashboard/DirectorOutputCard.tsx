
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Save } from 'lucide-react';

interface DirectorOutputCardProps {
  directorOutput: string;
  setDirectorOutput: (output: string) => void;
  onSaveShotsToDatabase: () => void;
  isLoadingDirector: boolean;
  isSavingShots: boolean;
  disabled?: boolean;
}

const DirectorOutputCard: React.FC<DirectorOutputCardProps> = ({
  directorOutput,
  setDirectorOutput,
  onSaveShotsToDatabase,
  isLoadingDirector,
  isSavingShots,
  disabled = false,
}) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboardCards.directorOutput.title')}</CardTitle>
        <CardDescription>{t('dashboardCards.directorOutput.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingDirector && !directorOutput && (
          <div className="flex items-center justify-center text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            {t('dashboardCards.directorOutput.processing')}
          </div>
        )}
        {directorOutput ? (
          <>
            <p className="text-muted-foreground mb-2">{t('dashboardCards.directorOutput.label')}</p>
            <Textarea
              value={directorOutput}
              onChange={(e) => setDirectorOutput(e.target.value)}
              className="min-h-[150px] bg-muted/30 font-mono text-sm"
              placeholder={t('dashboardCards.directorOutput.placeholder')}
              disabled={disabled}
            />
            <Button
              onClick={onSaveShotsToDatabase}
              className="mt-4 w-full"
              disabled={disabled || isSavingShots || !directorOutput}
            >
              {isSavingShots ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {t('dashboardCards.directorOutput.button')}
            </Button>
          </>
        ) : (
          !isLoadingDirector && <p className="text-muted-foreground">{t('dashboardCards.directorOutput.waiting')}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default DirectorOutputCard;
