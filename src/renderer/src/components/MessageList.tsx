import React, { useEffect, useRef } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAppStore } from '@/store/appStore'
import { ChatInput } from './ChatInput'
import { Loader2, ArrowRight } from 'lucide-react'
import { GenerationLengthSelector } from './GenerationLengthSelector'
import { AIGenerationLength } from '../../shared/aiTypes'
import { Button } from '@/components/ui/button'

export function MessageList(): React.JSX.Element {
  const messages = useAppStore((state) => state.messages)
  const characters = useAppStore((state) => state.characters)
  const currentRoomId = useAppStore((state) => state.currentRoomId)
  const isLoading = useAppStore((state) => state.isLoading)
  const sendUserMessageWithAIResponse = useAppStore((state) => state.sendUserMessageWithAIResponse)
  const getUserIdentity = useAppStore((state) => state.getUserIdentity)
  const scrollRef = useRef<HTMLDivElement>(null)

  const userIdentity = currentRoomId ? getUserIdentity(currentRoomId) : undefined

  // Store current selected length
  const currentLengthRef = React.useRef<AIGenerationLength>('medium')

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
    await sendUserMessageWithAIResponse(currentRoomId, content, currentLengthRef.current)
  }

  const handleContinue = async () => {
    if (!currentRoomId) return
    // 发送一个特殊的提示，让 AI 继续剧情
    await sendUserMessageWithAIResponse(currentRoomId, '（继续）', currentLengthRef.current)
  }

  const handleLengthChange = (length: AIGenerationLength) => {
    currentLengthRef.current = length
  }

  const formatTime = (timestamp: number) => {
    // 兼容后端可能传的是秒时间戳：例如 1710000000
    const ts = timestamp < 1_000_000_000_000 ? timestamp * 1000 : timestamp

    const date = new Date(ts)
    const now = new Date()

    const pad2 = (n: number) => String(n).padStart(2, '0')
    const timeStr = `${pad2(date.getHours())}:${pad2(date.getMinutes())}`

    const diffMs = now.getTime() - date.getTime()
    if (diffMs < 0) return timeStr

    // 1分钟内：社交平台常用“刚刚”
    if (diffMs < 60 * 1000) return '刚刚'
    // 1小时内：xx分钟前
    if (diffMs < 60 * 60 * 1000) return `${Math.floor(diffMs / (60 * 1000))}分钟前`
    // 1天内：xx小时前
    if (diffMs < 24 * 60 * 60 * 1000) return `${Math.floor(diffMs / (60 * 60 * 1000))}小时前`

    // 跨天逻辑：今天/昨天/本周/更早
    const startOfToday = new Date(now)
    startOfToday.setHours(0, 0, 0, 0)

    const startOfThatDay = new Date(date)
    startOfThatDay.setHours(0, 0, 0, 0)

    const dayDiff = Math.round((startOfToday.getTime() - startOfThatDay.getTime()) / (24 * 60 * 60 * 1000))

    if (dayDiff === 1) return `昨天 ${timeStr}`

    const weekday = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    if (dayDiff > 1 && dayDiff < 7 && date.getFullYear() === now.getFullYear()) {
      return `${weekday[date.getDay()]} ${timeStr}`
    }

    // 更早：显示日期（尽量简洁但包含时间）
    const month = date.getMonth() + 1
    const day = date.getDate()
    const year = date.getFullYear()

    if (year === now.getFullYear()) return `${month}月${day}日 ${timeStr}`
    return `${year}年${month}月${day}日 ${timeStr}`
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header with length selector */}
      <div className="flex items-center justify-between border-b px-4 py-2 bg-background">
        <span className="text-xs font-medium text-muted-foreground">剧情生成</span>
        <GenerationLengthSelector onChange={handleLengthChange} />
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {messages.length > 0 ? (
            messages.map((message) => {
              const isUser = message.type === 'user'
              const isNarrator = message.type === 'narrator'
              const portraitUrl = getCharacterPortrait(message.characterId)
              const characterName = getCharacterName(message.characterId)

              // Narrator messages - centered and styled differently
              if (isNarrator) {
                return (
                  <div key={message.id} className="flex items-center justify-center my-6">
                    <div className="max-w-[90%] rounded-lg bg-muted/50 px-6 py-3 border border-muted">
                      <p className="text-sm italic text-muted-foreground text-center leading-relaxed">
                        {message.content}
                      </p>
                      <p className="text-xs text-muted-foreground/60 text-center mt-2">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                )
              }

              // User and AI messages
              return (
                <div
                  key={message.id}
                  className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {isUser ? (
                      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center ring-2 ring-primary/20">
                        <span className="text-sm font-medium text-primary-foreground">
                          {userIdentity?.type === 'actor' && message.characterId
                            ? characterName.charAt(0)
                            : '我'}
                        </span>
                      </div>
                    ) : portraitUrl ? (
                      <img
                        src={portraitUrl}
                        alt={characterName}
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-border"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center ring-2 ring-border">
                        <span className="text-sm font-medium text-accent-foreground">
                          {characterName.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Message content */}
                  <div className={`flex flex-col gap-1 max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
                    {/* Character name */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        {isUser && userIdentity?.type === 'actor' && message.characterId
                          ? characterName
                          : isUser
                          ? '我'
                          : characterName}
                      </span>
                      <span className="text-xs text-muted-foreground/60">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>

                    {/* Message bubble */}
                    <div
                      className={`rounded-2xl px-4 py-2.5 shadow-sm ${
                        isUser
                          ? 'bg-primary text-primary-foreground rounded-tr-sm'
                          : 'bg-card text-card-foreground border border-border rounded-tl-sm'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-muted p-6 mb-4">
                <svg
                  className="h-12 w-12 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">开始对话</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                发送第一条消息开始与角色互动，AI 将根据世界设定和角色性格生成回应
              </p>
            </div>
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-center gap-3 pl-3">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-muted-foreground">AI</span>
                <div className="rounded-2xl rounded-tl-sm px-4 py-2.5 bg-card border border-border">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Continue Button - Show when there are messages and not loading */}
      {messages.length > 0 && !isLoading && (
        <div className="border-t px-4 py-3 bg-background/95 backdrop-blur">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleContinue}
            disabled={!currentRoomId}
          >
            <ArrowRight className="h-4 w-4 mr-2" />
            继续剧情
          </Button>
        </div>
      )}

      {/* Chat Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={!currentRoomId || isLoading}
        placeholder={
          isLoading
            ? 'AI 正在思考中...'
            : userIdentity?.type === 'actor'
            ? `作为 ${characters.find(c => c.id === userIdentity.characterId)?.name || '角色'} 发言...`
            : '输入消息... (Enter 发送，Shift+Enter 换行)'
        }
      />
    </div>
  )
}
