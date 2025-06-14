
# AI 影视前期制作工具 (AI Pre-production Tool)

欢迎来到您的 AI 影视前期制作工作台！这是一个利用大型语言模型（LLM）赋能创意，将一个简单的灵感转化为专业、可执行的视觉生产方案的 Web 应用。

## ✨ 项目简介 (Project Overview)

本工具旨在简化和加速影视、动画、游戏等内容的早期创意和规划阶段。用户只需输入一个故事梗概或创意点，AI Agent 链条便会自动完成从剧本初稿、导演分镜表到具体视觉方案和生成提示词（Prompts）的全过程。

## 🚀 主要功能 (Key Features)

-   **AI Agent 智能链条 (AI Agent Chain)**: 包含编剧、导演、摄像、美术指导四大核心 Agent，各司其职，协同工作。
-   **定制化内容生成 (Customizable Generation)**:
    -   **编剧 Agent**: 可选择剧本类型（科幻、喜剧等）和内容形式（真人电影、动画等）。
    -   **导演 Agent**: 可定义导演风格和叙事节奏，生成结构化分镜表。
    -   **摄像 Agent**: 可指定镜头类型、光照风格和运镜偏好。
    -   **美术指导 Agent**: 可设定整体艺术风格、核心色板和时代背景。
-   **结构化分镜管理 (Structured Shot Management)**: 在工作台清晰地查看和管理由 AI 生成的所有分镜。
-   **专业级视觉方案生成 (Professional Visual Plan Generation)**:
    -   为选定的分镜一键生成包含图像分析、执行方案、构图设计、调色板等在内的完整视觉方案。
    -   自动产出适配 Midjourney, Sora 等 AI 模型的 **中英双语** 详细提示词（Prompts）。

## 🛠️ 技术栈 (Tech Stack)

-   **前端 (Frontend)**: React, Vite, TypeScript
-   **UI 组件库 (UI Library)**: shadcn/ui
-   **样式 (Styling)**: Tailwind CSS
-   **后端与 AI (Backend & AI)**:
    -   Supabase (数据库与后端服务)
    -   DeepSeek API (核心语言模型)

## 🏃‍♂️ 如何开始 (Getting Started)

1.  **克隆项目 (Clone the repo)**
    ```sh
    git clone <YOUR_GIT_URL>
    ```
2.  **安装依赖 (Install dependencies)**
    ```sh
    npm install
    ```
3.  **配置环境变量 (Configure environment variables)**
    在项目根目录创建 `.env.local` 文件，并添加 Supabase 和 DeepSeek 的相关密钥。
    ```
    VITE_SUPABASE_URL=YOUR_SUPABASE_URL
    VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    VITE_DEEPSEEK_API_KEY=YOUR_DEEPSEEK_API_KEY
    ```
4.  **运行开发服务器 (Run the dev server)**
    ```sh
    npm run dev
    ```

---
*This project was built with [Lovable](https://lovable.dev).*

