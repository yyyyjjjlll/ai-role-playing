# NPC Chat 开发上下文

**项目位置**: `E:\electron_app\2512\npcchat`

**最后更新时间**: 2026-03-24

---

## 项目概述

NPC Chat 是一个基于 AI 的角色扮演与剧情生成工具，支持：
- 创建聊天室和角色
- 两种模式：聊天室模式和沉浸模式
- AI 驱动的对话生成和图像生成
- 用户可选择演绎者（参与剧情）或旁观者（观察剧情）身份

---

## 技术栈

| 类别 | 技术 |
|------|------|
| **框架** | Electron + Vite + React 18 + TypeScript |
| **UI** | Tailwind CSS v3 + shadcn/ui |
| **状态管理** | Zustand |
| **数据库** | better-sqlite3 (SQLite) |
| **AI** | OpenAI SDK (兼容多提供商) |
| **构建** | electron-vite |

---

## 项目结构

```
npcchat/
├── src/
│   ├── main/                    # 主进程
│   │   ├── index.ts             # 主进程入口
│   │   ├── database/
│   │   │   └── db.ts            # 数据库连接和初始化
│   │   ├── services/
│   │   │   ├── StorageService.ts # 存储服务
│   │   │   ├── AssetService.ts   # 资源服务（图片上传）
│   │   │   └── AIService.ts      # AI 服务（多提供商支持）
│   │   ├── ipc/
│   │   │   ├── channels.ts       # IPC 通道常量
│   │   │   ├── storageHandlers.ts # 存储 IPC 处理器
│   │   │   ├── assetHandlers.ts   # 资源 IPC 处理器
│   │   │   └── aiHandlers.ts      # AI IPC 处理器
│   │   └── types/
│   │       └── index.ts          # 主进程类型定义
│   │
│   ├── preload/
│   │   └── index.ts              # 预加载脚本（contextBridge）
│   │
│   └── renderer/                 # 渲染进程（React）
│       ├── src/
│       │   ├── App.tsx           # 根组件
│       │   ├── types/index.ts    # 渲染进程类型
│       │   ├── store/
│       │   │   └── appStore.ts   # Zustand store
│       │   ├── services/
│       │   │   ├── storageApi.ts # 存储 API 封装
│       │   │   ├── assetApi.ts   # 资源 API 封装
│       │   │   └── aiApi.ts      # AI API 封装
│       │   ├── components/
│       │   │   ├── Layout/
│       │   │   │   ├── AppLayout.tsx
│       │   │   │   └── MainContent.tsx
│       │   │   ├── Sidebar/
│       │   │   │   └── RoomSidebar.tsx
│       │   │   ├── Dialog/
│       │   │   │   ├── NewRoomDialog.tsx
│       │   │   │   ├── NewCharacterDialog.tsx
│       │   │   │   └── ApiKeyDialog.tsx
│       │   │   ├── CharacterList.tsx
│       │   │   ├── MessageList.tsx
│       │   │   ├── ChatInput.tsx
│       │   │   └── ui/           # shadcn/ui 组件
│       │   └── lib/
│       │       └── utils.ts      # 工具函数
│       └── index.html
│
├── electron.vite.config.ts       # Vite 配置
├── tailwind.config.js            # Tailwind 配置
├── tsconfig.json                 # TypeScript 配置
└── package.json
```

---

## 数据库架构

```sql
-- 聊天室
CREATE TABLE rooms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  world_setting TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
)

-- 角色
CREATE TABLE characters (
  id TEXT PRIMARY KEY,
  room_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  portrait_url TEXT,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
)

-- 消息
CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  room_id TEXT NOT NULL,
  character_id TEXT,
  type TEXT NOT NULL, -- 'user' | 'ai' | 'narrator'
  content TEXT NOT NULL,
  timestamp INTEGER NOT NULL,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
  FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE SET NULL
)

-- 用户身份
CREATE TABLE user_identities (
  room_id TEXT PRIMARY KEY,
  type TEXT NOT NULL, -- 'actor' | 'observer'
  character_id TEXT,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
  FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE SET NULL
)
```

---

## 核心功能

### 1. 房间管理
- 创建/删除聊天室
- 设置世界背景
- 房间列表侧边栏

### 2. 角色管理
- 添加角色到房间
- 上传角色立绘（或 AI 生成）
- 角色卡片展示

### 3. 消息系统
- 用户发送消息
- AI 自动生成响应（角色对话 + 旁白）
- 消息持久化
- 自动滚动到底部
- 加载状态显示

### 4. AI 服务（多提供商支持）
支持的提供商：
- **云服务**: OpenAI, DeepSeek, Moonshot, Zhipu, Baichuan, MiniMax
- **本地**: Ollama, LM Studio
- **自定义**: 任何兼容 OpenAI API 格式的服务

AI 响应格式：
```
[角色名]: 对话内容
【旁白】旁白内容
```

### 5. 用户身份系统
- **演绎者模式**: 用户扮演特定角色，AI 控制其他角色
- **旁观者模式**: AI 控制所有角色，用户引导故事

---

## IPC 通道

### 存储通道 (`StorageChannels`)
```typescript
'storage:rooms:getAll'
'storage:rooms:getById'
'storage:rooms:create'
'storage:rooms:update'
'storage:rooms:delete'
'storage:characters:getByRoom'
'storage:characters:getById'
'storage:characters:create'
'storage:characters:update'
'storage:characters:delete'
'storage:messages:getByRoom'
'storage:messages:getRecent'
'storage:messages:create'
'storage:messages:delete'
'storage:userIdentity:get'
'storage:userIdentity:set'
'storage:userIdentity:delete'
```

### AI 通道 (`AIChannels`)
```typescript
'ai:getProviders'      // 获取所有可用提供商
'ai:setProvider'       // 设置 AI 提供商
'ai:setApiKey'         // 设置 API 密钥
'ai:setBaseUrl'        // 设置 API 地址
'ai:setModel'          // 设置模型名称
'ai:getConfig'         // 获取当前配置
'ai:checkConfigured'   // 检查是否已配置
'ai:generateResponse'  // 生成 AI 响应
```

### 资源通道 (`AssetChannels`)
```typescript
'assets:uploadImage'
'assets:getAssetPath'
```

---

## Zustand Store 结构

```typescript
interface AppState {
  // 状态
  rooms: Room[]
  characters: Character[]
  messages: Message[]
  currentRoomId: string | null
  userIdentities: Map<string, UserIdentity>
  presentationMode: 'chat' | 'immersive'
  isLoading: boolean

  // 同步操作
  setRooms, setCurrentRoom, addRoom, updateRoom, deleteRoom
  setCharacters, addCharacter, updateCharacter, deleteCharacter
  setMessages, addMessage
  setUserIdentity, getUserIdentity
  setPresentationMode, setLoading

  // 异步操作
  loadRooms, loadRoom
  createRoomAsync
  createCharacterAsync
  sendMessageAsync
  sendUserMessageWithAIResponse  // 发送消息并触发 AI 响应
  saveUserIdentityAsync
}
```

---

## 关键文件说明

### `src/main/services/AIService.ts`
核心 AI 服务类，功能：
- 支持 10 种 AI 提供商切换
- 情境构建（世界设定 + 角色描述 + 消息历史）
- AI 响应生成和解析
- 错误处理和重试

### `src/renderer/src/store/appStore.ts`
全局状态管理，关键方法：
- `sendUserMessageWithAIResponse`: 发送用户消息并自动触发 AI 响应
- AI 响应拆分为多条消息（旁白 + 各角色对话）

### `src/renderer/src/components/Dialog/ApiKeyDialog.tsx`
AI 配置对话框，功能：
- 提供商选择下拉列表
- API 地址和模型配置
- 本地服务状态提示

---

## 开发命令

```bash
# 开发模式
npm run dev

# 构建
npm run build

# 类型检查
npm run typecheck

# 启动应用
npm start
```

---

## 待完成功能（根据 tasks-zh.md）

### 里程碑 6: 聊天模式完成
- [ ] 任务 6.1: 构建身份选择 UI
- [ ] 任务 6.2: 根据身份调整 AI 提示
- [ ] 任务 6.3: 润色聊天模式 UI

### 里程碑 7: 沉浸模式 UI
- [ ] 任务 7.1: 创建沉浸模式布局
- [ ] 任务 7.2: 在沉浸模式中显示消息
- [ ] 任务 7.3: 添加过渡动画

### 里程碑 8: AI 图像生成
- [ ] 任务 8.1: 集成图像生成 API
- [ ] 任务 8.2: 实现 AI 立绘生成
- [ ] 任务 8.3: 实现场景背景生成

### 里程碑 9: 模式切换和润色
- [ ] 任务 9.1: 实现模式切换
- [ ] 任务 9.2: 添加加载状态
- [ ] 任务 9.3: 实现错误处理
- [ ] 任务 9.4: 添加空状态和引导
- [ ] 任务 9.5: 性能优化
- [ ] 任务 9.6: 最终 UI 润色

---

## 常见问题和解决方案

### 1. better-sqlite3 编译问题
```bash
npm install -D @electron/rebuild
npx electron-rebuild -f -w better-sqlite3
```

### 2. `__dirname is not defined` 错误
原因：在 ESM 模块中直接使用 `__dirname`
解决：
```typescript
import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
```

### 3. Electron 模块导入问题
错误：在渲染器中直接导入 `electron` 模块
解决：使用 `window.electron.ipcRenderer` 代替

---

## AI 提供商配置参考

### DeepSeek
- 官网：https://platform.deepseek.com
- 模型：deepseek-chat, deepseek-coder
- 价格：约 ¥0.14/1K tokens

### Moonshot (月之暗面)
- 官网：https://platform.moonshot.cn
- 模型：moonshot-v1-8k, moonshot-v1-32k
- 特点：长文本处理

### Zhipu AI (智谱)
- 官网：https://open.bigmodel.cn
- 模型：glm-4, glm-3-turbo
- 特点：中文优化

### Ollama (本地)
- 官网：https://ollama.ai
- 模型：Llama 3, Mistral, Qwen 等
- 启动：`ollama serve` (端口 11434)

### LM Studio (本地)
- 官网：https://lmstudio.ai
- 模型：支持 GGUF 格式模型
- 启动：开启 Local Server (端口 1234)

---

## 下一步开发建议

1. **优先完成聊天模式** (里程碑 6)
   - 实现用户身份选择器
   - 完善 AI 提示以区分演绎者/旁观者模式

2. **添加 Toast 通知**
   - 安装 shadcn/ui Toast 组件
   - 用于 AI 错误、保存成功等反馈

3. **实现沉浸模式** (里程碑 7)
   - 视觉小说风格布局
   - 背景和立绘层
   - 对话框组件

4. **图像生成集成** (里程碑 8)
   - DALL-E 3 或 Stable Diffusion
   - 自动立绘生成
   - 场景背景生成

---

## 文件修改历史（本次对话）

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/main/services/AIService.ts` | 扩展 | 添加多提供商支持 |
| `src/main/ipc/aiHandlers.ts` | 创建/扩展 | AI IPC 处理器 |
| `src/main/ipc/channels.ts` | 扩展 | 添加 AI 通道 |
| `src/renderer/src/services/aiApi.ts` | 扩展 | AI API 封装 |
| `src/renderer/src/store/appStore.ts` | 扩展 | 添加 `sendUserMessageWithAIResponse` |
| `src/renderer/src/components/MessageList.tsx` | 扩展 | AI 消息样式、加载状态 |
| `src/renderer/src/components/ChatInput.tsx` | 创建 | 聊天输入组件 |
| `src/renderer/src/components/Dialog/ApiKeyDialog.tsx` | 扩展 | 提供商选择 UI |
| `src/renderer/src/App.tsx` | 扩展 | API 密钥状态按钮 |
| `src/renderer/src/components/ui/textarea.tsx` | 创建 | Textarea 组件 |
| `src/renderer/src/components/ui/select.tsx` | 创建 | Select 组件 |

---

**备注**: 此文件应由 AI 在下次对话开始时阅读，以快速理解项目状态和上下文。
