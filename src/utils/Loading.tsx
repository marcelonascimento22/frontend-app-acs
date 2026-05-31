import { Loader2 } from "lucide-react";

export function Loading() {
  return (
    <div className="flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      <p className="mt-3 text-gray-600">
        Carregando...
      </p>
    </div>
  );
}