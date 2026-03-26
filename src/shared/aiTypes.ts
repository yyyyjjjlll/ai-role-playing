// Shared AI types for both main and renderer processes

export type AIGenerationLength = 'short' | 'medium' | 'long' | 'verylong'

export interface AILengthConfig {
  label: string
  maxTokens: number
  description: string
}

export const AI_LENGTH_CONFIG: Record<AIGenerationLength, AILengthConfig> = {
  'short': {
    label: '简洁',
    maxTokens: 300,
    description: '简短回应，约 50-100 字'
  },
  'medium': {
    label: '中等',
    maxTokens: 600,
    description: '适中长度，约 100-200 字'
  },
  'long': {
    label: '详细',
    maxTokens: 1000,
    description: '详细内容，约 200-400 字'
  },
  'verylong': {
    label: '极长',
    maxTokens: 2000,
    description: '长篇剧情，约 400-800 字'
  }
}
