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

interface DeleteCharacterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  characterName: string
  onDelete: () => Promise<void>
  isDeleting?: boolean
}

export function DeleteCharacterDialog({
  open,
  onOpenChange,
  characterName,
  onDelete,
  isDeleting: parentIsDeleting,
}: DeleteCharacterDialogProps): React.JSX.Element {
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
      console.error('Failed to delete character:', error)
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
            确认删除角色
          </DialogTitle>
          <DialogDescription>
            此操作无法撤销。这将永久删除角色「<span className="font-semibold text-foreground">{characterName}</span>」。
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="rounded-md bg-destructive/10 p-4 text-sm">
            <p className="font-medium text-destructive">删除后将丢失以下内容：</p>
            <ul className="mt-2 list-disc list-inside space-y-1 text-destructive/80">
              <li>角色信息（名称、设定）</li>
              <li>角色立绘</li>
              <li>该角色相关的所有消息记录</li>
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
