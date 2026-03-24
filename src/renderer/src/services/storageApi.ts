import { Room, Character, Message, UserIdentity } from '../types'

/**
 * Type-safe IPC service for storage operations
 * Uses window.electron API from preload script
 */
export const storageApi = {
  // ==================== Room Operations ====================

  async getAllRooms(): Promise<Room[]> {
    return window.electron.ipcRenderer.invoke('storage:rooms:getAll')
  },

  async getRoomById(id: string): Promise<Room | null> {
    return window.electron.ipcRenderer.invoke('storage:rooms:getById', id)
  },

  async createRoom(room: Room): Promise<Room> {
    return window.electron.ipcRenderer.invoke('storage:rooms:create', room)
  },

  async updateRoom(id: string, updates: Partial<Room>): Promise<Room | null> {
    return window.electron.ipcRenderer.invoke('storage:rooms:update', id, updates)
  },

  async deleteRoom(id: string): Promise<boolean> {
    return window.electron.ipcRenderer.invoke('storage:rooms:delete', id)
  },

  // ==================== Character Operations ====================

  async getCharactersByRoom(roomId: string): Promise<Character[]> {
    return window.electron.ipcRenderer.invoke('storage:characters:getByRoom', roomId)
  },

  async getCharacterById(id: string): Promise<Character | null> {
    return window.electron.ipcRenderer.invoke('storage:characters:getById', id)
  },

  async createCharacter(character: Character): Promise<Character> {
    return window.electron.ipcRenderer.invoke('storage:characters:create', character)
  },

  async updateCharacter(
    id: string,
    updates: Partial<Character>
  ): Promise<Character | null> {
    return window.electron.ipcRenderer.invoke('storage:characters:update', id, updates)
  },

  async deleteCharacter(id: string): Promise<boolean> {
    return window.electron.ipcRenderer.invoke('storage:characters:delete', id)
  },

  // ==================== Message Operations ====================

  async getMessagesByRoom(roomId: string, limit?: number): Promise<Message[]> {
    return window.electron.ipcRenderer.invoke('storage:messages:getByRoom', roomId, limit)
  },

  async getRecentMessages(
    roomId: string,
    count: number
  ): Promise<Message[]> {
    return window.electron.ipcRenderer.invoke('storage:messages:getRecent', roomId, count)
  },

  async createMessage(message: Message): Promise<Message> {
    return window.electron.ipcRenderer.invoke('storage:messages:create', message)
  },

  async deleteMessage(id: string): Promise<boolean> {
    return window.electron.ipcRenderer.invoke('storage:messages:delete', id)
  },

  async deleteMessagesByRoom(roomId: string): Promise<number> {
    return window.electron.ipcRenderer.invoke('storage:messages:deleteByRoom', roomId)
  },

  // ==================== User Identity Operations ====================

  async getUserIdentity(roomId: string): Promise<UserIdentity | null> {
    return window.electron.ipcRenderer.invoke('storage:userIdentity:get', roomId)
  },

  async setUserIdentity(identity: UserIdentity): Promise<UserIdentity> {
    return window.electron.ipcRenderer.invoke('storage:userIdentity:set', identity)
  },

  async deleteUserIdentity(roomId: string): Promise<boolean> {
    return window.electron.ipcRenderer.invoke('storage:userIdentity:delete', roomId)
  },
}

/**
 * IPC service for asset operations
 */
export const assetApi = {
  /**
   * Upload an image from base64 data
   */
  async uploadImage(base64Data: string, subDir: 'portraits' | 'backgrounds' = 'portraits'): Promise<string> {
    return window.electron.ipcRenderer.invoke('assets:uploadImage', base64Data, subDir)
  },

  /**
   * Get the full path for an asset
   */
  async getAssetPath(relativePath: string): Promise<string> {
    return window.electron.ipcRenderer.invoke('assets:getAssetPath', relativePath)
  },
}
