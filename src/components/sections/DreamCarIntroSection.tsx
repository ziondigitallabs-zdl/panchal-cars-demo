import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function DreamCarIntroSection() {
  return (
    <div className="relative min-h-[100dvh] flex flex-col justify-center py-16 overflow-hidden bg-purple-deep text-cream z-10 border-t border-purple-night">
      {/* Background Images */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/dream-car-mobile.webp"
          alt="Dream Car Background Mobile"
          fill
          className="object-cover md:hidden"
        />
        <Image
          src="/assets/dream-car-desktop.webp"
          alt="Dream Car Background Desktop"
          fill
          className="object-cover hidden md:block"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-ink/90 via-purple-deep/20 to-purple-ink/40" />
      </div>

      {/* Star decorations */}
      <div className="absolute top-24 left-10 text-star-yellow opacity-40 select-none text-xl">✦</div>
      <div className="absolute bottom-24 right-10 text-star-yellow opacity-35 select-none text-sm">✦</div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow flex flex-col justify-between lg:justify-center relative z-10">
        {/* Top: Header */}
        <div className="text-center md:text-left space-y-4 pt-6 md:pt-12 lg:pt-0 animate-stagger-1">
          <span className="inline-block font-display text-xs tracking-widest text-brass font-semibold uppercase">
            NOT SURE WHAT TO BUY?
          </span>
          <h2 className="font-display text-[clamp(2.5rem,8vw,4.5rem)] leading-[0.95] tracking-tight uppercase">
            FIND YOUR <br />
            <span className="text-brass">DREAM CAR</span>
          </h2>
          <p className="font-body text-base sm:text-lg lg:text-xl text-gray-pill opacity-95 max-w-md mx-auto md:mx-0">
            4 quick questions. We'll find the perfect match from our inventory.
          </p>
        </div>

        {/* Middle Spacer to avoid overlapping the illustration on mobile */}
        <div className="flex-grow min-h-[220px] md:min-h-[300px] lg:hidden" />

        {/* Bottom: Start button + takes 30 seconds */}
        <div className="flex flex-col items-center md:items-start gap-2 pb-6 lg:pb-0 lg:mt-8 animate-stagger-2">
          <Link
            href="/dream-car/quiz"
            prefetch={false}
            className="inline-flex items-center justify-center gap-4 px-12 py-4 rounded-full bg-white text-ink font-display text-2xl tracking-wider hover:bg-cream transition-transform btn-scale shadow-lg"
          >
            START &rarr;
          </Link>
          <span className="font-body text-xs text-gray-pill opacity-85 mt-1">
            Takes 30 seconds
          </span>
        </div>
      </div>
    </div>
  );
}
