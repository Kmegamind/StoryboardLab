
import React from 'react';
import PlotInputCard from '@/components/dashboard/PlotInputCard';
import ScreenwriterOutputCard from '@/components/dashboard/ScreenwriterOutputCard';
import DirectorOutputCard from '@/components/dashboard/DirectorOutputCard';

interface ProcessingPipelineProps {
  plot: string;
  setPlot: (plot: string) => void;
  onProcessPlot: () => void;
  isLoadingScreenwriter: boolean;
  screenwriterOutput: string;
  setScreenwriterOutput: (output: string) => void;
  onDirectorProcessing: () => void;
  isLoadingDirector: boolean;
  directorOutput: string;
  setDirectorOutput: (output: string) => void;
  onSaveShotsToDatabase: () => void;
  isSavingShots: boolean;
  isProcessing: boolean;
}

const ProcessingPipeline: React.FC<ProcessingPipelineProps> = ({
  plot,
  setPlot,
  onProcessPlot,
  isLoadingScreenwriter,
  screenwriterOutput,
  setScreenwriterOutput,
  onDirectorProcessing,
  isLoadingDirector,
  directorOutput,
  setDirectorOutput,
  onSaveShotsToDatabase,
  isSavingShots,
  isProcessing,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
      <PlotInputCard
        plot={plot}
        setPlot={setPlot}
        onProcessPlot={onProcessPlot}
        isLoadingScreenwriter={isLoadingScreenwriter}
        disabled={isProcessing}
      />

      <div className="md:col-span-2 space-y-8">
        <ScreenwriterOutputCard
          screenwriterOutput={screenwriterOutput}
          setScreenwriterOutput={setScreenwriterOutput}
          onDirectorProcessing={onDirectorProcessing}
          isLoadingScreenwriter={isLoadingScreenwriter}
          isLoadingDirector={isLoadingDirector}
          disabled={!screenwriterOutput || isProcessing}
        />
        <DirectorOutputCard
          directorOutput={directorOutput}
          setDirectorOutput={setDirectorOutput}
          onSaveShotsToDatabase={onSaveShotsToDatabase}
          isLoadingDirector={isLoadingDirector}
          isSavingShots={isSavingShots}
          disabled={!directorOutput || isProcessing}
        />
      </div>
    </div>
  );
};

export default ProcessingPipeline;
