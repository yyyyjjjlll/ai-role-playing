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
import { Input } from '@/components/ui/input'

interface NewRoomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (name: string, worldSetting?: string) => Promise<void>
}

export function NewRoomDialog({
  open,
  onOpenChange,
  onCreate,
}: NewRoomDialogProps): React.JSX.Element {
  const [roomName, setRoomName] = useState('')
  const [worldSetting, setWorldSetting] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const handleCreate = async () => {
    if (!roomName.trim()) return

    setIsCreating(true)
    try {
      await onCreate(roomName.trim(), worldSetting.trim() || undefined)
      // Reset form
      setRoomName('')
      setWorldSetting('')
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to create room:', error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>创建新聊天室</DialogTitle>
          <DialogDescription>
            创建一个新的聊天室开始你的角色扮演故事
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="room-name" className="text-sm font-medium">
              聊天室名称 <span className="text-destructive">*</span>
            </label>
            <Input
              id="room-name"
              placeholder="例如：幻想世界冒险"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              disabled={isCreating}
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="world-setting" className="text-sm font-medium">
              世界设定（可选）
            </label>
            <textarea
              id="world-setting"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="描述这个世界的世界观、背景设定等..."
              value={worldSetting}
              onChange={(e) => setWorldSetting(e.target.value)}
              disabled={isCreating}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isCreating}
          >
            取消
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!roomName.trim() || isCreating}
          >
            {isCreating ? '创建中...' : '创建'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
