import OpenAI from 'openai'
import { Character, Message } from '../../types'

export interface AIResponse {
  characterDialogues: Array<{
    characterId: string
    characterName: string
    content: string
  }>
  narratorText: string
}

// AI 提供商类型
export type AIProvider =
  | 'openai'           // OpenAI GPT-4, GPT-3.5-turbo
  | 'azure-openai'    // Azure OpenAI
  | 'deepseek'        // DeepSeek (深度求索)
  | 'moonshot'        // Moonshot (月之暗面)
  | 'zhipu'           // Zhipu AI (智谱 AI)
  | 'baichuan'        // Baichuan (百川)
  | 'minimax'         // MiniMax
  | 'ollama'          // Ollama 本地模型
  | 'lmstudio'        // LM Studio 本地模型
  | 'custom'          // 自定义 OpenAI 兼容服务

export interface AIProviderConfig {
  id: AIProvider
  name: string
  defaultModel: string
  defaultBaseUrl?: string
  apiKeyRequired: boolean
  description: string
}

// AI 提供商配置列表
export const AI_PROVIDERS: Record<AIProvider, AIProviderConfig> = {
  'openai': {
    id: 'openai',
    name: 'OpenAI',
    defaultModel: 'gpt-3.5-turbo',
    defaultBaseUrl: 'https://api.openai.com/v1',
    apiKeyRequired: true,
    description: 'OpenAI 官方 API，支持 GPT-4、GPT-3.5 等模型'
  },
  'azure-openai': {
    id: 'azure-openai',
    name: 'Azure OpenAI',
    defaultModel: 'gpt-35-turbo',
    apiKeyRequired: true,
    description: '微软 Azure 托管的 OpenAI 服务'
  },
  'deepseek': {
    id: 'deepseek',
    name: 'DeepSeek 深度求索',
    defaultModel: 'deepseek-chat',
    defaultBaseUrl: 'https://api.deepseek.com/v1',
    apiKeyRequired: true,
    description: '国产大模型，性价比高'
  },
  'moonshot': {
    id: 'moonshot',
    name: 'Moonshot 月之暗面',
    defaultModel: 'moonshot-v1-8k',
    defaultBaseUrl: 'https://api.moonshot.cn/v1',
    apiKeyRequired: true,
    description: '月之暗面 K2 大模型'
  },
  'zhipu': {
    id: 'zhipu',
    name: 'Zhipu AI 智谱',
    defaultModel: 'glm-4',
    defaultBaseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    apiKeyRequired: true,
    description: '智谱 AI GLM 系列大模型'
  },
  'baichuan': {
    id: 'baichuan',
    name: 'Baichuan 百川',
    defaultModel: 'Baichuan4',
    defaultBaseUrl: 'https://api.baichuan-ai.com/v1',
    apiKeyRequired: true,
    description: '百川大模型'
  },
  'minimax': {
    id: 'minimax',
    name: 'MiniMax',
    defaultModel: 'abab6.5',
    defaultBaseUrl: 'https://api.minimax.chat/v1',
    apiKeyRequired: true,
    description: 'MiniMax 大模型'
  },
  'ollama': {
    id: 'ollama',
    name: 'Ollama (本地)',
    defaultModel: 'llama3',
    defaultBaseUrl: 'http://localhost:11434/v1',
    apiKeyRequired: false,
    description: '本地运行开源大模型（Llama 3、Mistral 等）'
  },
  'lmstudio': {
    id: 'lmstudio',
    name: 'LM Studio (本地)',
    defaultModel: 'local-model',
    defaultBaseUrl: 'http://localhost:1234/v1',
    apiKeyRequired: false,
    description: '本地运行各种开源大模型'
  },
  'custom': {
    id: 'custom',
    name: '自定义服务',
    defaultModel: 'default',
    apiKeyRequired: true,
    description: '其他兼容 OpenAI API 格式的服务'
  }
}

export interface AIServiceConfig {
  provider?: AIProvider
  apiKey?: string
  model?: string
  baseUrl?: string
}

export class AIService {
  private client: OpenAI | null = null
  private config: AIServiceConfig
  private provider: AIProvider = 'openai'

  constructor(config: AIServiceConfig = {}) {
    this.config = {
      provider: 'openai',
      model: 'gpt-3.5-turbo',
      ...config
    }
    this.provider = this.config.provider || 'openai'

    if (config.apiKey) {
      this.initClient()
    }
  }

  private initClient(): void {
    const providerConfig = AI_PROVIDERS[this.provider]
    const baseUrl = this.config.baseUrl || providerConfig.defaultBaseUrl

    if (baseUrl) {
      this.client = new OpenAI({
        apiKey: this.config.apiKey || 'ollama', // Ollama 不需要真实 API 密钥
        baseURL: baseUrl
      })
    }
  }

  /**
   * Set the AI provider
   */
  setProvider(provider: AIProvider): void {
    this.provider = provider
    const providerConfig = AI_PROVIDERS[provider]
    this.config.model = this.config.model || providerConfig.defaultModel
    this.initClient()
  }

  /**
   * Initialize or update the API key
   */
  setApiKey(apiKey: string): void {
    this.config.apiKey = apiKey
    this.initClient()
  }

  /**
   * Set the base URL
   */
  setBaseUrl(baseUrl: string): void {
    this.config.baseUrl = baseUrl
    this.initClient()
  }

  /**
   * Set the model name
   */
  setModel(model: string): void {
    this.config.model = model
  }

  /**
   * Get current provider
   */
  getProvider(): AIProvider {
    return this.provider
  }

  /**
   * Get current config
   */
  getConfig(): AIServiceConfig & { provider: AIProvider } {
    return {
      ...this.config,
      provider: this.provider
    }
  }

  /**
   * Check if the service is configured
   */
  isConfigured(): boolean {
    return this.client !== null
  }

  /**
   * Build context messages for the AI
   */
  buildContext(
    worldSetting: string,
    characters: Character[],
    recentMessages: Message[],
    userIdentity?: { type: 'actor' | 'observer'; characterId?: string },
    userCharacter?: Character
  ): OpenAI.Chat.Completions.ChatCompletionMessageParam[] {
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = []

    // System prompt with world setting and character descriptions
    let systemContent = `你是一个角色扮演游戏的 AI 叙事引擎。
世界设定：${worldSetting || '未设定'}

当前角色：
${characters.map(c => `- ${c.name}: ${c.description}`).join('\n')}

请根据以上设定生成符合情境的对话和旁白。
格式要求：
- 角色对话使用格式：[角色名]: 对话内容
- 旁白使用格式：【旁白】旁白内容
- 可以有多个角色对话和旁白交替
- 保持回应简洁，每段对话不超过 100 字`

    // Add user role instruction
    if (userIdentity?.type === 'actor' && userCharacter) {
      systemContent += `\n\n用户正在扮演角色：${userCharacter.name}
请为其他角色生成回应，不要为用户扮演的角色生成对话。`
    } else if (userIdentity?.type === 'observer') {
      systemContent += '\n\n用户是旁观者，正在引导故事发展。请为所有角色生成回应。'
    }

    messages.push({
      role: 'system',
      content: systemContent
    })

    // Add recent conversation history
    const historyMessages = recentMessages.slice(-50).map((msg): OpenAI.Chat.Completions.ChatCompletionMessageParam => {
      if (msg.type === 'user') {
        return {
          role: 'user',
          content: `[用户]: ${msg.content}`
        }
      } else if (msg.type === 'narrator') {
        return {
          role: 'assistant',
          content: `【旁白】${msg.content}`
        }
      } else {
        const character = characters.find(c => c.id === msg.characterId)
        const characterName = character?.name || '未知角色'
        return {
          role: 'assistant',
          content: `[${characterName}]: ${msg.content}`
        }
      }
    })

    messages.push(...historyMessages)

    return messages
  }

  /**
   * Generate AI response based on context
   */
  async generateResponse(
    worldSetting: string,
    characters: Character[],
    recentMessages: Message[],
    userIdentity?: { type: 'actor' | 'observer'; characterId?: string },
    userCharacter?: Character
  ): Promise<AIResponse> {
    if (!this.client) {
      throw new Error('AI 服务未配置 - 请设置 API 密钥')
    }

    const contextMessages = this.buildContext(
      worldSetting,
      characters,
      recentMessages,
      userIdentity,
      userCharacter
    )

    try {
      const completion = await this.client.chat.completions.create({
        model: this.config.model || 'gpt-3.5-turbo',
        messages: contextMessages,
        temperature: 0.8,
        max_tokens: 500
      })

      const responseContent = completion.choices[0].message?.content || ''
      return this.parseAIResponse(responseContent, characters)
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        throw new Error(`AI 服务错误：${error.message}`)
      }
      throw error
    }
  }

  /**
   * Parse AI response into structured format
   */
  private parseAIResponse(content: string, characters: Character[]): AIResponse {
    const characterDialogues: AIResponse['characterDialogues'] = []
    let narratorText = ''

    const lines = content.split('\n').filter(line => line.trim())

    for (const line of lines) {
      // Parse character dialogue: [角色名]: 对话内容
      const dialogueMatch = line.match(/^\[([^\]]+)\]:\s*(.+)$/)
      if (dialogueMatch) {
        const characterName = dialogueMatch[1].trim()
        const dialogueContent = dialogueMatch[2].trim()

        // Find matching character
        const character = characters.find(c => c.name === characterName)
        if (character) {
          characterDialogues.push({
            characterId: character.id,
            characterName: character.name,
            content: dialogueContent
          })
        } else {
          // If character not found, treat as narrator text
          narratorText += line + '\n'
        }
        continue
      }

      // Parse narrator text: 【旁白】旁白内容
      const narratorMatch = line.match(/^【旁白】\s*(.+)$/)
      if (narratorMatch) {
        narratorText += narratorMatch[1] + '\n'
        continue
      }

      // Any other line is treated as narrator text
      narratorText += line + '\n'
    }

    return {
      characterDialogues,
      narratorText: narratorText.trim()
    }
  }
}

// Export singleton instance (will be initialized with config later)
export const aiService = new AIService()
