
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, ArrowRight } from 'lucide-react';

interface PlotInputCardProps {
  plot: string;
  setPlot: (plot: string) => void;
  onProcessPlot: () => void;
  isLoadingScreenwriter: boolean;
  disabled?: boolean;
}

const PlotInputCard: React.FC<PlotInputCardProps> = ({
  plot,
  setPlot,
  onProcessPlot,
  isLoadingScreenwriter,
  disabled = false,
}) => {
  const { t } = useTranslation();

  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <CardTitle>{t('dashboardCards.plotInput.title')}</CardTitle>
        <CardDescription>{t('dashboardCards.plotInput.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder={t('dashboardCards.plotInput.placeholder')}
          value={plot}
          onChange={(e) => setPlot(e.target.value)}
          className="min-h-[200px] text-base"
          disabled={disabled}
        />
        <Button
          onClick={onProcessPlot}
          className="mt-4 w-full"
          disabled={disabled || !plot || isLoadingScreenwriter}
        >
          {isLoadingScreenwriter ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="mr-2 h-4 w-4" />
          )}
          {t('dashboardCards.plotInput.button')}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PlotInputCard;
