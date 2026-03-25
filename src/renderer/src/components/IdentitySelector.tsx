import React, { useState, useEffect, useMemo } from 'react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store/appStore'
import { UserIdentityType } from '@/types'
import { Users, Eye, Sparkles } from 'lucide-react'

interface IdentitySelectorProps {
  roomId: string
}

export function IdentitySelector({ roomId }: IdentitySelectorProps): React.JSX.Element {
  // Use separate selectors to avoid creating new arrays on every render
  const allCharacters = useAppStore((state) => state.characters)
  const getUserIdentity = useAppStore((state) => state.getUserIdentity)
  const saveUserIdentityAsync = useAppStore((state) => state.saveUserIdentityAsync)

  // Memoize the filtered characters
  const characters = useMemo(
    () => allCharacters.filter(c => c.roomId === roomId),
    [allCharacters, roomId]
  )

  const currentIdentity = getUserIdentity(roomId)

  const [identityType, setIdentityType] = useState<UserIdentityType>(
    currentIdentity?.type || 'observer'
  )
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | undefined>(
    currentIdentity?.characterId
  )
  const [isSaving, setIsSaving] = useState(false)

  // Update local state when identity changes
  useEffect(() => {
    if (currentIdentity) {
      setIdentityType(currentIdentity.type)
      setSelectedCharacterId(currentIdentity.characterId)
    }
  }, [currentIdentity])

  const handleSave = async () => {
    setIsSaving(true)
    await saveUserIdentityAsync(
      roomId,
      identityType,
      identityType === 'actor' ? selectedCharacterId : undefined
    )
    setIsSaving(false)
  }

  const hasCharacters = characters.length > 0

  return (
    <div className="border-t bg-background p-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">身份选择</h3>
      </div>

      <div className="space-y-3">
        <RadioGroup
          value={identityType}
          onValueChange={(value) => setIdentityType(value as UserIdentityType)}
          className="space-y-2"
        >
          {/* Observer option */}
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="observer" id="observer" className="mt-0.5" />
            <div className="flex-1">
              <Label
                htmlFor="observer"
                className="flex items-center gap-1.5 font-medium text-sm cursor-pointer"
              >
                <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                <span>旁观者</span>
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                观察剧情，引导故事，AI 控制所有角色
              </p>
            </div>
          </div>

          {/* Actor option */}
          <div className="flex items-start space-x-2">
            <RadioGroupItem
              value="actor"
              id="actor"
              disabled={!hasCharacters}
              className="mt-0.5"
            />
            <div className="flex-1">
              <Label
                htmlFor="actor"
                className={`flex items-center gap-1.5 font-medium text-sm ${
                  hasCharacters ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                }`}
              >
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                <span>演绎者</span>
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                扮演角色参与剧情，AI 控制其他角色
              </p>

              {!hasCharacters && (
                <p className="text-xs text-destructive mt-1">
                  需要先创建至少一个角色
                </p>
              )}
            </div>
          </div>
        </RadioGroup>

        {/* Character selection for actor mode */}
        {identityType === 'actor' && hasCharacters && (
          <div className="space-y-2 pl-6 pt-2">
            <Label htmlFor="character-select" className="text-xs">
              选择你要扮演的角色
            </Label>
            <Select
              value={selectedCharacterId}
              onValueChange={setSelectedCharacterId}
            >
              <SelectTrigger id="character-select" className="h-9">
                <SelectValue placeholder="选择一个角色" />
              </SelectTrigger>
              <SelectContent>
                {characters.map((character) => (
                  <SelectItem key={character.id} value={character.id}>
                    <div className="flex items-center gap-2">
                      {character.portraitUrl && (
                        <img
                          src={character.portraitUrl}
                          alt={character.name}
                          className="h-5 w-5 rounded-full object-cover"
                        />
                      )}
                      <span className="text-sm">{character.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={
              isSaving ||
              (identityType === 'actor' && !selectedCharacterId)
            }
            className="h-8 text-xs"
          >
            {isSaving ? '保存中...' : '保存身份'}
          </Button>
        </div>
      </div>
    </div>
  )
}
