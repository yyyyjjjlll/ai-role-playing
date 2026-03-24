import { ipcMain } from 'electron'
import { storageService } from '../services/StorageService'
import { StorageChannels } from './channels'
import { Room, Character, Message, UserIdentity } from '../types'

/**
 * Register all storage-related IPC handlers
 */
export function registerStorageHandlers(): void {
  // ==================== Room Handlers ====================

  ipcMain.handle(
    StorageChannels.ROOMS_GET_ALL,
    async (): Promise<Room[]> => {
      return storageService.getAllRooms()
    }
  )

  ipcMain.handle(
    StorageChannels.ROOMS_GET_BY_ID,
    async (_, id: string): Promise<Room | null> => {
      return storageService.getRoomById(id)
    }
  )

  ipcMain.handle(
    StorageChannels.ROOMS_CREATE,
    async (_, room: Room): Promise<Room> => {
      return storageService.createRoom(room)
    }
  )

  ipcMain.handle(
    StorageChannels.ROOMS_UPDATE,
    async (_, id: string, updates: Partial<Room>): Promise<Room | null> => {
      return storageService.updateRoom(id, updates)
    }
  )

  ipcMain.handle(
    StorageChannels.ROOMS_DELETE,
    async (_, id: string): Promise<boolean> => {
      return storageService.deleteRoom(id)
    }
  )

  // ==================== Character Handlers ====================

  ipcMain.handle(
    StorageChannels.CHARACTERS_GET_BY_ROOM,
    async (_, roomId: string): Promise<Character[]> => {
      return storageService.getCharactersByRoomId(roomId)
    }
  )

  ipcMain.handle(
    StorageChannels.CHARACTERS_GET_BY_ID,
    async (_, id: string): Promise<Character | null> => {
      return storageService.getCharacterById(id)
    }
  )

  ipcMain.handle(
    StorageChannels.CHARACTERS_CREATE,
    async (_, character: Character): Promise<Character> => {
      return storageService.createCharacter(character)
    }
  )

  ipcMain.handle(
    StorageChannels.CHARACTERS_UPDATE,
    async (_, id: string, updates: Partial<Character>): Promise<Character | null> => {
      return storageService.updateCharacter(id, updates)
    }
  )

  ipcMain.handle(
    StorageChannels.CHARACTERS_DELETE,
    async (_, id: string): Promise<boolean> => {
      return storageService.deleteCharacter(id)
    }
  )

  // ==================== Message Handlers ====================

  ipcMain.handle(
    StorageChannels.MESSAGES_GET_BY_ROOM,
    async (_, roomId: string, limit?: number): Promise<Message[]> => {
      return storageService.getMessagesByRoomId(roomId, limit)
    }
  )

  ipcMain.handle(
    StorageChannels.MESSAGES_GET_RECENT,
    async (_, roomId: string, count: number): Promise<Message[]> => {
      return storageService.getRecentMessages(roomId, count)
    }
  )

  ipcMain.handle(
    StorageChannels.MESSAGES_CREATE,
    async (_, message: Message): Promise<Message> => {
      return storageService.createMessage(message)
    }
  )

  ipcMain.handle(
    StorageChannels.MESSAGES_DELETE,
    async (_, id: string): Promise<boolean> => {
      return storageService.deleteMessage(id)
    }
  )

  ipcMain.handle(
    StorageChannels.MESSAGES_DELETE_BY_ROOM,
    async (_, roomId: string): Promise<number> => {
      return storageService.deleteMessagesByRoomId(roomId)
    }
  )

  // ==================== User Identity Handlers ====================

  ipcMain.handle(
    StorageChannels.USER_IDENTITY_GET,
    async (_, roomId: string): Promise<UserIdentity | null> => {
      return storageService.getUserIdentity(roomId)
    }
  )

  ipcMain.handle(
    StorageChannels.USER_IDENTITY_SET,
    async (_, identity: UserIdentity): Promise<UserIdentity> => {
      return storageService.setUserIdentity(identity)
    }
  )

  ipcMain.handle(
    StorageChannels.USER_IDENTITY_DELETE,
    async (_, roomId: string): Promise<boolean> => {
      return storageService.deleteUserIdentity(roomId)
    }
  )

  console.log('[IPC] Storage handlers registered')
}
