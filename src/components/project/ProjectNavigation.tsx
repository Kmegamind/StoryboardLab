import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { ChevronLeft, FileText, Settings, Eye, Zap } from 'lucide-react';
import { Project } from '@/hooks/useProject';

interface ProjectNavigationProps {
  project: Project;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ProjectNavigation = ({ project, activeTab, onTabChange }: ProjectNavigationProps) => {
  const location = useLocation();

  const tabs = [
    { id: 'plot', label: '情节处理', icon: FileText },
    { id: 'pipeline', label: 'AI流水线', icon: Zap },
    { id: 'shots', label: '分镜管理', icon: Eye },
    { id: 'assets', label: '资产管理', icon: Settings },
  ];

  return (
    <div className="space-y-4 mb-8">
      {/* 面包屑导航 */}
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/projects" className="flex items-center">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  我的项目
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className="font-medium">{project.title}</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* 快速跳转功能 */}
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/visual-overview?project=${project.id}`}>
              <Eye className="h-4 w-4 mr-2" />
              可视化总览
            </Link>
          </Button>
        </div>
      </div>

      {/* 项目信息栏 */}
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{project.title}</h1>
            <p className="text-muted-foreground">
              状态: {project.status === 'new' ? '新建' : 
                    project.status === 'writing' ? '编剧中' : 
                    project.status === 'directing' ? '导演中' : '已完成'}
              {project.updated_at && (
                <span className="ml-4">
                  更新于 {new Date(project.updated_at).toLocaleDateString('zh-CN')}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* 标签导航 */}
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center space-x-2">
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default ProjectNavigation;