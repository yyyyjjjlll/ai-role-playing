import { ipcMain } from 'electron'
import { assetService } from '../services/AssetService'
import { AssetChannels } from './channels'

/**
 * Register all asset-related IPC handlers
 */
export function registerAssetHandlers(): void {
  ipcMain.handle(
    AssetChannels.UPLOAD_IMAGE,
    async (_, base64Data: string, subDir: 'portraits' | 'backgrounds' = 'portraits'): Promise<string> => {
      try {
        const relativePath = assetService.saveImageFromBase64(base64Data, subDir)
        return relativePath
      } catch (error) {
        console.error('[AssetService] Failed to upload image:', error)
        throw error
      }
    }
  )

  ipcMain.handle(
    AssetChannels.GET_ASSET_PATH,
    async (_, relativePath: string): Promise<string> => {
      return assetService.getAssetPath(relativePath)
    }
  )

  console.log('[IPC] Asset handlers registered')
}
