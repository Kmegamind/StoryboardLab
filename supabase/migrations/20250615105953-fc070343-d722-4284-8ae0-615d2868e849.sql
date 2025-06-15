
-- 1. 创建新表 `project_assets` 用于存储项目资产（如角色、场景、道具）。
CREATE TABLE public.project_assets (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    asset_type text NOT NULL, -- 例如: 'character', 'scene', 'prop'
    asset_name text NOT NULL,
    description text,
    reference_token text, -- 用于存储 LoRA 触发词或 --cref URL 以保证一致性
    reference_image_url text, -- 可选的代表性图片URL
    -- 确保在同一个项目中，资产名称是唯一的
    CONSTRAINT unique_asset_name_per_project UNIQUE (project_id, asset_name)
);

-- 2. 创建触发器，在资产信息更新时自动更新 'updated_at' 时间戳。
-- 我们将复用项目已有的 `update_updated_at_column` 函数。
CREATE TRIGGER handle_updated_at_project_assets
BEFORE UPDATE ON public.project_assets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 3. 启用行级安全（RLS），保护您的资产数据。
ALTER TABLE public.project_assets ENABLE ROW LEVEL SECURITY;

-- 4. 创建一个统一的RLS策略，允许用户管理（查看、创建、更新、删除）他们自己项目中的资产。
CREATE POLICY "Users can manage assets for their own projects"
ON public.project_assets
FOR ALL
USING (auth.uid() = (SELECT user_id FROM public.projects WHERE id = project_id))
WITH CHECK (auth.uid() = (SELECT user_id FROM public.projects WHERE id = project_id));

