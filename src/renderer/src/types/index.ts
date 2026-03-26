import { AIGenerationLength } from '../../../shared/aiTypes'

// Core domain types

export interface Room {
  id: string
  name: string
  worldSetting?: string
  createdAt: number
  updatedAt: number
}

export interface Character {
  id: string
  roomId: string
  name: string
  description: string
  portraitUrl?: string
  createdAt: number
}

export type MessageType = 'user' | 'ai' | 'narrator'

export interface Message {
  id: string
  roomId: string
  characterId?: string // undefined for narrator messages
  type: MessageType
  content: string
  timestamp: number
}

export type UserIdentityType = 'actor' | 'observer'

export interface UserIdentity {
  roomId: string
  type: UserIdentityType
  characterId?: string // only for actor mode
}

export type PresentationMode = 'chat' | 'immersive'

// App State

export interface AppState {
  // Current state
  rooms: Room[]
  characters: Character[]
  messages: Message[]
  currentRoomId: string | null
  userIdentities: Map<string, UserIdentity> // roomId -> identity
  presentationMode: PresentationMode

  // Loading states
  isLoading: boolean

  // Actions - sync
  setRooms: (rooms: Room[]) => void
  setCurrentRoom: (roomId: string | null) => void
  addRoom: (room: Room) => void
  updateRoom: (roomId: string, updates: Partial<Room>) => void
  deleteRoom: (roomId: string) => void

  setCharacters: (characters: Character[]) => void
  addCharacter: (character: Character) => void
  updateCharacter: (characterId: string, updates: Partial<Character>) => void
  deleteCharacter: (characterId: string) => void

  setMessages: (messages: Message[]) => void
  addMessage: (message: Message) => void

  setUserIdentity: (roomId: string, identity: UserIdentity) => void
  getUserIdentity: (roomId: string) => UserIdentity | undefined

  setPresentationMode: (mode: PresentationMode) => void

  setLoading: (loading: boolean) => void

  // Actions - async with IPC
  loadRooms: () => Promise<Room[]>
  loadRoom: (roomId: string) => Promise<{
    room: Room
    characters: Character[]
    messages: Message[]
    userIdentity: UserIdentity | null
  } | null>
  createRoomAsync: (name: string, worldSetting?: string) => Promise<Room | null>
  updateRoomAsync: (roomId: string, updates: Partial<Room>) => Promise<Room | null>
  deleteRoomAsync: (roomId: string) => Promise<boolean>
  createCharacterAsync: (roomId: string, name: string, description: string, portraitUrl?: string) => Promise<Character | null>
  updateCharacterAsync: (characterId: string, updates: Partial<Character>) => Promise<Character | null>
  deleteCharacterAsync: (characterId: string) => Promise<boolean>
  sendMessageAsync: (roomId: string, content: string, type: MessageType, characterId?: string) => Promise<Message | null>
  sendUserMessageWithAIResponse: (roomId: string, content: string, length?: AIGenerationLength) => Promise<{ userMessage: Message; aiMessages: Message[] } | null>
  saveUserIdentityAsync: (roomId: string, type: 'actor' | 'observer', characterId?: string) => Promise<UserIdentity | null>
}
