import React, { useState, useRef } from 'react'
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
import { Upload, X } from 'lucide-react'

interface NewCharacterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (name: string, description: string, portraitUrl?: string) => Promise<void>
}

export function NewCharacterDialog({
  open,
  onOpenChange,
  onCreate,
}: NewCharacterDialogProps): React.JSX.Element {
  const [characterName, setCharacterName] = useState('')
  const [description, setDescription] = useState('')
  const [portraitUrl, setPortraitUrl] = useState<string | undefined>()
  const [isCreating, setIsCreating] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('请选择图像文件')
        return
      }
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert('文件大小不能超过 10MB')
        return
      }
      setPortraitUrl(URL.createObjectURL(file))
    }
  }

  const handleClearImage = () => {
    setPortraitUrl(undefined)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleCreate = async () => {
    if (!characterName.trim()) return

    setIsCreating(true)
    try {
      let finalPortraitUrl = portraitUrl

      // If there's a file, it will be handled by the parent component
      // through a custom event or callback
      await onCreate(characterName.trim(), description.trim(), finalPortraitUrl)

      // Reset form
      setCharacterName('')
      setDescription('')
      handleClearImage()
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to create character:', error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>添加新角色</DialogTitle>
          <DialogDescription>
            创建一个新的角色加入聊天室
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Portrait Upload */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              {portraitUrl ? (
                <div className="relative">
                  <img
                    src={portraitUrl}
                    alt="Portrait preview"
                    className="h-24 w-24 rounded-full object-cover"
                  />
                  <button
                    onClick={handleClearImage}
                    className="absolute -top-1 -right-1 p-1 bg-destructive text-destructive-foreground rounded-full hover:opacity-90"
                    type="button"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="h-24 w-24 rounded-full bg-muted flex items-center justify-center cursor-pointer hover:bg-accent transition-colors"
                >
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isCreating}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              点击上传角色立绘（PNG, JPG, WebP）
            </p>
          </div>

          {/* Character Name */}
          <div className="grid gap-2">
            <label htmlFor="character-name" className="text-sm font-medium">
              角色名称 <span className="text-destructive">*</span>
            </label>
            <Input
              id="character-name"
              placeholder="例如：艾伦"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              disabled={isCreating}
            />
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">
              角色设定 <span className="text-destructive">*</span>
            </label>
            <textarea
              id="description"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="描述角色的性格、外貌、背景等..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
            disabled={!characterName.trim() || isCreating}
          >
            {isCreating ? '创建中...' : '创建'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
