# NPC Chat

一个基于 Electron 的 AI 驱动角色扮演聊天应用。支持与多个 AI 角色进行沉浸式对话互动，自动生成剧情发展。

![Electron](https://img.shields.io/badge/Electron-47848F?style=flat&logo=electron&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat&logo=sqlite&logoColor=white)

## ✨ 功能特性

### 🎭 角色扮演
- **多角色聊天室**：创建不同主题的聊天室，为每个聊天室添加独特的 AI 角色
- **角色设定**：为每个角色定义独特的性格、背景和对话风格
- **身份模式**：支持"演绎者模式"（扮演角色）和"旁观者模式"（引导剧情）

### 🤖 AI 驱动
- **多平台支持**：
  - OpenAI (GPT-4, GPT-3.5)
  - Azure OpenAI
  - Qwen (千问)
  - DeepSeek (深度求索)
  - Moonshot (月之暗面)
  - Zhipu AI (智谱 AI)
  - Baichuan (百川)
  - MiniMax
  - Ollama (本地模型)
  - LM Studio (本地模型)
  - 自定义 OpenAI 兼容服务

- **生成长度控制**：4 档可调
  - 简洁（~50-100 字）
  - 中等（~100-200 字）
  - 详细（~200-400 字）
  - 极长（~400-800 字）

- **智能剧情生成**：AI 根据世界设定、角色性格和对话历史自动生成连贯剧情

### 🚀 快速开始
- **Demo 模板**：内置 6 个预设场景
  - 奇幻酒馆
  - 赛博朋克夜城
  - 侦探事务所
  - 校园文学部
  - 星际空间站
  - 修仙门派
- **一键创建**：点击⚡图标快速创建房间和角色

### 💬 对话体验
- **继续剧情**：无需输入，点击按钮让 AI 自动继续
- **多角色互动**：多个 AI 角色可同时参与对话
- **旁白系统**：AI 可生成旁白推动剧情发展
- **时间显示**：智能的时间戳显示（刚刚/分钟前/小时前等）

## 📦 安装

### 前置要求
- Node.js >= 18
- npm >= 9

### 安装步骤

```bash
# 克隆项目
git clone <repository-url>
cd npcchat

# 安装依赖
npm install

# 开发模式运行
npm run dev

# 构建生产版本
npm run build
```

## 📦 打包发布

### 打包命令

```bash
# 打包当前平台
npm run dist

# 仅打包 Windows
npm run dist:win

# 仅打包 macOS
npm run dist:mac

# 仅打包 Linux
npm run dist:linux

# 仅打包不生成安装文件（解压版）
npm run package
```

### 输出位置
- 打包完成后，安装包位于 `dist/` 目录
- Windows: `dist/NPC Chat-1.0.0-Setup.exe`

### 注意事项
1. **首次打包前可能需要重建原生模块**：
   ```bash
   npm run rebuild
   ```

2. **跨平台打包**需要使用对应的操作系统，或在 CI/CD 环境中进行

3. **Windows 打包**需要 [Visual Studio Build Tools](https://visualstudio.microsoft.com/downloads/)

4. **macOS 打包**需要 Xcode Command Line Tools

## 🛠️ 技术栈

| 分类 | 技术 |
|------|------|
| 框架 | Electron 30 |
| 前端 | React 18 + TypeScript |
| 构建 | Vite 5 |
| UI 组件 | shadcn/ui |
| 状态管理 | Zustand |
| 数据库 | Better-SQLite3 |
| AI SDK | OpenAI Node.js |

## 📁 项目结构

```
npcchat/
├── src/
│   ├── main/              # Electron 主进程
│   │   ├── services/      # 核心服务 (AIService, StorageService)
│   │   ├── ipc/           # IPC 通信处理器
│   │   └── database/      # SQLite 数据库
│   ├── renderer/          # 渲染进程 (前端)
│   │   ├── components/    # React 组件
│   │   ├── store/         # Zustand 状态管理
│   │   ├── services/      # 前端服务 (IPC API)
│   │   └── types/         # TypeScript 类型定义
│   ├── preload/           # Preload 脚本
│   └── shared/            # 主进程/渲染进程共享代码
├── package.json
├── tsconfig.json
├── tsconfig.node.json
└── tsconfig.web.json
```

## 🎮 使用指南

### 1. 配置 AI 服务
1. 首次打开应用，点击右下角设置图标
2. 选择 AI 服务提供商（如 OpenAI、DeepSeek 等）
3. 填入 API 密钥
4. （可选）配置自定义 Base URL 和模型名称

### 2. 创建聊天室
**方式一：快速创建 Demo**
- 点击侧边栏 ⚡ 图标
- 选择喜欢的模板
- 点击"创建房间"

**方式二：自定义创建**
- 点击侧边栏 + 图标
- 输入房间名称和世界设定
- 手动添加角色

### 3. 开始对话
1. 选择身份模式（演绎者/旁观者）
2. 在输入框输入消息
3. 按 Enter 发送，AI 自动回复
4. 点击"继续剧情"让故事自然发展

## 📝 API 配置示例

| 服务商 | Base URL | 推荐模型 |
|--------|----------|----------|
| OpenAI | https://api.openai.com/v1 | gpt-3.5-turbo |
| DeepSeek | https://api.deepseek.com/v1 | deepseek-chat |
| Moonshot | https://api.moonshot.cn/v1 | moonshot-v1-8k |
| Zhipu | https://open.bigmodel.cn/api/paas/v4 | glm-4 |
| Ollama | http://localhost:11434/v1 | ollama 本地模型 |

## 🔧 开发

```bash
# 类型检查
npm run typecheck

# 代码格式化
npm run lint

# 仅构建
npm run build
```

## 📄 许可证

MIT License

## 🙏 致谢

- [shadcn/ui](https://ui.shadcn.com/) - UI 组件库
- [electron-toolkit](https://github.com/alex8088/electron-toolkit) - Electron 开发工具

---

**注意**：本应用需要用户自行准备 AI 服务的 API 密钥。部分服务商可能需要在对应平台注册账号并开通服务。
