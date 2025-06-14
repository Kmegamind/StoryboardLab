
-- 创建结构化分镜表
CREATE TABLE public.structured_shots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  shot_number TEXT,
  shot_type TEXT,
  scene_content TEXT NOT NULL,
  dialogue TEXT,
  estimated_duration TEXT,
  camera_movement TEXT,
  sound_music TEXT,
  visual_style TEXT,
  key_props TEXT,
  director_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 为表添加注释
COMMENT ON TABLE public.structured_shots IS '存储结构化的电影分镜信息';
COMMENT ON COLUMN public.structured_shots.user_id IS '创建该分镜的用户ID';
COMMENT ON COLUMN public.structured_shots.shot_number IS '镜头的编号';
COMMENT ON COLUMN public.structured_shots.shot_type IS '镜头的景别';
COMMENT ON COLUMN public.structured_shots.scene_content IS '镜头的详细画面内容描述';
COMMENT ON COLUMN public.structured_shots.dialogue IS '该镜头中的台词';
COMMENT ON COLUMN public.structured_shots.estimated_duration IS '镜头预估时长';
COMMENT ON COLUMN public.structured_shots.camera_movement IS '镜头的运镜方式';
COMMENT ON COLUMN public.structured_shots.sound_music IS '镜头的音效或背景音乐描述';
COMMENT ON COLUMN public.structured_shots.visual_style IS '画面的风格参考';
COMMENT ON COLUMN public.structured_shots.key_props IS '镜头中的关键道具';
COMMENT ON COLUMN public.structured_shots.director_notes IS '导演对该镜头的特别注释或情绪指导';

-- 启用行级安全 (RLS)
ALTER TABLE public.structured_shots ENABLE ROW LEVEL SECURITY;

-- RLS 策略：用户可以查看自己的分镜
CREATE POLICY "Users can view their own shots"
ON public.structured_shots
FOR SELECT
USING (auth.uid() = user_id);

-- RLS 策略：用户可以插入自己的分镜
CREATE POLICY "Users can insert their own shots"
ON public.structured_shots
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS 策略：用户可以更新自己的分镜
CREATE POLICY "Users can update their own shots"
ON public.structured_shots
FOR UPDATE
USING (auth.uid() = user_id);

-- RLS 策略：用户可以删除自己的分镜
CREATE POLICY "Users can delete their own shots"
ON public.structured_shots
FOR DELETE
USING (auth.uid() = user_id);

-- 创建一个函数来自动更新 updated_at 时间戳
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = timezone('utc'::text, now());
   RETURN NEW;
END;
$$ language 'plpgsql';

-- 创建触发器，在更新时自动调用上述函数
CREATE TRIGGER update_structured_shots_updated_at
BEFORE UPDATE ON public.structured_shots
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
