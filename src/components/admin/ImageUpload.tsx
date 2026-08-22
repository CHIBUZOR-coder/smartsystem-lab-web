import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../../lib/api'

type Folder = 'products' | 'team' | 'insights'

interface ImageUploadProps {
  folder: Folder
  value: string        // current imageUrl from form state
  onChange: (url: string) => void
  label?: string
}

const ImageUpload = ({ folder, value, onChange, label = 'Image' }: ImageUploadProps) => {
  const inputRef   = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const [preview, setPreview]     = useState<string | null>(null)

  const displayImage = preview || value || null

  async function handleFile(file: File) {
    setError(null)
    setPreview(URL.createObjectURL(file))

    const body = new FormData()
    body.append('image', file)

    try {
      setUploading(true)
      const { data } = await api.post<{ url: string }>(`/api/upload?folder=${folder}`, body, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      onChange(data.url)
      setPreview(null) // use the real Cloudinary URL from now on
    } catch {
      setError('Upload failed. Check your Cloudinary credentials and try again.')
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  function handleClear() {
    onChange('')
    setPreview(null)
    setError(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-[#E6F5F0]">{label}</label>

      {/* Drop zone / preview */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => !uploading && inputRef.current?.click()}
        className={[
          'relative w-full rounded-xl border-2 border-dashed transition-colors cursor-pointer overflow-hidden',
          uploading ? 'border-[#00C896]/60 bg-[#00C896]/5' : 'border-[#1A3D3D] hover:border-[#00C896]/50 bg-[#0A2424]',
          displayImage ? 'h-48' : 'h-36',
        ].join(' ')}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="hidden"
          onChange={handleInputChange}
        />

        <AnimatePresence mode="wait">
          {displayImage ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <img
                src={displayImage}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center">
                <span className="opacity-0 hover:opacity-100 text-xs text-white font-medium transition-opacity">
                  Click to replace
                </span>
              </div>
              {uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Spinner />
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 select-none"
            >
              {uploading ? (
                <>
                  <Spinner />
                  <span className="text-xs text-[#00C896]">Uploading…</span>
                </>
              ) : (
                <>
                  <UploadIcon />
                  <span className="text-sm text-[#638A85]">
                    Drop image here or <span className="text-[#00C896]">browse</span>
                  </span>
                  <span className="text-xs text-[#3D6060]">JPEG · PNG · WebP · AVIF · max 5 MB</span>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}

      {/* Clear button */}
      {displayImage && !uploading && (
        <button
          type="button"
          onClick={handleClear}
          className="text-xs text-[#638A85] hover:text-red-400 transition-colors"
        >
          Remove image
        </button>
      )}
    </div>
  )
}

const UploadIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-[#3D6060]" aria-hidden="true">
    <path d="M4.67 18.67v2.66A2.67 2.67 0 007.33 24h13.34a2.67 2.67 0 002.66-2.67v-2.66" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18.67 9.33L14 4.67 9.33 9.33" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 4.67V18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
)

const Spinner = () => (
  <svg className="animate-spin h-6 w-6 text-[#00C896]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
  </svg>
)

export default ImageUpload
