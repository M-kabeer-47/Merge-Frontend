export default function NotesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-pulse">
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className="relative rounded-xl border border-light-border bg-main-background p-4 space-y-3"
        >
          {/* Icon */}
          <div className="w-12 h-12 bg-secondary/10 rounded-lg" />

          {/* Title */}
          <div className="h-4 bg-secondary/10 rounded w-3/4" />

          {/* Footer - Date and Menu */}
          <div className="flex items-center justify-between pt-2">
            <div className="h-3 bg-secondary/10 rounded w-16" />
            <div className="w-4 h-4 bg-secondary/10 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
