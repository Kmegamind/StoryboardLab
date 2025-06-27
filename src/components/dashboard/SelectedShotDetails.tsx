
import React from 'react';
import SelectedShotActionsCard from '@/components/dashboard/SelectedShotActionsCard';
import { Tables } from '@/integrations/supabase/types';

export type Shot = Tables<'structured_shots'>;

interface SelectedShotDetailsProps {
    selectedShot: Shot;
}

const SelectedShotDetails: React.FC<SelectedShotDetailsProps> = ({
    selectedShot,
}) => {
    return (
        <SelectedShotActionsCard selectedShot={selectedShot} />
    );
};

export default SelectedShotDetails;
