import { Loader2 } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <Loader2 className="animate-spin h-6 w-6 text-white mr-2" />
      <span className="text-white">Please wait...</span>
    </div>
  );
}
