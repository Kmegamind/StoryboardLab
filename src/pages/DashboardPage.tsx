import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

const DashboardPage = () => {
  const { project, isLoadingProject, updateProject } = useProject();
  const navigate = useNavigate();

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
  
  const handleFetchSavedShots = useCallback(() => {
      if (project) {
        fetchSavedShots(project.id);
      }
  }, [project, fetchSavedShots]);
  
  const { isLoadingDirector, isSavingShots, processWithDirectorAgent, saveShotsToDatabase } = useDirectorProcessing({
    onSaveComplete: handleFetchSavedShots,
  });

  useEffect(() => {
    if (project) {
      setPlot(project.plot || '');
      setScreenwriterOutput(project.screenwriter_output || '');
      setDirectorOutput(project.director_output_json || '');
      if(project.status === 'completed' || project.director_output_json) {
        handleFetchSavedShots();
      }
    }
  }, [project, handleFetchSavedShots]);

  const handleProcessPlot = async () => {
    if (!project) return;
    setScreenwriterOutput('');
    setDirectorOutput('');
    clearSelectedShotAndPrompts();
    await updateProject({ plot, screenwriter_output: null, director_output_json: null, status: 'new' });
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

    const result = await processWithDirectorAgent(screenwriterOutput);

    if (result) {
      let accumulatedOutput = result;
      setDirectorOutput(accumulatedOutput);

      try {
        const trimmed = accumulatedOutput.trim();
        // Basic validation to ensure it's likely a JSON array
        if (trimmed && (!trimmed.startsWith('[') || !trimmed.endsWith(']'))) {
           // Attempt to find JSON array within markdown ```json ... ```
          const match = trimmed.match(/```json\s*([\s\S]*?)\s*```/);
          if (match && match[1]) {
            const extractedJson = match[1].trim();
            JSON.parse(extractedJson); // Validate extracted JSON
            accumulatedOutput = extractedJson;
            setDirectorOutput(accumulatedOutput); // Update UI with cleaned JSON
          } else {
            throw new Error("输出不是有效的JSON数组，且未在Markdown代码块中找到。");
          }
        } else if (trimmed) {
           JSON.parse(trimmed); // Validate
        }
        
        await updateProject({ director_output_json: accumulatedOutput, status: 'directing' });
      } catch (e: any) {
        toast({
          title: "警告：导演 Agent 输出内容格式有误",
          description: "AI输出的可能不是标准JSON格式。请在保存前仔细检查并手动编辑。",
          variant: "destructive",
          duration: 9000,
        });
        // Still save the raw output for manual correction
        await updateProject({ director_output_json: accumulatedOutput, status: 'directing' });
      }
    }
  };

  const handleSaveShots = async () => {
    if (!project || !directorOutput) return;
    await updateProject({ director_output_json: directorOutput }); // Save latest edits
    await saveShotsToDatabase(directorOutput, project.id);
    await updateProject({ status: 'completed' });
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        toast({ title: '登出失败', description: error.message, variant: 'destructive' });
    } else {
        navigate('/auth');
    }
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

  const isProcessing = isLoadingScreenwriter || isLoadingDirector || isSavingShots;

  return (
    <div className="container mx-auto px-4 py-8 pt-24 min-h-screen">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-bold text-primary">AI电影创作工作台</h1>
        <p className="text-xl text-muted-foreground mt-2">
          当前项目: <span className="font-semibold">{project.title}</span> (状态: {project.status})
        </p>
        <Button onClick={handleLogout} variant="outline" className="mt-4">登出</Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <PlotInputCard
          plot={plot}
          setPlot={setPlot}
          onProcessPlot={handleProcessPlot}
          isLoadingScreenwriter={isLoadingScreenwriter}
          disabled={isProcessing}
        />

        <div className="md:col-span-2 space-y-8">
          <ScreenwriterOutputCard
            screenwriterOutput={screenwriterOutput}
            setScreenwriterOutput={setScreenwriterOutput}
            onDirectorProcessing={handleDirectorProcessing}
            isLoadingScreenwriter={isLoadingScreenwriter}
            isLoadingDirector={isLoadingDirector}
            disabled={!screenwriterOutput || isProcessing}
          />
          <DirectorOutputCard
            directorOutput={directorOutput}
            setDirectorOutput={setDirectorOutput}
            onSaveShotsToDatabase={handleSaveShots}
            isLoadingDirector={isLoadingDirector}
            isSavingShots={isSavingShots}
            disabled={!directorOutput || isProcessing}
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
