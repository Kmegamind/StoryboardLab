
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Save, RotateCcw, Settings } from 'lucide-react';

interface AgentConfig {
  name: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  description: string;
}

const TestAgentsPage = () => {
  const { t } = useTranslation();
  
  const [agentConfigs, setAgentConfigs] = useState<Record<string, AgentConfig>>({
    screenwriter: {
      name: '编剧 Agent',
      systemPrompt: `你是一位才华横溢的电影编剧，尤其擅长创作不同风格的影视作品。请根据用户提供的故事梗概或情节，创作一段富有叙事性、包含场景描述、角色行为和对话的初步剧本。请注重故事的流畅性和画面的想象力，你的输出将交给导演进行进一步的专业处理和分镜设计。`,
      temperature: 0.8,
      maxTokens: 2000,
      description: '负责将故事梗概转化为初步剧本'
    },
    director: {
      name: '导演 Agent',
      systemPrompt: `你是一位经验丰富的电影导演，擅长将剧本分解为具体的拍摄指令。请将用户提供的剧本内容转化为结构化的分镜列表，以JSON格式输出。每个分镜应包含：shot_number（镜头编号）、scene_description（场景描述）、camera_angle（机位角度）、character_actions（角色动作）、dialogue（对话）等字段。确保输出格式严格遵循JSON标准。`,
      temperature: 0.7,
      maxTokens: 3000,
      description: '将剧本转化为结构化分镜列表'
    },
    cinematographer: {
      name: '摄像 Agent',
      systemPrompt: `你是一位专业的电影摄影师，负责为每个分镜提供详细的拍摄方案。包括镜头类型、运动方式、光线设置、色彩基调等技术细节。请为每个镜头提供具体可执行的摄影指导。`,
      temperature: 0.6,
      maxTokens: 1500,
      description: '为分镜提供专业摄影指导'
    },
    artDirector: {
      name: '美术指导 Agent',
      systemPrompt: `你是一位资深的电影美术指导，负责为每个场景设计视觉风格。包括场景布置、服装设计、道具选择、色彩搭配等美术细节。请提供详细的美术设计方案。`,
      temperature: 0.7,
      maxTokens: 1500,
      description: '为场景提供美术设计方案'
    }
  });

  const [activeAgent, setActiveAgent] = useState('screenwriter');

  const handleConfigChange = (agentKey: string, field: keyof AgentConfig, value: string | number) => {
    setAgentConfigs(prev => ({
      ...prev,
      [agentKey]: {
        ...prev[agentKey],
        [field]: value
      }
    }));
  };

  const handleSave = (agentKey: string) => {
    // 这里可以添加保存到数据库的逻辑
    localStorage.setItem(`agent_config_${agentKey}`, JSON.stringify(agentConfigs[agentKey]));
    toast({
      title: "配置已保存",
      description: `${agentConfigs[agentKey].name}的配置已成功保存到本地存储。`,
    });
  };

  const handleReset = (agentKey: string) => {
    // 重置为默认配置
    const defaultConfigs = {
      screenwriter: {
        name: '编剧 Agent',
        systemPrompt: `你是一位才华横溢的电影编剧，尤其擅长创作不同风格的影视作品。请根据用户提供的故事梗概或情节，创作一段富有叙事性、包含场景描述、角色行为和对话的初步剧本。请注重故事的流畅性和画面的想象力，你的输出将交给导演进行进一步的专业处理和分镜设计。`,
        temperature: 0.8,
        maxTokens: 2000,
        description: '负责将故事梗概转化为初步剧本'
      },
      // ... 其他默认配置
    };
    
    if (defaultConfigs[agentKey as keyof typeof defaultConfigs]) {
      setAgentConfigs(prev => ({
        ...prev,
        [agentKey]: defaultConfigs[agentKey as keyof typeof defaultConfigs]
      }));
      toast({
        title: "配置已重置",
        description: `${agentConfigs[agentKey].name}的配置已重置为默认值。`,
      });
    }
  };

  const AgentConfigPanel = ({ agentKey }: { agentKey: string }) => {
    const config = agentConfigs[agentKey];
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{config.name}</h3>
            <p className="text-sm text-muted-foreground">{config.description}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleReset(agentKey)}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              重置
            </Button>
            <Button
              size="sm"
              onClick={() => handleSave(agentKey)}
            >
              <Save className="h-4 w-4 mr-1" />
              保存
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor={`${agentKey}-temperature`}>创造性温度 (0.0-1.0)</Label>
              <Input
                id={`${agentKey}-temperature`}
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={config.temperature}
                onChange={(e) => handleConfigChange(agentKey, 'temperature', parseFloat(e.target.value))}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                较高的值会产生更有创意但可能不太一致的输出
              </p>
            </div>

            <div>
              <Label htmlFor={`${agentKey}-maxTokens`}>最大输出长度</Label>
              <Input
                id={`${agentKey}-maxTokens`}
                type="number"
                min="500"
                max="4000"
                step="100"
                value={config.maxTokens}
                onChange={(e) => handleConfigChange(agentKey, 'maxTokens', parseInt(e.target.value))}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                控制AI生成内容的最大长度
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor={`${agentKey}-systemPrompt`}>系统提示词</Label>
            <Textarea
              id={`${agentKey}-systemPrompt`}
              value={config.systemPrompt}
              onChange={(e) => handleConfigChange(agentKey, 'systemPrompt', e.target.value)}
              className="mt-1 min-h-[300px] font-mono text-sm"
              placeholder="输入系统提示词..."
            />
            <p className="text-xs text-muted-foreground mt-1">
              定义AI的角色和行为规则
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-28 min-h-screen">
      <header className="mb-8">
        <div className="flex items-center gap-3">
          <Settings className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-4xl font-bold text-primary">Agent 配置管理</h1>
            <p className="text-lg text-muted-foreground mt-2">
              调整各个AI Agent的提示词和参数，优化创作效果
            </p>
          </div>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Agent 配置面板</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeAgent} onValueChange={setActiveAgent}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="screenwriter">编剧 Agent</TabsTrigger>
              <TabsTrigger value="director">导演 Agent</TabsTrigger>
              <TabsTrigger value="cinematographer">摄像 Agent</TabsTrigger>
              <TabsTrigger value="artDirector">美术指导 Agent</TabsTrigger>
            </TabsList>
            
            <TabsContent value="screenwriter" className="mt-6">
              <AgentConfigPanel agentKey="screenwriter" />
            </TabsContent>
            
            <TabsContent value="director" className="mt-6">
              <AgentConfigPanel agentKey="director" />
            </TabsContent>
            
            <TabsContent value="cinematographer" className="mt-6">
              <AgentConfigPanel agentKey="cinematographer" />
            </TabsContent>
            
            <TabsContent value="artDirector" className="mt-6">
              <AgentConfigPanel agentKey="artDirector" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestAgentsPage;
