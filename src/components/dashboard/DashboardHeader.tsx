
import React from 'react';
import { Button } from '@/components/ui/button';
import { Project } from '@/hooks/useProject';

interface DashboardHeaderProps {
  project: Project;
  onLogout: () => void;
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'new': return '新建';
    case 'writing': return '编剧中';
    case 'directing': return '导演中';
    case 'completed': return '已完成';
    default: return status;
  }
};

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ project, onLogout }) => {
  return (
    <header className="mb-12 text-center">
      <h1 className="text-5xl font-bold text-primary">AI影视创作工作台</h1>
      <p className="text-xl text-muted-foreground mt-2">
        当前项目: <span className="font-semibold">{project.title}</span> (状态: {getStatusText(project.status)})
      </p>
      <Button onClick={onLogout} variant="outline" className="mt-4">退出登录</Button>
    </header>
  );
};

export default DashboardHeader;
