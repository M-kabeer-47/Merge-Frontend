export default function VerifyPageSkeleton() {
  return (
    <div className="bg-background border border-light-border rounded-2xl shadow-xl p-8 max-w-md w-full text-center animate-pulse">
      <div className="w-12 h-12 bg-secondary/10 rounded-full mx-auto mb-4" />
      <div className="h-6 bg-secondary/10 rounded w-2/3 mx-auto mb-2" />
      <div className="h-4 bg-secondary/10 rounded w-full mx-auto" />
    </div>
  );
}
