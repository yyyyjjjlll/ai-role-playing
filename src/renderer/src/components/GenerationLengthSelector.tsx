import React, { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { aiApi } from '@/services/aiApi'
import { useToast } from '@/hooks/use-toast'
import { AI_LENGTH_CONFIG, AIGenerationLength } from '../../../shared/aiTypes'

interface GenerationLengthSelectorProps {
  onChange?: (length: AIGenerationLength) => void
}

export function GenerationLengthSelector({ onChange }: GenerationLengthSelectorProps): React.JSX.Element {
  const [value, setValue] = useState<AIGenerationLength>('medium')
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Load current generation length on mount
  useEffect(() => {
    aiApi.getConfig().then((config) => {
      if (config.generationLength) {
        setValue(config.generationLength)
      }
      setIsLoading(false)
    })
  }, [])

  const handleValueChange = async (newValue: AIGenerationLength) => {
    setValue(newValue)
    try {
      await aiApi.setGenerationLength(newValue)
      toast({
        title: '长度已设置',
        description: `生成长度已更改为"${AI_LENGTH_CONFIG[newValue].label}"`,
        variant: 'success',
      })
      onChange?.(newValue)
    } catch (error) {
      toast({
        title: '设置失败',
        description: '无法保存生成长度设置',
        variant: 'destructive',
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">加载中...</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground whitespace-nowrap">生成长度:</span>
      <Select value={value} onValueChange={handleValueChange}>
        <SelectTrigger className="h-7 w-[70px] text-xs">
          <span className="text-xs">{AI_LENGTH_CONFIG[value].label}</span>
        </SelectTrigger>
        <SelectContent>
          {Object.entries(AI_LENGTH_CONFIG).map(([key, config]) => (
            <SelectItem key={key} value={key} className="text-sm">
              <div className="flex items-center justify-between gap-4">
                <span>{config.label}</span>
                <span className="text-xs text-muted-foreground">{config.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
