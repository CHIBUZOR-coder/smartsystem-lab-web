import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../../lib/api'
import { getYouTubeEmbedUrl } from '../../lib/productVisuals'

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
  const [mode, setMode]           = useState<'upload' | 'link'>('upload')
  const [linkDraft, setLinkDraft] = useState('')

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
    setLinkDraft('')
    setError(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  function handleLinkSubmit() {
    const url = linkDraft.trim()
    if (!url) return
    setError(null)
    onChange(url)
  }

  const youTubeEmbedUrl = value ? getYouTubeEmbedUrl(value) : null

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-[#E6F5F0]">{label}</label>

      {!value && (
        <div className="flex gap-1 p-1 rounded-lg bg-[#0A2424] border border-[#1A3D3D] w-fit">
          {(['upload', 'link'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={[
                'px-3 py-1 text-xs rounded-md transition-colors',
                mode === m
                  ? 'bg-[#00C896]/15 text-[#00C896]'
                  : 'text-[#638A85] hover:text-[#E6F5F0]',
              ].join(' ')}
            >
              {m === 'upload' ? 'Upload file' : 'Paste link'}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {value ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            {youTubeEmbedUrl ? (
              <iframe
                src={youTubeEmbedUrl}
                title="Video preview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full rounded-xl border border-[#1A3D3D] bg-black aspect-video"
                style={{ maxHeight: '220px' }}
              />
            ) : (
              <video
                src={value}
                controls
                className="w-full rounded-xl border border-[#1A3D3D] bg-black"
                style={{ maxHeight: '220px' }}
              />
            )}
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
        ) : mode === 'link' ? (
          <motion.div
            key="link"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex gap-2"
          >
            <input
              type="url"
              value={linkDraft}
              onChange={(e) => setLinkDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleLinkSubmit() } }}
              placeholder="https://www.youtube.com/watch?v=..."
              className="flex-1 rounded-xl border border-[#1A3D3D] bg-[#0A2424] px-3 py-2 text-sm text-[#E6F5F0] placeholder:text-[#3D6060] focus:outline-none focus:border-[#00C896]/50"
            />
            <button
              type="button"
              onClick={handleLinkSubmit}
              className="px-4 rounded-xl bg-[#00C896]/15 text-[#00C896] text-sm hover:bg-[#00C896]/25 transition-colors"
            >
              Add
            </button>
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
