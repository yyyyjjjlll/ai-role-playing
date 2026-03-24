// Database row types (snake_case matching database columns)

export interface RoomRow {
  id: string
  name: string
  world_setting: string | null
  created_at: number
  updated_at: number
}

export interface CharacterRow {
  id: string
  room_id: string
  name: string
  description: string
  portrait_url: string | null
  created_at: number
}

export interface MessageRow {
  id: string
  room_id: string
  character_id: string | null
  type: 'user' | 'ai' | 'narrator'
  content: string
  timestamp: number
}

export interface UserIdentityRow {
  room_id: string
  type: 'actor' | 'observer'
  character_id: string | null
}

// Domain types (camelCase for application use)

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

export interface Message {
  id: string
  roomId: string
  characterId?: string
  type: 'user' | 'ai' | 'narrator'
  content: string
  timestamp: number
}

export interface UserIdentity {
  roomId: string
  type: 'actor' | 'observer'
  characterId?: string
}
