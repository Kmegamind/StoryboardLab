
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
  script: z.string().min(20, { message: "请至少输入20个字的剧本内容。" }),
  style: z.string({ required_error: "请选择一个导演风格。" }),
  pace: z.string({ required_error: "请选择一个叙事节奏。" }),
});

const DirectorAgentPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      script: "",
      style: "写实主义",
      pace: "标准",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setOutput('');

    const systemPrompt = `你是一位经验丰富的电影导演和AI提示词工程师，你的导演风格偏向“${values.style}”，并且擅长把握“${values.pace}”的叙事节奏。你将收到一份由编剧撰写的初步剧本。你的任务是：
1.  仔细阅读和理解剧本内容。
2.  将剧本详细分解为一系列具体的镜头。
3.  对于每一个镜头，请以JSON数组的格式输出。数组中的每个对象代表一个镜头，并包含以下字段：
    *   \`shot_number\` (镜号)
    *   \`shot_type\` (景别)
    *   \`scene_content\` (画面内容)
    *   \`dialogue\` (台词)
    *   \`estimated_duration\` (预估时长)
    *   \`camera_movement\` (运镜方式)
    *   \`sound_music\` (音效/音乐)
    *   \`visual_style\` (画面风格参考): (此项需结合你的导演风格“${values.style}”进行具体阐述)
    *   \`key_props\` (关键道具)
    *   \`director_notes\` (导演注释): (此项需结合你的叙事节奏“${values.pace}”进行说明)

请确保输出是一个完整的、格式正确的JSON数组字符串。`;
    const userPrompt = values.script;

    const result = await callDeepSeekAPI(systemPrompt, userPrompt);
    
    if (result) {
        try {
            // Attempt to parse and stringify to format it nicely
            const parsedJson = JSON.parse(result);
            setOutput(JSON.stringify(parsedJson, null, 2));
            toast({
              title: "导演 Agent 已完成",
              description: "结构化分镜(JSON)已生成。",
            });
        } catch (e) {
            // If it's not valid JSON, show it as is
            setOutput(result);
            toast({
              title: "导演 Agent 已完成，但输出可能不是有效的JSON",
              description: "请检查输出内容。",
              variant: "default",
            });
        }
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
        <h1 className="text-4xl font-bold text-primary">导演 Agent</h1>
        <p className="text-lg text-muted-foreground mt-2">
          将剧本转化为结构化的分镜表(JSON)，并可定制导演风格与节奏。
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
                  name="style"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>导演风格</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择一个导演风格" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="写实主义">写实主义</SelectItem>
                          <SelectItem value="表现主义">表现主义</SelectItem>
                          <SelectItem value="黑色电影">黑色电影</SelectItem>
                          <SelectItem value="王家卫式文艺">王家卫式文艺</SelectItem>
                          <SelectItem value="昆汀式暴力美学">昆汀式暴力美学</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pace"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>叙事节奏</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择一个叙事节奏" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="快节奏">快节奏</SelectItem>
                          <SelectItem value="标准">标准</SelectItem>
                          <SelectItem value="慢节奏">慢节奏</SelectItem>
                          <SelectItem value="紧张急促">紧张急促</SelectItem>
                          <SelectItem value="舒缓写意">舒缓写意</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="script"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>剧本内容</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="在此处粘贴由编剧 Agent 生成的剧本，或您自己的剧本内容..."
                          className="min-h-[200px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        提供包含场景、动作和对话的剧本内容。
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      生成分镜中...
                    </>
                  ) : (
                    "生成分镜 (JSON)"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agent 输出 (JSON)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[540px] p-4 bg-muted rounded-md overflow-y-auto">
              {isLoading && (
                 <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                 </div>
              )}
              {!isLoading && !output && (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  此处将显示生成的分镜JSON
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

export default DirectorAgentPage;
