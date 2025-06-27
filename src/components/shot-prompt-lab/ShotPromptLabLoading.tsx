
import React from 'react';
import { Loader2 } from 'lucide-react';
import ShotPromptLabLayout from './ShotPromptLabLayout';

const ShotPromptLabLoading: React.FC = () => {
  return (
    <ShotPromptLabLayout>
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4">正在加载分镜详情...</p>
      </div>
    </ShotPromptLabLayout>
  );
};

export default ShotPromptLabLoading;
