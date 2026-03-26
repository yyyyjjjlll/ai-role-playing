import React, { useState } from 'react'
import { useAppStore } from '../../store/appStore'
import { useToast } from '@/hooks/use-toast'
import { CharacterList } from '../CharacterList'
import { MessageList } from '../MessageList'
import { IdentitySelector } from '../IdentitySelector'
import { NewCharacterDialog } from '../Dialog/NewCharacterDialog'

export function MainContent(): React.JSX.Element {
  const currentRoomId = useAppStore((state) => state.currentRoomId)
  const rooms = useAppStore((state) => state.rooms)
  const [isCharacterDialogOpen, setIsCharacterDialogOpen] = useState(false)
  const { toast } = useToast()
  const createCharacterAsync = useAppStore((state) => state.createCharacterAsync)

  if (!currentRoomId) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-background p-8">
        <div className="text-center space-y-6 max-w-md">
          <div className="rounded-full bg-muted p-6 mb-4 inline-block">
            <svg
              className="h-16 w-16 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold">欢迎来到 NPC Chat</h1>
          <p className="text-muted-foreground">
            AI 驱动的角色扮演与剧情生成工具
          </p>
          <div className="space-y-4 mt-6">
            <div className="flex items-start gap-3 text-left p-4 rounded-lg bg-muted/50">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">1</div>
              <div>
                <p className="font-medium text-sm">创建聊天室</p>
                <p className="text-xs text-muted-foreground">点击左侧边栏的 + 按钮创建新的聊天室</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-left p-4 rounded-lg bg-muted/50">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">2</div>
              <div>
                <p className="font-medium text-sm">添加角色</p>
                <p className="text-xs text-muted-foreground">为你的聊天室添加 AI 角色并设定性格</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-left p-4 rounded-lg bg-muted/50">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">3</div>
              <div>
                <p className="font-medium text-sm">开始对话</p>
                <p className="text-xs text-muted-foreground">选择身份开始与角色互动或引导剧情发展</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            💡 提示：请确保在右下角设置 AI 服务配置
          </p>
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
      await createCharacterAsync(currentRoomId, name, description, portraitUrl)
      toast({
        title: '创建成功',
        description: `角色"${name}"已添加`,
        variant: 'success',
      })
      setIsCharacterDialogOpen(false)
    } catch (error) {
      toast({
        title: '创建失败',
        description: '无法创建角色，请重试',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Room Header */}
      <div className="flex items-center justify-between border-b px-4 py-3 bg-background">
        <div className="min-w-0">
          <h1 className="text-lg font-semibold truncate">{currentRoom?.name}</h1>
          {/* {currentRoom?.worldSetting && (
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {currentRoom.worldSetting}
            </p>
          )} */}
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {currentRoom?.worldSetting || '暂无设定'}
          </p>
        </div>
      </div>

      {/* Room Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Characters & Identity */}
        <div className="w-64 border-r bg-background flex flex-col min-h-0">
          <CharacterList onAddCharacter={() => setIsCharacterDialogOpen(true)} />

          {/* Identity Selector */}
          <IdentitySelector roomId={currentRoomId} />
        </div>

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
