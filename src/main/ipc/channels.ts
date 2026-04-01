// IPC channel constants for storage operations

export const StorageChannels = {
  // Room operations
  ROOMS_GET_ALL: 'storage:rooms:getAll',
  ROOMS_GET_BY_ID: 'storage:rooms:getById',
  ROOMS_CREATE: 'storage:rooms:create',
  ROOMS_UPDATE: 'storage:rooms:update',
  ROOMS_DELETE: 'storage:rooms:delete',

  // Character operations
  CHARACTERS_GET_BY_ROOM: 'storage:characters:getByRoom',
  CHARACTERS_GET_BY_ID: 'storage:characters:getById',
  CHARACTERS_CREATE: 'storage:characters:create',
  CHARACTERS_UPDATE: 'storage:characters:update',
  CHARACTERS_DELETE: 'storage:characters:delete',

  // Message operations
  MESSAGES_GET_BY_ROOM: 'storage:messages:getByRoom',
  MESSAGES_GET_RECENT: 'storage:messages:getRecent',
  MESSAGES_CREATE: 'storage:messages:create',
  MESSAGES_DELETE: 'storage:messages:delete',
  MESSAGES_DELETE_BY_ROOM: 'storage:messages:deleteByRoom',

  // User identity operations
  USER_IDENTITY_GET: 'storage:userIdentity:get',
  USER_IDENTITY_SET: 'storage:userIdentity:set',
  USER_IDENTITY_DELETE: 'storage:userIdentity:delete',
} as const

// Asset operations
export const AssetChannels = {
  UPLOAD_IMAGE: 'assets:uploadImage',
  GET_ASSET_PATH: 'assets:getAssetPath',
} as const

// AI operations
export const AIChannels = {
  GET_PROVIDERS: 'ai:getProviders',
  SET_PROVIDER: 'ai:setProvider',
  GENERATE_RESPONSE: 'ai:generateResponse',
  GENERATE_STREAM: 'ai:generateStream',
  SET_API_KEY: 'ai:setApiKey',
  SET_BASE_URL: 'ai:setBaseUrl',
  SET_MODEL: 'ai:setModel',
  GET_CONFIG: 'ai:getConfig',
  CHECK_CONFIGURED: 'ai:checkConfigured',
  SET_GENERATION_LENGTH: 'ai:setGenerationLength',
} as const
