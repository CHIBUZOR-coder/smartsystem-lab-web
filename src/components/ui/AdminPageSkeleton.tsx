import SkeletonBox from './SkeletonBox'

const AdminPageSkeleton = () => (
  <div className="space-y-6" aria-hidden="true">
    {/* Page header */}
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <SkeletonBox className="h-7 w-48" />
        <SkeletonBox className="h-4 w-64" />
      </div>
      <SkeletonBox className="h-9 w-28" rounded="lg" />
    </div>

    {/* Stat row */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-2">
          <SkeletonBox className="h-3 w-20" />
          <SkeletonBox className="h-7 w-14" />
        </div>
      ))}
    </div>

    {/* Table */}
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Table header */}
      <div className="bg-gray-50 dark:bg-gray-900 px-5 py-3 flex gap-6 border-b border-gray-100 dark:border-gray-700">
        {['w-1/3', 'w-1/4', 'w-1/5', 'w-20'].map((w, i) => (
          <SkeletonBox key={i} className={`h-3 ${w}`} />
        ))}
      </div>
      {/* Table rows */}
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {Array.from({ length: 6 }, (_, r) => (
          <div key={r} className="px-5 py-4 flex gap-6 items-center">
            {['w-1/3', 'w-1/4', 'w-1/5', 'w-20'].map((w, i) => (
              <SkeletonBox key={i} className={`h-3.5 ${w} ${i === 0 ? 'opacity-90' : 'opacity-50'}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
)

export default AdminPageSkeleton
