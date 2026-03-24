# 技术规范文档

## 1. 技术概要

这是一个基于Electron的桌面应用程序，提供AI驱动的角色扮演和叙事生成平台。MVP专注于：
- 本地优先的单用户体验与本地数据持久化
- 双重呈现模式（聊天和沉浸式视觉小说）
- AI驱动的叙事和资产生成
- 灵活的角色和房间管理

**主要技术目标**:
- 快速的本地优先体验与响应式UI
- 高效的AI集成用于文本和图像生成
- 聊天和沉浸视图之间的平滑模式切换
- 复杂叙事情境的健壮状态管理

**关键实现假设**:
- 桌面优先（Electron应用，项目结构已表明）
- 每个实例单用户（无实时协作）
- 通过API访问AI服务（OpenAI GPT-4用于文本，DALL-E/Stable Diffusion用于图像）
- 本地存储用于数据持久化（SQLite或JSON文件）
- MVP不需要身份验证

## 2. 推荐技术栈

### 前端
- **框架**: React 18+ with TypeScript
- **UI库**: shadcn/ui + Radix UI 基础组件
- **样式**: Tailwind CSS
- **状态管理**: Zustand（轻量级，适合Electron）
- **路由**: React Router v6（用于视图管理）
- **Markdown/富文本**: react-markdown 用于旁白文本格式化

**原因**: React + TypeScript 提供类型安全和组件可重用性。shadcn/ui 提供可访问、可定制的组件，非常适合聊天和沉浸模式。Tailwind 支持快速UI开发。Zustand 比 Redux 更简单，适合此范围。

### 后端/Electron
- **运行时**: Electron（已在项目结构中）
- **进程架构**: 主进程用于文件I/O和API调用，渲染进程用于UI
- **IPC**: Electron IPC 用于进程间安全通信

**原因**: Electron 提供使用Web技术的原生桌面体验。主进程处理敏感操作（API密钥、文件系统）。

### 数据库
- **存储**: SQLite（通过 better-sqlite3）
- **架构管理**: 手动迁移（MVP足够简单）
- **替代方案**: 带原子写入的本地JSON文件（更简单但扩展性较差）

**原因**: SQLite 是无服务器的、可靠的，非常适合本地优先的桌面应用。不需要单独的数据库服务器。

### AI集成
- **文本生成**: OpenAI API（GPT-4 或 GPT-3.5-turbo）
- **图像生成**:
  - 角色立绘: DALL-E 3 或 Stable Diffusion API
  - 背景: Stable Diffusion（成本更低，生成更快）
- **API客户端**: 原生 fetch 带重试逻辑

**原因**: OpenAI 提供一流的文本生成。DALL-E 用于高质量立绘，Stable Diffusion 用于经济实惠的背景。

### 开发工具
- **构建工具**: Vite（快速、现代，与Electron良好配合）
- **Electron构建器**: electron-builder 用于打包
- **代码检查**: ESLint + Prettier
- **测试**: Vitest（单元测试），Playwright（如需E2E测试）

## 3. 系统范围

### 需要的系统/模块
1. **聊天室管理器**: 房间的CRUD操作
2. **角色管理器**: 创建、编辑、删除角色
3. **消息处理器**: 处理用户输入，发送到AI，显示响应
4. **AI服务连接器**: 与OpenAI和图像生成API的接口
5. **呈现层**: 双重视图（聊天模式、沉浸模式）
6. **本地存储管理器**: 持久化房间、角色、消息、图像
7. **资产管理器**: 处理图像上传和AI生成的资产

### 明确排除
- 用户认证系统
- 云同步或多设备支持
- 实时协作功能
- 语音或音频系统
- 战斗/游戏机制
- 分析或遥测
- 自动更新机制（可稍后添加）

## 4. 高层架构

```
┌─────────────────────────────────────────────────────────┐
│                  Electron 主进程                         │
│  - API密钥管理                                           │
│  - 文件系统操作（SQLite、图像缓存）                      │
│  - AI服务通信（OpenAI、Stable Diffusion）                │
└────────────────┬────────────────────────────────────────┘
                 │ IPC
                 │
┌────────────────▼────────────────────────────────────────┐
│                Electron 渲染进程                         │
│                                                          │
│  ┌────────────────────────────────────────────────┐   │
│  │              React 应用                         │   │
│  │                                                 │   │
│  │  ┌─────────────┐  ┌──────────────────────┐   │   │
│  │  │  左侧面板   │  │   主内容区域         │   │   │
│  │  │  (房间列表) │  │                       │   │   │
│  │  │             │  │  ┌────────────────┐  │   │   │
│  │  │  - 房间 1   │  │  │  聊天模式      │  │   │   │
│  │  │  - 房间 2   │  │  │  或            │  │   │   │
│  │  │  - 房间 3   │  │  │  沉浸模式      │  │   │   │
│  │  │             │  │  └────────────────┘  │   │   │
│  │  └─────────────┘  └──────────────────────┘   │   │
│  │                                                 │   │
│  │  状态: Zustand Store                           │   │
│  │  - rooms, characters, messages, currentRoom    │   │
│  └────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                 │
                 │ HTTP API 调用
                 ▼
┌─────────────────────────────────────────────────────────┐
│              外部服务                                   │
│  - OpenAI API（文本生成）                               │
│  - DALL-E / Stable Diffusion（图像生成）                │
└─────────────────────────────────────────────────────────┘
```

## 5. 核心模块

### 5.1 房间管理器
- **目的**: 管理聊天室生命周期
- **职责**:
  - 创建带元数据的新房间
  - 列出所有房间
  - 删除房间
  - 切换活动房间
- **输入**: 房间名称、设置
- **输出**: 带ID的房间对象
- **依赖**: 存储管理器

### 5.2 角色管理器
- **目的**: 处理房间内的角色CRUD
- **职责**:
  - 创建带名称、描述的角色
  - 处理立绘上传（文件或URL）
  - 触发AI立绘生成
  - 将角色链接到用户（用于演绎者模式）
- **输入**: 角色数据、可选图像
- **输出**: 带立绘的角色对象
- **依赖**: AI服务、资产管理器、存储管理器

### 5.3 消息处理器
- **目的**: 处理对话流程
- **职责**:
  - 接受用户输入
  - 维护对话情境
  - 将情境发送到AI服务
  - 解析AI响应（角色对话、旁白文本）
  - 存储消息
- **输入**: 用户消息、当前情境
- **输出**: AI生成的消息
- **依赖**: AI服务、存储管理器

### 5.4 AI服务连接器
- **目的**: 与外部AI API的接口
- **职责**:
  - 文本生成（叙事、角色响应）
  - 角色立绘生成
  - 背景图像生成
  - 处理API错误和重试
  - 流式响应（如支持）
- **输入**: 提示、情境、图像生成规格
- **输出**: 生成的文本、图像URL/缓冲区
- **依赖**: 无（外部API客户端）

### 5.5 呈现层
- **目的**: 在聊天或沉浸模式下渲染内容
- **职责**:
  - **聊天模式**: 按时间顺序显示带角色标签的消息
  - **沉浸模式**: 显示角色立绘、背景、对话框
  - 模式切换
  - 响应式布局
- **输入**: 消息、角色、背景、模式选择
- **输出**: 渲染的UI
- **依赖**: 消息处理器、资产管理器

### 5.6 存储管理器
- **目的**: 本地持久化所有应用数据
- **职责**:
  - 保存/加载房间、角色、消息
  - 缓存AI生成的图像
  - 处理架构迁移（简单）
  - 原子写入以防止损坏
- **输入**: 数据对象
- **输出**: 持久化数据、查询结果
- **依赖**: SQLite 或 JSON文件系统

### 5.7 资产管理器
- **目的**: 处理图像资产
- **职责**:
  - 验证和存储上传的图像
  - 从URL下载图像
  - 本地缓存AI生成的图像
  - 向UI提供图像
- **输入**: 图像文件、URL、base64数据
- **输出**: 本地文件路径或数据URI
- **依赖**: 文件系统（通过Electron主进程）

## 6. 数据模型

### 6.1 Room（房间）
```typescript
interface Room {
  id: string;              // UUID
  name: string;
  createdAt: number;       // 时间戳
  updatedAt: number;
  settings: {
    worldSetting?: string; // 可选的世界描述
    narratorEnabled: boolean;
  };
}
```

### 6.2 Character（角色）
```typescript
interface Character {
  id: string;              // UUID
  roomId: string;          // Room的外键
  name: string;
  description: string;     // 角色设定/性格
  portraitUrl?: string;    // 本地文件路径或远程URL
  isAIGenerated: boolean;  // 立绘是否AI生成
  createdAt: number;
}
```

### 6.3 Message（消息）
```typescript
interface Message {
  id: string;
  roomId: string;
  characterId?: string;    // 旁白消息为null
  content: string;
  type: 'user' | 'ai' | 'narrator' | 'system';
  timestamp: number;
  metadata?: {
    backgroundUrl?: string; // 用于沉浸模式
  };
}
```

### 6.4 UserIdentity（用户身份）
```typescript
interface UserIdentity {
  roomId: string;
  role: 'actor' | 'observer'; // 演绎者 | 旁观者
  assignedCharacterId?: string; // 仅用于演绎者角色
}
```

### 6.5 AppState（应用状态 - Zustand Store）
```typescript
interface AppState {
  rooms: Room[];
  currentRoomId: string | null;
  characters: Record<string, Character[]>; // 按roomId索引
  messages: Record<string, Message[]>;     // 按roomId索引
  userIdentities: Record<string, UserIdentity>; // 按roomId索引
  presentationMode: 'chat' | 'immersive';

  // 操作
  createRoom: (name: string) => void;
  deleteRoom: (roomId: string) => void;
  setCurrentRoom: (roomId: string) => void;
  addCharacter: (roomId: string, character: Omit<Character, 'id' | 'createdAt'>) => void;
  sendMessage: (roomId: string, content: string) => void;
  setUserIdentity: (roomId: string, identity: UserIdentity) => void;
  togglePresentationMode: () => void;
}
```

## 7. API / 接口契约

### 7.1 Electron IPC 契约

#### 主进程 → 渲染进程
- `room:created` - 通知房间创建完成
- `character:portrait-generated` - AI立绘就绪
- `message:ai-response` - 收到AI响应
- `error:ai-service` - AI服务错误

#### 渲染进程 → 主进程
- `room:create` - 创建新房间
- `room:load-all` - 加载所有房间
- `character:create` - 创建角色
- `character:generate-portrait` - 请求AI立绘
- `message:send` - 发送用户消息
- `ai:generate-text` - 请求AI叙事
- `ai:generate-background` - 请求场景背景

### 7.2 AI服务契约

#### 文本生成
```typescript
interface TextGenerationRequest {
  context: {
    worldSetting?: string;
    characters: Character[];
    recentMessages: Message[];
    userInput: string;
    userRole: 'actor' | 'observer';
  };
}

interface TextGenerationResponse {
  characterDialogues: Array<{
    characterId: string;
    text: string;
  }>;
  narratorText?: string;
  suggestedBackground?: string; // 用于图像生成的场景描述
}
```

#### 图像生成
```typescript
interface ImageGenerationRequest {
  type: 'character-portrait' | 'scene-background';
  prompt: string;
  style?: string;
}

interface ImageGenerationResponse {
  imageUrl: string;      // URL 或 base64
  cached: boolean;
}
```

### 7.3 存储契约

```typescript
interface StorageService {
  // 房间
  createRoom(room: Omit<Room, 'id' | 'createdAt'>): Promise<Room>;
  getRooms(): Promise<Room[]>;
  deleteRoom(roomId: string): Promise<void>;

  // 角色
  createCharacter(character: Omit<Character, 'id' | 'createdAt'>): Promise<Character>;
  getCharactersByRoom(roomId: string): Promise<Character[]>;

  // 消息
  createMessage(message: Omit<Message, 'id' | 'timestamp'>): Promise<Message>;
  getMessagesByRoom(roomId: string, limit?: number): Promise<Message[]>;

  // 资产
  saveImage(imageData: Buffer | string, filename: string): Promise<string>;
  getImagePath(filename: string): Promise<string>;
}
```

## 8. 状态和数据流

### 8.1 客户端状态（Zustand）
- 在内存中保存所有房间、角色、消息，以便快速访问
- 通过Electron IPC与本地存储同步
- 由用户操作和AI响应触发更新

### 8.2 数据流：用户发送消息

1. 用户在UI中输入消息（聊天或沉浸模式）
2. 渲染进程调用 `appState.sendMessage(roomId, content)`
3. Zustand操作：
   - 创建用户消息对象
   - 添加到本地状态（乐观更新）
   - 发送IPC `message:send` 到主进程
4. 主进程：
   - 将消息保存到SQLite
   - 收集情境（最近消息、角色、世界设定）
   - 使用情境调用OpenAI API
   - 解析AI响应
   - 发送IPC `message:ai-response` 返回渲染进程
5. 渲染进程收到AI响应：
   - 将AI消息添加到状态
   - 如果是沉浸模式 + 新场景，触发背景生成
6. UI通过React重新渲染自动更新

### 8.3 数据流：使用AI立绘创建角色

1. 用户填写角色表单，立绘留空
2. 渲染进程调用 `appState.addCharacter(roomId, characterData)`
3. Zustand操作：
   - 创建 `isAIGenerated: true` 的角色
   - 发送IPC `character:create` + `character:generate-portrait`
4. 主进程：
   - 将角色保存到SQLite
   - 使用角色描述调用图像生成API（DALL-E）
   - 本地保存生成的图像
   - 发送IPC `character:portrait-generated` 带图像路径
5. 渲染进程使用立绘URL更新角色
6. UI显示带立绘的角色

### 8.4 加载/错误/空状态处理
- **加载**: 在AI生成期间显示加载动画，禁用输入
- **错误**: 显示提示通知，为失败的AI调用提供重试选项
- **空状态**: 为空房间列表、角色列表显示引导提示

### 8.5 缓存策略
- AI生成的图像本地缓存（永不重新生成相同提示）
- 消息历史限制为最后50条消息用于AI情境（可配置）
- 角色数据和立绘无限期持久保存

## 9. 安全和权限考虑

### 9.1 身份验证
- **MVP**: 不需要身份验证（单用户桌面应用）
- **未来**: 可选的云同步账户系统

### 9.2 API密钥管理
- 在Electron主进程中存储OpenAI和图像生成API密钥
- 使用环境变量或加密的本地配置文件
- 永不向渲染进程暴露密钥

### 9.3 输入验证
- 发送到AI前清理用户输入（防止提示注入）
- 验证图像上传（文件类型、大小限制：最大10MB）
- 渲染前清理AI响应（XSS防护）

### 9.4 数据隐私
- 所有数据本地存储（MVP无遥测）
- 用户控制所有数据（可删除房间、角色）
- AI API调用：使用用户自己的API密钥（用户拥有其数据）

### 9.5 滥用防护
- AI调用速率限制（最多10次请求/分钟）
- 图像生成成本跟踪（高使用量时警告用户）

## 10. 非功能性技术期望

### 10.1 性能
- UI响应时间：所有用户交互 < 100ms
- AI文本生成：< 5秒（目标 < 3秒）
- AI图像生成：< 15秒（立绘可接受）
- 模式切换：< 500ms

### 10.2 可靠性
- 立即自动保存所有更改（不需要"保存"按钮）
- AI服务不可用时优雅降级（显示错误，允许重试）
- 使用原子写入防止数据损坏

### 10.3 响应性
- 桌面优化（最小分辨率1280x720）
- 侧边栏可在较小屏幕上折叠
- 模式转换的平滑动画

### 10.4 可访问性
- 键盘导航支持
- 屏幕阅读器友好（ARIA标签）
- 高对比度模式支持（通过系统偏好）

### 10.5 可维护性
- TypeScript提供类型安全
- 基于组件的架构（易于测试）
- 清晰的关注点分离（UI、状态、存储、AI）
- 全面的错误日志记录

### 10.6 测试基线
- 核心逻辑的单元测试（AI服务、存储）
- IPC通信的集成测试
- MVP的手动E2E测试（MVP后自动化）

## 11. 交付风险和权衡

### 11.1 AI服务延迟
- **风险**: 缓慢的AI响应使用户沮丧
- **缓解**:
  - 显示加载指示器
  - 如API支持则流式传输响应
  - 设置现实的超时限制（最多30秒）

### 11.2 图像生成成本
- **风险**: 如果用户生成许多背景，每张图像成本高
- **缓解**:
  - 积极缓存
  - 对背景使用较低成本模型（Stable Diffusion）
  - 限制背景生成（每5条消息最多1次）

### 11.3 情境窗口限制
- **风险**: 长对话超出AI情境限制
- **缓解**:
  - 总结旧消息
  - 仅保留最后50条消息在情境中
  - 实现"场景边界"以重置情境

### 11.4 沉浸模式复杂性
- **风险**: 沉浸模式的复杂UI可能延迟MVP
- **缓解**:
  - 从简单的视觉小说布局开始
  - 重用shadcn/ui组件（对话框、卡片）
  - 将高级动画推迟到MVP后

### 11.5 数据迁移
- **风险**: 架构更改破坏现有用户数据
- **缓解**:
  - 版本化数据库架构
  - 架构更改前编写迁移脚本
  - 使用样本数据测试迁移

### 11.6 速度 vs 可维护性
- **权衡**: SQLite（更多设置）vs JSON文件（更简单）
- **决策**: 使用SQLite以获得更好的数据完整性和查询性能
- **理由**: 复杂性可管理，收益超过设置成本

## 12. 建议的构建顺序

1. **设置Electron + React + TypeScript样板**
   - Electron的Vite配置
   - 基本IPC设置
   - ESLint、Prettier

2. **实现本地存储（SQLite）**
   - 定义架构
   - 创建存储服务
   - 测试CRUD操作

3. **构建房间管理器（UI + 逻辑）**
   - 左侧边栏组件
   - 房间列表显示
   - 创建房间流程

4. **构建角色管理器（UI + 逻辑）**
   - 角色创建表单
   - 房间中的角色列表
   - 图像上传处理

5. **实现AI文本生成**
   - OpenAI API集成
   - 情境构建逻辑
   - 响应解析

6. **构建聊天模式呈现**
   - 消息列表组件
   - 用户输入组件
   - 显示角色消息 + 旁白

7. **实现用户身份系统**
   - 身份选择UI
   - 将身份链接到角色（演绎者模式）
   - 根据角色调整AI提示

8. **构建沉浸模式呈现**
   - 视觉小说布局
   - 角色立绘显示
   - 对话框样式

9. **实现AI图像生成**
   - 角色立绘生成
   - 基于场景的背景生成
   - 图像缓存

10. **实现模式切换**
    - 在聊天和沉浸之间切换
    - 跨模式保留状态

11. **错误处理和边缘情况**
    - 加载状态
    - 错误消息
    - 空状态

12. **润色和测试**
    - 平滑过渡
    - 性能优化
    - 手动测试

## 13. 开放问题

1. **AI模型选择**: 我们应该支持多个AI提供商（OpenAI、Anthropic、本地模型）吗？
   - **解决方案**: 仅从OpenAI开始，使其在MVP后可交换

2. **图像缓存策略**: 我们应该无限期缓存所有AI生成的图像吗？
   - **解决方案**: 是的，但实现手动缓存清除

3. **情境总结**: 如何处理非常长的对话？
   - **解决方案**: 将旧消息总结为简短的"故事至今"（MVP后）

4. **背景生成频率**: 背景应该多久重新生成一次？
   - **解决方案**: 仅当场景显著变化时（通过AI检测或手动用户触发）

5. **离线模式**: 应用应该在没有互联网的情况下工作（无AI功能）吗？
   - **解决方案**: 是的，允许离线查看已保存内容，优雅地禁用AI功能

6. **导出功能**: 用户应该能够导出对话吗？
   - **解决方案**: MVP范围外，MVP后添加（markdown导出）
