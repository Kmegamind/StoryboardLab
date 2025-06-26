
import React from 'react';
import { Button } from '@/components/ui/button'; 
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Gradient Animation */}
      <div className="absolute inset-0 -z-10">
        <div className="relative w-full h-full bg-gradient-to-br from-primary/20 via-primary/10 to-primary/20 grainy-noise"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-7xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-primary/80">
            CinemaAI Studio
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          {t('hero.subtitle', '革命性的AI影视创作平台，将您的故事剧本自动转化为可执行的AI生成指令。')}
        </p>
        <p className="text-2xl md:text-3xl font-medium text-primary mb-12">
          {t('hero.tagline', '让每个故事都能绽放视觉生命力')} ✨
        </p>
        <div className="flex justify-center items-center">
          <Button size="lg" asChild className="btn-primary hover-lift">
            <Link to="/dashboard">{t('hero.cta.start', '开始创作')}</Link>
          </Button>
        </div>
        <p className="mt-12 text-sm text-muted-foreground">
          {t('hero.imageUploadHint', '您可以上传一张图片作为背景，让页面更具吸引力。')}
        </p>
      </div>
    </section>
  );
};

export default Hero;
