import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function VerifyPageSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
      <div className="mb-4">
        <LoadingSpinner children={<></>} loaderColor="heading" size="md" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading...</h2>
    </div>
  );
}
