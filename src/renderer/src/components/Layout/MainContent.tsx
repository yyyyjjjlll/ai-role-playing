import React, { useState } from 'react'
import { useAppStore } from '../../store/appStore'
import { CharacterList } from '../CharacterList'
import { MessageList } from '../MessageList'
import { NewCharacterDialog } from '../Dialog/NewCharacterDialog'

export function MainContent(): React.JSX.Element {
  const currentRoomId = useAppStore((state) => state.currentRoomId)
  const rooms = useAppStore((state) => state.rooms)
  const [isCharacterDialogOpen, setIsCharacterDialogOpen] = useState(false)
  const createCharacterAsync = useAppStore((state) => state.createCharacterAsync)

  if (!currentRoomId) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-background">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="text-4xl font-bold">NPC Chat</h1>
          <p className="text-muted-foreground">
            AI 驱动的角色扮演与剧情生成工具
          </p>
          <div className="flex flex-col gap-2 mt-6 text-sm text-muted-foreground">
            <p>选择一个聊天室开始</p>
            <p>或者创建一个新的聊天室</p>
          </div>
        </div>
      </div>
    )
  }

  const currentRoom = rooms.find((r) => r.id === currentRoomId)

  const handleCreateCharacter = async (
    name: string,
    description: string,
    portraitUrl?: string
  ) => {
    try {
      // If there's a portrait file, we need to upload it first
      // For now, we'll use the object URL directly
      // In a real implementation, you'd convert the file to base64 and upload
      await createCharacterAsync(currentRoomId, name, description, portraitUrl)
    } catch (error) {
      console.error('Failed to create character:', error)
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Room Header */}
      <div className="flex items-center justify-between border-b p-4 bg-card">
        <div>
          <h1 className="text-xl font-semibold">{currentRoom?.name}</h1>
          {currentRoom?.worldSetting && (
            <p className="text-sm text-muted-foreground mt-1">
              {currentRoom.worldSetting}
            </p>
          )}
        </div>
      </div>

      {/* Room Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Characters Panel */}
        <CharacterList onAddCharacter={() => setIsCharacterDialogOpen(true)} />

        {/* Messages Area */}
        <MessageList />
      </div>

      {/* Character Dialog */}
      <NewCharacterDialog
        open={isCharacterDialogOpen}
        onOpenChange={setIsCharacterDialogOpen}
        onCreate={handleCreateCharacter}
      />
    </div>
  )
}
