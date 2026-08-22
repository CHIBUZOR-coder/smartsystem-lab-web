interface SkeletonBoxProps {
  className?: string
  rounded?: 'sm' | 'md' | 'lg' | 'full'
}

const roundedMap = {
  sm:   'rounded',
  md:   'rounded-md',
  lg:   'rounded-xl',
  full: 'rounded-full',
}

const SkeletonBox = ({ className = '', rounded = 'md' }: SkeletonBoxProps) => (
  <div
    aria-hidden="true"
    className={`skeleton ${roundedMap[rounded]} ${className}`}
  />
)

export const SkeletonCard = () => (
  <div className="rounded-2xl border border-brand-border bg-brand-surface p-5 space-y-4">
    <SkeletonBox className="h-40 w-full" rounded="lg" />
    <SkeletonBox className="h-4 w-3/4" />
    <SkeletonBox className="h-3 w-full" />
    <SkeletonBox className="h-3 w-5/6" />
    <SkeletonBox className="h-9 w-28 mt-2" rounded="lg" />
  </div>
)

export const SkeletonText = ({ lines = 3 }: { lines?: number }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }, (_, i) => (
      <SkeletonBox
        key={i}
        className={`h-3 ${i === lines - 1 ? 'w-4/6' : 'w-full'}`}
      />
    ))}
  </div>
)

// Skeleton row for admin table — pass cols as array of width classes e.g. ['w-1/4','w-1/3','w-16','w-20']
export const AdminTableSkeleton = ({ cols, rows = 5 }: { cols: string[]; rows?: number }) => (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden" aria-hidden="true">
    {/* fake header */}
    <div className="bg-gray-50 px-5 py-3 flex gap-6 border-b border-gray-100">
      {cols.map((w, i) => <SkeletonBox key={i} className={`h-3 ${w}`} />)}
    </div>
    {/* fake rows */}
    <div className="divide-y divide-gray-100">
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} className="px-5 py-4 flex gap-6 items-center">
          {cols.map((w, i) => (
            <SkeletonBox key={i} className={`h-3.5 ${w} ${i === 0 ? 'opacity-80' : 'opacity-50'}`} />
          ))}
        </div>
      ))}
    </div>
  </div>
)

export default SkeletonBox
