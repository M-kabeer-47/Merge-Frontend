export default function AuthPageSkeleton() {
  return (
    <div className="bg-background border border-light-border rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
      <div className="animate-pulse">
        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4" />
        <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
        <div className="h-4 bg-gray-200 rounded w-full mx-auto" />
      </div>
    </div>
  );
}
