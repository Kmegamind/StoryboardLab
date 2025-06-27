
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/auth');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>登录以保存您的创作</DialogTitle>
          <DialogDescription>
            登录后可以保存您的创作内容，随时查看和编辑您的项目。
            您也可以选择不登录继续创作，但内容将不会被保存。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={onContinueWithoutLogin}>
            暂不登录，继续创作
          </Button>
          <Button onClick={handleLogin}>
            登录保存内容
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LoginPromptDialog;
