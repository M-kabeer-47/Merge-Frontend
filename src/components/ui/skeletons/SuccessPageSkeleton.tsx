export default function SuccessPageSkeleton() {
  return (
    <div className="shadow-xl p-8 max-w-md rounded-2xl bg-background w-full text-center">
      <div className="animate-pulse">
        <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4" />
        <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
        <div className="h-4 bg-gray-200 rounded w-full mx-auto" />
      </div>
    </div>
  );
}
