import React, { useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Plus, MoreVertical, Edit, Trash2, User } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { useToast } from '@/hooks/use-toast'
import { EditCharacterDialog } from '@/components/Dialog/EditCharacterDialog'
import { DeleteCharacterDialog } from '@/components/Dialog/DeleteCharacterDialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface CharacterListProps {
  onAddCharacter?: () => void
}

export function CharacterList({ onAddCharacter }: CharacterListProps): React.JSX.Element {
  const characters = useAppStore((state) => state.characters)
  const currentRoomId = useAppStore((state) => state.currentRoomId)
  const updateCharacterAsync = useAppStore((state) => state.updateCharacterAsync)
  const deleteCharacterAsync = useAppStore((state) => state.deleteCharacterAsync)
  const { toast } = useToast()

  const [editingCharacter, setEditingCharacter] = useState<{ id: string; name: string } | null>(null)
  const [deletingCharacter, setDeletingCharacter] = useState<{ id: string; name: string } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  if (!currentRoomId) {
    return <></>
  }

  const handleEditCharacter = async (characterId: string, updates: Partial<{ name: string; description: string; portraitUrl: string }>) => {
    setIsSaving(true)
    try {
      await updateCharacterAsync(characterId, updates)
      toast({
        title: '保存成功',
        description: '角色信息已更新',
        variant: 'success',
      })
      setEditingCharacter(null)
    } catch (error) {
      toast({
        title: '保存失败',
        description: '无法更新角色信息',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteCharacter = async () => {
    if (!deletingCharacter) return
    setIsDeleting(true)
    try {
      await deleteCharacterAsync(deletingCharacter.id)
      toast({
        title: '删除成功',
        description: `角色"${deletingCharacter.name}"已删除`,
        variant: 'success',
      })
      setDeletingCharacter(null)
    } catch (error) {
      toast({
        title: '删除失败',
        description: '无法删除角色',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="text-base font-semibold text-foreground truncate">角色</h2>
        <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0" onClick={onAddCharacter}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Character List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {characters.length > 0 ? (
            characters.map((character) => (
              <div
                key={character.id}
                className="group relative flex items-center gap-2 rounded-md px-2 py-2 hover:bg-accent cursor-pointer transition-all w-full"
              >
                {/* Character Avatar */}
                {character.portraitUrl ? (
                  <img
                    src={character.portraitUrl}
                    alt={character.name}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-border/50 flex-shrink-0"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-primary">
                      {character.name.charAt(0)}
                    </span>
                  </div>
                )}

                {/* Character Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="font-medium text-sm truncate text-foreground w-full">
                    {character.name}
                  </div>
                  <div className="text-xs text-muted-foreground truncate w-40">
                    {character.description || '暂无描述'}
                  </div>
                </div>

                {/* Menu Button */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem onClick={() => setEditingCharacter({ id: character.id, name: character.name })}>
                      <Edit className="h-4 w-4 mr-2" />
                      编辑
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDeletingCharacter({ id: character.id, name: character.name })}
                      className="text-destructive focus:text-destructive focus:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      删除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center text-muted-foreground">
              <User className="h-10 w-10 mb-3 opacity-20" />
              <p className="text-sm font-medium">暂无角色</p>
              <p className="text-xs mt-1 opacity-70">点击上方 + 添加</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Dialogs */}
      <EditCharacterDialog
        open={!!editingCharacter}
        onOpenChange={(open) => !open && setEditingCharacter(null)}
        character={editingCharacter ? characters.find(c => c.id === editingCharacter.id) || null : null}
        onSave={handleEditCharacter}
        isSaving={isSaving}
      />

      <DeleteCharacterDialog
        open={!!deletingCharacter}
        onOpenChange={(open) => !open && setDeletingCharacter(null)}
        characterName={deletingCharacter?.name || ''}
        onDelete={handleDeleteCharacter}
        isDeleting={isDeleting}
      />
    </div>
  )
}
