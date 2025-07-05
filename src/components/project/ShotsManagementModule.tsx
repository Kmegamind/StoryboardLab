import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Archive, ArchiveRestore, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Shot {
  id: string;
  shot_number: string;
  scene_content: string;
  shot_type: string;
  is_archived: boolean;
  created_at: string;
}

interface ShotsManagementModuleProps {
  savedShots: Shot[];
  archivedShots: Shot[];
  isLoadingSavedShots: boolean;
  selectedShot: Shot | null;
  onSelectShot: (shot: Shot) => void;
  onToggleArchive: (shot: Shot) => void;
  projectId: string;
}

const ShotsManagementModule = ({
  savedShots,
  archivedShots,
  isLoadingSavedShots,
  selectedShot,
  onSelectShot,
  onToggleArchive,
  projectId,
}: ShotsManagementModuleProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* 分镜管理工具栏 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5" />
            <span>分镜管理</span>
          </CardTitle>
          <CardDescription>
            管理项目中的所有分镜，支持查看、编辑和归档操作
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Badge variant="outline">
                活跃分镜: {savedShots.length}
              </Badge>
              <Badge variant="secondary">
                已归档: {archivedShots.length}
              </Badge>
            </div>
            <Button asChild variant="outline">
              <Link to={`/visual-overview?project=${projectId}`}>
                <Eye className="h-4 w-4 mr-2" />
                可视化总览
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 活跃分镜列表 */}
      <Card>
        <CardHeader>
          <CardTitle>活跃分镜</CardTitle>
          <CardDescription>
            当前项目中的活跃分镜列表
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingSavedShots ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>加载分镜中...</span>
            </div>
          ) : savedShots.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>暂无活跃分镜</p>
              <p className="text-sm">完成AI流水线处理后，分镜将显示在这里</p>
            </div>
          ) : (
            <div className="space-y-3">
              {savedShots.map((shot) => (
                <div
                  key={shot.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedShot?.id === shot.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => onSelectShot(shot)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline">
                          分镜 {shot.shot_number}
                        </Badge>
                        {shot.shot_type && (
                          <Badge variant="secondary">
                            {shot.shot_type}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {shot.scene_content}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        创建于 {formatDate(shot.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                      >
                        <Link to={`/shot-lab/${shot.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleArchive(shot);
                        }}
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 已归档分镜 */}
      {archivedShots.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Archive className="h-5 w-5" />
              <span>已归档分镜</span>
            </CardTitle>
            <CardDescription>
              已归档的分镜列表，可以恢复到活跃状态
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {archivedShots.map((shot) => (
                <div
                  key={shot.id}
                  className="p-4 border rounded-lg opacity-75"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline">
                          分镜 {shot.shot_number}
                        </Badge>
                        {shot.shot_type && (
                          <Badge variant="secondary">
                            {shot.shot_type}
                          </Badge>
                        )}
                        <Badge variant="destructive">已归档</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {shot.scene_content}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleArchive(shot)}
                    >
                      <ArchiveRestore className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ShotsManagementModule;