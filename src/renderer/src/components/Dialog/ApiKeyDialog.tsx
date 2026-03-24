import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Key, Globe, Server, Cpu } from 'lucide-react'
import { AIProvider, AIProviderConfig } from '@/../main/services/AIService'
import { aiApi } from '@/services/aiApi'

interface ApiKeyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSetApiKey: (apiKey: string) => Promise<boolean>
}

export function ApiKeyDialog({
  open,
  onOpenChange,
  onSetApiKey,
}: ApiKeyDialogProps): React.JSX.Element {
  const [providers, setProviders] = useState<Record<AIProvider, AIProviderConfig>>({} as any)
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>('openai')
  const [apiKey, setApiKey] = useState('')
  const [baseUrl, setBaseUrl] = useState('')
  const [model, setModel] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isCustomProvider, setIsCustomProvider] = useState(false)

  // Load providers on mount
  useEffect(() => {
    aiApi.getProviders().then((data) => {
      setProviders(data)
      const config = data['openai']
      if (config) {
        setBaseUrl(config.defaultBaseUrl || '')
        setModel(config.defaultModel)
      }
    })
  }, [])

  // Update config when provider changes
  useEffect(() => {
    const config = providers[selectedProvider]
    if (config) {
      setBaseUrl(config.defaultBaseUrl || '')
      setModel(config.defaultModel)
      setIsCustomProvider(selectedProvider === 'custom')
    }
  }, [selectedProvider, providers])

  const handleProviderChange = (provider: AIProvider) => {
    setSelectedProvider(provider)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Set provider
      await aiApi.setProvider(selectedProvider)

      // Set base URL if provided
      if (baseUrl.trim()) {
        await aiApi.setBaseUrl(baseUrl.trim())
      }

      // Set model if provided
      if (model.trim()) {
        await aiApi.setModel(model.trim())
      }

      // Set API key if required and provided
      if (apiKey.trim()) {
        await onSetApiKey(apiKey.trim())
      }

      setApiKey('')
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to save AI config:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const config = providers[selectedProvider]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            AI 服务提供商设置
          </DialogTitle>
          <DialogDescription>
            选择 AI 服务提供商并配置 API 密钥
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Provider Selection */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">AI 提供商</label>
            <Select value={selectedProvider} onValueChange={handleProviderChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span>OpenAI (GPT-4/3.5)</span>
                  </div>
                </SelectItem>
                <SelectItem value="deepseek">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span>DeepSeek 深度求索</span>
                  </div>
                </SelectItem>
                <SelectItem value="moonshot">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span>Moonshot 月之暗面</span>
                  </div>
                </SelectItem>
                <SelectItem value="zhipu">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span>Zhipu AI 智谱</span>
                  </div>
                </SelectItem>
                <SelectItem value="baichuan">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span>Baichuan 百川</span>
                  </div>
                </SelectItem>
                <SelectItem value="minimax">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span>MiniMax</span>
                  </div>
                </SelectItem>
                <SelectItem value="ollama">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4" />
                    <span>Ollama (本地运行)</span>
                  </div>
                </SelectItem>
                <SelectItem value="lmstudio">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4" />
                    <span>LM Studio (本地运行)</span>
                  </div>
                </SelectItem>
                <SelectItem value="custom">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4" />
                    <span>自定义服务</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {config && (
              <p className="text-xs text-muted-foreground">
                {config.description}
              </p>
            )}
          </div>

          {/* API URL */}
          <div className="grid gap-2">
            <label htmlFor="base-url" className="text-sm font-medium">
              API 地址
            </label>
            <Input
              id="base-url"
              placeholder="https://api.example.com/v1"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              disabled={isSaving || (!isCustomProvider && !!config?.defaultBaseUrl)}
            />
          </div>

          {/* Model Name */}
          <div className="grid gap-2">
            <label htmlFor="model" className="text-sm font-medium">
              模型名称
            </label>
            <Input
              id="model"
              placeholder="gpt-3.5-turbo"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              disabled={isSaving}
            />
          </div>

          {/* API Key */}
          {config?.apiKeyRequired !== false && (
            <div className="grid gap-2">
              <label htmlFor="api-key" className="text-sm font-medium">
                API 密钥
              </label>
              <Input
                id="api-key"
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                disabled={isSaving}
              />
              <p className="text-xs text-muted-foreground">
                您的 API 密钥将仅存储在本地，不会上传到任何服务器
              </p>
            </div>
          )}

          {config?.apiKeyRequired === false && (
            <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm">
              <p className="flex items-center gap-2">
                <Cpu className="h-4 w-4" />
                {config.name} 不需要 API 密钥，确保本地服务正在运行即可
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            取消
          </Button>
          <Button
            onClick={handleSave}
            disabled={(!apiKey && config?.apiKeyRequired !== false) || isSaving}
          >
            {isSaving ? '保存中...' : '保存'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
