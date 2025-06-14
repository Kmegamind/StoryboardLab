
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
  topic: z.string().min(10, { message: "请至少输入10个字的情节梗概。" }),
  genre: z.string({ required_error: "请选择一个类型。" }),
  format: z.string({ required_error: "请选择一个形式。" }),
});

const ScreenwriterAgentPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      genre: "科幻",
      format: "真人电影",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setOutput('');

    const systemPrompt = `你是一位才华横溢的电影编剧，尤其擅长创作${values.genre}风格的${values.format}。请根据用户提供的故事梗概或情节，创作一段富有叙事性、包含场景描述、角色行为和对话的初步剧本。请注重故事的流畅性和画面的想象力，你的输出将交给导演进行进一步的专业处理和分镜设计。`;
    const userPrompt = values.topic;

    const result = await callDeepSeekAPI(systemPrompt, userPrompt);
    
    if (result) {
      setOutput(result);
      toast({
        title: "编剧 Agent 已完成",
        description: "剧本草稿已生成。",
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
        <h1 className="text-4xl font-bold text-primary">编剧 Agent</h1>
        <p className="text-lg text-muted-foreground mt-2">
          根据您的灵感，定制化生成不同风格和形式的剧本初稿。
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>创作指令</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="genre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>剧本类型</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择一个剧本类型" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="科幻">科幻</SelectItem>
                          <SelectItem value="喜剧">喜剧</SelectItem>
                          <SelectItem value="悲剧">悲剧</SelectItem>
                          <SelectItem value="爱情">爱情</SelectItem>
                          <SelectItem value="悬疑">悬疑</SelectItem>
                          <SelectItem value="恐怖">恐怖</SelectItem>
                          <SelectItem value="动作">动作</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="format"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>内容形式</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择一个内容形式" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="真人电影">真人电影</SelectItem>
                          <SelectItem value="动画电影">动画电影</SelectItem>
                          <SelectItem value="电视剧集">电视剧集</SelectItem>
                          <SelectItem value="短片">短片</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>情节梗概</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="例如：一个生活在未来的机器人，突然觉醒了自我意识，并开始质疑它存在的意义..."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        请详细描述您的故事核心、主要角色和关键情节。
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
                    "生成剧本"
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
            <div className="w-full h-[480px] p-4 bg-muted rounded-md overflow-y-auto">
              {isLoading && (
                 <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                 </div>
              )}
              {!isLoading && !output && (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  此处将显示生成的剧本内容
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

export default ScreenwriterAgentPage;
