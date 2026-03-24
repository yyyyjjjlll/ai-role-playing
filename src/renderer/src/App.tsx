import React, { useState, useEffect } from 'react'
import { AppLayout } from './components/Layout/AppLayout'
import { RoomSidebar } from './components/Sidebar/RoomSidebar'
import { MainContent } from './components/Layout/MainContent'
import { NewRoomDialog } from './components/Dialog/NewRoomDialog'
import { ApiKeyDialog } from './components/Dialog/ApiKeyDialog'
import { Button } from './components/ui/button'
import { useAppStore } from './store/appStore'
import { aiApi } from './services/aiApi'
import { Key } from 'lucide-react'

function App(): React.JSX.Element {
  const [isNewRoomDialogOpen, setIsNewRoomDialogOpen] = useState(false)
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false)
  const [isAiConfigured, setIsAiConfigured] = useState(false)
  const createRoomAsync = useAppStore((state) => state.createRoomAsync)

  const handleCreateRoom = async (name: string, worldSetting?: string) => {
    await createRoomAsync(name, worldSetting)
  }

  const handleSetApiKey = async (apiKey: string): Promise<boolean> => {
    const success = await aiApi.setApiKey(apiKey)
    if (success) {
      setIsAiConfigured(true)
    }
    return success
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
    </AppLayout>
  )
}

export default App
