import { useState } from 'react'
import { getYouTubeEmbedUrl } from '../../lib/productVisuals'

interface YouTubeLinkFieldProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

const YouTubeLinkField = ({ value, onChange, label = 'YouTube Video Link' }: YouTubeLinkFieldProps) => {
  const [draft, setDraft] = useState(value)
  const [error, setError] = useState<string | null>(null)

  const embedUrl = value ? getYouTubeEmbedUrl(value) : null

  function handleSave() {
    const url = draft.trim()
    if (!url) { onChange(''); setError(null); return }
    if (!getYouTubeEmbedUrl(url)) { setError('That doesn\'t look like a valid YouTube link.'); return }
    setError(null)
    onChange(url)
  }

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-[#E6F5F0]">{label}</label>
      <p className="text-xs text-[#638A85]">
        If set, this is shown on the product page instead of the uploaded video file above.
      </p>

      <div className="flex gap-2">
        <input
          type="url"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSave() } }}
          placeholder="https://www.youtube.com/watch?v=..."
          className="flex-1 rounded-xl border border-[#1A3D3D] bg-[#0A2424] px-3 py-2 text-sm text-[#E6F5F0] placeholder:text-[#3D6060] focus:outline-none focus:border-[#00C896]/50"
        />
        {value && (
          <button
            type="button"
            onClick={() => { setDraft(''); onChange(''); setError(null) }}
            className="px-3 text-xs text-[#638A85] hover:text-red-400 transition-colors"
          >
            Remove
          </button>
        )}
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      {embedUrl && (
        <iframe
          src={embedUrl}
          title="YouTube preview"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full rounded-xl border border-[#1A3D3D] bg-black aspect-video"
          style={{ maxHeight: '220px' }}
        />
      )}
    </div>
  )
}

export default YouTubeLinkField
