
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";
import { ProjectAssetsCard } from '@/components/dashboard/ProjectAssetsCard';
import FutureAreaCard from '@/components/dashboard/FutureAreaCard';
import ArchivedShotsList from '@/components/dashboard/ArchivedShotsList';
import { Loader2 } from 'lucide-react';
import { useProject } from '@/hooks/useProject';
import { usePlotProcessing } from '@/hooks/usePlotProcessing';
import { useDirectorProcessing } from '@/hooks/useDirectorProcessing';
import { useShotManagement } from '@/hooks/useShotManagement';
import { useProjectAssets } from '@/hooks/useProjectAssets';
import { supabase } from '@/integrations/supabase/client';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ProcessingPipeline from '@/components/dashboard/ProcessingPipeline';
import SelectedShotDetails from '@/components/dashboard/SelectedShotDetails';
import { useTranslation } from 'react-i18next';

const DashboardPage = () => {
  const { t } = useTranslation();
  const { project, isLoadingProject, updateProject } = useProject();
  const navigate = useNavigate();

  const [plot, setPlot] = useState('');
  const [screenwriterOutput, setScreenwriterOutput] = useState('');
  const [directorOutput, setDirectorOutput] = useState('');

  const {
    savedShots,
    archivedShots,
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
    toggleShotArchiveStatus,
    generatePromptsForSelectedShot,
    generateCinematographerPlan,
    generateArtDirectorPlan,
    clearSelectedShotAndPrompts,
  } = useShotManagement();

  const { isLoadingScreenwriter, processPlotWithScreenwriter } = usePlotProcessing();
  
  const {
    assets,
    isLoadingAssets,
    addAsset,
    updateAsset,
    deleteAsset,
  } = useProjectAssets(project?.id);
  
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
          title: t('dashboardPage.directorOutputWarningTitle'),
          description: t('dashboardPage.directorOutputWarningDescription'),
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
        <p className="ml-4 text-lg">{t('dashboardPage.loading')}</p>
      </div>
    );
  }
  
  if (!project) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-lg text-destructive">{t('dashboardPage.loadError')}</p>
        </div>
      );
  }

  const isProcessing = isLoadingScreenwriter || isLoadingDirector || isSavingShots;

  return (
    <div className="container mx-auto px-4 py-8 pt-24 min-h-screen">
      <DashboardHeader project={project} onLogout={handleLogout} />

      <ProcessingPipeline
        plot={plot}
        setPlot={setPlot}
        onProcessPlot={handleProcessPlot}
        isLoadingScreenwriter={isLoadingScreenwriter}
        screenwriterOutput={screenwriterOutput}
        setScreenwriterOutput={setScreenwriterOutput}
        onDirectorProcessing={handleDirectorProcessing}
        isLoadingDirector={isLoadingDirector}
        directorOutput={directorOutput}
        setDirectorOutput={setDirectorOutput}
        onSaveShotsToDatabase={handleSaveShots}
        isSavingShots={isSavingShots}
        isProcessing={isProcessing}
      />

      <ProjectAssetsCard
        assets={assets}
        isLoading={isLoadingAssets}
        onAddAsset={addAsset}
        onUpdateAsset={updateAsset}
        onDeleteAsset={deleteAsset}
      />

      <FutureAreaCard
        savedShots={savedShots}
        isLoadingSavedShots={isLoadingSavedShots}
        onSelectShot={selectShot}
        selectedShotId={selectedShot?.id}
        onToggleArchive={toggleShotArchiveStatus}
      />

      <ArchivedShotsList
        archivedShots={archivedShots}
        onToggleArchive={toggleShotArchiveStatus}
      />

      {selectedShot && (
        <SelectedShotDetails
          selectedShot={selectedShot}
          onGeneratePrompts={generatePromptsForSelectedShot}
          isLoadingPrompts={isLoadingImagePrompts}
          generatedPrompts={generatedImagePrompts}
          onGenerateCinematographerPlan={generateCinematographerPlan}
          isLoadingCinematographer={isLoadingCinematographer}
          cinematographerPlan={cinematographerPlan}
          onGenerateArtDirectorPlan={generateArtDirectorPlan}
          isLoadingArtDirector={isLoadingArtDirector}
          artDirectorPlan={artDirectorPlan}
        />
      )}
    </div>
  );
};

export default DashboardPage;
