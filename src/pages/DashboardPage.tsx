
import React, { useEffect, useState } from 'react';
import { toast } from "@/components/ui/use-toast";
import PlotInputCard from '@/components/dashboard/PlotInputCard';
import ScreenwriterOutputCard from '@/components/dashboard/ScreenwriterOutputCard';
import DirectorOutputCard from '@/components/dashboard/DirectorOutputCard';
import FutureAreaCard from '@/components/dashboard/FutureAreaCard';
import SelectedShotActionsCard from '@/components/dashboard/SelectedShotActionsCard';
import AgentAnalysisCard from '@/components/dashboard/AgentAnalysisCard';
import { Camera, Palette, Loader2 } from 'lucide-react';
import { useProject } from '@/hooks/useProject';
import { usePlotProcessing } from '@/hooks/usePlotProcessing';
import { useDirectorProcessing } from '@/hooks/useDirectorProcessing';
import { useShotManagement } from '@/hooks/useShotManagement';

const DashboardPage = () => {
  const { project, isLoadingProject, updateProject } = useProject();

  const [plot, setPlot] = useState('');
  const [screenwriterOutput, setScreenwriterOutput] = useState('');
  const [directorOutput, setDirectorOutput] = useState('');

  const {
    savedShots,
    isLoadingSavedShots,
    selectedShot,
    generatedImagePrompts,
    isLoadingImagePrompts,
    cinematographerPlan,
    isLoadingCinematographer,
    artDirectorPlan,
    isLoadingArtDirector,
    fetchSavedShots,
    selectShot,
    generatePromptsForSelectedShot,
    generateCinematographerPlan,
    generateArtDirectorPlan,
    clearSelectedShotAndPrompts,
  } = useShotManagement();

  const { isLoadingScreenwriter, processPlotWithScreenwriter } = usePlotProcessing();
  const { isLoadingDirector, isSavingShots, processWithDirectorAgent, saveShotsToDatabase } = useDirectorProcessing({
    onSaveComplete: fetchSavedShots,
  });

  useEffect(() => {
    if (project) {
      setPlot(project.plot || '');
      setScreenwriterOutput(project.screenwriter_output || '');
      setDirectorOutput(project.director_output_json || '');
    }
  }, [project]);

  useEffect(() => {
    fetchSavedShots();
  }, [fetchSavedShots]);

  const handleProcessPlot = async () => {
    if (!project) return;
    setScreenwriterOutput('');
    setDirectorOutput('');
    clearSelectedShotAndPrompts();
    await updateProject({ plot, screenwriter_output: null, director_output_json: null });
    const result = await processPlotWithScreenwriter(plot);
    if (result) {
      setScreenwriterOutput(result);
      await updateProject({ screenwriter_output: result, status: 'writing' });
    }
  };

  const handleDirectorProcessing = async () => {
    if (!project || !screenwriterOutput) return;
    clearSelectedShotAndPrompts();
    setDirectorOutput('');
    await updateProject({ screenwriter_output: screenwriterOutput, director_output_json: null });

    let accumulatedOutput = "";
    await processWithDirectorAgent(
      screenwriterOutput,
      (chunk) => {
        accumulatedOutput += chunk;
        setDirectorOutput(prev => prev + chunk);
      },
      async () => { // onStreamComplete
        try {
          const trimmed = accumulatedOutput.trim();
          if (trimmed && (!trimmed.startsWith('[') || !trimmed.endsWith(']'))) {
            throw new Error("输出不是有效的JSON数组。");
          }
          if(trimmed) JSON.parse(trimmed);
          await updateProject({ director_output_json: accumulatedOutput, status: 'directing' });
        } catch (e: any) {
          toast({
            title: "警告：输出内容格式有误",
            description: e.message || "请在保存前检查并修正。",
            variant: "destructive",
            duration: 9000,
          });
          await updateProject({ director_output_json: accumulatedOutput, status: 'directing' });
        }
      }
    );
  };

  const handleSaveShots = async () => {
    if (!project || !directorOutput) return;
    await updateProject({ director_output_json: directorOutput }); // Save latest edits
    await saveShotsToDatabase(directorOutput, project.id);
    await updateProject({ status: 'completed' });
  };

  if (isLoadingProject) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">正在加载您的创作项目...</p>
      </div>
    );
  }
  
  if (!project) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-lg text-destructive">无法加载项目。请检查您的网络连接并刷新页面。如果您未登录，请先登录。</p>
        </div>
      );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24 min-h-screen">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-bold text-primary">AI电影创作工作台</h1>
        <p className="text-xl text-muted-foreground mt-2">
          当前项目: <span className="font-semibold">{project.title}</span> (状态: {project.status})
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <PlotInputCard
          plot={plot}
          setPlot={setPlot}
          onProcessPlot={handleProcessPlot}
          isLoadingScreenwriter={isLoadingScreenwriter}
          disabled={isLoadingScreenwriter || isLoadingDirector}
        />

        <div className="md:col-span-2 space-y-8">
          <ScreenwriterOutputCard
            screenwriterOutput={screenwriterOutput}
            setScreenwriterOutput={setScreenwriterOutput}
            onDirectorProcessing={handleDirectorProcessing}
            isLoadingScreenwriter={isLoadingScreenwriter}
            isLoadingDirector={isLoadingDirector}
            disabled={!screenwriterOutput || isLoadingScreenwriter || isLoadingDirector}
          />
          <DirectorOutputCard
            directorOutput={directorOutput}
            setDirectorOutput={setDirectorOutput}
            onSaveShotsToDatabase={handleSaveShots}
            isLoadingDirector={isLoadingDirector}
            isSavingShots={isSavingShots}
            disabled={!directorOutput || isLoadingDirector || isSavingShots}
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
        <>
          <SelectedShotActionsCard
            selectedShot={selectedShot}
            onGeneratePrompts={generatePromptsForSelectedShot}
            isLoadingPrompts={isLoadingImagePrompts}
            generatedPrompts={generatedImagePrompts}
            onGenerateCinematographerPlan={generateCinematographerPlan}
            isLoadingCinematographer={isLoadingCinematographer}
            onGenerateArtDirectorPlan={generateArtDirectorPlan}
            isLoadingArtDirector={isLoadingArtDirector}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <AgentAnalysisCard 
              title="摄像 Agent 方案"
              isLoading={isLoadingCinematographer}
              analysis={cinematographerPlan}
              icon={<Camera className="h-6 w-6 text-primary" />}
            />
            <AgentAnalysisCard 
              title="美术指导 Agent 方案"
              isLoading={isLoadingArtDirector}
              analysis={artDirectorPlan}
              icon={<Palette className="h-6 w-6 text-primary" />}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
