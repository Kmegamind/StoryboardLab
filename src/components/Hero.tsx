
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-black">
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
          将您的故事剧本自动转化为可执行的AI生成指令
        </p>
        <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
          输入故事情节 → AI智能分析 → 生成专业分镜脚本 → 一键导出视觉指令
        </p>
        <div className="flex justify-center items-center">
          <Button size="lg" asChild>
            <Link to="/projects">开始创作</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
