import { AIResponse, AIProvider, AIProviderConfig } from '@/../../main/services/AIService'
import { AIGenerationLength } from '@/shared/aiTypes'

/**
 * Type-safe IPC service for AI operations
 * Uses window.electron API from preload script
 */
export const aiApi = {
  /**
   * Get all available AI providers
   */
  async getProviders(): Promise<Record<AIProvider, AIProviderConfig>> {
    return window.electron.ipcRenderer.invoke('ai:getProviders')
  },

  /**
   * Set the AI provider
   */
  async setProvider(provider: AIProvider): Promise<boolean> {
    const result = await window.electron.ipcRenderer.invoke('ai:setProvider', provider)
    return result.success
  },

  /**
   * Set the OpenAI API key
   */
  async setApiKey(apiKey: string): Promise<boolean> {
    const result = await window.electron.ipcRenderer.invoke('ai:setApiKey', apiKey)
    return result.success
  },

  /**
   * Set the base URL for custom API endpoints
   */
  async setBaseUrl(baseUrl: string): Promise<boolean> {
    const result = await window.electron.ipcRenderer.invoke('ai:setBaseUrl', baseUrl)
    return result.success
  },

  /**
   * Set the model name
   */
  async setModel(model: string): Promise<boolean> {
    const result = await window.electron.ipcRenderer.invoke('ai:setModel', model)
    return result.success
  },

  /**
   * Set the generation length
   */
  async setGenerationLength(length: AIGenerationLength): Promise<boolean> {
    const result = await window.electron.ipcRenderer.invoke('ai:setGenerationLength', length)
    return result.success
  },

  /**
   * Get current AI config
   */
  async getConfig(): Promise<{ provider: AIProvider; apiKey?: string; model?: string; baseUrl?: string; generationLength?: AIGenerationLength }> {
    return window.electron.ipcRenderer.invoke('ai:getConfig')
  },

  /**
   * Check if AI service is configured
   */
  async checkConfigured(): Promise<boolean> {
    return window.electron.ipcRenderer.invoke('ai:checkConfigured')
  },

  /**
   * Generate AI response for a room
   */
  async generateResponse(
    roomId: string,
    userIdentity?: { type: 'actor' | 'observer'; characterId?: string },
    length?: AIGenerationLength
  ): Promise<{ success: boolean; response?: AIResponse; error?: string }> {
    return window.electron.ipcRenderer.invoke('ai:generateResponse', roomId, userIdentity, length)
  },

  /**
   * Generate AI response with streaming
   * Returns a promise that resolves when stream is complete
   * Use onChunk callback to receive streaming content
   */
  async generateStream(
    roomId: string,
    userIdentity?: { type: 'actor' | 'observer'; characterId?: string },
    length?: AIGenerationLength,
    onChunk?: (chunk: string) => void
  ): Promise<{ success: boolean; error?: string }> {
    // Set up listeners before starting stream
    const chunkListener = (_event: unknown, data: { streamId: string; chunk: string }) => {
      onChunk?.(data.chunk)
    }

    const doneListener = () => {
      window.electron.ipcRenderer.removeListener('ai:streamChunk', chunkListener)
      window.electron.ipcRenderer.removeListener('ai:streamDone', doneListener)
      window.electron.ipcRenderer.removeListener('ai:streamError', errorListener)
    }

    const errorListener = (_event: unknown, data: { streamId: string; error: string }) => {
      doneListener()
    }

    window.electron.ipcRenderer.on('ai:streamChunk', chunkListener)
    window.electron.ipcRenderer.on('ai:streamDone', doneListener)
    window.electron.ipcRenderer.on('ai:streamError', errorListener)

    return window.electron.ipcRenderer.invoke('ai:generateStream', roomId, userIdentity, length)
  },
}
