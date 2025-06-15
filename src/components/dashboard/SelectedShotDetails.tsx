
import React from 'react';
import SelectedShotActionsCard from '@/components/dashboard/SelectedShotActionsCard';
import AgentAnalysisCard from '@/components/dashboard/AgentAnalysisCard';
import { Camera, Palette } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

export type Shot = Tables<'structured_shots'>;

interface SelectedShotDetailsProps {
    selectedShot: Shot;
    onGeneratePrompts: () => void;
    isLoadingPrompts: boolean;
    generatedPrompts: any;
    onGenerateCinematographerPlan: () => void;
    isLoadingCinematographer: boolean;
    cinematographerPlan: string | null;
    onGenerateArtDirectorPlan: () => void;
    isLoadingArtDirector: boolean;
    artDirectorPlan: string | null;
}

const SelectedShotDetails: React.FC<SelectedShotDetailsProps> = ({
    selectedShot,
    onGeneratePrompts,
    isLoadingPrompts,
    generatedPrompts,
    onGenerateCinematographerPlan,
    isLoadingCinematographer,
    cinematographerPlan,
    onGenerateArtDirectorPlan,
    isLoadingArtDirector,
    artDirectorPlan,
}) => {
    return (
        <>
            <SelectedShotActionsCard
                selectedShot={selectedShot}
                onGeneratePrompts={onGeneratePrompts}
                isLoadingPrompts={isLoadingPrompts}
                generatedPrompts={generatedPrompts}
                onGenerateCinematographerPlan={onGenerateCinematographerPlan}
                isLoadingCinematographer={isLoadingCinematographer}
                onGenerateArtDirectorPlan={onGenerateArtDirectorPlan}
                isLoadingArtDirector={isLoadingArtDirector}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <AgentAnalysisCard
                    title="摄像 Agent 方案"
                    isLoading={isLoadingCinematographer}
                    analysis={cinematographerPlan}
                    icon={<Camera className="h-6 w-6 text-primary" />}
                />
                <AgentAnalysisCard
                    title="美术指导 Agent 方案"
                    isLoading={isLoadingArtDirector}
                    analysis={artDirectorPlan}
                    icon={<Palette className="h-6 w-6 text-primary" />}
                />
            </div>
        </>
    );
};

export default SelectedShotDetails;
