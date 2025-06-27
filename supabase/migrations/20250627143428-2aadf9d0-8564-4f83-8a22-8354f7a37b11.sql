
-- 修改 structured_shots 表，添加视角变体支持字段
ALTER TABLE public.structured_shots 
ADD COLUMN parent_shot_id UUID REFERENCES public.structured_shots(id),
ADD COLUMN perspective_type TEXT NOT NULL DEFAULT 'main',
ADD COLUMN perspective_name TEXT;

-- 添加约束确保 perspective_type 只能是 'main' 或 'perspective'
ALTER TABLE public.structured_shots 
ADD CONSTRAINT check_perspective_type 
CHECK (perspective_type IN ('main', 'perspective'));

-- 创建 shot_perspectives 表存储预定义视角模板
CREATE TABLE public.shot_perspectives (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  perspective_name TEXT NOT NULL,
  description TEXT,
  prompt_modifier TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'angle',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 启用 RLS
ALTER TABLE public.shot_perspectives ENABLE ROW LEVEL SECURITY;

-- 创建策略：所有用户都可以读取预定义视角模板
CREATE POLICY "Anyone can view shot perspectives" 
  ON public.shot_perspectives 
  FOR SELECT 
  USING (true);

-- 插入预定义的视角模板
INSERT INTO public.shot_perspectives (perspective_name, description, prompt_modifier, category) VALUES
('正面视角', '直接面对主体的视角', 'front view, facing camera, centered composition', 'angle'),
('侧面视角', '从侧面观察主体', 'side view, profile angle, lateral perspective', 'angle'),
('背面视角', '从背后观察主体', 'back view, rear angle, behind perspective', 'angle'),
('俯视视角', '从上方向下观察', 'top-down view, bird eye view, overhead angle', 'angle'),
('仰视视角', '从下方向上观察', 'low angle view, looking up, worm eye view', 'angle'),
('45度视角', '斜45度角度观察', '45 degree angle, three-quarter view, diagonal perspective', 'angle'),
('特写视角', '聚焦于细节的近距离视角', 'close-up view, detailed focus, macro perspective', 'distance'),
('全景视角', '展现整体环境的远距离视角', 'wide shot, establishing view, panoramic perspective', 'distance'),
('电影感视角', '具有电影质感的构图', 'cinematic angle, dramatic composition, film-like perspective', 'style'),
('纪录片视角', '真实自然的观察角度', 'documentary style, natural perspective, realistic angle', 'style');

-- 为 shot_perspectives 表添加更新时间触发器
CREATE TRIGGER update_shot_perspectives_updated_at
    BEFORE UPDATE ON public.shot_perspectives
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
