import { ipcMain } from 'electron'
import { AIChannels } from './channels'
import { aiService, AIProvider, AI_PROVIDERS } from '../services/AIService'
import { storageService } from '../services/StorageService'

export function registerAIHandlers(): void {
  // Get available providers
  ipcMain.handle(AIChannels.GET_PROVIDERS, async () => {
    return AI_PROVIDERS
  })

  // Set AI Provider
  ipcMain.handle(AIChannels.SET_PROVIDER, async (_event, provider: AIProvider) => {
    try {
      aiService.setProvider(provider)
      return { success: true }
    } catch (error) {
      console.error('Failed to set provider:', error)
      return { success: false, error: '设置 AI 提供商失败' }
    }
  })

  // Set API Key
  ipcMain.handle(AIChannels.SET_API_KEY, async (_event, apiKey: string) => {
    try {
      aiService.setApiKey(apiKey)
      return { success: true }
    } catch (error) {
      console.error('Failed to set API key:', error)
      return { success: false, error: '设置 API 密钥失败' }
    }
  })

  // Set Base URL
  ipcMain.handle(AIChannels.SET_BASE_URL, async (_event, baseUrl: string) => {
    try {
      aiService.setBaseUrl(baseUrl)
      return { success: true }
    } catch (error) {
      console.error('Failed to set base URL:', error)
      return { success: false, error: '设置 API 地址失败' }
    }
  })

  // Set Model
  ipcMain.handle(AIChannels.SET_MODEL, async (_event, model: string) => {
    try {
      aiService.setModel(model)
      return { success: true }
    } catch (error) {
      console.error('Failed to set model:', error)
      return { success: false, error: '设置模型失败' }
    }
  })

  // Get current config
  ipcMain.handle(AIChannels.GET_CONFIG, async () => {
    return aiService.getConfig()
  })

  // Check if AI is configured
  ipcMain.handle(AIChannels.CHECK_CONFIGURED, async () => {
    return aiService.isConfigured()
  })

  // Generate AI response
  ipcMain.handle(
    AIChannels.GENERATE_RESPONSE,
    async (
      _event,
      roomId: string,
      userIdentity?: { type: 'actor' | 'observer'; characterId?: string }
    ) => {
      try {
        // Get room data
        const room = await storageService.getRoomById(roomId)
        if (!room) {
          throw new Error('房间不存在')
        }

        // Get characters in the room
        const characters = await storageService.getCharactersByRoomId(roomId)

        // Get recent messages
        const recentMessages = await storageService.getRecentMessages(roomId, 50)

        // Get user character if actor mode
        let userCharacter
        if (userIdentity?.type === 'actor' && userIdentity.characterId) {
          userCharacter = characters.find(c => c.id === userIdentity.characterId)
        }

        // Generate AI response
        const response = await aiService.generateResponse(
          room.worldSetting || '',
          characters,
          recentMessages,
          userIdentity,
          userCharacter
        )

        return { success: true, response }
      } catch (error) {
        console.error('Failed to generate AI response:', error)
        return {
          success: false,
          error: error instanceof Error ? error.message : 'AI 生成失败'
        }
      }
    }
  )
}
