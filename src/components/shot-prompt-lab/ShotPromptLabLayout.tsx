
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Tables } from '@/integrations/supabase/types';

type Shot = Tables<'structured_shots'>;

interface ShotPromptLabLayoutProps {
  children: React.ReactNode;
  shot?: Shot;
}

const ShotPromptLabLayout: React.FC<ShotPromptLabLayoutProps> = ({ children, shot }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回仪表板
          </Button>
          {shot && (
            <h1 className="text-3xl font-bold">
              Prompt Lab - 分镜 {shot.shot_number}
              {shot.perspective_type === 'perspective' && (
                <span className="text-lg text-muted-foreground ml-2">
                  ({shot.perspective_name})
                </span>
              )}
            </h1>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};

export default ShotPromptLabLayout;
