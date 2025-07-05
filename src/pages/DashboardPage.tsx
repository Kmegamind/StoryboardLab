import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';
import { useProject } from '@/hooks/useProject';
import { usePlotProcessing } from '@/hooks/usePlotProcessing';
import { useDirectorProcessing } from '@/hooks/useDirectorProcessing';
import { useShotManagement } from '@/hooks/useShotManagement';
import { useProjectAssets } from '@/hooks/useProjectAssets';
import { useOptionalAuth } from '@/hooks/useOptionalAuth';
import { supabase } from '@/integrations/supabase/client';
import SelectedShotDetails from '@/components/dashboard/SelectedShotDetails';
import LoginPromptDialog from '@/components/LoginPromptDialog';
import Navbar from '@/components/Navbar';
import ProjectNavigation from '@/components/project/ProjectNavigation';
import PlotProcessingModule from '@/components/project/PlotProcessingModule';
import AIPipelineModule from '@/components/project/AIPipelineModule';
import ShotsManagementModule from '@/components/project/ShotsManagementModule';
import AssetsManagementModule from '@/components/project/AssetsManagementModule';

const DashboardPage = () => {
  const { id: projectId } = useParams();
  const { user, isAuthenticated } = useOptionalAuth();
  const { project, isLoadingProject, updateProject } = useProject(projectId);
  const navigate = useNavigate();

  // 模块化状态
  const [activeTab, setActiveTab] = useState('plot');
  const [plot, setPlot] = useState('');
  const [screenwriterOutput, setScreenwriterOutput] = useState('');
  const [directorOutput, setDirectorOutput] = useState('');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const {
    savedShots,
    archivedShots,
    isLoadingSavedShots,
    selectedShot,
    fetchSavedShots,
    selectShot,
    toggleShotArchiveStatus,
    clearSelectedShotAndPrompts,
  } = useShotManagement();

  const { isLoadingScreenwriter, processPlotWithScreenwriter } = usePlotProcessing();
  
  const {
    assets,
    isLoadingAssets,
    addAsset,
    updateAsset,
    deleteAsset,
  } = useProjectAssets(isAuthenticated ? project?.id : undefined);
  
  const handleFetchSavedShots = useCallback(() => {
      if (project && isAuthenticated) {
        fetchSavedShots(project.id);
      }
  }, [project, fetchSavedShots, isAuthenticated]);
  
  const { isLoadingDirector, isSavingShots, processWithDirectorAgent, saveShotsToDatabase } = useDirectorProcessing({
    onSaveComplete: handleFetchSavedShots,
  });

  // 根据项目状态自动切换到合适的标签
  useEffect(() => {
    if (project) {
      setPlot(project.plot || '');
      setScreenwriterOutput(project.screenwriter_output || '');
      setDirectorOutput(project.director_output_json || '');
      
      // 自动切换到合适的标签
      if (project.status === 'completed' || project.director_output_json) {
        setActiveTab('shots');
      } else if (project.status === 'directing' || project.screenwriter_output) {
        setActiveTab('pipeline');
      } else {
        setActiveTab('plot');
      }
      
      if((project.status === 'completed' || project.director_output_json) && isAuthenticated) {
        handleFetchSavedShots();
      }
    }
  }, [project, handleFetchSavedShots, isAuthenticated]);

  const checkAuthAndProceed = (action: () => void) => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    action();
  };

  const handleProcessPlot = async () => {
    checkAuthAndProceed(async () => {
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
    });
  };

  const handleDirectorProcessing = async () => {
    checkAuthAndProceed(async () => {
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
            title: '警告：导演智能体输出格式不正确',
            description: 'AI输出可能不是标准JSON格式。请检查并手动编辑后再保存。',
            variant: "destructive",
            duration: 9000,
          });
          // Still save the raw output for manual correction
          await updateProject({ director_output_json: accumulatedOutput, status: 'directing' });
        }
      }
    });
  };

  const handleSaveShots = async () => {
    checkAuthAndProceed(async () => {
      if (!project || !directorOutput) return;
      await updateProject({ director_output_json: directorOutput }); // Save latest edits
      await saveShotsToDatabase(directorOutput, project.id);
      await updateProject({ status: 'completed' });
    });
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        toast({ title: '退出登录失败', description: error.message, variant: 'destructive' });
    } else {
        navigate('/auth');
    }
  };

  const handleContinueWithoutLogin = () => {
    setShowLoginPrompt(false);
    toast({
      title: "提示",
      description: "您可以查看界面，但需要登录才能使用AI功能和保存数据。",
      duration: 4000,
    });
  };

  if (isLoadingProject) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-lg">正在加载您的项目...</p>
        </div>
      </div>
    );
  }
  
  if (!project) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <p className="text-lg text-muted-foreground mb-4">项目加载失败，请刷新页面重试</p>
          </div>
        </div>
      </div>
    );
  }

  const isProcessing = isLoadingScreenwriter || isLoadingDirector || isSavingShots;

  // 渲染当前活跃的模块
  const renderActiveModule = () => {
    switch (activeTab) {
      case 'plot':
        return (
          <PlotProcessingModule
            plot={plot}
            setPlot={setPlot}
            onProcessPlot={handleProcessPlot}
            isLoadingScreenwriter={isLoadingScreenwriter}
            screenwriterOutput={screenwriterOutput}
            setScreenwriterOutput={setScreenwriterOutput}
            isProcessing={isProcessing}
          />
        );
      case 'pipeline':
        return (
          <AIPipelineModule
            screenwriterOutput={screenwriterOutput}
            directorOutput={directorOutput}
            setDirectorOutput={setDirectorOutput}
            onDirectorProcessing={handleDirectorProcessing}
            onSaveShotsToDatabase={handleSaveShots}
            isLoadingDirector={isLoadingDirector}
            isSavingShots={isSavingShots}
            isProcessing={isProcessing}
          />
        );
      case 'shots':
        return (
          <ShotsManagementModule
            savedShots={savedShots}
            archivedShots={archivedShots}
            isLoadingSavedShots={isLoadingSavedShots}
            selectedShot={selectedShot}
            onSelectShot={selectShot}
            onToggleArchive={toggleShotArchiveStatus}
            projectId={project?.id || ''}
          />
        );
      case 'assets':
        return (
          <AssetsManagementModule
            assets={assets}
            isLoading={isLoadingAssets}
            onAddAsset={addAsset}
            onUpdateAsset={updateAsset}
            onDeleteAsset={deleteAsset}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24">
        <ProjectNavigation
          project={project}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {renderActiveModule()}

        {selectedShot && (
          <div className="mt-8">
            <SelectedShotDetails selectedShot={selectedShot} />
          </div>
        )}

        <LoginPromptDialog
          open={showLoginPrompt}
          onOpenChange={setShowLoginPrompt}
          onContinueWithoutLogin={handleContinueWithoutLogin}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
