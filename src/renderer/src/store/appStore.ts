import { create } from 'zustand'
import { AppState, Room, Character, Message, UserIdentity, PresentationMode, MessageType } from '../types'
import { storageApi } from '../services/storageApi'
import { aiApi } from '../services/aiApi'

// Generate unique ID
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  rooms: [],
  characters: [],
  messages: [],
  currentRoomId: null,
  userIdentities: new Map(),
  presentationMode: 'chat',
  isLoading: false,

  // Room actions
  setRooms: (rooms: Room[]) => set({ rooms }),

  setCurrentRoom: (roomId: string | null) => set({ currentRoomId: roomId }),

  addRoom: (room: Room) =>
    set((state) => ({
      rooms: [...state.rooms, room]
    })),

  updateRoom: (roomId: string, updates: Partial<Room>) =>
    set((state) => ({
      rooms: state.rooms.map((room) =>
        room.id === roomId ? { ...room, ...updates } : room
      )
    })),

  deleteRoom: (roomId: string) =>
    set((state) => ({
      rooms: state.rooms.filter((room) => room.id !== roomId),
      currentRoomId: state.currentRoomId === roomId ? null : state.currentRoomId
    })),

  // Character actions
  setCharacters: (characters: Character[]) => set({ characters }),

  addCharacter: (character: Character) =>
    set((state) => ({
      characters: [...state.characters, character]
    })),

  updateCharacter: (characterId: string, updates: Partial<Character>) =>
    set((state) => ({
      characters: state.characters.map((char) =>
        char.id === characterId ? { ...char, ...updates } : char
      )
    })),

  deleteCharacter: (characterId: string) =>
    set((state) => ({
      characters: state.characters.filter((char) => char.id !== characterId)
    })),

  // Message actions
  setMessages: (messages: Message[]) => set({ messages }),

  addMessage: (message: Message) =>
    set((state) => ({
      messages: [...state.messages, message]
    })),

  // User identity actions
  setUserIdentity: (roomId: string, identity: UserIdentity) =>
    set((state) => {
      const newIdentities = new Map(state.userIdentities)
      newIdentities.set(roomId, identity)
      return { userIdentities: newIdentities }
    }),

  getUserIdentity: (roomId: string) => {
    return get().userIdentities.get(roomId)
  },

  // Presentation mode actions
  setPresentationMode: (mode: PresentationMode) =>
    set({ presentationMode: mode }),

  // Loading state
  setLoading: (loading: boolean) => set({ isLoading: loading }),

  // Async operations with IPC
  loadRooms: async () => {
    try {
      const rooms = await storageApi.getAllRooms()
      set({ rooms })
      return rooms
    } catch (error) {
      console.error('Failed to load rooms:', error)
      return []
    }
  },

  loadRoom: async (roomId: string) => {
    try {
      set({ isLoading: true })

      // Load room data
      const room = await storageApi.getRoomById(roomId)
      if (!room) {
        set({ isLoading: false })
        return null
      }

      // Load characters for this room
      const characters = await storageApi.getCharactersByRoom(roomId)

      // Load messages for this room
      const messages = await storageApi.getMessagesByRoom(roomId)

      // Load user identity for this room
      const userIdentity = await storageApi.getUserIdentity(roomId)

      // Update state
      set({
        characters,
        messages,
        currentRoomId: roomId,
        isLoading: false
      })

      if (userIdentity) {
        const newIdentities = new Map(get().userIdentities)
        newIdentities.set(roomId, userIdentity)
        set({ userIdentities: newIdentities })
      }

      return { room, characters, messages, userIdentity }
    } catch (error) {
      console.error('Failed to load room:', error)
      set({ isLoading: false })
      return null
    }
  },

  createRoomAsync: async (name: string, worldSetting?: string) => {
    try {
      const now = Date.now()
      const room: Room = {
        id: generateId(),
        name,
        worldSetting,
        createdAt: now,
        updatedAt: now
      }

      const savedRoom = await storageApi.createRoom(room)
      set((state) => ({
        rooms: [...state.rooms, savedRoom],
        currentRoomId: savedRoom.id
      }))
      return savedRoom
    } catch (error) {
      console.error('Failed to create room:', error)
      return null
    }
  },

  updateRoomAsync: async (roomId: string, updates: Partial<Room>) => {
    try {
      const savedRoom = await storageApi.updateRoom(roomId, updates)
      if (savedRoom) {
        set((state) => ({
          rooms: state.rooms.map((room) =>
            room.id === roomId ? { ...room, ...savedRoom } : room
          )
        }))
      }
      return savedRoom
    } catch (error) {
      console.error('Failed to update room:', error)
      return null
    }
  },

  deleteRoomAsync: async (roomId: string) => {
    try {
      const success = await storageApi.deleteRoom(roomId)
      if (success) {
        set((state) => ({
          rooms: state.rooms.filter((room) => room.id !== roomId),
          currentRoomId: state.currentRoomId === roomId ? null : state.currentRoomId
        }))
      }
      return success
    } catch (error) {
      console.error('Failed to delete room:', error)
      return false
    }
  },

  createCharacterAsync: async (roomId: string, name: string, description: string, portraitUrl?: string) => {
    try {
      const character: Character = {
        id: generateId(),
        roomId,
        name,
        description,
        portraitUrl,
        createdAt: Date.now()
      }

      const savedCharacter = await storageApi.createCharacter(character)
      set((state) => ({
        characters: [...state.characters, savedCharacter]
      }))
      return savedCharacter
    } catch (error) {
      console.error('Failed to create character:', error)
      return null
    }
  },

  updateCharacterAsync: async (characterId: string, updates: Partial<Character>) => {
    try {
      const savedCharacter = await storageApi.updateCharacter(characterId, updates)
      if (savedCharacter) {
        set((state) => ({
          characters: state.characters.map((char) =>
            char.id === characterId ? { ...char, ...savedCharacter } : char
          )
        }))
      }
      return savedCharacter
    } catch (error) {
      console.error('Failed to update character:', error)
      return null
    }
  },

  deleteCharacterAsync: async (characterId: string) => {
    try {
      const success = await storageApi.deleteCharacter(characterId)
      if (success) {
        set((state) => ({
          characters: state.characters.filter((char) => char.id !== characterId)
        }))
      }
      return success
    } catch (error) {
      console.error('Failed to delete character:', error)
      return false
    }
  },

  sendMessageAsync: async (roomId: string, content: string, type: MessageType, characterId?: string) => {
    try {
      const message: Message = {
        id: generateId(),
        roomId,
        characterId,
        type,
        content,
        timestamp: Date.now()
      }

      const savedMessage = await storageApi.createMessage(message)
      set((state) => ({
        messages: [...state.messages, savedMessage]
      }))
      return savedMessage
    } catch (error) {
      console.error('Failed to send message:', error)
      return null
    }
  },

  /**
   * Send user message and trigger AI response
   */
  sendUserMessageWithAIResponse: async (roomId: string, content: string, length?: import('@/../../main/services/AIService').AIGenerationLength) => {
    try {
      set({ isLoading: true })

      // Get user identity to determine which character is speaking
      const userIdentity = get().userIdentities.get(roomId)
      const actualCharacterId = userIdentity?.type === 'actor' ? userIdentity.characterId : undefined

      // Save user message
      const userMessage: Message = {
        id: generateId(),
        roomId,
        characterId: actualCharacterId, // Use the user's assigned character in actor mode
        type: 'user',
        content,
        timestamp: Date.now()
      }

      const savedUserMessage = await storageApi.createMessage(userMessage)
      set((state) => ({
        messages: [...state.messages, savedUserMessage]
      }))

      // Generate AI response with user identity
      const aiResult = await aiApi.generateResponse(roomId, userIdentity, length)

      if (!aiResult.success || !aiResult.response) {
        console.error('AI generation failed:', aiResult.error)
        set({ isLoading: false })
        return { userMessage: savedUserMessage, aiMessages: [] }
      }

      const { response } = aiResult
      const aiMessages: Message[] = []

      // Add narrator text if present
      if (response.narratorText) {
        const narratorMessage: Message = {
          id: generateId(),
          roomId,
          type: 'narrator',
          content: response.narratorText,
          timestamp: Date.now()
        }
        const savedNarrator = await storageApi.createMessage(narratorMessage)
        aiMessages.push(savedNarrator)
      }

      // Add character dialogues
      for (const dialogue of response.characterDialogues) {
        const aiMessage: Message = {
          id: generateId(),
          roomId,
          characterId: dialogue.characterId,
          type: 'ai',
          content: dialogue.content,
          timestamp: Date.now()
        }
        const savedAi = await storageApi.createMessage(aiMessage)
        aiMessages.push(savedAi)
      }

      // Update state with all AI messages
      set((state) => ({
        messages: [...state.messages, ...aiMessages],
        isLoading: false
      }))

      return { userMessage: savedUserMessage, aiMessages }
    } catch (error) {
      console.error('Failed to send message with AI response:', error)
      set({ isLoading: false })
      return null
    }
  },

  saveUserIdentityAsync: async (roomId: string, type: 'actor' | 'observer', characterId?: string) => {
    try {
      const identity: UserIdentity = {
        roomId,
        type,
        characterId
      }

      await storageApi.setUserIdentity(identity)
      const newIdentities = new Map(get().userIdentities)
      newIdentities.set(roomId, identity)
      set({ userIdentities: newIdentities })
      return identity
    } catch (error) {
      console.error('Failed to save user identity:', error)
      return null
    }
  }
}))
