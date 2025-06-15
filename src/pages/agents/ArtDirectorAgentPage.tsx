
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { callDeepSeekAPI } from '@/utils/apiUtils';
import { toast } from '@/hooks/use-toast';

const formSchema = z.object({
  description: z.string().min(20, { message: "请至少输入20个字的美术概念描述。" }),
  style: z.string({ required_error: "请选择一个整体美术风格。" }),
  palette: z.string({ required_error: "请选择一个核心色调。" }),
  period: z.string({ required_error: "请选择一个时代背景。" }),
});

const ArtDirectorAgentPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      style: "现实主义",
      palette: "自然色调",
      period: "现代",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setOutput('');

    const systemPrompt = `你是一位经验丰富、想象力卓越的电影美术指导。你的专长是定义和执行“${values.style}”风格的视觉世界，尤其擅长运用“${values.palette}”来营造氛围。你将基于“${values.period}”的时代背景进行创作。现在，你将收到一份概念描述。你的任务是：
1.  基于核心概念，构建一个完整的世界观视觉体系。
2.  设计关键场景的氛围、布景和环境细节。
3.  定义主要角色的服装、造型和道具风格。
4.  指定一套符合“${values.palette}”的详细色彩系统方案。
5.  输出一份专业的美术设计阐述，包含情绪板(Mood Board)的文字描述、设计草图方向等，为整个视觉团队提供清晰的指导。`;
    const userPrompt = values.description;

    const result = await callDeepSeekAPI(systemPrompt, userPrompt);
    
    if (result) {
      setOutput(result);
      toast({
        title: "美术指导 Agent 已完成",
        description: "美术设计阐述已生成。",
      });
    } else {
      toast({
        title: "生成失败",
        description: "无法从 Agent 获取回复，请稍后再试。",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-28 min-h-screen">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-primary">美术指导 Agent</h1>
        <p className="text-lg text-muted-foreground mt-2">
          结合美术风格、核心色调与时代背景，生成全面的美术设计阐述。
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>设计指令</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="style"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>整体美术风格</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择一个美术风格" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="现实主义">现实主义</SelectItem>
                          <SelectItem value="未来主义">未来主义</SelectItem>
                          <SelectItem value="哥特风格">哥特风格</SelectItem>
                          <SelectItem value="赛博朋克">赛博朋克</SelectItem>
                          <SelectItem value="蒸汽朋克">蒸汽朋克</SelectItem>
                          <SelectItem value="废土风格">废土风格</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="palette"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>核心色调</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择一个核心色调" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="暖色调">暖色调</SelectItem>
                          <SelectItem value="冷色调">冷色调</SelectItem>
                          <SelectItem value="单色调(黑白灰)">单色调(黑白灰)</SelectItem>
                          <SelectItem value="高饱和度/高对比度">高饱和度/高对比度</SelectItem>
                          <SelectItem value="低饱和度/柔和色调">低饱和度/柔和色调</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="period"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>时代背景</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择一个时代背景" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="古代(东方/西方)">古代(东方/西方)</SelectItem>
                          <SelectItem value="中世纪/近代">中世纪/近代</SelectItem>
                          <SelectItem value="现代(20-21世纪)">现代(20-21世纪)</SelectItem>
                          <SelectItem value="近未来">近未来</SelectItem>
                          <SelectItem value="遥远未来/太空时代">遥远未来/太空时代</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>美术概念描述</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="例如：一座悬浮在云端的反重力城市，建筑风格融合了东方寺庙与未来科技..."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        提供您的核心视觉创意、世界观设定或关键场景描述。
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    "生成美术设计阐述"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agent 输出</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[525px] p-4 bg-muted rounded-md overflow-y-auto">
              {isLoading && (
                 <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                 </div>
              )}
              {!isLoading && !output && (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  此处将显示生成的美术设计阐述
                </div>
              )}
              {output && <pre className="whitespace-pre-wrap text-sm">{output}</pre>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ArtDirectorAgentPage;
