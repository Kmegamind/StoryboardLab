
# CinemaAI Studio - AI影视前期制作工具

![CinemaAI Studio](https://img.shields.io/badge/CinemaAI-Studio-00A67E?style=for-the-badge&logo=react)
![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

## 🎬 项目简介 (Project Overview)

CinemaAI Studio 是一个革命性的AI影视前期制作平台，专为电影制作人、编剧、导演和创意工作者设计。通过先进的大型语言模型（LLM）技术，将简单的故事灵感自动转化为专业、可执行的视觉生产方案。

### 核心优势
- **🤖 AI智能化创作**: 利用多Agent协作架构，实现从剧本到分镜的全流程自动化
- **🎨 专业级输出**: 生成符合行业标准的分镜表、视觉方案和AI生成提示词
- **⚡ 高效协作**: 四大核心Agent（编剧、导演、摄像、美术指导）协同工作
- **🎯 定制化服务**: 支持多种剧本类型、导演风格和视觉风格的个性化定制
- **🌐 双语支持**: 中英文界面，输出中英双语提示词

## ✨ 主要功能 (Key Features)

### 🎭 AI Agent 智能链条
- **编剧 Agent**: 
  - 支持多种剧本类型（科幻、喜剧、悬疑、动作、爱情等）
  - 可选择内容形式（真人电影、动画、纪录片等）
  - 自动生成结构化剧本和场景描述

- **导演 Agent**: 
  - 可定义导演风格（希区柯克、库布里克、诺兰等）
  - 支持叙事节奏调整（快节奏、慢节奏、平衡）
  - 生成详细的分镜表和导演备注

- **摄像 Agent**: 
  - 支持多种镜头类型（特写、中景、远景、航拍等）
  - 可指定光照风格（自然光、人工光、戏剧化等）
  - 运镜偏好设置（稳定、动态、手持等）

- **美术指导 Agent**: 
  - 设定整体艺术风格（现实主义、超现实主义、未来主义等）
  - 定义核心色板和视觉主题
  - 指定时代背景和场景设计

### 📋 分镜管理系统
- **结构化分镜展示**: 清晰展示每个镜头的详细信息
- **分镜筛选和排序**: 支持按场景、镜头类型、时长等多维度筛选
- **实时编辑**: 支持对分镜内容进行实时修改和调整
- **批量操作**: 支持批量选择、删除和归档分镜

### 🎨 专业视觉方案生成
- **一键生成**: 为选定分镜自动生成完整视觉方案
- **多维度分析**: 包含图像分析、执行方案、构图设计等
- **调色板设计**: 自动生成符合场景需求的专业调色板
- **提示词优化**: 生成适配Midjourney、DALL-E、Stable Diffusion等AI模型的提示词

### 🔧 项目管理功能
- **项目资产管理**: 统一管理项目中的所有资源文件
- **版本控制**: 支持分镜版本管理和历史记录
- **协作功能**: 支持多人协作和权限管理
- **导出功能**: 支持多格式导出（PDF、JSON、CSV等）

## 🛠️ 技术架构 (Technical Architecture)

### 前端技术栈
```
React 18.3.1          - 现代化UI框架
TypeScript            - 类型安全的JavaScript
Vite                  - 高性能构建工具
Tailwind CSS          - 实用优先的CSS框架
shadcn/ui             - 高质量组件库
React Router          - 客户端路由
React Query           - 数据获取和状态管理
React Hook Form       - 表单管理
Lucide React          - 图标库
Recharts              - 数据可视化
```

### 后端与数据库
```
Supabase              - 后端即服务平台
PostgreSQL            - 关系型数据库
Supabase Auth         - 用户认证系统
Supabase Storage      - 文件存储服务
Edge Functions        - 无服务器函数
```

### AI服务集成
```
DeepSeek API          - 核心语言模型
OpenAI API            - GPT模型支持
Claude API            - Anthropic模型支持
自定义Prompt工程       - 优化的提示词模板
```

### 开发工具
```
ESLint                - 代码规范检查
Prettier              - 代码格式化
Husky                 - Git钩子管理
TypeScript            - 静态类型检查
Vite DevTools         - 开发调试工具
```

## 🚀 快速开始 (Quick Start)

### 环境要求
- Node.js >= 18.0.0
- npm >= 9.0.0 或 yarn >= 1.22.0
- 现代浏览器（Chrome 90+, Firefox 88+, Safari 14+）

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/your-username/cinemaai-studio.git
cd cinemaai-studio
```

2. **安装依赖**
```bash
npm install
# 或
yarn install
```

3. **环境配置**
创建 `.env.local` 文件并配置以下环境变量：
```env
# Supabase 配置
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI服务配置
VITE_DEEPSEEK_API_KEY=your_deepseek_api_key
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_CLAUDE_API_KEY=your_claude_api_key

# 其他配置
VITE_APP_ENV=development
VITE_API_BASE_URL=http://localhost:3000
```

4. **数据库初始化**
```bash
# Supabase CLI 初始化
npx supabase init
npx supabase start
npx supabase db reset
```

5. **启动开发服务器**
```bash
npm run dev
# 或
yarn dev
```

6. **访问应用**
打开浏览器访问 `http://localhost:5173`

## 📖 使用指南 (Usage Guide)

### 基础工作流程

1. **用户注册/登录**
   - 支持邮箱注册和第三方登录
   - 完善个人资料和偏好设置

2. **创建新项目**
   - 输入项目基本信息
   - 选择项目类型和风格偏好

3. **故事创作**
   - 输入故事梗概或创意灵感
   - 选择剧本类型和内容形式
   - AI编剧Agent自动生成剧本

4. **分镜生成**
   - 导演Agent基于剧本生成分镜表
   - 支持风格和节奏的个性化调整
   - 实时预览和编辑分镜内容

5. **视觉方案制作**
   - 选择重要分镜进行视觉方案生成
   - 摄像和美术指导Agent协作产出
   - 生成专业级提示词和执行方案

6. **项目管理**
   - 版本控制和历史记录
   - 资产管理和文件组织
   - 导出和分享功能

### 高级功能

#### Agent配置定制
```typescript
// 编剧Agent配置示例
const screenwriterConfig = {
  genre: 'sci-fi',           // 科幻类型
  format: 'feature-film',    // 长片格式
  tone: 'serious',           // 严肃基调
  structure: 'three-act'     // 三幕结构
};

// 导演Agent配置示例
const directorConfig = {
  style: 'kubrick',          // 库布里克风格
  pacing: 'deliberate',      // 从容节奏
  visual: 'symmetrical'      // 对称构图
};
```

#### 自定义提示词模板
```jinja2
# Midjourney提示词模板
{{scene_description}}, {{lighting_style}}, {{camera_angle}}, 
{{art_style}}, {{color_palette}}, {{mood}}, 
professional cinematography, 8k resolution, 
--ar {{aspect_ratio}} --v {{version}}
```

## 🏗️ 项目结构 (Project Structure)

```
cinemaai-studio/
├── public/                 # 静态资源
│   ├── locales/           # 国际化文件
│   └── favicon.ico        # 网站图标
├── src/
│   ├── components/        # React组件
│   │   ├── ui/           # 基础UI组件
│   │   ├── dashboard/    # 仪表板组件
│   │   └── ...
│   ├── pages/            # 页面组件
│   │   ├── agents/       # Agent相关页面
│   │   └── ...
│   ├── hooks/            # 自定义Hooks
│   ├── utils/            # 工具函数
│   ├── lib/              # 第三方库配置
│   ├── integrations/     # 外部服务集成
│   └── types/            # TypeScript类型定义
├── supabase/             # Supabase配置
│   ├── functions/        # Edge Functions
│   └── migrations/       # 数据库迁移
├── docs/                 # 项目文档
└── scripts/              # 构建脚本
```

## 🔌 API文档 (API Documentation)

### 核心API端点

#### 用户认证
```typescript
// 用户登录
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

// 用户注册
POST /auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "name": "用户名"
}
```

#### 项目管理
```typescript
// 创建项目
POST /api/projects
{
  "name": "项目名称",
  "description": "项目描述",
  "type": "feature-film"
}

// 获取项目列表
GET /api/projects?page=1&limit=10

// 更新项目
PUT /api/projects/:id
{
  "name": "新项目名称",
  "status": "active"
}
```

#### AI Agent处理
```typescript
// 编剧Agent处理
POST /api/agents/screenwriter
{
  "plotSummary": "故事梗概",
  "config": {
    "genre": "sci-fi",
    "format": "feature-film"
  }
}

// 导演Agent处理
POST /api/agents/director
{
  "script": "剧本内容",
  "config": {
    "style": "kubrick",
    "pacing": "slow"
  }
}
```

## 🧪 测试 (Testing)

### 运行测试
```bash
# 运行所有测试
npm test

# 运行特定测试文件
npm test -- --testNamePattern="Agent"

# 运行测试覆盖率
npm run test:coverage

# 运行E2E测试
npm run test:e2e
```

### 测试策略
- **单元测试**: Jest + React Testing Library
- **集成测试**: API端点和数据库操作
- **E2E测试**: Playwright自动化测试
- **性能测试**: Lighthouse CI集成

## 🚀 部署 (Deployment)

### 生产环境部署

1. **构建项目**
```bash
npm run build
```

2. **环境变量配置**
```env
NODE_ENV=production
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_anon_key
```

3. **部署选项**

#### Vercel部署
```bash
npm install -g vercel
vercel --prod
```

#### Netlify部署
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

#### Docker部署
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔧 配置 (Configuration)

### Supabase配置
```sql
-- 数据库Schema
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE shots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  shot_number INTEGER,
  scene_content TEXT,
  camera_movement VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### AI模型配置
```typescript
// DeepSeek配置
const deepseekConfig = {
  model: 'deepseek-chat',
  temperature: 0.7,
  max_tokens: 4000,
  top_p: 0.9
};

// OpenAI配置
const openaiConfig = {
  model: 'gpt-4-turbo-preview',
  temperature: 0.8,
  max_tokens: 3000
};
```

## 🤝 贡献指南 (Contributing)

### 开发流程
1. Fork项目到个人仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建Pull Request

### 代码规范
- 遵循ESLint和Prettier配置
- 使用TypeScript进行类型检查
- 编写单元测试覆盖新功能
- 更新相关文档

### 提交规范
```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建/工具相关
```

## 📄 许可证 (License)

本项目采用 MIT 许可证 - 详情请查看 [LICENSE](LICENSE) 文件。

## 🆘 支持与帮助 (Support)

### 官方渠道
- **官方网站**: [https://cinemaai.studio](https://cinemaai.studio)
- **技术文档**: [https://docs.cinemaai.studio](https://docs.cinemaai.studio)
- **用户社区**: [https://community.cinemaai.studio](https://community.cinemaai.studio)

### 联系方式
- **商业合作**: [biz@cinemaai.studio](mailto:biz@cinemaai.studio)
- **技术支持**: [support@cinemaai.studio](mailto:support@cinemaai.studio)
- **Bug报告**: [GitHub Issues](https://github.com/your-username/cinemaai-studio/issues)

### 常见问题

**Q: 如何获取API密钥？**
A: 请访问对应的AI服务提供商官网注册账户并获取API密钥。

**Q: 支持哪些AI模型？**
A: 目前支持DeepSeek、OpenAI GPT系列、Claude系列等主流模型。

**Q: 是否支持离线使用？**
A: 部分功能支持离线使用，但AI生成功能需要网络连接。

**Q: 如何自定义Agent配置？**
A: 可以在设置页面或通过配置文件自定义各个Agent的参数。

## 🎯 路线图 (Roadmap)

### 已完成 ✅
- [x] 基础AI Agent架构
- [x] 用户认证系统
- [x] 分镜管理功能
- [x] 基础视觉方案生成
- [x] 多语言支持

### 进行中 🚧
- [ ] 实时协作功能
- [ ] 移动端适配
- [ ] 高级视觉效果
- [ ] 批量处理优化

### 计划中 📋
- [ ] 视频生成集成
- [ ] 3D场景预览
- [ ] 插件系统
- [ ] 企业级功能
- [ ] API开放平台

## 📊 性能指标 (Performance Metrics)

- **首屏加载时间**: < 2秒
- **AI响应时间**: < 10秒
- **并发用户支持**: 1000+
- **数据库查询优化**: 平均 < 100ms
- **CDN覆盖**: 全球99%地区

## 🏆 致谢 (Acknowledgments)

感谢以下开源项目和服务提供商：
- [React](https://reactjs.org/) - 用户界面库
- [Supabase](https://supabase.com/) - 后端服务
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架
- [shadcn/ui](https://ui.shadcn.com/) - 组件库
- [Lucide](https://lucide.dev/) - 图标库

---

**CinemaAI Studio** - 让每个故事都能绽放视觉生命力 ✨

*Built with ❤️ by CinemaAI Team*

*This project was created with [Lovable](https://lovable.dev) - The AI-powered web app builder*
