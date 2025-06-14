
import React from 'react';
import { BrainCircuit, Clapperboard, Wand2 } from 'lucide-react'; // Example icons

const Overview = () => {
  return (
    <section id="overview" className="bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary">产品概述</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            CinemaAI Studio 是一款革命性的AI影视创作平台，通过多专家Agent系统将您的故事剧本自动转化为可执行的AI生成指令。
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-8 bg-secondary rounded-xl shadow-xl hover:shadow-primary/20 transition-shadow duration-300 transform hover:-translate-y-1">
            <div className="flex justify-center mb-4">
              <BrainCircuit className="h-16 w-16 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">智能剧本解析</h3>
            <p className="text-muted-foreground">
              输入故事情节，系统智能分析并提取关键元素，为后续生成奠定基础。
            </p>
          </div>
          <div className="p-8 bg-secondary rounded-xl shadow-xl hover:shadow-primary/20 transition-shadow duration-300 transform hover:-translate-y-1">
            <div className="flex justify-center mb-4">
              <Clapperboard className="h-16 w-16 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">专业级输出</h3>
            <p className="text-muted-foreground">
              自动生成角色设计、场景道具提示词、专业分镜头脚本及AI指令。
            </p>
          </div>
          <div className="p-8 bg-secondary rounded-xl shadow-xl hover:shadow-primary/20 transition-shadow duration-300 transform hover:-translate-y-1">
            <div className="flex justify-center mb-4">
              <Wand2 className="h-16 w-16 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">端到端工作流</h3>
            <p className="text-muted-foreground">
              支持ComfyUI批量生产，实现从概念到视觉资产的高效转化。
            </p>
          </div>
        </div>
        <div className="mt-16 text-center">
          <p className="text-2xl font-medium text-foreground">
            核心理念：<span className="text-primary">让专业影视制作能力赋能每位创作者。</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Overview;
