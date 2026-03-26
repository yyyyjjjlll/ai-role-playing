import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sparkles, Users, Globe } from 'lucide-react'
import { DEMO_TEMPLATES, DemoTemplate } from '../../../../shared/demoTemplates'

interface CreateDemoRoomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (template: DemoTemplate) => Promise<void>
  isCreating?: boolean
}

export function CreateDemoRoomDialog({
  open,
  onOpenChange,
  onCreate,
  isCreating = false,
}: CreateDemoRoomDialogProps): React.JSX.Element {
  const [selectedTemplate, setSelectedTemplate] = useState<DemoTemplate | null>(null)

  const handleCreate = async () => {
    if (selectedTemplate) {
      await onCreate(selectedTemplate)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            选择 Demo 模板
          </DialogTitle>
          <DialogDescription>
            选择一个预设模板快速创建房间和角色，开始你的冒险
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DEMO_TEMPLATES.map((template) => (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                className={`
                  cursor-pointer rounded-lg border-2 p-4 transition-all
                  ${
                    selectedTemplate?.id === template.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 hover:bg-accent'
                  }
                `}
              >
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  {template.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                  {template.worldSetting}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  <span>{template.characters.length} 个角色</span>
                </div>
                {selectedTemplate?.id === template.id && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs font-medium mb-2">角色列表：</p>
                    <ul className="space-y-1">
                      {template.characters.map((char, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground">
                          • {char.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isCreating}>
            取消
          </Button>
          <Button onClick={handleCreate} disabled={!selectedTemplate || isCreating}>
            {isCreating ? '创建中...' : '创建房间'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
