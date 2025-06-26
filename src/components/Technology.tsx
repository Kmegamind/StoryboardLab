
import React from 'react';
import { Cpu, Layers, Share2, BarChartBig } from 'lucide-react'; // Replaced pie chart with BarChartBig

const techHighlights = [
  {
    icon: Cpu,
    title: '多Agent协作架构',
    description: '基于LangChain和Claude 3.5构建，实现高度智能化的多Agent协作框架。',
  },
  {
    icon: Layers,
    title: '动态提示词工程',
    description: '采用Jinja2和自定义语法树，生成高度定制化和优化的提示词。',
  },
  {
    icon: Share2,
    title: 'ComfyUI自动化',
    description: '深度集成ComfyUI工作流，实现视觉资产的批量化、标准化生产。',
  },
  {
    icon: BarChartBig, // Placeholder for AI service distribution visualization
    title: '整合多种AI服务',
    description: '有效整合Stable Diffusion, Vidu视频生成等多种AI能力，提供一站式解决方案。',
  },
];

const Technology = () => {
  return (
    <section id="technology" className="bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary">技术亮点</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            CinemaAI Studio 由前沿技术驱动，确保高效与创新的完美结合。
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-10">
          {techHighlights.map((tech, index) => (
            <div key={index} className="bg-secondary p-8 rounded-xl shadow-xl hover:shadow-primary/20 transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <tech.icon className="h-10 w-10 text-primary mr-4" />
                <h3 className="text-2xl font-semibold text-foreground">{tech.title}</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">{tech.description}</p>
            </div>
          ))}
        </div>
         <p className="mt-12 text-center text-sm text-muted-foreground">
          产品手册中提及的系统架构图、ComfyUI流程图和AI服务分布饼图，由于其复杂性，暂未在此页面直接展示。后续可以考虑将其作为静态图片或交互元素加入。
        </p>
      </div>
    </section>
  );
};

export default Technology;
