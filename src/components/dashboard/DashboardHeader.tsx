
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Project } from '@/hooks/useProject';

interface DashboardHeaderProps {
  project: Project;
  onLogout: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ project, onLogout }) => {
  const { t } = useTranslation();
  return (
    <header className="mb-12 text-center">
      <h1 className="text-5xl font-bold text-primary">{t('dashboardHeader.title')}</h1>
      <p className="text-xl text-muted-foreground mt-2">
        {t('dashboardHeader.currentProject')}: <span className="font-semibold">{project.title}</span> ({t('dashboardHeader.status')}: {project.status})
      </p>
      <Button onClick={onLogout} variant="outline" className="mt-4">{t('dashboardHeader.logout')}</Button>
    </header>
  );
};

export default DashboardHeader;
