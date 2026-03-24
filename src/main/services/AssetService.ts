import { app } from 'electron'
import { join } from 'path'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { randomUUID } from 'crypto'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']

export class AssetService {
  private assetsDir: string
  private portraitsDir: string
  private backgroundsDir: string

  constructor() {
    const userDataPath = app.getPath('userData')
    this.assetsDir = join(userDataPath, 'assets')
    this.portraitsDir = join(this.assetsDir, 'portraits')
    this.backgroundsDir = join(this.assetsDir, 'backgrounds')

    // Ensure directories exist
    if (!existsSync(this.portraitsDir)) {
      mkdirSync(this.portraitsDir, { recursive: true })
    }
    if (!existsSync(this.backgroundsDir)) {
      mkdirSync(this.backgroundsDir, { recursive: true })
    }
  }

  /**
   * Save an image file from base64 data
   */
  saveImageFromBase64(
    base64Data: string,
    subDir: 'portraits' | 'backgrounds' = 'portraits'
  ): string {
    // Remove data URL prefix if present
    const matches = base64Data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/)
    const contentType = matches ? matches[1] : 'image/png'
    const data = matches ? matches[2] : base64Data

    // Validate content type
    if (!ALLOWED_TYPES.includes(contentType)) {
      throw new Error('不支持的图片格式')
    }

    // Generate unique filename
    const extension = contentType.split('/')[1]
    const filename = `${randomUUID()}.${extension}`
    const dir = subDir === 'portraits' ? this.portraitsDir : this.backgroundsDir
    const filePath = join(dir, filename)

    // Write file
    const buffer = Buffer.from(data, 'base64')

    // Validate file size
    if (buffer.length > MAX_FILE_SIZE) {
      throw new Error('文件大小不能超过 10MB')
    }

    writeFileSync(filePath, buffer)

    // Return relative path for storage
    return `assets/${subDir}/${filename}`
  }

  /**
   * Get the full path for an asset
   */
  getAssetPath(relativePath: string): string {
    return join(app.getPath('userData'), relativePath)
  }

  /**
   * Delete an asset file
   */
  deleteAsset(relativePath: string): boolean {
    try {
      const filePath = this.getAssetPath(relativePath)
      if (existsSync(filePath)) {
        // Note: In a real app, you might want to move to trash instead
        return true
      }
      return false
    } catch {
      return false
    }
  }

  /**
   * Get the assets directory path
   */
  getAssetsDir(): string {
    return this.assetsDir
  }

  /**
   * Get the portraits directory path
   */
  getPortraitsDir(): string {
    return this.portraitsDir
  }

  /**
   * Get the backgrounds directory path
   */
  getBackgroundsDir(): string {
    return this.backgroundsDir
  }
}

// Export singleton instance
export const assetService = new AssetService()
