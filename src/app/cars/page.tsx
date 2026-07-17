import { Suspense } from "react";
import CarsListings from "@/components/CarsListings";

export default function CarsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream flex flex-col items-center justify-center text-ink font-display text-2xl gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet"></div>
          LOADING INVENTORY...
        </div>
      }
    >
      <CarsListings />
    </Suspense>
  );
}
