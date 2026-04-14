import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

interface StorySuggestionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  suggestions: string[]
  onSelect: (suggestion: string) => void
  isLoading?: boolean
}

export function StorySuggestionsDialog({
  open,
  onOpenChange,
  suggestions,
  onSelect,
  isLoading = false,
}: StorySuggestionsDialogProps): React.JSX.Element {
  const handleSelect = (suggestion: string) => {
    onSelect(suggestion)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            选择剧情走向
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="flex gap-2 mb-4">
                <div className="h-3 w-3 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.3s]" />
                <div className="h-3 w-3 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.15s]" />
                <div className="h-3 w-3 rounded-full bg-primary/60 animate-bounce" />
              </div>
              <p className="text-sm text-muted-foreground">AI 正在思考剧情走向...</p>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground mb-4">
                请选择一个剧情发展方向，AI 将根据您的选择继续故事：
              </p>
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full text-left justify-start h-auto py-3 px-4 whitespace-normal"
                  onClick={() => handleSelect(suggestion)}
                >
                  <span className="text-primary font-medium mr-2 flex-shrink-0">
                    {index + 1}.
                  </span>
                  <span className="text-foreground">{suggestion}</span>
                </Button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                暂无建议，请稍后再试
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
