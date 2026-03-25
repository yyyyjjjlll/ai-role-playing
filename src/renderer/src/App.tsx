import React, { useState, useEffect } from 'react'
import { AppLayout } from './components/Layout/AppLayout'
import { RoomSidebar } from './components/Sidebar/RoomSidebar'
import { MainContent } from './components/Layout/MainContent'
import { NewRoomDialog } from './components/Dialog/NewRoomDialog'
import { ApiKeyDialog } from './components/Dialog/ApiKeyDialog'
import { Toaster } from '@/components/ui/toaster'
import { Button } from '@/components/ui/button'
import { useAppStore } from './store/appStore'
import { aiApi } from './services/aiApi'
import { useToast } from '@/hooks/use-toast'
import { Key } from 'lucide-react'

function App(): React.JSX.Element {
  const [isNewRoomDialogOpen, setIsNewRoomDialogOpen] = useState(false)
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false)
  const [isAiConfigured, setIsAiConfigured] = useState(false)
  const { toast } = useToast()
  const createRoomAsync = useAppStore((state) => state.createRoomAsync)

  const handleCreateRoom = async (name: string, worldSetting?: string) => {
    try {
      await createRoomAsync(name, worldSetting)
      toast({
        title: '创建成功',
        description: `聊天室"${name}"已创建`,
        variant: 'success',
      })
    } catch (error) {
      toast({
        title: '创建失败',
        description: '无法创建聊天室，请重试',
        variant: 'destructive',
      })
    }
  }

  const handleSetApiKey = async (apiKey: string): Promise<boolean> => {
    try {
      const success = await aiApi.setApiKey(apiKey)
      if (success) {
        setIsAiConfigured(true)
        toast({
          title: 'API 密钥已保存',
          description: 'AI 服务已配置成功',
          variant: 'success',
        })
      }
      return success
    } catch (error) {
      toast({
        title: '配置失败',
        description: '无法保存 API 密钥，请重试',
        variant: 'destructive',
      })
      return false
    }
  }

  // Check AI configuration on mount
  useEffect(() => {
    aiApi.checkConfigured().then(setIsAiConfigured)
  }, [])

  return (
    <AppLayout>
      <RoomSidebar onCreateRoom={() => setIsNewRoomDialogOpen(true)} />
      <MainContent />
      <NewRoomDialog
        open={isNewRoomDialogOpen}
        onOpenChange={setIsNewRoomDialogOpen}
        onCreate={handleCreateRoom}
      />
      <ApiKeyDialog
        open={isApiKeyDialogOpen}
        onOpenChange={setIsApiKeyDialogOpen}
        onSetApiKey={handleSetApiKey}
      />

      {/* API Key Status Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant={isAiConfigured ? 'default' : 'destructive'}
          size="sm"
          onClick={() => setIsApiKeyDialogOpen(true)}
          className="gap-2 shadow-lg"
        >
          <Key className="h-4 w-4" />
          {isAiConfigured ? 'AI 已配置' : '设置 AI'}
        </Button>
      </div>

      {/* Toast notifications */}
      <Toaster />
    </AppLayout>
  )
}

export default App
