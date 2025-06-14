
import React from 'react';
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui Button is available
import { PlayCircle } from 'lucide-react';

const Hero = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Gradient Animation */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 animate-gradient-xy"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
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
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
            开始创作
          </Button>
          <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10 px-8 py-6 text-lg rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
            <PlayCircle className="mr-2 h-5 w-5" />
            观看演示
          </Button>
        </div>
        <p className="mt-12 text-sm text-muted-foreground">
          如果您有手册中提到的 `cinemaai-banner.png` 图片，请上传它，我可以将其设置为更具吸引力的背景。
        </p>
      </div>
      <style jsx global>{`
        @keyframes gradient-xy {
          0%, 100% {
            background-size: 400% 400%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        .animate-gradient-xy {
          animation: gradient-xy 15s ease infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;
