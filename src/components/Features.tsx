
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, FileText, Sparkles, Settings2 } from 'lucide-react';

const Features = () => {
  const { t } = useTranslation();

  const featuresData = [
    {
      icon: FileText,
      title: t('features.storyScript.title', '故事剧本转化系统'),
      description: t('features.storyScript.description', '支持多种输入格式，智能解析剧本，生成初步预览报告。'),
    },
    {
      icon: Users,
      title: t('features.multiAgent.title', '多专家Agent协作'),
      description: t('features.multiAgent.description', '编剧、导演、摄像、美术Agent协同工作，产出专业级创作指令。'),
    },
    {
      icon: Sparkles,
      title: t('features.promptFactory.title', '提示词工厂系统'),
      description: t('features.promptFactory.description', '动态提示词模板引擎，为角色、场景生成高度优化的视觉提示词。'),
    },
    {
      icon: Settings2,
      title: t('features.comfyUI.title', 'ComfyUI自动化流水线'),
      description: t('features.comfyUI.description', '实现角色多角度、多表情的批量化、标准化视觉资产生成。'),
    },
  ];

  return (
    <section id="features" className="bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary">{t('features.title', '核心功能')}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('features.subtitle', '探索 CinemaAI Studio 强大的功能集，助力您的影视创作之旅。')}
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {featuresData.map((feature, index) => (
            <div key={index} className="flex items-start p-6 bg-secondary rounded-lg shadow-lg hover:shadow-primary/10 transition-shadow duration-300">
              <div className="flex-shrink-0 mr-6">
                <feature.icon className="h-12 w-12 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
