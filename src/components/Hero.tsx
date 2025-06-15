
import React from 'react';
import { FuturisticButton } from '@/components/ui/FuturisticButton'; 
import { PlayCircle } from 'lucide-react';

const Hero = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Gradient Animation */}
      <div className="absolute inset-0 -z-10">
        <div className="relative w-full h-full bg-gradient-to-br from-brand-purple via-brand-pink to-brand-cyan grainy-noise"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-500">
            CinemaAI Studio
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          革命性的AI影视创作平台，将您的故事剧本自动转化为可执行的AI生成指令。
        </p>
        <p className="text-2xl md:text-3xl font-semibold text-primary mb-12">
          让每个故事都能绽放视觉生命力 ✨
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <FuturisticButton size="lg" className="px-8 py-6">
            开始创作
          </FuturisticButton>
          <FuturisticButton variant="outline" size="lg" className="px-8 py-6">
            <PlayCircle className="mr-2 h-5 w-5" />
            观看演示
          </FuturisticButton>
        </div>
        <p className="mt-12 text-sm text-muted-foreground">
          您可以上传一张图片作为背景，让页面更具吸引力。
        </p>
      </div>
    </section>
  );
};

export default Hero;
