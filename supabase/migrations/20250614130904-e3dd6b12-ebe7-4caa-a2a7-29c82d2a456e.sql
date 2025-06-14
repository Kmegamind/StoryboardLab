
-- 创建一个 `projects` 表来存储每个创意项目的完整状态
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL DEFAULT auth.uid(),
    title TEXT NOT NULL DEFAULT '未命名项目',
    plot TEXT,
    screenwriter_output TEXT,
    director_output_json TEXT,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'writing', 'directing', 'completed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 为表和关键列添加注释说明
COMMENT ON TABLE public.projects IS '存储每个创意项目的状态，从情节构思到最终输出。';
COMMENT ON COLUMN public.projects.status IS '追踪项目的当前工作流阶段 (new, writing, directing, completed)。';
COMMENT ON COLUMN public.projects.user_id IS '关联到创建此项目的用户。';

-- 为 `projects` 表启用行级安全 (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 创建 RLS 策略，确保用户只能访问自己的项目
CREATE POLICY "用户可以查看自己的项目"
ON public.projects FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "用户可以创建自己的项目"
ON public.projects FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户可以更新自己的项目"
ON public.projects FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "用户可以删除自己的项目"
ON public.projects FOR DELETE
USING (auth.uid() = user_id);

-- 创建触发器，在项目信息更新时自动更新 'updated_at' 时间戳
-- (这会使用项目中已存在的 `update_updated_at_column` 函数)
CREATE TRIGGER handle_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ---

-- 修改现有的 `structured_shots` 表，为其增加一个 `project_id` 列以关联到项目
ALTER TABLE public.structured_shots ADD COLUMN project_id UUID;

-- 添加外键约束，确保数据完整性，并在项目被删除时级联删除相关的分镜
ALTER TABLE public.structured_shots
ADD CONSTRAINT fk_project
FOREIGN KEY (project_id)
REFERENCES public.projects(id)
ON DELETE CASCADE;

-- 为 `structured_shots` 表启用 RLS，以保护用户数据
ALTER TABLE public.structured_shots ENABLE ROW LEVEL SECURITY;

-- 创建 RLS 策略，确保用户只能操作自己的分镜 (基于 `user_id` 列)
CREATE POLICY "用户可以查看自己的分镜"
ON public.structured_shots FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "用户可以插入自己的分镜"
ON public.structured_shots FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户可以更新自己的分镜"
ON public.structured_shots FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "用户可以删除自己的分镜"
ON public.structured_shots FOR DELETE
USING (auth.uid() = user_id);
