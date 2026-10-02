import { useRef, useState } from 'react'
import api from '../../lib/api'

interface MultiImageUploadProps {
  value: string[]
  onChange: (urls: string[]) => void
  label?: string
}

const MultiImageUpload = ({ value, onChange, label = 'Photos' }: MultiImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError]         = useState<string | null>(null)

  async function handleFiles(files: FileList) {
    setError(null)
    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        const body = new FormData()
        body.append('image', file)
        const { data } = await api.post<{ url: string }>('/api/upload?folder=cars', body, {
          headers: { 'Content-Type': undefined },
        })
        onChange([...value, data.url])
      }
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.length) handleFiles(e.target.files)
  }

  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#E6F5F0]">{label}</label>

      {value.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {value.map((url, i) => (
            <div key={url} className="relative aspect-square rounded-lg overflow-hidden border border-[#1A3D3D] bg-[#0A2424]">
              <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeAt(i)}
                title="Remove this photo"
                className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/60 text-white text-xs leading-none flex items-center justify-center hover:bg-red-500 transition-colors"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={handleInputChange}
      />
      <button
        type="button"
        onClick={() => !uploading && inputRef.current?.click()}
        disabled={uploading}
        className="w-full px-3 py-2.5 rounded-lg border-2 border-dashed border-[#1A3D3D] hover:border-[#00C896]/50 text-sm text-[#638A85] hover:text-[#00C896] transition-colors disabled:opacity-60"
      >
        {uploading ? 'Uploading…' : '+ Add photo(s)'}
      </button>

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

export default MultiImageUpload
