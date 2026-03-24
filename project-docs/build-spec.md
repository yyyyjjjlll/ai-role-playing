# Build Spec

## 1. Technical Summary

This is an Electron-based desktop application that provides an AI-powered role-playing and narrative generation platform. The MVP focuses on:
- Single-user experience with local data persistence
- Dual presentation modes (chat and immersive visual novel)
- AI-driven narrative and asset generation
- Flexible character and room management

**Main Technical Goals**:
- Fast local-first experience with responsive UI
- Efficient AI integration for text and image generation
- Smooth mode switching between chat and immersive views
- Robust state management for complex narrative contexts

**Key Implementation Assumptions**:
- Desktop-first (Electron app, already indicated by project structure)
- Single user per instance (no real-time collaboration)
- AI services accessed via API (OpenAI GPT-4 for text, DALL-E/Stable Diffusion for images)
- Local storage for data persistence (SQLite or JSON files)
- No authentication required for MVP

## 2. Recommended Tech Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **UI Library**: shadcn/ui + Radix UI primitives
- **Styling**: Tailwind CSS
- **State Management**: Zustand (lightweight, suitable for Electron)
- **Routing**: React Router v6 (for view management)
- **Markdown/Rich Text**: react-markdown for narrator text formatting

**Why**: React + TypeScript provides type safety and component reusability. shadcn/ui offers accessible, customizable components perfect for both chat and immersive modes. Tailwind enables rapid UI development. Zustand is simpler than Redux for this scope.

### Backend/Electron
- **Runtime**: Electron (already in project structure)
- **Process Architecture**: Main process for file I/O and API calls, Renderer for UI
- **IPC**: Electron IPC for secure communication between processes

**Why**: Electron provides native desktop experience with web technologies. Main process handles sensitive operations (API keys, file system).

### Database
- **Storage**: SQLite (via better-sqlite3)
- **Schema Management**: Manual migrations (simple for MVP)
- **Alternative**: Local JSON files with atomic writes (simpler but less scalable)

**Why**: SQLite is serverless, reliable, and perfect for local-first desktop apps. No separate database server needed.

### AI Integration
- **Text Generation**: OpenAI API (GPT-4 or GPT-3.5-turbo)
- **Image Generation**:
  - Character portraits: DALL-E 3 or Stable Diffusion API
  - Backgrounds: Stable Diffusion (lower cost, faster generation)
- **API Client**: Native fetch with retry logic

**Why**: OpenAI provides best-in-class text generation. DALL-E for quality portraits, Stable Diffusion for cost-effective backgrounds.

### Development Tools
- **Build Tool**: Vite (fast, modern, works well with Electron)
- **Electron Builder**: electron-builder for packaging
- **Linting**: ESLint + Prettier
- **Testing**: Vitest (unit), Playwright (E2E if needed)

## 3. System Scope

### Required Systems/Modules
1. **Chat Room Manager**: CRUD operations for rooms
2. **Character Manager**: Create, edit, delete characters
3. **Message Handler**: Process user inputs, send to AI, display responses
4. **AI Service Connector**: Interface to OpenAI and image generation APIs
5. **Presentation Layer**: Dual views (chat mode, immersive mode)
6. **Local Storage Manager**: Persist rooms, characters, messages, images
7. **Asset Manager**: Handle image uploads and AI-generated assets

### Intentionally Excluded
- User authentication system
- Cloud sync or multi-device support
- Real-time collaboration features
- Voice or audio systems
- Combat/game mechanics
- Analytics or telemetry
- Auto-update mechanism (can add later)

## 4. High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Electron Main Process                │
│  - API Key Management                                   │
│  - File System Operations (SQLite, Image Cache)        │
│  - AI Service Communication (OpenAI, Stable Diffusion) │
└────────────────┬────────────────────────────────────────┘
                 │ IPC
                 │
┌────────────────▼────────────────────────────────────────┐
│                Electron Renderer Process                │
│                                                          │
│  ┌────────────────────────────────────────────────┐   │
│  │              React Application                  │   │
│  │                                                 │   │
│  │  ┌─────────────┐  ┌──────────────────────┐   │   │
│  │  │  Left Panel │  │   Main Content Area  │   │   │
│  │  │  (Room List)│  │                       │   │   │
│  │  │             │  │  ┌────────────────┐  │   │   │
│  │  │  - Room 1   │  │  │  Chat Mode     │  │   │   │
│  │  │  - Room 2   │  │  │  or            │  │   │   │
│  │  │  - Room 3   │  │  │  Immersive Mode│  │   │   │
│  │  │             │  │  └────────────────┘  │   │   │
│  │  └─────────────┘  └──────────────────────┘   │   │
│  │                                                 │   │
│  │  State: Zustand Store                          │   │
│  │  - rooms, characters, messages, currentRoom    │   │
│  └────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                 │
                 │ HTTP API Calls
                 ▼
┌─────────────────────────────────────────────────────────┐
│              External Services                          │
│  - OpenAI API (Text Generation)                        │
│  - DALL-E / Stable Diffusion (Image Generation)        │
└─────────────────────────────────────────────────────────┘
```

## 5. Core Modules

### 5.1 Room Manager
- **Purpose**: Manage chat room lifecycle
- **Responsibilities**:
  - Create new rooms with metadata
  - List all rooms
  - Delete rooms
  - Switch active room
- **Inputs**: Room name, settings
- **Outputs**: Room objects with IDs
- **Dependencies**: Storage Manager

### 5.2 Character Manager
- **Purpose**: Handle character CRUD within rooms
- **Responsibilities**:
  - Create characters with name, description
  - Handle portrait uploads (file or URL)
  - Trigger AI portrait generation
  - Link characters to users (for 演绎者 mode)
- **Inputs**: Character data, optional image
- **Outputs**: Character objects with portraits
- **Dependencies**: AI Service, Asset Manager, Storage Manager

### 5.3 Message Handler
- **Purpose**: Process conversation flow
- **Responsibilities**:
  - Accept user inputs
  - Maintain conversation context
  - Send context to AI service
  - Parse AI responses (character dialogue, narrator text)
  - Store messages
- **Inputs**: User message, current context
- **Outputs**: AI-generated messages
- **Dependencies**: AI Service, Storage Manager

### 5.4 AI Service Connector
- **Purpose**: Interface with external AI APIs
- **Responsibilities**:
  - Text generation (narrative, character responses)
  - Character portrait generation
  - Background image generation
  - Handle API errors and retries
  - Stream responses if supported
- **Inputs**: Prompts, context, image generation specs
- **Outputs**: Generated text, image URLs/buffers
- **Dependencies**: None (external API client)

### 5.5 Presentation Layer
- **Purpose**: Render content in chat or immersive mode
- **Responsibilities**:
  - **Chat Mode**: Display messages chronologically with character labels
  - **Immersive Mode**: Show character portraits, backgrounds, dialogue boxes
  - Mode switching
  - Responsive layout
- **Inputs**: Messages, characters, backgrounds, mode selection
- **Outputs**: Rendered UI
- **Dependencies**: Message Handler, Asset Manager

### 5.6 Storage Manager
- **Purpose**: Persist all application data locally
- **Responsibilities**:
  - Save/load rooms, characters, messages
  - Cache AI-generated images
  - Handle schema migrations (simple)
  - Atomic writes to prevent corruption
- **Inputs**: Data objects
- **Outputs**: Persisted data, query results
- **Dependencies**: SQLite or JSON file system

### 5.7 Asset Manager
- **Purpose**: Handle image assets
- **Responsibilities**:
  - Validate and store uploaded images
  - Download images from URLs
  - Cache AI-generated images locally
  - Serve images to UI
- **Inputs**: Image files, URLs, base64 data
- **Outputs**: Local file paths or data URIs
- **Dependencies**: File system (via Electron main process)

## 6. Data Model

### 6.1 Room
```typescript
interface Room {
  id: string;              // UUID
  name: string;
  createdAt: number;       // timestamp
  updatedAt: number;
  settings: {
    worldSetting?: string; // Optional world description
    narratorEnabled: boolean;
  };
}
```

### 6.2 Character
```typescript
interface Character {
  id: string;              // UUID
  roomId: string;          // Foreign key to Room
  name: string;
  description: string;     // Character setting/personality
  portraitUrl?: string;    // Local file path or remote URL
  isAIGenerated: boolean;  // Whether portrait is AI-generated
  createdAt: number;
}
```

### 6.3 Message
```typescript
interface Message {
  id: string;
  roomId: string;
  characterId?: string;    // null for narrator messages
  content: string;
  type: 'user' | 'ai' | 'narrator' | 'system';
  timestamp: number;
  metadata?: {
    backgroundUrl?: string; // For immersive mode
  };
}
```

### 6.4 UserIdentity
```typescript
interface UserIdentity {
  roomId: string;
  role: 'actor' | 'observer'; // 演绎者 | 旁观者
  assignedCharacterId?: string; // Only for actor role
}
```

### 6.5 AppState (Zustand Store)
```typescript
interface AppState {
  rooms: Room[];
  currentRoomId: string | null;
  characters: Record<string, Character[]>; // Keyed by roomId
  messages: Record<string, Message[]>;     // Keyed by roomId
  userIdentities: Record<string, UserIdentity>; // Keyed by roomId
  presentationMode: 'chat' | 'immersive';

  // Actions
  createRoom: (name: string) => void;
  deleteRoom: (roomId: string) => void;
  setCurrentRoom: (roomId: string) => void;
  addCharacter: (roomId: string, character: Omit<Character, 'id' | 'createdAt'>) => void;
  sendMessage: (roomId: string, content: string) => void;
  setUserIdentity: (roomId: string, identity: UserIdentity) => void;
  togglePresentationMode: () => void;
}
```

## 7. API / Interface Contracts

### 7.1 Electron IPC Contracts

#### Main → Renderer
- `room:created` - Notify room creation complete
- `character:portrait-generated` - AI portrait ready
- `message:ai-response` - AI response received
- `error:ai-service` - AI service error

#### Renderer → Main
- `room:create` - Create new room
- `room:load-all` - Load all rooms
- `character:create` - Create character
- `character:generate-portrait` - Request AI portrait
- `message:send` - Send user message
- `ai:generate-text` - Request AI narrative
- `ai:generate-background` - Request scene background

### 7.2 AI Service Contracts

#### Text Generation
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
  suggestedBackground?: string; // Scene description for image gen
}
```

#### Image Generation
```typescript
interface ImageGenerationRequest {
  type: 'character-portrait' | 'scene-background';
  prompt: string;
  style?: string;
}

interface ImageGenerationResponse {
  imageUrl: string;      // URL or base64
  cached: boolean;
}
```

### 7.3 Storage Contracts

```typescript
interface StorageService {
  // Rooms
  createRoom(room: Omit<Room, 'id' | 'createdAt'>): Promise<Room>;
  getRooms(): Promise<Room[]>;
  deleteRoom(roomId: string): Promise<void>;

  // Characters
  createCharacter(character: Omit<Character, 'id' | 'createdAt'>): Promise<Character>;
  getCharactersByRoom(roomId: string): Promise<Character[]>;

  // Messages
  createMessage(message: Omit<Message, 'id' | 'timestamp'>): Promise<Message>;
  getMessagesByRoom(roomId: string, limit?: number): Promise<Message[]>;

  // Assets
  saveImage(imageData: Buffer | string, filename: string): Promise<string>;
  getImagePath(filename: string): Promise<string>;
}
```

## 8. State and Data Flow

### 8.1 Client State (Zustand)
- Holds all rooms, characters, messages in memory for fast access
- Syncs with local storage via Electron IPC
- Updates triggered by user actions and AI responses

### 8.2 Data Flow: User Sends Message

1. User types message in UI (chat or immersive mode)
2. Renderer calls `appState.sendMessage(roomId, content)`
3. Zustand action:
   - Creates user message object
   - Adds to local state (optimistic update)
   - Sends IPC `message:send` to main process
4. Main process:
   - Saves message to SQLite
   - Gathers context (recent messages, characters, world setting)
   - Calls OpenAI API with context
   - Parses AI response
   - Sends IPC `message:ai-response` back to renderer
5. Renderer receives AI response:
   - Adds AI messages to state
   - If immersive mode + new scene, trigger background generation
6. UI auto-updates via React re-render

### 8.3 Data Flow: Character Creation with AI Portrait

1. User fills character form, leaves portrait blank
2. Renderer calls `appState.addCharacter(roomId, characterData)`
3. Zustand action:
   - Creates character with `isAIGenerated: true`
   - Sends IPC `character:create` + `character:generate-portrait`
4. Main process:
   - Saves character to SQLite
   - Calls image generation API (DALL-E) with character description
   - Saves generated image locally
   - Sends IPC `character:portrait-generated` with image path
5. Renderer updates character with portrait URL
6. UI displays character with portrait

### 8.4 Loading/Error/Empty Handling
- **Loading**: Show spinners during AI generation, disable input
- **Error**: Display toast notifications, retry options for failed AI calls
- **Empty**: Show onboarding prompts for empty room list, character list

### 8.5 Caching Strategy
- AI-generated images cached locally (never regenerate same prompt)
- Message history limited to last 50 messages for AI context (configurable)
- Character data and portraits persist indefinitely

## 9. Security and Permission Considerations

### 9.1 Authentication
- **MVP**: No authentication required (single-user desktop app)
- **Future**: Optional cloud sync with account system

### 9.2 API Key Management
- Store OpenAI and image generation API keys in Electron main process
- Use environment variables or encrypted local config file
- Never expose keys to renderer process

### 9.3 Input Validation
- Sanitize user inputs before sending to AI (prevent prompt injection)
- Validate image uploads (file type, size limits: max 10MB)
- Sanitize AI responses before rendering (XSS prevention)

### 9.4 Data Privacy
- All data stored locally (no telemetry in MVP)
- User controls all data (can delete rooms, characters)
- AI API calls: use user's own API keys (user owns their data)

### 9.5 Abuse Prevention
- Rate limiting on AI calls (max 10 requests/minute)
- Cost tracking for image generation (warn user if high usage)

## 10. Non-Functional Technical Expectations

### 10.1 Performance
- UI response time: < 100ms for all user interactions
- AI text generation: < 5 seconds (target < 3s)
- AI image generation: < 15 seconds (acceptable for portraits)
- Mode switching: < 500ms

### 10.2 Reliability
- Auto-save all changes immediately (no "Save" button needed)
- Graceful degradation if AI service unavailable (show error, allow retry)
- Prevent data corruption with atomic writes

### 10.3 Responsiveness
- Desktop-optimized (1280x720 minimum resolution)
- Sidebar collapsible for smaller screens
- Smooth animations for mode transitions

### 10.4 Accessibility
- Keyboard navigation support
- Screen reader friendly (ARIA labels)
- High contrast mode support (via system preferences)

### 10.5 Maintainability
- TypeScript for type safety
- Component-based architecture (easy to test)
- Clear separation of concerns (UI, state, storage, AI)
- Comprehensive error logging

### 10.6 Testing Baseline
- Unit tests for core logic (AI service, storage)
- Integration tests for IPC communication
- Manual E2E testing for MVP (automate post-MVP)

## 11. Delivery Risks and Trade-Offs

### 11.1 AI Service Latency
- **Risk**: Slow AI responses frustrate users
- **Mitigation**:
  - Show loading indicators
  - Stream responses if supported by API
  - Set realistic timeout limits (30s max)

### 11.2 Image Generation Cost
- **Risk**: High cost per image if user generates many backgrounds
- **Mitigation**:
  - Cache aggressively
  - Use lower-cost models for backgrounds (Stable Diffusion)
  - Limit background generation (max 1 per 5 messages)

### 11.3 Context Window Limitations
- **Risk**: Long conversations exceed AI context limits
- **Mitigation**:
  - Summarize older messages
  - Keep only last 50 messages in context
  - Implement "scene boundaries" to reset context

### 11.4 Immersive Mode Complexity
- **Risk**: Complex UI for immersive mode may delay MVP
- **Mitigation**:
  - Start with simple visual novel layout
  - Reuse shadcn/ui components (dialog, card)
  - Defer advanced animations to post-MVP

### 11.5 Data Migration
- **Risk**: Schema changes break existing user data
- **Mitigation**:
  - Version database schema
  - Write migration scripts before schema changes
  - Test migrations with sample data

### 11.6 Speed vs Maintainability
- **Trade-off**: SQLite (more setup) vs JSON files (simpler)
- **Decision**: Use SQLite for better data integrity and query performance
- **Rationale**: Complexity is manageable, benefits outweigh setup cost

## 12. Suggested Build Order

1. **Setup Electron + React + TypeScript boilerplate**
   - Vite config for Electron
   - Basic IPC setup
   - ESLint, Prettier

2. **Implement local storage (SQLite)**
   - Define schema
   - Create storage service
   - Test CRUD operations

3. **Build Room Manager (UI + logic)**
   - Left sidebar component
   - Room list display
   - Create room flow

4. **Build Character Manager (UI + logic)**
   - Character creation form
   - Character list in room
   - Image upload handling

5. **Implement AI text generation**
   - OpenAI API integration
   - Context building logic
   - Response parsing

6. **Build Chat Mode presentation**
   - Message list component
   - User input component
   - Display character messages + narrator

7. **Implement user identity system**
   - Identity selection UI
   - Link identity to character (actor mode)
   - Adjust AI prompts based on role

8. **Build Immersive Mode presentation**
   - Visual novel layout
   - Character portrait display
   - Dialogue box styling

9. **Implement AI image generation**
   - Character portrait generation
   - Background generation based on scene
   - Image caching

10. **Implement mode switching**
    - Toggle between chat and immersive
    - Preserve state across modes

11. **Error handling and edge cases**
    - Loading states
    - Error messages
    - Empty states

12. **Polish and testing**
    - Smooth transitions
    - Performance optimization
    - Manual testing

## 13. Open Questions

1. **AI Model Selection**: Should we support multiple AI providers (OpenAI, Anthropic, local models)?
   - **Resolution**: Start with OpenAI only, make it swappable post-MVP

2. **Image Caching Strategy**: Should we cache all AI-generated images indefinitely?
   - **Resolution**: Yes, but implement manual cache clearing

3. **Context Summarization**: How to handle very long conversations?
   - **Resolution**: Summarize older messages into brief "story so far" (post-MVP)

4. **Background Generation Frequency**: How often should backgrounds regenerate?
   - **Resolution**: Only when scene changes significantly (detect via AI or manual user trigger)

5. **Offline Mode**: Should app work without internet (no AI features)?
   - **Resolution**: Yes, allow viewing saved content offline, disable AI features gracefully

6. **Export Feature**: Should users be able to export conversations?
   - **Resolution**: Out of scope for MVP, add post-MVP (markdown export)
