import React from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useAppStore } from '@/store/appStore'

interface CharacterListProps {
  onAddCharacter?: () => void
}

export function CharacterList({ onAddCharacter }: CharacterListProps): React.JSX.Element {
  const characters = useAppStore((state) => state.characters)
  const currentRoomId = useAppStore((state) => state.currentRoomId)

  if (!currentRoomId) {
    return <></>
  }

  return (
    <div className="w-64 border-r bg-card flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="text-sm font-semibold">角色</h2>
        <Button size="icon" variant="ghost" onClick={onAddCharacter}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Character List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {characters.length > 0 ? (
            characters.map((character) => (
              <div
                key={character.id}
                className="flex items-center gap-3 rounded-lg border p-2 hover:bg-accent cursor-pointer transition-colors"
              >
                {character.portraitUrl ? (
                  <img
                    src={character.portraitUrl}
                    alt={character.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-xs font-medium">
                      {character.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">
                    {character.name}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {character.description}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <p className="text-xs">暂无角色</p>
              <p className="text-xs mt-1">点击 + 添加角色</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
