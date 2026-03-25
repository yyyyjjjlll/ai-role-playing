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
import { Room } from '@/types'

interface EditRoomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  room: Room | null
  onSave: (roomId: string, updates: Partial<Room>) => Promise<void>
  isSaving?: boolean
}

export function EditRoomDialog({
  open,
  onOpenChange,
  room,
  onSave,
  isSaving: parentIsSaving,
}: EditRoomDialogProps): React.JSX.Element {
  const [roomName, setRoomName] = useState('')
  const [worldSetting, setWorldSetting] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const effectiveIsSaving = parentIsSaving !== undefined ? parentIsSaving : isSaving

  // Reset form when room changes
  useEffect(() => {
    if (room) {
      setRoomName(room.name)
      setWorldSetting(room.worldSetting || '')
    }
  }, [room])

  const handleSave = async () => {
    if (!room || !roomName.trim()) return

    if (parentIsSaving === undefined) {
      setIsSaving(true)
    }
    try {
      await onSave(room.id, {
        name: roomName.trim(),
        worldSetting: worldSetting.trim() || undefined,
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to update room:', error)
    } finally {
      if (parentIsSaving === undefined) {
        setIsSaving(false)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>编辑聊天室</DialogTitle>
          <DialogDescription>
            修改聊天室的名称和设定
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="edit-room-name" className="text-sm font-medium">
              聊天室名称 <span className="text-destructive">*</span>
            </label>
            <Input
              id="edit-room-name"
              placeholder="例如：幻想世界冒险"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              disabled={effectiveIsSaving}
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="edit-world-setting" className="text-sm font-medium">
              世界设定（可选）
            </label>
            <textarea
              id="edit-world-setting"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="描述这个世界的世界观、背景设定等..."
              value={worldSetting}
              onChange={(e) => setWorldSetting(e.target.value)}
              disabled={effectiveIsSaving}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={effectiveIsSaving}
          >
            取消
          </Button>
          <Button
            onClick={handleSave}
            disabled={!roomName.trim() || effectiveIsSaving}
          >
            {effectiveIsSaving ? '保存中...' : '保存'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
