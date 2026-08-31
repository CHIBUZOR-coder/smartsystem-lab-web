import SkeletonBox from './SkeletonBox'

const PageSkeleton = () => (
  <div className="w-full" aria-hidden="true" aria-label="Loading page">
    {/* Hero strip */}
    <div className="w-full h-[260px] skeleton rounded-none" />

    {/* Content blocks */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Section heading */}
      <div className="space-y-3 max-w-md">
        <SkeletonBox className="h-5 w-1/3" />
        <SkeletonBox className="h-8 w-2/3" />
        <SkeletonBox className="h-4 w-full" />
        <SkeletonBox className="h-4 w-5/6" />
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="rounded-2xl border border-[var(--color-border)] p-5 space-y-4">
            <SkeletonBox className="h-36 w-full" rounded="lg" />
            <SkeletonBox className="h-4 w-3/4" />
            <SkeletonBox className="h-3 w-full" />
            <SkeletonBox className="h-3 w-5/6" />
          </div>
        ))}
      </div>

      {/* Text block */}
      <div className="space-y-2 max-w-2xl">
        <SkeletonBox className="h-3 w-full" />
        <SkeletonBox className="h-3 w-full" />
        <SkeletonBox className="h-3 w-4/5" />
      </div>
    </div>
  </div>
)

export default PageSkeleton
