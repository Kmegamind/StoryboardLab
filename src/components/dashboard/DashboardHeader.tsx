
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import { useOptionalAuth } from '@/hooks/useOptionalAuth';

interface DashboardHeaderProps {
  project: any;
  onLogout: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ project }) => {
  const { user, isAuthenticated } = useOptionalAuth();

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-2xl font-bold text-primary">项目工作台</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {isAuthenticated ? (
              <>
                <User className="h-4 w-4" />
                <span>{user?.email}</span>
              </>
            ) : (
              <span>访客模式 - 需要登录才能保存数据</span>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold">项目: {project?.name || '未命名项目'}</p>
            <p className="text-sm text-muted-foreground">
              状态: <span className="capitalize">{project?.status || '新建'}</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardHeader;
