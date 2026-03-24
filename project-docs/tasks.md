# Execution Backlog

## 1. Execution Strategy

**Implementation Approach**:
- Build in vertical slices: complete one feature end-to-end before moving to the next
- Start with core infrastructure (Electron + React + Storage) to enable rapid iteration
- Implement Chat Mode first (simpler), then Immersive Mode (more complex)
- Integrate AI services incrementally (text first, then images)
- Keep commits small and reversible for easy debugging

**Dependency Logic**:
- Storage layer must exist before any data-dependent features
- Room management enables character management
- Character management enables messaging
- Chat Mode must work before building Immersive Mode
- Text generation must work before image generation

**Staging**:
1. **Foundation**: Infrastructure and basic UI
2. **Core Features**: Rooms, characters, messaging without AI
3. **AI Integration**: Text and image generation
4. **Presentation Modes**: Chat and Immersive views
5. **Polish**: Error handling, performance, UX refinement

**Early Validation**:
- Validate storage layer with dummy data
- Validate UI layout before AI integration
- Test AI integration with single room/character
- Validate mode switching with static content first

## 2. Milestones

### Milestone 1: Foundation Setup
**Goal**: Establish project structure, build pipeline, and basic UI shell
**Complete When**: Electron app runs with React UI, left sidebar visible

### Milestone 2: Local Data Layer
**Goal**: Implement persistent storage for rooms, characters, and messages
**Complete When**: Can create and retrieve data from SQLite

### Milestone 3: Room & Character Management
**Goal**: Users can create rooms and characters with manual data entry
**Complete When**: Can create rooms, add characters with uploaded portraits

### Milestone 4: Basic Messaging (No AI)
**Goal**: Users can send messages and see them displayed in chat format
**Complete When**: Messages persist and display in chronological order

### Milestone 5: AI Text Generation
**Goal**: AI generates contextual responses to user messages
**Complete When**: AI responds with character dialogue and narrator text

### Milestone 6: Chat Mode Completion
**Goal**: Full chat-based interaction with identity system
**Complete When**: Actor/Observer modes work, messages display correctly

### Milestone 7: Immersive Mode UI
**Goal**: Visual novel presentation layer
**Complete When**: Character portraits and backgrounds display in immersive view

### Milestone 8: AI Image Generation
**Goal**: AI generates character portraits and scene backgrounds
**Complete When**: Missing portraits auto-generate, backgrounds update with scenes

### Milestone 9: Mode Switching & Polish
**Goal**: Seamless transition between modes, error handling, UX refinement
**Complete When**: All acceptance criteria met, app feels polished

## 3. Task Breakdown by Milestone

### Milestone 1: Foundation Setup

**Goal**: Establish project structure and basic UI shell

---

#### Task 1.1: Initialize Electron + React + TypeScript Project

**Purpose**: Set up the development environment and build pipeline

**Scope**:
- Initialize Electron app with Vite
- Configure TypeScript
- Set up React 18
- Configure hot reload for development
- Set up basic Electron main and renderer processes

**Suggested Implementation Notes**:
- Use `electron-vite` template or `vite-plugin-electron`
- Configure IPC boilerplate (even if empty for now)
- Set up `src/main` and `src/renderer` directories
- Create basic `index.html` entry point

**Acceptance Criteria**:
- App launches in Electron window
- Hot reload works for renderer process
- TypeScript compiles without errors
- Basic window (800x600) displays "Hello World"

**Suggested Commit Granularity**:
1. Initialize Vite + React + TypeScript
2. Add Electron and configure main/renderer processes
3. Set up hot reload and dev scripts

**Dependencies**: None

**Risks / Failure Modes**:
- Electron and Vite configuration conflicts
- TypeScript path resolution issues
- Watch carefully for CORS or CSP errors in Electron

---

#### Task 1.2: Install and Configure UI Libraries

**Purpose**: Set up Tailwind CSS and shadcn/ui for component library

**Scope**:
- Install Tailwind CSS
- Configure Tailwind for Electron renderer
- Install shadcn/ui CLI
- Add initial components: Button, Card, Input, Dialog, Sidebar

**Suggested Implementation Notes**:
- Follow shadcn/ui installation guide for Vite
- Configure `tailwind.config.js` with design tokens (colors, spacing)
- Add `components.json` for shadcn/ui configuration
- Install only needed components (not all)

**Acceptance Criteria**:
- Tailwind classes work in renderer
- shadcn/ui components render correctly
- No style conflicts or console errors
- Test page shows Button, Card, Input working

**Suggested Commit Granularity**:
1. Install and configure Tailwind CSS
2. Install shadcn/ui and add initial components

**Dependencies**: Task 1.1

**Risks / Failure Modes**:
- Tailwind PostCSS config may conflict with Vite
- shadcn/ui paths may need adjustment for Electron

---

#### Task 1.3: Create Basic Layout with Sidebar

**Purpose**: Build the main app layout with left sidebar for room list

**Scope**:
- Create main layout component with sidebar and content area
- Left sidebar: 250px width, collapsible (optional for MVP)
- Content area: Flexible width
- Use shadcn/ui Sidebar or custom component

**Suggested Implementation Notes**:
- Create `components/Layout/AppLayout.tsx`
- Create `components/Sidebar/RoomSidebar.tsx`
- Use CSS Grid or Flexbox for layout
- Add placeholder content in sidebar and main area

**Acceptance Criteria**:
- Sidebar visible on left (250px)
- Main content area fills remaining space
- Layout responsive to window resize
- No horizontal scrollbars

**Suggested Commit Granularity**:
1. Create AppLayout component with grid structure
2. Create RoomSidebar component with placeholder list

**Dependencies**: Task 1.2

**Risks / Failure Modes**:
- Layout issues on smaller window sizes
- Sidebar may not stick to viewport height

---

#### Task 1.4: Set Up Zustand Store

**Purpose**: Initialize global state management

**Scope**:
- Install Zustand
- Create initial store structure
- Define types for AppState
- Add placeholder actions (to be implemented later)

**Suggested Implementation Notes**:
- Create `src/renderer/store/appStore.ts`
- Define types in `src/renderer/types/index.ts`
- Initial state: `rooms`, `currentRoomId`, `characters`, `messages`, `presentationMode`
- Use TypeScript for full type safety

**Acceptance Criteria**:
- Zustand store initializes without errors
- State accessible via `useAppStore()` hook
- TypeScript types enforce correct usage
- Can read state in test component

**Suggested Commit Granularity**:
1. Install Zustand and create store skeleton
2. Define TypeScript types for state and actions

**Dependencies**: Task 1.1

**Risks / Failure Modes**:
- TypeScript inference issues with Zustand
- Over-complicating initial state structure

---

### Milestone 2: Local Data Layer

**Goal**: Implement persistent storage for all application data

---

#### Task 2.1: Set Up SQLite Database

**Purpose**: Initialize SQLite and define database schema

**Scope**:
- Install `better-sqlite3`
- Create database initialization script
- Define tables: `rooms`, `characters`, `messages`, `user_identities`
- Create database file in user data directory

**Suggested Implementation Notes**:
- Create `src/main/database/schema.sql`
- Create `src/main/database/db.ts` for database connection
- Use Electron `app.getPath('userData')` for DB location
- Create tables on first run

**Acceptance Criteria**:
- Database file created in user data directory
- All tables created with correct schema
- Foreign key constraints enforced
- Can connect and query database from main process

**Suggested Commit Granularity**:
1. Install better-sqlite3 and create DB connection module
2. Define schema and create initialization script
3. Test database creation and basic queries

**Dependencies**: Task 1.1

**Risks / Failure Modes**:
- better-sqlite3 native module compilation issues on some platforms
- Database file permissions errors
- Schema design errors (hard to fix post-deployment)

---

#### Task 2.2: Implement Storage Service

**Purpose**: Create abstraction layer for database operations

**Scope**:
- Create `StorageService` class with typed methods
- Implement CRUD for rooms
- Implement CRUD for characters
- Implement CRUD for messages
- Implement user identity storage

**Suggested Implementation Notes**:
- Create `src/main/services/StorageService.ts`
- Use prepared statements for security
- Return typed objects (Room, Character, Message)
- Handle errors gracefully (throw custom errors)

**Acceptance Criteria**:
- All CRUD operations work for rooms, characters, messages
- Methods return correct TypeScript types
- Errors handled and thrown appropriately
- Test script can create and retrieve data

**Suggested Commit Granularity**:
1. Implement Room CRUD methods
2. Implement Character CRUD methods
3. Implement Message CRUD methods
4. Add user identity methods

**Dependencies**: Task 2.1

**Risks / Failure Modes**:
- SQL injection if not using prepared statements
- Race conditions with concurrent writes
- Foreign key constraint violations

---

#### Task 2.3: Create IPC Handlers for Storage

**Purpose**: Expose storage operations to renderer via IPC

**Scope**:
- Create IPC handlers in main process
- Define IPC channel names (constants)
- Create typed IPC invoke wrappers for renderer

**Suggested Implementation Notes**:
- Create `src/main/ipc/storageHandlers.ts`
- Create `src/renderer/services/ipcService.ts` for type-safe calls
- Use `ipcMain.handle()` for async operations
- Use `ipcRenderer.invoke()` in renderer

**Acceptance Criteria**:
- Renderer can create/read/update/delete rooms via IPC
- Renderer can create/read characters via IPC
- Renderer can create/read messages via IPC
- All IPC calls are type-safe

**Suggested Commit Granularity**:
1. Create IPC handlers in main process
2. Create type-safe IPC client in renderer
3. Test IPC communication with sample data

**Dependencies**: Task 2.2

**Risks / Failure Modes**:
- IPC channel name conflicts
- Type mismatches between main and renderer
- Async timing issues

---

### Milestone 3: Room & Character Management

**Goal**: Build UI and logic for creating and managing rooms and characters

---

#### Task 3.1: Build Room List UI

**Purpose**: Display all rooms in left sidebar

**Scope**:
- Create `RoomList` component
- Fetch rooms from storage on app load
- Display room names in sidebar
- Highlight currently selected room
- Add "New Room" button

**Suggested Implementation Notes**:
- Use `useEffect` to load rooms on mount
- Store rooms in Zustand
- Use shadcn/ui Button for "New Room"
- Use shadcn/ui ScrollArea for room list

**Acceptance Criteria**:
- All rooms display in sidebar
- Currently selected room is highlighted
- "New Room" button visible and clickable
- Empty state shows helpful message

**Suggested Commit Granularity**:
1. Create RoomList component and fetch rooms
2. Add "New Room" button and empty state

**Dependencies**: Task 1.3, Task 2.3

**Risks / Failure Modes**:
- Slow loading with many rooms (unlikely for MVP)
- State not updating when rooms change

---

#### Task 3.2: Implement Create Room Flow

**Purpose**: Allow users to create new rooms

**Scope**:
- Create "New Room" dialog
- Input: Room name (required)
- Optional: World setting description
- Save to database via IPC
- Update Zustand state
- Auto-select new room

**Suggested Implementation Notes**:
- Use shadcn/ui Dialog component
- Use shadcn/ui Input and Textarea
- Form validation: room name required (min 1 char)
- Call `createRoom()` Zustand action

**Acceptance Criteria**:
- Dialog opens on "New Room" click
- User can enter room name and world setting
- Room created in database
- New room appears in sidebar
- New room auto-selected

**Suggested Commit Granularity**:
1. Create dialog UI with form
2. Implement create room logic and state update
3. Add form validation

**Dependencies**: Task 3.1

**Risks / Failure Modes**:
- Empty room name edge case
- Duplicate room names (allow for MVP, unique later)

---

#### Task 3.3: Implement Room Selection

**Purpose**: Allow users to switch between rooms

**Scope**:
- Click room in sidebar to select
- Update `currentRoomId` in Zustand
- Load characters and messages for selected room
- Update main content area

**Suggested Implementation Notes**:
- Add onClick handler to room list items
- Call `setCurrentRoom()` Zustand action
- Load characters and messages via IPC
- Clear previous room's data from view

**Acceptance Criteria**:
- Clicking room updates selection
- Main content area updates to show room data
- Characters and messages load for selected room
- Switching rooms is instantaneous (< 100ms)

**Suggested Commit Granularity**:
1. Implement room selection logic
2. Load characters and messages on room change

**Dependencies**: Task 3.1

**Risks / Failure Modes**:
- Slow loading with large message history
- State synchronization issues

---

#### Task 3.4: Build Character Creation UI

**Purpose**: Allow users to add characters to current room

**Scope**:
- Create "Add Character" button in main content area
- Dialog with inputs: name, description
- Optional: portrait upload (file or URL)
- Save character to database
- Display in character list

**Suggested Implementation Notes**:
- Use shadcn/ui Dialog
- Use shadcn/ui Input for name and Textarea for description
- Use `<input type="file" accept="image/*">` for upload
- Support drag-and-drop (optional for MVP)
- Display character cards in grid layout

**Acceptance Criteria**:
- "Add Character" button visible in room view
- Dialog opens with name and description fields
- User can upload image or enter URL
- Character saved to database
- Character appears in character list

**Suggested Commit Granularity**:
1. Create character creation dialog UI
2. Implement image upload handling
3. Save character and update state

**Dependencies**: Task 3.3

**Risks / Failure Modes**:
- Large image uploads (add size limit: 10MB)
- Invalid image URLs
- Missing character name validation

---

#### Task 3.5: Implement Image Upload and Storage

**Purpose**: Handle image uploads and store locally

**Scope**:
- Accept image files (PNG, JPG, WebP)
- Save to local assets directory
- Return local file path
- Display in character portrait

**Suggested Implementation Notes**:
- Create `src/main/services/AssetService.ts`
- Save images to `userData/assets/portraits/`
- Generate unique filenames (UUID)
- Use IPC to send image from renderer to main
- Validate file type and size in main process

**Acceptance Criteria**:
- Image files uploaded and saved locally
- Correct file path returned to renderer
- Images display in UI
- File size limited to 10MB

**Suggested Commit Granularity**:
1. Create AssetService for image handling
2. Implement IPC for image upload
3. Test upload and display

**Dependencies**: Task 3.4

**Risks / Failure Modes**:
- File system permissions errors
- Large images slow down upload
- Image format incompatibility

---

### Milestone 4: Basic Messaging (No AI)

**Goal**: Users can send and display messages without AI

---

#### Task 4.1: Build Chat Input Component

**Purpose**: Allow users to type and send messages

**Scope**:
- Text input at bottom of main content area
- Send button
- Submit on Enter key
- Clear input after send

**Suggested Implementation Notes**:
- Use shadcn/ui Input or Textarea
- Add keyboard listener for Enter (Shift+Enter for new line)
- Call `sendMessage()` Zustand action
- Use controlled component pattern

**Acceptance Criteria**:
- Input field visible at bottom
- User can type message
- Enter key sends message
- Input clears after send
- Send button disabled when input empty

**Suggested Commit Granularity**:
1. Create chat input component with send button
2. Add keyboard shortcuts and validation

**Dependencies**: Task 3.3

**Risks / Failure Modes**:
- Input focus issues
- Enter key conflicts with textarea newlines

---

#### Task 4.2: Build Message List Component

**Purpose**: Display messages in chronological order

**Scope**:
- Display all messages for current room
- Show character name (if character message)
- Show "Narrator" label for narrator messages
- Auto-scroll to bottom on new message

**Suggested Implementation Notes**:
- Create `MessageList` component
- Use shadcn/ui ScrollArea
- Map over messages array from Zustand
- Use `useEffect` with ref to scroll to bottom
- Different styling for user/AI/narrator messages

**Acceptance Criteria**:
- All messages display in order (oldest to newest)
- Character messages show character name
- Narrator messages clearly labeled
- Auto-scrolls to latest message
- Supports scrolling to view history

**Suggested Commit Granularity**:
1. Create MessageList component with basic rendering
2. Add auto-scroll and styling variations

**Dependencies**: Task 4.1

**Risks / Failure Modes**:
- Performance with long message history (virtualize later if needed)
- Auto-scroll conflicts with manual scrolling

---

#### Task 4.3: Implement Message Sending (Manual Mode)

**Purpose**: Save user messages to database (no AI yet)

**Scope**:
- Capture user input from chat component
- Create message object (type: 'user')
- Save to database via IPC
- Update Zustand state
- Display in message list

**Suggested Implementation Notes**:
- Call `createMessage()` IPC handler
- Use current room ID
- Set `characterId` based on user identity (if actor)
- Timestamp with `Date.now()`

**Acceptance Criteria**:
- User message saved to database
- Message appears in message list immediately
- Message persists across app restart
- Correct character association (if actor mode)

**Suggested Commit Granularity**:
1. Implement message creation logic
2. Connect to UI and test persistence

**Dependencies**: Task 4.2

**Risks / Failure Modes**:
- Race condition with rapid message sending
- Missing room or character ID

---

### Milestone 5: AI Text Generation

**Goal**: Integrate OpenAI API for contextual narrative generation

---

#### Task 5.1: Set Up OpenAI API Client

**Purpose**: Create service for calling OpenAI API

**Scope**:
- Install OpenAI SDK
- Create `AIService` class
- Configure API key (environment variable or config)
- Implement text generation method
- Handle errors and retries

**Suggested Implementation Notes**:
- Create `src/main/services/AIService.ts`
- Use OpenAI SDK: `openai.chat.completions.create()`
- Use GPT-4 or GPT-3.5-turbo model
- Store API key in `.env` file (not committed)
- Add retry logic (max 3 attempts)

**Acceptance Criteria**:
- OpenAI API client initializes correctly
- Can send prompt and receive response
- API key loaded from environment
- Errors handled gracefully (with retry)

**Suggested Commit Granularity**:
1. Install OpenAI SDK and create AIService skeleton
2. Implement text generation method
3. Add error handling and retry logic

**Dependencies**: Task 1.1

**Risks / Failure Modes**:
- API key not set (show clear error message)
- Rate limiting from OpenAI
- API changes or downtime

---

#### Task 5.2: Build Context Preparation Logic

**Purpose**: Prepare conversation context for AI

**Scope**:
- Gather last 50 messages from current room
- Include character descriptions
- Include world setting
- Format as OpenAI messages array
- Include user identity (actor/observer)

**Suggested Implementation Notes**:
- Create `buildContext()` function in AIService
- Format: `{ role: 'system', content: worldSetting + characterDescriptions }`
- Format: `{ role: 'user', content: recentMessages + newUserInput }`
- Limit context to ~3000 tokens

**Acceptance Criteria**:
- Context includes world setting and characters
- Last 50 messages included
- Context formatted correctly for OpenAI
- User role (actor/observer) reflected in system prompt

**Suggested Commit Granularity**:
1. Implement context gathering from database
2. Format context for OpenAI messages format
3. Add token counting and truncation

**Dependencies**: Task 5.1

**Risks / Failure Modes**:
- Context too long (exceeds model limit)
- Token counting inaccurate
- Character data missing

---

#### Task 5.3: Implement AI Response Generation

**Purpose**: Generate AI responses to user messages

**Scope**:
- Call OpenAI API with prepared context
- Parse response
- Extract character dialogues and narrator text
- Return structured response

**Suggested Implementation Notes**:
- Use system prompt to instruct AI format:
  - `Character: [Name]: [Dialogue]`
  - `Narrator: [Narration]`
- Parse AI response text
- Return `{ characterDialogues: [...], narratorText: '...' }`

**Acceptance Criteria**:
- AI generates contextual responses
- Response parsed into character dialogues and narrator text
- Multiple characters can speak in one response
- Narrator text optional

**Suggested Commit Granularity**:
1. Implement OpenAI call with context
2. Parse response into structured format
3. Test with various scenarios

**Dependencies**: Task 5.2

**Risks / Failure Modes**:
- AI doesn't follow format instructions (add retry with clarification)
- Parsing errors if format unexpected
- Long generation time (show loading state)

---

#### Task 5.4: Integrate AI into Message Flow

**Purpose**: Connect AI service to user message sending

**Scope**:
- After user sends message, trigger AI generation
- Show loading indicator
- Save AI response as new messages
- Update message list

**Suggested Implementation Notes**:
- Modify `sendMessage()` Zustand action
- Add IPC handler: `ai:generate-response`
- Create AI messages with type: 'ai' or 'narrator'
- Save each dialogue as separate message
- Handle errors (show error message, allow retry)

**Acceptance Criteria**:
- User message triggers AI response
- Loading indicator shows during generation
- AI response appears in message list
- Multiple character responses handled
- Narrator messages display correctly
- Errors handled with user-friendly message

**Suggested Commit Granularity**:
1. Connect user message to AI generation
2. Save and display AI responses
3. Add loading and error states

**Dependencies**: Task 5.3, Task 4.3

**Risks / Failure Modes**:
- Race conditions with rapid user inputs
- Long AI response time (add timeout: 30s)
- Unexpected AI response format

---

### Milestone 6: Chat Mode Completion

**Goal**: Implement user identity system and finalize chat mode

---

#### Task 6.1: Build Identity Selection UI

**Purpose**: Allow users to choose actor or observer role

**Scope**:
- Add identity selector to room view
- Radio buttons or toggle: 演绎者 / 旁观者
- If actor: show character assignment dropdown
- Save identity to database

**Suggested Implementation Notes**:
- Create `IdentitySelector` component
- Use shadcn/ui RadioGroup or ToggleGroup
- If actor selected, show character dropdown (use characters in room)
- Call `setUserIdentity()` Zustand action

**Acceptance Criteria**:
- User can select actor or observer
- If actor, can select character to play
- Identity saved to database (per room)
- Identity persists across sessions

**Suggested Commit Granularity**:
1. Create identity selector UI
2. Implement identity save logic
3. Load and display saved identity

**Dependencies**: Task 3.3

**Risks / Failure Modes**:
- No characters available for actor mode (disable actor option)
- Identity not persisting

---

#### Task 6.2: Adjust AI Prompts Based on Identity

**Purpose**: Modify AI behavior for actor vs observer

**Scope**:
- If actor: AI controls other characters, user controls assigned character
- If observer: AI controls all characters, user can guide story
- Update context preparation to reflect identity

**Suggested Implementation Notes**:
- Modify `buildContext()` in AIService
- Actor mode system prompt: "User is playing [Character Name]. Generate responses for other characters."
- Observer mode: "User is guiding the story. Generate responses for all characters."
- Include user's character ID in context (if actor)

**Acceptance Criteria**:
- Actor mode: AI doesn't speak for user's character
- Observer mode: AI controls all characters
- AI follows identity-based instructions
- Smooth transitions when switching identity

**Suggested Commit Granularity**:
1. Update context building for identity
2. Test actor and observer modes separately

**Dependencies**: Task 6.1, Task 5.2

**Risks / Failure Modes**:
- AI occasionally speaks for user's character (add strong prompt)
- Observer mode feels too passive (add guidance instructions)

---

#### Task 6.3: Polish Chat Mode UI

**Purpose**: Refine chat mode styling and interactions

**Scope**:
- Improve message styling (bubbles, colors)
- Add character avatars to messages (small portrait)
- Add timestamps (optional, subtle)
- Improve narrator message styling (italic, centered)
- Add empty state for new rooms

**Suggested Implementation Notes**:
- Use different background colors for user/AI/narrator
- Display character portrait thumbnail next to messages
- Use subtle typography for timestamps
- Center and italicize narrator messages

**Acceptance Criteria**:
- Messages visually distinct (user/AI/narrator)
- Character portraits visible in messages
- Timestamps present but not distracting
- Narrator messages stand out
- Empty state helpful and inviting

**Suggested Commit Granularity**:
1. Improve message styling and layout
2. Add character avatars and timestamps
3. Create empty state

**Dependencies**: Task 4.2

**Risks / Failure Modes**:
- Over-designed UI slows down rendering
- Avatar images fail to load

---

### Milestone 7: Immersive Mode UI

**Goal**: Build visual novel style presentation

---

#### Task 7.1: Create Immersive Mode Layout

**Purpose**: Build visual novel UI structure

**Scope**:
- Fullscreen or large content area
- Background image layer
- Character portrait layer (centered or left/right)
- Dialogue box at bottom (semi-transparent overlay)
- Character name label above dialogue

**Suggested Implementation Notes**:
- Create `ImmersiveView` component
- Use CSS Grid or Flexbox for layers
- Background: full viewport, fixed
- Character portrait: centered, max 40% height
- Dialogue box: bottom 25%, semi-transparent dark background

**Acceptance Criteria**:
- Immersive view displays with correct layout
- Background image fills viewport
- Character portrait visible and centered
- Dialogue box at bottom with readable text
- Character name displayed above dialogue

**Suggested Commit Granularity**:
1. Create immersive view layout structure
2. Add background and character layers
3. Create dialogue box component

**Dependencies**: Task 1.3

**Risks / Failure Modes**:
- Layout breaks on different screen sizes
- Overlapping elements

---

#### Task 7.2: Display Messages in Immersive Mode

**Purpose**: Show conversation as visual novel dialogue

**Scope**:
- Display current message in dialogue box
- Show active speaker's portrait
- Advance to next message on click or key press
- Support narrator messages (no portrait, centered text)

**Suggested Implementation Notes**:
- Track current message index in Zustand
- Display `messages[currentIndex]`
- On click/Enter: increment index
- If narrator message: hide portrait, show text only
- Auto-advance after AI response (optional)

**Acceptance Criteria**:
- One message displayed at a time
- Correct character portrait shown
- Clicking advances to next message
- Narrator messages display without portrait
- Can navigate back and forth (arrow keys)

**Suggested Commit Granularity**:
1. Implement message display logic
2. Add navigation controls
3. Handle narrator messages

**Dependencies**: Task 7.1

**Risks / Failure Modes**:
- Clicking too fast skips messages
- Portrait changes jarring without transition

---

#### Task 7.3: Add Transition Animations

**Purpose**: Smooth transitions between messages

**Scope**:
- Fade in/out for dialogue box
- Slide or fade for character portrait changes
- Crossfade for background changes

**Suggested Implementation Notes**:
- Use CSS transitions or Framer Motion
- Fade dialogue: 300ms ease-in-out
- Portrait change: 400ms fade or slide
- Background crossfade: 500ms

**Acceptance Criteria**:
- Dialogue fades in/out smoothly
- Portrait transitions look polished
- Background changes seamlessly
- Transitions don't slow down navigation

**Suggested Commit Granularity**:
1. Add dialogue fade transitions
2. Add portrait and background transitions

**Dependencies**: Task 7.2

**Risks / Failure Modes**:
- Slow transitions frustrate users (keep short)
- Transition timing conflicts with rapid clicking

---

### Milestone 8: AI Image Generation

**Goal**: Generate character portraits and scene backgrounds with AI

---

#### Task 8.1: Integrate Image Generation API

**Purpose**: Set up DALL-E or Stable Diffusion for image generation

**Scope**:
- Install image generation SDK (OpenAI DALL-E or Replicate for SD)
- Create `ImageGenerationService`
- Implement portrait generation method
- Implement background generation method
- Handle errors and timeouts

**Suggested Implementation Notes**:
- Create `src/main/services/ImageGenerationService.ts`
- Use DALL-E 3 for portraits (higher quality)
- Use Stable Diffusion for backgrounds (lower cost)
- Add timeout: 30s max
- Return image URL or download and save locally

**Acceptance Criteria**:
- Image generation API client initializes
- Can generate image from text prompt
- Images downloaded and saved locally
- Errors handled with retry logic

**Suggested Commit Granularity**:
1. Set up image generation client
2. Implement portrait generation
3. Implement background generation

**Dependencies**: Task 5.1

**Risks / Failure Modes**:
- High API costs (set daily limit)
- Slow generation (15+ seconds)
- Generated images inappropriate (add content filter)

---

#### Task 8.2: Implement AI Portrait Generation for Characters

**Purpose**: Auto-generate portraits when user doesn't upload

**Scope**:
- When character created without portrait, trigger AI generation
- Build prompt from character name + description
- Save generated image locally
- Update character with portrait URL

**Suggested Implementation Notes**:
- Check `character.portraitUrl` on creation
- If empty, call `generatePortrait(character.name, character.description)`
- Prompt template: "Portrait of [name], [description], digital art, high quality"
- Show loading state in character card
- Update character in database after generation

**Acceptance Criteria**:
- Characters without uploaded portrait auto-generate
- Generated portraits display in UI
- Generation happens in background (non-blocking)
- User can manually retry if generation fails

**Suggested Commit Granularity**:
1. Implement portrait generation trigger
2. Build prompt and call API
3. Save and display generated portrait

**Dependencies**: Task 8.1, Task 3.4

**Risks / Failure Modes**:
- Generated portrait doesn't match description (refine prompt)
- Generation fails (allow manual upload as fallback)

---

#### Task 8.3: Implement Scene Background Generation

**Purpose**: Generate backgrounds based on story context

**Scope**:
- Detect scene changes in conversation
- Generate background description from AI narrative
- Call image generation API
- Cache backgrounds (reuse similar scenes)
- Update immersive mode background

**Suggested Implementation Notes**:
- Add `backgroundDescription` to AI response parsing
- Trigger background generation when description changes
- Prompt: "[background description], digital art, cinematic lighting"
- Save to `userData/assets/backgrounds/`
- Cache by hashing description (reuse if similar)

**Acceptance Criteria**:
- Backgrounds generate when scene changes
- AI provides background descriptions
- Backgrounds display in immersive mode
- Caching prevents redundant generation
- Fallback to default background if generation fails

**Suggested Commit Granularity**:
1. Extract background descriptions from AI responses
2. Implement background generation
3. Add caching and display logic

**Dependencies**: Task 8.1, Task 7.1

**Risks / Failure Modes**:
- Frequent scene changes cause too many generations (limit: 1 per 5 messages)
- AI doesn't provide good descriptions (improve prompt)

---

### Milestone 9: Mode Switching & Polish

**Goal**: Seamless mode transitions and final UX polish

---

#### Task 9.1: Implement Mode Switching

**Purpose**: Toggle between chat and immersive modes

**Scope**:
- Add toggle button (top-right of content area)
- Switch between Chat and Immersive views
- Preserve message history and state
- Save mode preference per room

**Suggested Implementation Notes**:
- Add toggle button using shadcn/ui Switch or ToggleGroup
- Update `presentationMode` in Zustand
- Conditionally render `ChatView` or `ImmersiveView`
- Save mode preference to database (per room)

**Acceptance Criteria**:
- Toggle button visible and labeled
- Clicking switches between modes instantly
- Message history preserved across switch
- Mode preference persists per room
- Smooth visual transition (fade or slide)

**Suggested Commit Granularity**:
1. Add mode toggle UI
2. Implement mode switching logic
3. Save and load mode preference

**Dependencies**: Task 6.3, Task 7.2

**Risks / Failure Modes**:
- State loss during switch (ensure shared state)
- Jarring visual jump (add transition)

---

#### Task 9.2: Add Loading States Everywhere

**Purpose**: Show feedback during async operations

**Scope**:
- Loading spinner for AI text generation
- Loading indicator for image generation
- Loading state for room/character creation
- Skeleton screens for initial data load

**Suggested Implementation Notes**:
- Use shadcn/ui Spinner or custom component
- Add `isLoading` state to Zustand
- Show spinner in message list when AI responding
- Show skeleton for character cards during portrait generation
- Use global loading overlay for blocking operations

**Acceptance Criteria**:
- Loading indicators visible during all async ops
- Users understand when system is processing
- Loading states don't block unrelated interactions
- Spinners accessible (aria-label)

**Suggested Commit Granularity**:
1. Add loading states for AI operations
2. Add loading for image generation
3. Add skeleton screens for data loading

**Dependencies**: All previous tasks

**Risks / Failure Modes**:
- Too many spinners overwhelming
- Loading states stuck (add timeout and error handling)

---

#### Task 9.3: Implement Error Handling and User Feedback

**Purpose**: Graceful error handling with clear user feedback

**Scope**:
- Toast notifications for errors (using shadcn/ui Toast)
- Retry buttons for failed AI operations
- Error messages for network issues
- Validation errors for forms

**Suggested Implementation Notes**:
- Install and configure shadcn/ui Toast
- Create `useToast()` hook
- Show toast for AI errors: "AI service unavailable. Retry?"
- Show toast for image errors: "Image generation failed. Try again?"
- Add retry buttons in error states

**Acceptance Criteria**:
- All errors show user-friendly messages
- Toast notifications don't stack excessively
- Users can retry failed operations
- Validation errors shown inline in forms
- No uncaught exceptions in console

**Suggested Commit Granularity**:
1. Set up toast notification system
2. Add error handling for AI operations
3. Add error handling for image and storage operations

**Dependencies**: All previous tasks

**Risks / Failure Modes**:
- Error messages too technical (simplify language)
- Retry logic causes loops (limit retries)

---

#### Task 9.4: Add Empty States and Onboarding

**Purpose**: Guide new users and handle empty data gracefully

**Scope**:
- Empty room list: "Create your first room to get started"
- Empty character list: "Add characters to begin the story"
- Empty message list: "Start the conversation..."
- Optional: Quick tutorial overlay on first launch

**Suggested Implementation Notes**:
- Create `EmptyState` component with icon, title, description
- Use shadcn/ui's Card component for styling
- Add helpful actions (e.g., "Create Room" button in empty state)
- Store `hasSeenOnboarding` in localStorage

**Acceptance Criteria**:
- Empty states display helpful messages
- Empty states include actionable next steps
- First-time users see brief guidance
- Empty states visually appealing

**Suggested Commit Granularity**:
1. Create empty state components
2. Add onboarding flow (optional)

**Dependencies**: Task 3.1, Task 3.4, Task 4.2

**Risks / Failure Modes**:
- Onboarding too long (keep under 30 seconds)
- Empty states feel patronizing (keep concise)

---

#### Task 9.5: Performance Optimization

**Purpose**: Ensure smooth performance

**Scope**:
- Lazy load images (portraits, backgrounds)
- Virtualize message list if > 100 messages
- Debounce AI calls during rapid input
- Optimize re-renders (React.memo, useMemo)

**Suggested Implementation Notes**:
- Use `react-window` or `react-virtualized` for long message lists
- Add debounce (500ms) to message sending
- Memoize expensive computations
- Use `React.memo` for message components
- Profile with React DevTools

**Acceptance Criteria**:
- App remains responsive with 100+ messages
- Scrolling smooth in all views
- AI calls not triggered redundantly
- Memory usage stable over time

**Suggested Commit Granularity**:
1. Add virtualization to message list
2. Optimize component re-renders
3. Add debouncing and memoization

**Dependencies**: All previous tasks

**Risks / Failure Modes**:
- Premature optimization adds complexity
- Virtualization breaks scroll behavior

---

#### Task 9.6: Final UI Polish and Consistency

**Purpose**: Refine visual design and ensure consistency

**Scope**:
- Consistent spacing and typography
- Hover and focus states for all interactive elements
- Smooth transitions throughout app
- Dark mode support (optional for MVP)
- Accessibility improvements (keyboard nav, ARIA labels)

**Suggested Implementation Notes**:
- Review Tailwind spacing scale usage
- Add focus-visible styles to all buttons/inputs
- Test keyboard navigation (Tab, Enter, Escape)
- Add ARIA labels for screen readers
- Ensure color contrast meets WCAG AA

**Acceptance Criteria**:
- Consistent visual design across all views
- All interactive elements respond to hover/focus
- Keyboard navigation works throughout app
- Screen reader friendly (basic ARIA)
- No visual bugs or inconsistencies

**Suggested Commit Granularity**:
1. Standardize spacing and typography
2. Add hover/focus states and transitions
3. Improve accessibility (keyboard nav, ARIA)

**Dependencies**: All previous tasks

**Risks / Failure Modes**:
- Polish takes too long (time-box to 1 day)
- Over-polishing delays launch

---

## 4. Cross-Cutting Checks

Apply these checks throughout all implementation tasks:

- **TypeScript Type Safety**: All functions and components fully typed, no `any` types
- **ESLint**: Code passes linting without warnings
- **Error Handling**: All async operations wrapped in try-catch, errors logged
- **Loading States**: All async UI operations show loading indicators
- **Empty States**: All lists/views handle empty data gracefully
- **Validation**: All user inputs validated before processing
- **Security**: User inputs sanitized, no XSS vulnerabilities
- **Accessibility**: Keyboard navigation, ARIA labels where needed
- **Performance**: No blocking operations on main thread, smooth 60fps UI
- **Logging**: Important operations logged for debugging (use electron-log)

## 5. Definition of Done for MVP

**Feature Completeness**:
- Users can create and manage rooms
- Users can create characters with portraits (uploaded or AI-generated)
- Users can select actor or observer identity
- Users can send messages and receive AI responses
- Chat mode displays messages correctly
- Immersive mode displays visual novel style interface
- AI generates scene backgrounds dynamically
- Users can switch between chat and immersive modes

**Quality Baseline**:
- No critical bugs (app crashes, data loss)
- AI responses relevant and contextual
- All UI interactions responsive (< 100ms)
- Error handling prevents user frustration
- Data persists across app restarts

**Validation Baseline**:
- Manual testing of all user flows
- Core features tested on Windows (primary platform)
- AI integration tested with real API calls
- Storage tested with realistic data volumes (10 rooms, 50 messages each)

**Deployment Readiness**:
- App builds successfully with electron-builder
- Installer tested on clean Windows machine
- Basic user documentation (README)
- Known issues documented

## 6. Recommended Working Pattern for AI Coding

When using this backlog with AI coding tools (Cursor, Copilot, etc.):

1. **One Task at a Time**: Implement exactly one task per session, do not combine
2. **Read Context First**: Review relevant build spec sections before starting
3. **Small Commits**: Follow suggested commit granularity, commit after each logical step
4. **Validate Immediately**: Test each task completion before moving to next
5. **No Scope Creep**: Implement only what's in task scope, resist adding "nice-to-haves"
6. **Review Code**: Check generated code for type safety, error handling, consistency
7. **Update Docs**: If implementation differs from spec, update build-spec.md
8. **Track Progress**: Mark tasks complete only when all acceptance criteria met
9. **Ask Questions**: If task ambiguous, clarify before implementing (ask in comments)
10. **Iterate**: If approach doesn't work, backtrack and try alternative (small commits help)

**Avoid**:
- Merging multiple tasks into one implementation
- Skipping error handling "for now"
- Committing large, untested changes
- Implementing features not in backlog
- Ignoring acceptance criteria

**Best Practices**:
- Use TypeScript strictly (enable `strict` mode)
- Prefer existing patterns over inventing new ones
- Write descriptive commit messages
- Keep components small and focused
- Test with realistic data early and often
