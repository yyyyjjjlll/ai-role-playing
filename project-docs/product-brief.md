# Product Brief

## 1. Product Overview
- **What**: An AI-powered role-playing and narrative generation platform that enables users to create custom characters, build worlds, and participate in dynamic AI-driven storylines
- **Who**: Role-playing enthusiasts, creative writers, storytellers, and interactive fiction fans
- **Core Problem**: Traditional role-playing experiences require extensive manual storytelling effort and lack dynamic, AI-powered narrative generation with flexible participation modes
- **Why Now**: Advanced AI language models now enable real-time, contextual narrative generation, making immersive AI-driven role-playing experiences feasible and engaging

## 2. Goals
- **Primary Goal**: Enable users to create and participate in AI-driven role-playing experiences with minimal setup friction
- **Secondary Goals**:
  - Support both active participation (演绎者) and passive observation (旁观者) modes
  - Provide dual presentation modes (chat and immersive) for different user preferences
  - Enable AI-assisted character and visual asset generation
- **Success Metrics**:
  - Users successfully create and join chat rooms within 5 minutes
  - 70%+ of users try both presentation modes
  - AI-generated content (characters, backgrounds) acceptance rate > 60%

## 3. Target Users
- **Primary Users**:
  - Creative individuals aged 18-35 who enjoy role-playing games
  - Writers seeking collaborative storytelling tools
  - Interactive fiction enthusiasts
- **Key User Characteristics**:
  - Familiar with chat interfaces
  - Interested in AI-assisted creative content
  - Willing to experiment with different narrative modes
- **Core Usage Scenarios**:
  - Creating custom RPG scenarios with friends
  - Solo creative writing with AI companions
  - Observing and guiding AI-generated narratives

## 4. Problem Statement
- **Current Pain Points**:
  - Traditional RPG platforms require significant manual storytelling effort
  - Limited flexibility in participation modes (must actively play)
  - Character and visual asset creation is time-consuming
  - Lack of dynamic, context-aware narrative generation
- **Existing Alternatives**:
  - Character.AI (limited world-building, no multi-character scenes)
  - Traditional tabletop RPG platforms (manual, not AI-driven)
  - Text-based RPG games (fixed narratives, limited customization)
- **Why Insufficient**:
  - No combination of multi-character management, dual participation modes, and dual presentation styles
  - Limited AI-driven visual generation (backgrounds, character portraits)
  - Lack of flexible user identity switching

## 5. MVP Scope

### In Scope
- **Chat Room Management**:
  - Left panel chat room list
  - Create/join chat rooms
  - Room-specific settings

- **Character Creation**:
  - Multiple characters per room
  - Character name, description/setting
  - Character portrait upload (image file or URL)
  - AI-generated character portraits (if user doesn't provide)

- **User Identity Selection**:
  - 演绎者 (Actor): Active participant with assigned character
  - 旁观者 (Observer): Passive observer with guidance ability

- **Dual Presentation Modes**:
  - **Chat Mode**: Text-based chat interface with narrator support
  - **Immersive Mode**: Visual novel style with character portraits and AI-generated backgrounds

- **AI-Driven Features**:
  - AI-generated narrative progression
  - AI-generated character portraits (optional)
  - AI-generated scene backgrounds based on story context

### Out of Scope
- Multi-user real-time collaboration (focus on single-user or async scenarios first)
- Voice narration or audio features
- Complex combat/dice roll mechanics
- Character stat systems
- Export to other formats (PDF, video, etc.)
- Mobile app (web-first)
- Monetization features
- User authentication (can be added post-MVP)

## 6. User Flow

1. **Entry**: User opens the application
2. **Room Selection**: User sees left panel with chat room list
3. **Room Creation/Join**:
   - **Create**: Click "New Room" → Enter room name and settings
   - **Join**: Click existing room from list
4. **Character Setup**:
   - Add characters with name and description
   - Upload portrait image OR leave blank for AI generation
   - Assign character to self (if 演绎者) or leave unassigned
5. **Identity Selection**: Choose identity as 演绎者 or 旁观者
6. **Mode Selection**: Toggle between Chat Mode and Immersive Mode
7. **Interaction**:
   - **Chat Mode**: Send messages, AI responds with character dialogue and narration
   - **Immersive Mode**: View character portraits, backgrounds, and dialogue in visual novel format
8. **Narrative Progression**: AI generates contextual responses, updates backgrounds in immersive mode
9. **Completion**: User can save/exit room at any time

## 7. Functional Requirements

1. **Chat Room System**:
   - Display all user rooms in left sidebar
   - Support room creation with custom naming
   - Persist room state

2. **Character Management**:
   - Create multiple characters per room
   - Required fields: name, description
   - Optional: portrait image (upload or URL)
   - AI fallback for missing portraits

3. **Identity System**:
   - Toggle between 演绎者 and 旁观者
   - 演绎者: Assigned to specific character
   - 旁观者: Can send guidance messages

4. **Chat Mode Presentation**:
   - Text-based message list
   - Support for narrator messages (system-style)
   - Character messages with name labels

5. **Immersive Mode Presentation**:
   - Display active character portrait
   - Show AI-generated background image
   - Present dialogue in visual novel style
   - Smooth transitions between scenes

6. **AI Integration**:
   - Generate narrative responses based on context
   - Generate character portraits when not provided
   - Generate scene backgrounds dynamically
   - Maintain conversation context

## 8. Non-Functional Expectations

- **Performance**:
  - AI response time < 5 seconds for narrative generation
  - Image generation < 15 seconds
  - Smooth mode switching (< 1 second)

- **Usability**:
  - Intuitive chat-like interface
  - Clear visual distinction between modes
  - Simple character creation process

- **Responsiveness**:
  - Web-responsive design (desktop-first)
  - Graceful degradation on smaller screens

- **Reliability**:
  - Persist chat history and room state
  - Handle AI service failures gracefully

- **Security/Privacy**:
  - Sanitize user inputs
  - Secure image upload handling
  - Local storage for MVP (privacy-first)

## 9. Risks and Open Questions

**Product Risks**:
- User expectation mismatch (AI quality vs user expectations)
- Complexity of dual-mode UI may confuse users
- Character creation friction may reduce engagement

**Technical Risks**:
- AI generation latency affecting user experience
- Image generation cost and speed trade-offs
- Context window limitations for long narratives
- Background generation quality consistency

**UX Risks**:
- Mode switching may be disruptive
- Immersive mode may feel disconnected from chat history
- Observer role may feel too passive

**Open Questions**:
- Should rooms support multiple simultaneous users? (Out of scope for MVP)
- How to handle very long conversation histories?
- What level of user control over AI generation?
- Should backgrounds be cached/reused?

## 10. Acceptance Criteria

- User can create a new chat room with custom name
- User can add at least 2 characters to a room with names and descriptions
- User can upload character portrait OR see AI-generated portrait
- User can select identity as 演绎者 or 旁观者
- User can toggle between Chat Mode and Immersive Mode
- In Chat Mode: Messages display with character names and narrator text
- In Immersive Mode: Character portraits and backgrounds display correctly
- AI generates contextual narrative responses within 5 seconds
- AI generates backgrounds that match scene context
- Room state persists across sessions
- Left panel displays all created rooms
- User can switch between rooms without losing data
