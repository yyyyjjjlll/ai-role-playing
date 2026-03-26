import Database from 'better-sqlite3'
import { app } from 'electron'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'

let db: Database.Database | null = null

// Database schema as a constant
const SCHEMA = `
-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  world_setting TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Characters table
CREATE TABLE IF NOT EXISTS characters (
  id TEXT PRIMARY KEY,
  room_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  portrait_url TEXT,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  room_id TEXT NOT NULL,
  character_id TEXT,
  type TEXT NOT NULL CHECK(type IN ('user', 'ai', 'narrator')),
  content TEXT NOT NULL,
  timestamp INTEGER NOT NULL,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
  FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE SET NULL
);

-- User identities table (stores user role per room)
CREATE TABLE IF NOT EXISTS user_identities (
  room_id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK(type IN ('actor', 'observer')),
  character_id TEXT,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
  FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE SET NULL
);

-- AI config table (stores API settings)
CREATE TABLE IF NOT EXISTS ai_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_characters_room_id ON characters(room_id);
CREATE INDEX IF NOT EXISTS idx_messages_room_id ON messages(room_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);
`

/**
 * Initialize the SQLite database
 */
export function initDatabase(): Database.Database {
  if (db) {
    return db
  }

  // Get user data path
  const userDataPath = app.getPath('userData')
  const dbPath = join(userDataPath, 'npcchat.db')

  // Ensure directory exists
  if (!existsSync(userDataPath)) {
    mkdirSync(userDataPath, { recursive: true })
  }

  console.log(`[Database] Initializing database at: ${dbPath}`)

  // Create database connection
  db = new Database(dbPath, {
    verbose: console.log
  })

  // Enable foreign keys
  db.pragma('foreign_keys = ON')

  // Initialize schema
  initSchema(db)

  console.log('[Database] Database initialized successfully')

  return db
}

/**
 * Initialize database schema
 */
function initSchema(database: Database.Database): void {
  try {
    database.exec(SCHEMA)
    console.log('[Database] Schema initialized successfully')
  } catch (error) {
    console.error('[Database] Failed to initialize schema:', error)
    throw error
  }
}

/**
 * Get the database instance
 */
export function getDatabase(): Database.Database {
  if (!db) {
    return initDatabase()
  }
  return db
}

/**
 * Close the database connection
 */
export function closeDatabase(): void {
  if (db) {
    db.close()
    db = null
    console.log('[Database] Database connection closed')
  }
}
