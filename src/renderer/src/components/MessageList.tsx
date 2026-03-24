import React, { useEffect, useRef } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAppStore } from '@/store/appStore'
import { ChatInput } from './ChatInput'
import { Loader2 } from 'lucide-react'

export function MessageList(): React.JSX.Element {
  const messages = useAppStore((state) => state.messages)
  const characters = useAppStore((state) => state.characters)
  const currentRoomId = useAppStore((state) => state.currentRoomId)
  const isLoading = useAppStore((state) => state.isLoading)
  const sendUserMessageWithAIResponse = useAppStore((state) => state.sendUserMessageWithAIResponse)
  const scrollRef = useRef<HTMLDivElement>(null)

  const getCharacterName = (characterId?: string) => {
    if (!characterId) return '旁白'
    const character = characters.find((c) => c.id === characterId)
    return character?.name || '未知'
  }

  const getCharacterPortrait = (characterId?: string) => {
    if (!characterId) return undefined
    const character = characters.find((c) => c.id === characterId)
    return character?.portraitUrl
  }

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const handleSendMessage = async (content: string) => {
    if (!currentRoomId) return
    await sendUserMessageWithAIResponse(currentRoomId, content)
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {messages.length > 0 ? (
            messages.map((message) => {
              const isUser = message.type === 'user'
              const isNarrator = message.type === 'narrator'
              const isAI = message.type === 'ai'
              const portraitUrl = getCharacterPortrait(message.characterId)

              return (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    isNarrator
                      ? 'items-center justify-center my-4'
                      : isUser
                      ? 'items-end'
                      : 'items-start'
                  }`}
                >
                  {/* Avatar for non-user messages */}
                  {!isUser && !isNarrator && (
                    <div className="flex-shrink-0">
                      {portraitUrl ? (
                        <img
                          src={portraitUrl}
                          alt={getCharacterName(message.characterId)}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {getCharacterName(message.characterId).charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Message content */}
                  <div className={`flex flex-col gap-1 ${isNarrator ? 'items-center' : ''}`}>
                    {!isUser && !isNarrator && (
                      <span className="text-xs font-medium text-muted-foreground">
                        {getCharacterName(message.characterId)}
                      </span>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        isUser
                          ? 'bg-primary text-primary-foreground'
                          : isNarrator
                          ? 'bg-muted italic text-center'
                          : isAI
                          ? 'bg-accent'
                          : 'bg-secondary'
                      }`}
                    >
                      {message.content}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  {/* Avatar for user messages */}
                  {isUser && (
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-foreground">
                          我
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Avatar for AI messages */}
                  {isAI && (
                    <div className="flex-shrink-0">
                      {portraitUrl ? (
                        <img
                          src={portraitUrl}
                          alt={getCharacterName(message.characterId)}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {getCharacterName(message.characterId).charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <p className="text-sm">暂无消息</p>
              <p className="text-xs mt-1">发送第一条消息开始对话</p>
            </div>
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">AI 正在思考中...</span>
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Chat Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={!currentRoomId || isLoading}
        placeholder={isLoading ? 'AI 正在思考中...' : '输入消息... (Enter 发送，Shift+Enter 换行)'}
      />
    </div>
  )
}
