import React, { useEffect, useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Plus, MoreVertical, Edit, Trash2, Home } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { useToast } from '@/hooks/use-toast'
import { EditRoomDialog } from '@/components/Dialog/EditRoomDialog'
import { DeleteRoomDialog } from '@/components/Dialog/DeleteRoomDialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface RoomSidebarProps {
  onCreateRoom: () => void
}

export function RoomSidebar({ onCreateRoom }: RoomSidebarProps): React.JSX.Element {
  const rooms = useAppStore((state) => state.rooms)
  const currentRoomId = useAppStore((state) => state.currentRoomId)
  const loadRooms = useAppStore((state) => state.loadRooms)
  const loadRoom = useAppStore((state) => state.loadRoom)
  const updateRoomAsync = useAppStore((state) => state.updateRoomAsync)
  const deleteRoomAsync = useAppStore((state) => state.deleteRoomAsync)
  const { toast } = useToast()

  const [editingRoom, setEditingRoom] = useState<{ id: string; name: string } | null>(null)
  const [deletingRoom, setDeletingRoom] = useState<{ id: string; name: string } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Load rooms on mount
  useEffect(() => {
    loadRooms()
  }, [])

  const handleRoomClick = async (roomId: string) => {
    await loadRoom(roomId)
  }

  const handleEditRoom = async (roomId: string, updates: Partial<{ name: string; worldSetting: string }>) => {
    setIsSaving(true)
    try {
      await updateRoomAsync(roomId, updates)
      toast({
        title: '保存成功',
        description: '聊天室信息已更新',
        variant: 'success',
      })
      setEditingRoom(null)
    } catch (error) {
      toast({
        title: '保存失败',
        description: '无法更新聊天室信息',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteRoom = async () => {
    if (!deletingRoom) return
    setIsDeleting(true)
    try {
      await deleteRoomAsync(deletingRoom.id)
      toast({
        title: '删除成功',
        description: `聊天室"${deletingRoom.name}"已删除`,
        variant: 'success',
      })
      setDeletingRoom(null)
    } catch (error) {
      toast({
        title: '删除失败',
        description: '无法删除聊天室',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex h-full w-64 min-w-64 flex-col border-r bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="text-base font-semibold text-foreground truncate">聊天室</h2>
        <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0" onClick={onCreateRoom}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Room List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <div
                key={room.id}
                className={`group relative flex items-center gap-2 rounded-md px-2 py-2 cursor-pointer transition-all ${
                  currentRoomId === room.id
                    ? 'bg-primary/10 text-primary hover:bg-primary/15'
                    : 'hover:bg-accent text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => handleRoomClick(room.id)}
              >
                {/* Room Icon */}
                <div className={`flex-shrink-0 h-8 w-8 rounded-md flex items-center justify-center ${
                  currentRoomId === room.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  <Home className="h-4 w-4" />
                </div>

                {/* Room Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="font-medium text-sm truncate w-full">{room.name}</div>
                  <div className="text-xs text-muted-foreground truncate w-full opacity-70">
                    {room.worldSetting || '暂无设定'}
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
                    <DropdownMenuItem onClick={() => setEditingRoom({ id: room.id, name: room.name })}>
                      <Edit className="h-4 w-4 mr-2" />
                      编辑
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDeletingRoom({ id: room.id, name: room.name })}
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
              <Home className="h-10 w-10 mb-3 opacity-20" />
              <p className="text-sm font-medium">暂无聊天室</p>
              <p className="text-xs mt-1 opacity-70">点击上方 + 创建</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Dialogs */}
      <EditRoomDialog
        open={!!editingRoom}
        onOpenChange={(open) => !open && setEditingRoom(null)}
        room={editingRoom ? rooms.find(r => r.id === editingRoom.id) || null : null}
        onSave={handleEditRoom}
        isSaving={isSaving}
      />

      <DeleteRoomDialog
        open={!!deletingRoom}
        onOpenChange={(open) => !open && setDeletingRoom(null)}
        roomName={deletingRoom?.name || ''}
        onDelete={handleDeleteRoom}
        isDeleting={isDeleting}
      />
    </div>
  )
}
