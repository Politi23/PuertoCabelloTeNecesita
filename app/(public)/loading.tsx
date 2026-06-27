export default function Loading() {
  return (
    <div className="max-w-container xl:max-w-container-xl 2xl:max-w-container-tv mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* Stats skeleton */}
      <div className="bg-surface border border-line rounded-xl p-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-9 w-16 rounded bg-line animate-pulse" />
            <div className="h-3 w-24 rounded bg-line/60 animate-pulse" />
          </div>
        ))}
      </div>
      {/* Locations skeleton */}
      <div>
        <div className="h-7 w-40 rounded bg-line animate-pulse mb-5" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-surface border border-line rounded-lg p-4 space-y-3 border-t-2 border-t-line"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex justify-between gap-2">
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 w-3/4 rounded bg-line animate-pulse" />
                  <div className="h-3 w-1/2 rounded bg-line/60 animate-pulse" />
                </div>
                <div className="h-5 w-16 rounded-full bg-line animate-pulse shrink-0" />
              </div>
              <div className="space-y-1.5 pt-2">
                <div className="h-3 w-full rounded bg-line/50 animate-pulse" />
                <div className="h-3 w-4/5 rounded bg-line/40 animate-pulse" />
                <div className="h-3 w-3/5 rounded bg-line/30 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
