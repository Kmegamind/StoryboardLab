
-- 确保 structured_shots 表包含所有需要的字段
-- 这些字段可能已经存在，但我们需要确保它们都有合适的默认值

-- 检查并添加缺失的字段（如果不存在的话）
DO $$ 
BEGIN
    -- 检查 dialogue 字段
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'structured_shots' AND column_name = 'dialogue') THEN
        ALTER TABLE public.structured_shots ADD COLUMN dialogue TEXT;
    END IF;
    
    -- 检查 camera_movement 字段
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'structured_shots' AND column_name = 'camera_movement') THEN
        ALTER TABLE public.structured_shots ADD COLUMN camera_movement TEXT;
    END IF;
    
    -- 检查 sound_music 字段
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'structured_shots' AND column_name = 'sound_music') THEN
        ALTER TABLE public.structured_shots ADD COLUMN sound_music TEXT;
    END IF;
    
    -- 检查 visual_style 字段
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'structured_shots' AND column_name = 'visual_style') THEN
        ALTER TABLE public.structured_shots ADD COLUMN visual_style TEXT;
    END IF;
    
    -- 检查 key_props 字段
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'structured_shots' AND column_name = 'key_props') THEN
        ALTER TABLE public.structured_shots ADD COLUMN key_props TEXT;
    END IF;
    
    -- 检查 director_notes 字段
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'structured_shots' AND column_name = 'director_notes') THEN
        ALTER TABLE public.structured_shots ADD COLUMN director_notes TEXT;
    END IF;
END $$;

-- 为表添加更详细的注释
COMMENT ON COLUMN public.structured_shots.dialogue IS '该镜头中的台词或对白';
COMMENT ON COLUMN public.structured_shots.camera_movement IS '镜头的运镜方式，如推拉摇移等';
COMMENT ON COLUMN public.structured_shots.sound_music IS '镜头的音效或背景音乐描述';
COMMENT ON COLUMN public.structured_shots.visual_style IS '画面的风格参考或视觉指导';
COMMENT ON COLUMN public.structured_shots.key_props IS '镜头中的关键道具或重要物件';
COMMENT ON COLUMN public.structured_shots.director_notes IS '导演对该镜头的特别注释或情绪指导';
