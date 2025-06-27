
# 分镜实验室 - AI影视前期制作工具

![分镜实验室](https://img.shields.io/badge/CinemaAI-Studio-00A67E?style=for-the-badge&logo=react)
![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

## 🎬 项目简介

分镜实验室 是一个创新的AI影视前期制作平台，专为电影制作人、编剧、导演和创意工作者设计。通过先进的大型语言模型（LLM）技术，将简单的故事灵感自动转化为专业、可执行的视觉生产方案。

### 核心优势
- **🤖 AI智能化创作**: 多Agent协作架构，实现从剧本到分镜的全流程自动化
- **🎨 专业级输出**: 生成符合行业标准的分镜表、视觉方案和AI生成提示词
- **⚡ 高效协作**: 四大核心Agent（编剧、导演、摄像、美术指导）协同工作
- **🎯 定制化服务**: 支持多种剧本类型、导演风格和视觉风格的个性化定制

## ✨ 主要功能

### 🎭 AI Agent 智能链条
- **编剧 Agent**: 支持多种剧本类型，自动生成结构化剧本和场景描述
- **导演 Agent**: 可定义导演风格，生成详细的分镜表和导演备注
- **摄像 Agent**: 支持多种镜头类型和光照风格设置
- **美术指导 Agent**: 设定整体艺术风格和视觉主题

### 📋 分镜管理系统
- **结构化分镜展示**: 清晰展示每个镜头的详细信息
- **分镜筛选和排序**: 支持按场景、镜头类型、时长等多维度筛选
- **实时编辑**: 支持对分镜内容进行实时修改和调整
- **批量操作**: 支持批量选择、删除和归档分镜

### 🎨 专业视觉方案生成
- **一键生成**: 为选定分镜自动生成完整视觉方案
- **多维度分析**: 包含图像分析、执行方案、构图设计等
- **调色板设计**: 自动生成符合场景需求的专业调色板
- **提示词优化**: 生成适配主流AI模型的优化提示词

## 🛠️ 技术架构

```
React 18.3.1          - UI框架
TypeScript            - 类型安全的JavaScript
Vite                  - 高性能构建工具
Tailwind CSS          - 实用优先的CSS框架
shadcn/ui             - 高质量组件库
Supabase              - 后端即服务平台
DeepSeek API          - 核心语言模型
```

## 🚀 快速开始

### 环境要求
- Node.js >= 18.0.0
- npm >= 9.0.0
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
```

3. **环境配置**
创建 `.env.local` 文件并配置以下环境变量：
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **启动开发服务器**
```bash
npm run dev
```

5. **访问应用**
打开浏览器访问 `http://localhost:5173`

## 📖 使用指南

### 基础工作流程

1. **用户注册/登录** - 支持邮箱注册和认证
2. **创建新项目** - 输入项目基本信息和风格偏好
3. **故事创作** - 输入故事梗概，AI编剧Agent自动生成剧本
4. **分镜生成** - 导演Agent基于剧本生成分镜表
5. **视觉方案制作** - 生成专业级提示词和执行方案
6. **项目管理** - 版本控制、资产管理和导出功能

## 🏗️ 项目结构

```
cinemaai-studio/
├── src/
│   ├── components/        # React组件
│   │   ├── ui/           # 基础UI组件
│   │   ├── dashboard/    # 仪表板组件
│   │   └── user-settings/ # 用户设置组件
│   ├── pages/            # 页面组件
│   ├── hooks/            # 自定义Hooks
│   ├── utils/            # 工具函数
│   ├── lib/              # 第三方库配置
│   └── types/            # TypeScript类型定义
├── supabase/             # Supabase配置
└── public/               # 静态资源
```

## 🔧 配置说明

### API密钥配置
项目需要配置DeepSeek API密钥才能使用AI功能：
1. 前往 [DeepSeek官网](https://deepseek.com) 注册账户
2. 获取API密钥
3. 在用户设置页面配置并测试API密钥

### Supabase配置
项目使用Supabase作为后端服务，提供：
- 用户认证系统
- 数据库存储
- API密钥加密存储

## 🤝 贡献指南

1. Fork项目到个人仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 详情请查看 [LICENSE](LICENSE) 文件。

## 🆘 支持与帮助

### 常见问题

**Q: 如何获取DeepSeek API密钥？**
A: 访问DeepSeek官网注册账户并获取API密钥。

**Q: 为什么需要配置自己的API密钥？**
A: 本项目为开源项目，同时为了保证服务稳定性和用户数据安全，我们要求用户使用自己的API密钥。

**Q: 支持哪些AI模型？**
A: 目前主要支持DeepSeek系列模型，未来将支持更多模型。

## 🎯 路线图

### 已完成 ✅
- [x] 基础AI Agent架构
- [x] 用户认证系统
- [x] 分镜管理功能
- [x] 基础视觉方案生成
- [x] API密钥管理

### 进行中 🚧
- [ ] 实时协作功能
- [ ] 移动端适配
- [ ] 高级视觉效果

### 计划中 📋
- [ ] 视频生成集成
- [ ] 场景预览
- [ ] 插件系统

---

**CinemaAI Studio** - 让每个故事都能绽放视觉生命力 ✨

*Built with ❤️ by 猪猪乾坤屁💨（小红书：357374401）*

*This project was created with [Lovable](https://lovable.dev)*
