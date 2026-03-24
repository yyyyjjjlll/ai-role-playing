import React, { useEffect } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useAppStore } from '@/store/appStore'

interface RoomSidebarProps {
  onCreateRoom: () => void
}

export function RoomSidebar({ onCreateRoom }: RoomSidebarProps): React.JSX.Element {
  const rooms = useAppStore((state) => state.rooms)
  const currentRoomId = useAppStore((state) => state.currentRoomId)
  const loadRooms = useAppStore((state) => state.loadRooms)
  const loadRoom = useAppStore((state) => state.loadRoom)

  // Load rooms on mount
  useEffect(() => {
    loadRooms()
  }, [])

  const handleRoomClick = async (roomId: string) => {
    await loadRoom(roomId)
  }

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="text-lg font-semibold">聊天室列表</h2>
        <Button size="icon" variant="ghost" onClick={onCreateRoom}>
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* Room List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <div
                key={room.id}
                onClick={() => handleRoomClick(room.id)}
                className={`flex flex-col gap-1 rounded-lg border p-3 hover:bg-accent cursor-pointer transition-colors ${
                  currentRoomId === room.id ? 'bg-accent border-primary' : ''
                }`}
              >
                <div className="font-medium text-sm">{room.name}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {room.worldSetting || '无世界设定'}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <p className="text-sm">暂无聊天室</p>
              <p className="text-xs mt-1">点击 + 创建新聊天室</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
