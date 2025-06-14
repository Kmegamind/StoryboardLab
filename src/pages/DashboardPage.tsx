
import React, { useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import PlotInputCard from '@/components/dashboard/PlotInputCard';
import ScreenwriterOutputCard from '@/components/dashboard/ScreenwriterOutputCard';
import DirectorOutputCard from '@/components/dashboard/DirectorOutputCard';
import FutureAreaCard from '@/components/dashboard/FutureAreaCard';
import SelectedShotActionsCard from '@/components/dashboard/SelectedShotActionsCard';

import { usePlotProcessing } from '@/hooks/usePlotProcessing';
import { useDirectorProcessing } from '@/hooks/useDirectorProcessing';
import { useShotManagement } from '@/hooks/useShotManagement';

const DashboardPage = () => {
  const {
    savedShots,
    isLoadingSavedShots,
    selectedShot,
    generatedImagePrompts,
    isLoadingImagePrompts,
    fetchSavedShots,
    selectShot,
    generatePromptsForSelectedShot,
    clearSelectedShotAndPrompts, // Renamed from clearSelectedShot
  } = useShotManagement();

  const {
    plot,
    setPlot,
    screenwriterOutput,
    setScreenwriterOutput,
    isLoadingScreenwriter,
    processPlotWithScreenwriter,
  } = usePlotProcessing();

  const {
    directorOutput,
    setDirectorOutput,
    isLoadingDirector,
    isSavingShots,
    processWithDirectorAgent,
    saveShotsToDatabase,
  } = useDirectorProcessing({
    onSaveComplete: fetchSavedShots, // Refresh saved shots list after saving
  });

  useEffect(() => {
    fetchSavedShots();
  }, [fetchSavedShots]);

  const handleProcessPlot = async () => {
    setDirectorOutput(''); 
    clearSelectedShotAndPrompts();
    await processPlotWithScreenwriter(plot);
  };

  const handleDirectorProcessing = async () => {
    clearSelectedShotAndPrompts();
    await processWithDirectorAgent(screenwriterOutput);
  };

  const handleSaveShots = async () => {
    await saveShotsToDatabase(directorOutput);
  };

  const handleDirectorOutputCardGeneratePrompts = async () => {
    toast({
      title: "功能提示",
      description: "此按钮用于处理导演Agent的直接输出。若要为已保存的单个分镜生成提示词，请先在下方列表中选择分镜。",
      variant: "default"
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-24 min-h-screen">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-bold text-primary">AI电影创作工作台</h1>
        <p className="text-xl text-muted-foreground mt-2">
          输入您的故事灵感，让AI Agent逐步细化，最终生成惊艳的视觉提示词。
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <PlotInputCard
          plot={plot}
          setPlot={setPlot}
          onProcessPlot={handleProcessPlot}
          isLoadingScreenwriter={isLoadingScreenwriter}
        />

        <div className="md:col-span-2 space-y-8">
          <ScreenwriterOutputCard
            screenwriterOutput={screenwriterOutput}
            setScreenwriterOutput={setScreenwriterOutput} // Pass setter for direct editing
            onDirectorProcessing={handleDirectorProcessing}
            isLoadingScreenwriter={isLoadingScreenwriter}
            isLoadingDirector={isLoadingDirector}
          />
          <DirectorOutputCard
            directorOutput={directorOutput}
            setDirectorOutput={setDirectorOutput} // Pass setter for direct editing
            onSaveShotsToDatabase={handleSaveShots}
            onGenerateFinalPrompts={handleDirectorOutputCardGeneratePrompts}
            isLoadingDirector={isLoadingDirector}
            isSavingShots={isSavingShots}
            isLoadingFinalPrompts={false} 
          />
        </div>
      </div>

      <FutureAreaCard
        savedShots={savedShots}
        isLoadingSavedShots={isLoadingSavedShots}
        onSelectShot={selectShot}
        selectedShotId={selectedShot?.id}
      />

      {selectedShot && (
        <SelectedShotActionsCard
          selectedShot={selectedShot}
          onGeneratePrompts={generatePromptsForSelectedShot}
          isLoadingPrompts={isLoadingImagePrompts}
          generatedPrompts={generatedImagePrompts}
        />
      )}
    </div>
  );
};

export default DashboardPage;
