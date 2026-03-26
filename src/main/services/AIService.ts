import OpenAI from 'openai'
import { Character, Message } from '../types'
import { storageService } from './StorageService'
import { AIGenerationLength, AI_LENGTH_CONFIG } from '../../shared/aiTypes'

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
  generationLength?: AIGenerationLength
}

export class AIService {
  private client: OpenAI | null = null
  private config: AIServiceConfig
  private provider: AIProvider = 'openai'

  constructor(config: AIServiceConfig = {}) {
    this.config = {
      provider: 'openai',
      model: 'gpt-3.5-turbo',
      generationLength: 'medium', // 默认中等长度
      ...config
    }
    this.provider = this.config.provider || 'openai'

    if (config.apiKey) {
      this.initClient()
    }
  }

  /**
   * Load config from storage and initialize
   */
  async loadFromStorage(): Promise<void> {
    try {
      const aiConfig = storageService.getAllAiConfig()
      const provider = aiConfig['provider'] as AIProvider | undefined
      const apiKey = aiConfig['apiKey']
      const baseUrl = aiConfig['baseUrl']
      const model = aiConfig['model']
      const generationLength = aiConfig['generationLength'] as AIGenerationLength | undefined

      if (provider) {
        this.provider = provider
      }
      if (apiKey) {
        this.config.apiKey = apiKey
      }
      if (baseUrl) {
        this.config.baseUrl = baseUrl
      }
      if (model) {
        this.config.model = model
      } else {
        // Use default model for the provider
        const providerConfig = AI_PROVIDERS[this.provider]
        if (providerConfig) {
          this.config.model = providerConfig.defaultModel
        }
      }
      if (generationLength) {
        this.config.generationLength = generationLength
      }

      if (this.config.apiKey || AI_PROVIDERS[this.provider]?.apiKeyRequired === false) {
        this.initClient()
      }
    } catch (error) {
      console.error('[AIService] Failed to load config from storage:', error)
    }
  }

  /**
   * Save config to storage
   */
  private saveToStorage(): void {
    try {
      storageService.setAiConfig('provider', this.provider)
      if (this.config.apiKey) {
        storageService.setAiConfig('apiKey', this.config.apiKey)
      }
      if (this.config.baseUrl) {
        storageService.setAiConfig('baseUrl', this.config.baseUrl)
      }
      if (this.config.model) {
        storageService.setAiConfig('model', this.config.model)
      }
      if (this.config.generationLength) {
        storageService.setAiConfig('generationLength', this.config.generationLength)
      }
    } catch (error) {
      console.error('[AIService] Failed to save config to storage:', error)
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
    this.saveToStorage()
  }

  /**
   * Initialize or update the API key
   */
  setApiKey(apiKey: string): void {
    this.config.apiKey = apiKey
    this.initClient()
    this.saveToStorage()
  }

  /**
   * Set the base URL
   */
  setBaseUrl(baseUrl: string): void {
    this.config.baseUrl = baseUrl
    this.initClient()
    this.saveToStorage()
  }

  /**
   * Set the model name
   */
  setModel(model: string): void {
    this.config.model = model
    this.saveToStorage()
  }

  /**
   * Set the generation length
   */
  setGenerationLength(length: AIGenerationLength): void {
    this.config.generationLength = length
    this.saveToStorage()
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
   * Get current generation length
   */
  getGenerationLength(): AIGenerationLength {
    return this.config.generationLength || 'medium'
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
    userCharacter?: Character,
    length?: AIGenerationLength
  ): OpenAI.Chat.Completions.ChatCompletionMessageParam[] {
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = []

    // Get length-specific guidance
    const generationLength = length || this.config.generationLength || 'medium'
    const lengthGuidance: Record<AIGenerationLength, string> = {
      'short': '保持回应简洁，每段对话不超过 50 字',
      'medium': '保持回应适中，每段对话约 100-150 字',
      'long': '可以详细描述，每段对话约 200-300 字，包含更多细节和描写',
      'verylong': '尽情展开剧情，每段对话可达 400-600 字，充分描写场景、心理和动作'
    }

    // System prompt with world setting and character descriptions
    let systemContent = `你是一个角色扮演游戏的 AI 叙事引擎。

世界设定：${worldSetting || '未设定'}

当前角色：
${characters.map(c => `- ${c.name}: ${c.description}`).join('\n')}

`

    // Add user role instruction - CRITICAL for proper behavior
    if (userIdentity?.type === 'actor' && userCharacter) {
      systemContent += `重要：用户身份 - 演绎者模式
用户正在扮演角色：【${userCharacter.name}】
你的职责：
1. 绝对不要为角色"${userCharacter.name}"生成任何对话或行为
2. 只为其他角色（${characters.filter(c => c.id !== userCharacter.id).map(c => c.name).join('、')}）生成回应
3. 对用户扮演角色的发言做出自然反应
4. 推动剧情发展，但不要代替用户角色做决定

`
    } else if (userIdentity?.type === 'observer') {
      systemContent += `重要：用户身份 - 旁观者模式
用户是旁观者，正在引导和观察故事发展
你的职责：
1. 为所有角色生成自然的对话和行为
2. 根据用户的引导推动剧情
3. 让角色之间产生互动和冲突
4. 创造引人入胜的叙事体验

`
    }

    systemContent += `格式要求：
- 角色对话使用格式：[角色名]: 对话内容
- 旁白使用格式：【旁白】旁白内容
- 可以有多个角色对话和旁白交替
- ${lengthGuidance[generationLength]}
- 对话要符合角色性格和当前情境`

    messages.push({
      role: 'system',
      content: systemContent
    })

    // Add recent conversation history
    const historyMessages = recentMessages.slice(-50).map((msg): OpenAI.Chat.Completions.ChatCompletionMessageParam => {
      if (msg.type === 'user') {
        const character = characters.find(c => c.id === msg.characterId)
        const prefix = character ? `[${character.name}]` : '[用户]'
        return {
          role: 'user',
          content: `${prefix}: ${msg.content}`
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
    userCharacter?: Character,
    length?: AIGenerationLength
  ): Promise<AIResponse> {
    if (!this.client) {
      throw new Error('AI 服务未配置 - 请设置 API 密钥')
    }

    // Use provided length or fall back to config
    const generationLength = length || this.config.generationLength || 'medium'
    const lengthConfig = AI_LENGTH_CONFIG[generationLength]

    const contextMessages = this.buildContext(
      worldSetting,
      characters,
      recentMessages,
      userIdentity,
      userCharacter,
      generationLength
    )

    try {
      const completion = await this.client.chat.completions.create({
        model: this.config.model || 'gpt-3.5-turbo',
        messages: contextMessages,
        temperature: 0.8,
        max_tokens: lengthConfig.maxTokens
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
