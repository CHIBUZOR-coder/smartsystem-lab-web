import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../../lib/api'

interface VideoUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

const VideoUpload = ({ value, onChange, label = 'Product Video' }: VideoUploadProps) => {
  const inputRef              = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress]   = useState(0)
  const [error, setError]         = useState<string | null>(null)

  async function handleFile(file: File) {
    setError(null)
    setProgress(0)

    const body = new FormData()
    body.append('video', file)

    try {
      setUploading(true)
      const { data } = await api.post<{ url: string }>(
        '/api/upload/video?folder=products',
        body,
        {
          headers: { 'Content-Type': undefined },
          onUploadProgress: (e) => {
            if (e.total) setProgress(Math.round((e.loaded / e.total) * 100))
          },
        }
      )
      onChange(data.url)
    } catch {
      setError('Upload failed. Check your Cloudinary credentials and try again.')
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  function handleClear() {
    onChange('')
    setError(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-[#E6F5F0]">{label}</label>

      <AnimatePresence mode="wait">
        {value ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            <video
              src={value}
              controls
              className="w-full rounded-xl border border-[#1A3D3D] bg-black"
              style={{ maxHeight: '220px' }}
            />
            {!uploading && (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-[#638A85] hover:text-red-400 transition-colors"
              >
                Remove video
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              onClick={() => !uploading && inputRef.current?.click()}
              className={[
                'relative w-full rounded-xl border-2 border-dashed transition-colors h-28',
                uploading
                  ? 'border-[#00C896]/60 bg-[#00C896]/5 cursor-default'
                  : 'border-[#1A3D3D] hover:border-[#00C896]/50 bg-[#0A2424] cursor-pointer',
              ].join(' ')}
            >
              <input
                ref={inputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                className="hidden"
                onChange={handleInputChange}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 select-none">
                {uploading ? (
                  <>
                    <VideoIcon />
                    <div className="w-40 h-1.5 bg-[#1A3D3D] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#00C896] rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-[#00C896]">Uploading… {progress}%</span>
                  </>
                ) : (
                  <>
                    <VideoIcon />
                    <span className="text-sm text-[#638A85]">
                      Click to upload a <span className="text-[#00C896]">product video</span>
                    </span>
                    <span className="text-xs text-[#3D6060]">MP4 · WebM · MOV · max 200 MB</span>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

const VideoIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-[#3D6060]" aria-hidden="true">
    <rect x="2" y="6" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
    <path d="M20 11L26 8V20L20 17V11Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
)

export default VideoUpload
