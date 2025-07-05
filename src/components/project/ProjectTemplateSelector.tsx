import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Film, Megaphone, Camera, Tv } from 'lucide-react';
import { ProjectTemplate, PROJECT_TEMPLATES } from '@/types/projectTemplate';

interface ProjectTemplateSelectorProps {
  selectedTemplate: ProjectTemplate | null;
  onTemplateSelect: (template: ProjectTemplate) => void;
}

const ProjectTemplateSelector = ({ selectedTemplate, onTemplateSelect }: ProjectTemplateSelectorProps) => {
  const getIcon = (iconName: string) => {
    const icons = {
      FileText,
      Film,
      Megaphone,
      Camera,
      Tv,
    };
    const IconComponent = icons[iconName as keyof typeof icons] || FileText;
    return IconComponent;
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      film: '电影',
      series: '剧集',
      documentary: '纪录片',
      commercial: '广告',
      short: '短片',
    };
    return labels[category as keyof typeof labels] || category;
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">选择项目模板</h3>
        <p className="text-muted-foreground text-sm">
          选择一个模板来快速开始您的项目，或选择空白项目从零开始
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        {PROJECT_TEMPLATES.map((template) => {
          const IconComponent = getIcon(template.icon);
          const isSelected = selectedTemplate?.id === template.id;
          
          return (
            <Card
              key={template.id}
              className={`cursor-pointer transition-colors hover:border-primary/50 ${
                isSelected ? 'border-primary bg-primary/5' : ''
              }`}
              onClick={() => onTemplateSelect(template)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <IconComponent className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">{template.name}</CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {getCategoryLabel(template.category)}
                  </Badge>
                </div>
                <CardDescription className="text-sm">
                  {template.description}
                </CardDescription>
              </CardHeader>
              
              {template.id !== 'blank' && (
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {template.plot && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {template.plot}
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      {template.assets && (
                        <span>{template.assets.length} 个资产</span>
                      )}
                      {template.shots && (
                        <span>{template.shots.length} 个分镜</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectTemplateSelector;