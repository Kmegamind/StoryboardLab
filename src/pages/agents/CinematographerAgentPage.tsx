
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
import { toast } from '@/components/ui/use-toast';

const formSchema = z.object({
  scene: z.string().min(20, { message: "请至少输入20个字的场景描述。" }),
  lens: z.string({ required_error: "请选择一个镜头类型。" }),
  lighting: z.string({ required_error: "请选择一个灯光风格。" }),
  movement: z.string({ required_error: "请选择一个运镜偏好。" }),
});

const CinematographerAgentPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      scene: "",
      lens: "标准镜头(50mm)",
      lighting: "自然光",
      movement: "静态机位",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setOutput('');

    const systemPrompt = `你是一位顶尖的电影摄影指导（DP），擅长运用“${values.lens}”来构建画面，精通“${values.lighting}”风格的布光，并偏好“${values.movement}”的镜头运动。现在，你将收到一段场景描述。你的任务是：
1.  解读场景的氛围和核心动作。
2.  设计具体的镜头语言，包括景别、角度、构图。
3.  详细描述灯光布局、光影效果，以符合“${values.lighting}”风格。
4.  规划摄影机的运动方式，以匹配“${values.movement}”的偏好。
5.  输出一段专业的摄影执行方案，内容需具体、富有视觉想象力，并可直接用于现场拍摄。`;
    const userPrompt = values.scene;

    const result = await callDeepSeekAPI(systemPrompt, userPrompt);
    
    if (result) {
      setOutput(result);
      toast({
        title: "摄像 Agent 已完成",
        description: "摄影执行方案已生成。",
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
        <h1 className="text-4xl font-bold text-primary">摄像 Agent</h1>
        <p className="text-lg text-muted-foreground mt-2">
          根据场景描述，结合镜头、灯光和运镜偏好，生成专业摄影方案。
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>拍摄指令</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="lens"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>镜头类型</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择一个镜头类型" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="广角镜头(14-35mm)">广角镜头(14-35mm)</SelectItem>
                          <SelectItem value="标准镜头(50mm)">标准镜头(50mm)</SelectItem>
                          <SelectItem value="长焦镜头(85-200mm)">长焦镜头(85-200mm)</SelectItem>
                          <SelectItem value="微距镜头">微距镜头</SelectItem>
                          <SelectItem value="变形宽银幕镜头">变形宽银幕镜头</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lighting"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>灯光风格</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择一个灯光风格" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="高调光(High-key)">高调光(High-key)</SelectItem>
                          <SelectItem value="低调光(Low-key)">低调光(Low-key)</SelectItem>
                          <SelectItem value="自然光">自然光</SelectItem>
                          <SelectItem value="伦勃朗光">伦勃朗光</SelectItem>
                          <SelectItem value="霓虹/赛博朋克光">霓虹/赛博朋克光</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="movement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>运镜偏好</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择一个运镜偏好" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="静态机位">静态机位</SelectItem>
                          <SelectItem value="手持拍摄">手持拍摄</SelectItem>
                          <SelectItem value="稳定器(Steadicam)">稳定器(Steadicam)</SelectItem>
                          <SelectItem value="摇臂/升降机">摇臂/升降机</SelectItem>
                          <SelectItem value="无人机航拍">无人机航拍</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="scene"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>场景描述</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="例如：清晨，主角独自走在空无一人的雨后街道上，路面积水倒映着霓虹灯牌..."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        提供详细的场景信息，包括环境、角色动作和情绪氛围。
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
                    "生成摄影方案"
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
                  此处将显示生成的摄影方案
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

export default CinematographerAgentPage;
