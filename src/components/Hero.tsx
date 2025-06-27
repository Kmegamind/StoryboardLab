
import React from 'react';
import { Button } from '@/components/ui/button'; 
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-black">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 -z-10">
        <div className="relative w-full h-full bg-gradient-to-br from-black via-gray-900 to-black"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-500">
            分镜实验室
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
          革命性的AI影视创作平台，将您的故事剧本自动转化为可执行的AI生成指令。
        </p>
        <p className="text-2xl md:text-3xl font-semibold text-primary mb-12">
          让每个故事都能绽放视觉生命力 ✨
        </p>
        <div className="flex justify-center items-center">
          <Button size="lg" asChild>
            <Link to="/create">开始创作</Link>
          </Button>
        </div>
        <p className="mt-12 text-sm text-gray-400">
          无需登录即可体验AI创作，登录后可保存您的作品
        </p>
      </div>
    </section>
  );
};

export default Hero;
