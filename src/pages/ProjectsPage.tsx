import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOptionalAuth } from '@/hooks/useOptionalAuth';
import { useProjects } from '@/hooks/useProjects';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Plus, Loader2, FolderOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import ProjectTemplateSelector from '@/components/project/ProjectTemplateSelector';
import { ProjectTemplate, PROJECT_TEMPLATES } from '@/types/projectTemplate';

const ProjectsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useOptionalAuth();
  const { projects, isLoading, createProject, deleteProject } = useProjects();
  
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(PROJECT_TEMPLATES[0]);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateProject = async () => {
    if (!newProjectTitle.trim()) {
      toast({
        title: '项目名称不能为空',
        description: '请输入有效的项目名称',
        variant: 'destructive',
      });
      return;
    }

    if (!selectedTemplate) {
      toast({
        title: '请选择项目模板',
        description: '请选择一个项目模板来创建项目',
        variant: 'destructive',
      });
      return;
    }

    setIsCreating(true);
    try {
      const project = await createProject(newProjectTitle.trim(), selectedTemplate);
      if (project) {
        setShowCreateDialog(false);
        setNewProjectTitle('');
        setSelectedTemplate(PROJECT_TEMPLATES[0]);
        navigate(`/project/${project.id}`);
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleOpenProject = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'new': { label: '新建', variant: 'secondary' as const },
      'writing': { label: '编剧中', variant: 'default' as const },
      'directing': { label: '导演中', variant: 'default' as const },
      'completed': { label: '已完成', variant: 'outline' as const },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.new;
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="container mx-auto px-4 py-8 pt-24">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">
                请登录以查看您的项目
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">我的项目</h1>
              <p className="text-muted-foreground">管理您的创意项目</p>
            </div>
            
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  新建项目
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>创建新项目</DialogTitle>
                  <DialogDescription>
                    选择模板并为您的创意项目起一个名字
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <ProjectTemplateSelector
                    selectedTemplate={selectedTemplate}
                    onTemplateSelect={setSelectedTemplate}
                  />
                  
                  <div>
                    <Label htmlFor="project-title">项目名称</Label>
                    <Input
                      id="project-title"
                      value={newProjectTitle}
                      onChange={(e) => setNewProjectTitle(e.target.value)}
                      placeholder="输入项目名称..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleCreateProject();
                        }
                      }}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateDialog(false)}
                  >
                    取消
                  </Button>
                  <Button
                    onClick={handleCreateProject}
                    disabled={isCreating}
                  >
                    {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    创建项目
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Separator className="mb-8" />

          {/* Projects Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="ml-4 text-lg">正在加载项目...</p>
            </div>
          ) : projects.length === 0 ? (
            <Card className="p-12 text-center">
              <CardContent>
                <FolderOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">还没有项目</h3>
                <p className="text-muted-foreground mb-6">
                  创建您的第一个项目来开始使用AI影视创作工具
                </p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  创建第一个项目
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card 
                  key={project.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleOpenProject(project.id)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg truncate pr-2">
                        {project.title}
                      </CardTitle>
                      {getStatusBadge(project.status)}
                    </div>
                    <CardDescription className="text-sm">
                      创建于 {formatDate(project.created_at)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {project.plot && (
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {project.plot}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>更新于 {formatDate(project.updated_at)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;