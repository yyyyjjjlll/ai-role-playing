import React, { useState, useEffect, useRef } from 'react'
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
import { Character } from '@/types'

interface EditCharacterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  character: Character | null
  onSave: (characterId: string, updates: Partial<Character>) => Promise<void>
  isSaving?: boolean
}

export function EditCharacterDialog({
  open,
  onOpenChange,
  character,
  onSave,
  isSaving: parentIsSaving,
}: EditCharacterDialogProps): React.JSX.Element {
  const [characterName, setCharacterName] = useState('')
  const [description, setDescription] = useState('')
  const [portraitUrl, setPortraitUrl] = useState<string | undefined>()
  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const effectiveIsSaving = parentIsSaving !== undefined ? parentIsSaving : isSaving

  // Reset form when character changes
  useEffect(() => {
    if (character) {
      setCharacterName(character.name)
      setDescription(character.description)
      setPortraitUrl(character.portraitUrl)
    }
  }, [character])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('请选择图像文件')
        return
      }
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

  const handleSave = async () => {
    if (!character || !characterName.trim()) return

    if (parentIsSaving === undefined) {
      setIsSaving(true)
    }
    try {
      await onSave(character.id, {
        name: characterName.trim(),
        description: description.trim(),
        portraitUrl,
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to update character:', error)
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
          <DialogTitle>编辑角色</DialogTitle>
          <DialogDescription>
            修改角色的信息和设定
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
                    disabled={effectiveIsSaving}
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
                disabled={effectiveIsSaving}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              点击上传角色立绘（PNG, JPG, WebP）
            </p>
          </div>

          {/* Character Name */}
          <div className="grid gap-2">
            <label htmlFor="edit-character-name" className="text-sm font-medium">
              角色名称 <span className="text-destructive">*</span>
            </label>
            <Input
              id="edit-character-name"
              placeholder="例如：艾伦"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              disabled={effectiveIsSaving}
            />
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <label htmlFor="edit-description" className="text-sm font-medium">
              角色设定 <span className="text-destructive">*</span>
            </label>
            <textarea
              id="edit-description"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="描述角色的性格、外貌、背景等..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
            disabled={!characterName.trim() || effectiveIsSaving}
          >
            {effectiveIsSaving ? '保存中...' : '保存'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
