import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

interface DeleteRoomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  roomName: string
  onDelete: () => Promise<void>
  isDeleting?: boolean
}

export function DeleteRoomDialog({
  open,
  onOpenChange,
  roomName,
  onDelete,
  isDeleting: parentIsDeleting,
}: DeleteRoomDialogProps): React.JSX.Element {
  const [isDeleting, setIsDeleting] = React.useState(false)

  const effectiveIsDeleting = parentIsDeleting !== undefined ? parentIsDeleting : isDeleting

  const handleDelete = async () => {
    if (parentIsDeleting === undefined) {
      setIsDeleting(true)
    }
    try {
      await onDelete()
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to delete room:', error)
    } finally {
      if (parentIsDeleting === undefined) {
        setIsDeleting(false)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            确认删除聊天室
          </DialogTitle>
          <DialogDescription>
            此操作无法撤销。这将永久删除聊天室「<span className="font-semibold text-foreground">{roomName}</span>」及其所有相关数据。
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="rounded-md bg-destructive/10 p-4 text-sm">
            <p className="font-medium text-destructive">删除后将丢失以下内容：</p>
            <ul className="mt-2 list-disc list-inside space-y-1 text-destructive/80">
              <li>所有角色信息</li>
              <li>所有聊天记录</li>
              <li>世界设定</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={effectiveIsDeleting}
          >
            取消
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={effectiveIsDeleting}
          >
            {effectiveIsDeleting ? '删除中...' : '删除'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
