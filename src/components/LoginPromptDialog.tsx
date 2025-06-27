
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { UserPlus, ArrowRight } from 'lucide-react';

interface LoginPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinueWithoutLogin: () => void;
}

const LoginPromptDialog: React.FC<LoginPromptDialogProps> = ({
  open,
  onOpenChange,
  onContinueWithoutLogin,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            建议登录保存作品
          </DialogTitle>
          <DialogDescription>
            登录后可以保存您的创作内容，享受完整的多Agent协作功能，包括编剧、导演、摄像和美术等专业团队服务。
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 pt-4">
          <Button asChild className="w-full">
            <Link to="/auth">
              <UserPlus className="mr-2 h-4 w-4" />
              登录/注册保存作品
            </Link>
          </Button>
          <Button 
            variant="outline" 
            onClick={onContinueWithoutLogin}
            className="w-full"
          >
            <ArrowRight className="mr-2 h-4 w-4" />
            继续创作（不保存）
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          💡 登录后可使用完整的AI影视创作工作台
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default LoginPromptDialog;
