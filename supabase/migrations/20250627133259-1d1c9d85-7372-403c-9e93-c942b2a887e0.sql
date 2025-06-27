
-- 创建分镜提示词版本表
CREATE TABLE public.shot_prompts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shot_id UUID NOT NULL REFERENCES public.structured_shots(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt_text TEXT NOT NULL,
  version_number INTEGER NOT NULL DEFAULT 1,
  is_final BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 创建项目一致性提示词表
CREATE TABLE public.project_consistency_prompts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  asset_type TEXT NOT NULL, -- 'character', 'location', 'style', 'props'
  asset_name TEXT NOT NULL,
  consistency_prompt TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id, asset_type, asset_name)
);

-- 为 shot_prompts 表添加索引
CREATE INDEX idx_shot_prompts_shot_id ON public.shot_prompts(shot_id);
CREATE INDEX idx_shot_prompts_user_id ON public.shot_prompts(user_id);
CREATE UNIQUE INDEX idx_shot_prompts_shot_version ON public.shot_prompts(shot_id, version_number);

-- 为 project_consistency_prompts 表添加索引
CREATE INDEX idx_consistency_prompts_project_id ON public.project_consistency_prompts(project_id);
CREATE INDEX idx_consistency_prompts_user_id ON public.project_consistency_prompts(user_id);

-- 启用 RLS
ALTER TABLE public.shot_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_consistency_prompts ENABLE ROW LEVEL SECURITY;

-- shot_prompts 表的 RLS 策略
CREATE POLICY "Users can view their own shot prompts" 
  ON public.shot_prompts 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own shot prompts" 
  ON public.shot_prompts 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shot prompts" 
  ON public.shot_prompts 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shot prompts" 
  ON public.shot_prompts 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- project_consistency_prompts 表的 RLS 策略
CREATE POLICY "Users can view their own consistency prompts" 
  ON public.project_consistency_prompts 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own consistency prompts" 
  ON public.project_consistency_prompts 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own consistency prompts" 
  ON public.project_consistency_prompts 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own consistency prompts" 
  ON public.project_consistency_prompts 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- 添加更新时间触发器
CREATE TRIGGER update_shot_prompts_updated_at
  BEFORE UPDATE ON public.shot_prompts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_consistency_prompts_updated_at
  BEFORE UPDATE ON public.project_consistency_prompts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
