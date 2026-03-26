import Database from 'better-sqlite3'
import { getDatabase } from '../database/db'
import {
  Room,
  Character,
  Message,
  UserIdentity,
  RoomRow,
  CharacterRow,
  MessageRow,
  UserIdentityRow
} from '../types'

export class StorageService {
  private db: Database.Database

  constructor() {
    this.db = getDatabase()
  }

  // ==================== Room Operations ====================

  /**
   * Get all rooms
   */
  getAllRooms(): Room[] {
    const stmt = this.db.prepare('SELECT * FROM rooms ORDER BY updated_at DESC')
    const rows = stmt.all() as RoomRow[]
    return rows.map(this.rowToRoom)
  }

  /**
   * Get room by ID
   */
  getRoomById(id: string): Room | null {
    const stmt = this.db.prepare('SELECT * FROM rooms WHERE id = ?')
    const row = stmt.get(id) as RoomRow | undefined
    return row ? this.rowToRoom(row) : null
  }

  /**
   * Create a new room
   */
  createRoom(room: Room): Room {
    const stmt = this.db.prepare(`
      INSERT INTO rooms (id, name, world_setting, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `)
    stmt.run(
      room.id,
      room.name,
      room.worldSetting || null,
      room.createdAt,
      room.updatedAt
    )
    return room
  }

  /**
   * Update a room
   */
  updateRoom(id: string, updates: Partial<Room>): Room | null {
    const room = this.getRoomById(id)
    if (!room) return null

    const updatedRoom = {
      ...room,
      ...updates,
      updatedAt: Date.now()
    }

    const stmt = this.db.prepare(`
      UPDATE rooms
      SET name = ?, world_setting = ?, updated_at = ?
      WHERE id = ?
    `)
    stmt.run(
      updatedRoom.name,
      updatedRoom.worldSetting || null,
      updatedRoom.updatedAt,
      id
    )

    return updatedRoom
  }

  /**
   * Delete a room (cascades to characters, messages, and user_identities)
   */
  deleteRoom(id: string): boolean {
    const stmt = this.db.prepare('DELETE FROM rooms WHERE id = ?')
    const result = stmt.run(id)
    return result.changes > 0
  }

  // ==================== Character Operations ====================

  /**
   * Get all characters for a room
   */
  getCharactersByRoomId(roomId: string): Character[] {
    const stmt = this.db.prepare('SELECT * FROM characters WHERE room_id = ? ORDER BY created_at ASC')
    const rows = stmt.all(roomId) as CharacterRow[]
    return rows.map(this.rowToCharacter)
  }

  /**
   * Get character by ID
   */
  getCharacterById(id: string): Character | null {
    const stmt = this.db.prepare('SELECT * FROM characters WHERE id = ?')
    const row = stmt.get(id) as CharacterRow | undefined
    return row ? this.rowToCharacter(row) : null
  }

  /**
   * Create a new character
   */
  createCharacter(character: Character): Character {
    const stmt = this.db.prepare(`
      INSERT INTO characters (id, room_id, name, description, portrait_url, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    stmt.run(
      character.id,
      character.roomId,
      character.name,
      character.description,
      character.portraitUrl || null,
      character.createdAt
    )
    return character
  }

  /**
   * Update a character
   */
  updateCharacter(id: string, updates: Partial<Character>): Character | null {
    const character = this.getCharacterById(id)
    if (!character) return null

    const updatedCharacter = { ...character, ...updates }

    const stmt = this.db.prepare(`
      UPDATE characters
      SET name = ?, description = ?, portrait_url = ?
      WHERE id = ?
    `)
    stmt.run(
      updatedCharacter.name,
      updatedCharacter.description,
      updatedCharacter.portraitUrl || null,
      id
    )

    return updatedCharacter
  }

  /**
   * Delete a character
   */
  deleteCharacter(id: string): boolean {
    const stmt = this.db.prepare('DELETE FROM characters WHERE id = ?')
    const result = stmt.run(id)
    return result.changes > 0
  }

  // ==================== Message Operations ====================

  /**
   * Get all messages for a room
   */
  getMessagesByRoomId(roomId: string, limit?: number): Message[] {
    const sql = limit
      ? 'SELECT * FROM messages WHERE room_id = ? ORDER BY timestamp ASC LIMIT ?'
      : 'SELECT * FROM messages WHERE room_id = ? ORDER BY timestamp ASC'

    const stmt = this.db.prepare(sql)
    const rows = limit
      ? (stmt.all(roomId, limit) as MessageRow[])
      : (stmt.all(roomId) as MessageRow[])
    return rows.map(this.rowToMessage)
  }

  /**
   * Get recent messages for a room
   */
  getRecentMessages(roomId: string, count: number): Message[] {
    const stmt = this.db.prepare(`
      SELECT * FROM messages
      WHERE room_id = ?
      ORDER BY timestamp DESC
      LIMIT ?
    `)
    const rows = stmt.all(roomId, count) as MessageRow[]
    return rows.reverse().map(this.rowToMessage)
  }

  /**
   * Create a new message
   */
  createMessage(message: Message): Message {
    const stmt = this.db.prepare(`
      INSERT INTO messages (id, room_id, character_id, type, content, timestamp)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    stmt.run(
      message.id,
      message.roomId,
      message.characterId || null,
      message.type,
      message.content,
      message.timestamp
    )
    return message
  }

  /**
   * Delete a message
   */
  deleteMessage(id: string): boolean {
    const stmt = this.db.prepare('DELETE FROM messages WHERE id = ?')
    const result = stmt.run(id)
    return result.changes > 0
  }

  /**
   * Delete all messages for a room
   */
  deleteMessagesByRoomId(roomId: string): number {
    const stmt = this.db.prepare('DELETE FROM messages WHERE room_id = ?')
    const result = stmt.run(roomId)
    return result.changes
  }

  // ==================== User Identity Operations ====================

  /**
   * Get user identity for a room
   */
  getUserIdentity(roomId: string): UserIdentity | null {
    const stmt = this.db.prepare('SELECT * FROM user_identities WHERE room_id = ?')
    const row = stmt.get(roomId) as UserIdentityRow | undefined
    return row ? this.rowToUserIdentity(row) : null
  }

  /**
   * Set user identity for a room (upsert)
   */
  setUserIdentity(identity: UserIdentity): UserIdentity {
    const stmt = this.db.prepare(`
      INSERT INTO user_identities (room_id, type, character_id)
      VALUES (?, ?, ?)
      ON CONFLICT(room_id) DO UPDATE SET
        type = excluded.type,
        character_id = excluded.character_id
    `)
    stmt.run(identity.roomId, identity.type, identity.characterId || null)
    return identity
  }

  /**
   * Delete user identity for a room
   */
  deleteUserIdentity(roomId: string): boolean {
    const stmt = this.db.prepare('DELETE FROM user_identities WHERE room_id = ?')
    const result = stmt.run(roomId)
    return result.changes > 0
  }

  // ==================== AI Config Operations ====================

  /**
   * Get AI config value by key
   */
  getAiConfig(key: string): string | null {
    const stmt = this.db.prepare('SELECT value FROM ai_config WHERE key = ?')
    const row = stmt.get(key) as { value: string } | undefined
    return row ? row.value : null
  }

  /**
   * Set AI config value (upsert)
   */
  setAiConfig(key: string, value: string): void {
    const stmt = this.db.prepare(`
      INSERT INTO ai_config (key, value)
      VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `)
    stmt.run(key, value)
  }

  /**
   * Get all AI config
   */
  getAllAiConfig(): Record<string, string> {
    const stmt = this.db.prepare('SELECT key, value FROM ai_config')
    const rows = stmt.all() as Array<{ key: string; value: string }>
    const config: Record<string, string> = {}
    for (const row of rows) {
      config[row.key] = row.value
    }
    return config
  }

  // ==================== Helper Methods ====================

  private rowToRoom(row: RoomRow): Room {
    return {
      id: row.id,
      name: row.name,
      worldSetting: row.world_setting || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }
  }

  private rowToCharacter(row: CharacterRow): Character {
    return {
      id: row.id,
      roomId: row.room_id,
      name: row.name,
      description: row.description,
      portraitUrl: row.portrait_url || undefined,
      createdAt: row.created_at
    }
  }

  private rowToMessage(row: MessageRow): Message {
    return {
      id: row.id,
      roomId: row.room_id,
      characterId: row.character_id || undefined,
      type: row.type,
      content: row.content,
      timestamp: row.timestamp
    }
  }

  private rowToUserIdentity(row: UserIdentityRow): UserIdentity {
    return {
      roomId: row.room_id,
      type: row.type,
      characterId: row.character_id || undefined
    }
  }
}

// Export singleton instance
export const storageService = new StorageService()
