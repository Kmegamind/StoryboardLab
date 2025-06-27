
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PlotInputCard from '@/components/dashboard/PlotInputCard';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import LoginPromptDialog from '@/components/LoginPromptDialog';
import { useOptionalAuth } from '@/hooks/useOptionalAuth';
import { Loader2 } from 'lucide-react';

const PublicDashboardPage = () => {
  const { user, loading } = useOptionalAuth();
  const [plot, setPlot] = useState('');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleProcessPlot = () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    // 如果已登录，跳转到完整工作台
    window.location.href = '/dashboard';
  };

  const handleContinueWithoutLogin = () => {
    setShowLoginPrompt(false);
    // 这里可以实现不登录的临时体验功能
    // 暂时只是关闭对话框
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-lg">正在加载...</p>
        </div>
      </div>
    );
  }

  // 如果已登录，直接跳转到完整工作台
  if (user) {
    window.location.href = '/dashboard';
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">分镜实验室</h1>
          <p className="text-lg text-muted-foreground">
            开始您的AI影视创作之旅
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <PlotInputCard
            plot={plot}
            setPlot={setPlot}
            onProcessPlot={handleProcessPlot}
            isLoadingScreenwriter={false}
            disabled={false}
          />
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground mb-4">
            已有账户？
          </p>
          <Button asChild variant="outline">
            <Link to="/auth">登录/注册</Link>
          </Button>
        </div>
      </div>

      <LoginPromptDialog
        open={showLoginPrompt}
        onOpenChange={setShowLoginPrompt}
        onContinueWithoutLogin={handleContinueWithoutLogin}
      />
    </div>
  );
};

export default PublicDashboardPage;
