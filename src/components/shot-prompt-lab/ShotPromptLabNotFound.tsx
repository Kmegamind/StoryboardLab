
import React from 'react';
import ShotPromptLabLayout from './ShotPromptLabLayout';

const ShotPromptLabNotFound: React.FC = () => {
  return (
    <ShotPromptLabLayout>
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-muted-foreground">分镜不存在</p>
      </div>
    </ShotPromptLabLayout>
  );
};

export default ShotPromptLabNotFound;
