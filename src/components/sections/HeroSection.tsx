import Image from "next/image";
import Link from "next/link";
import { cars } from "@/data/cars";
import { siteConfig } from "@/data/site";

export default function HeroSection() {
  const stockCount = cars.length;

  return (
    <div className="relative min-h-[100dvh] flex flex-col justify-between pt-28 pb-10 overflow-hidden bg-purple-deep text-cream z-10">
      {/* Background Images with Scrim */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/hero-mobile.webp"
          alt="Panchal Cars Hero Background Mobile"
          fill
          priority
          className="object-cover md:hidden"
        />
        <Image
          src="/assets/hero-desktop.webp"
          alt="Panchal Cars Hero Background Desktop"
          fill
          priority
          className="object-cover hidden md:block"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-ink/90 via-purple-deep/30 to-purple-ink/40" />
      </div>

      {/* Sparse stars decoration */}
      <div className="absolute top-24 right-10 text-star-yellow opacity-40 select-none text-xl animate-pulse">✦</div>
      <div className="absolute top-1/3 left-8 text-star-yellow opacity-35 select-none text-sm">✦</div>
      <div className="absolute bottom-1/3 right-1/4 text-star-yellow opacity-25 select-none text-lg">✦</div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow flex flex-col justify-between lg:justify-center relative z-10">
        <div className="max-w-3xl space-y-3 text-left animate-stagger-1 pt-6 md:pt-12 lg:pt-0">
          <h1 className="font-display text-[clamp(3.1rem,10vw,4.5rem)] lg:text-8xl leading-[0.95] tracking-tight">
            BEST <br />
            USED CARS <br />
            IN <span className="text-brass">VADODARA</span>
          </h1>
          <p className="font-body text-sm sm:text-base lg:text-xl text-gray-pill opacity-90">
            {stockCount} cars in stock. Ready to drive.
          </p>
        </div>

        {/* Middle Spacer to avoid overlapping the building illustration on mobile */}
        <div className="flex-grow min-h-[160px] md:min-h-[220px] lg:hidden" />

        {/* Action Buttons Block */}
        <div className="space-y-6 pb-4 lg:pb-0 lg:mt-10">
          <div className="max-w-2xl w-full mx-auto md:mx-0 flex flex-col md:flex-row gap-4 items-stretch animate-stagger-2">
            {/* BUY A CAR Button */}
            <Link
              href="/cars"
              prefetch={false}
              className="flex-1 h-[96px] lg:h-[110px] rounded-[24px] bg-violet hover:bg-opacity-95 text-white flex items-center justify-between pl-8 pr-4 py-3 btn-scale transition-all duration-200"
            >
              <span className="font-display text-2xl tracking-wider uppercase text-left leading-none">
                BUY A CAR
              </span>
              <div className="relative w-[120px] h-[50px] sm:w-[150px] sm:h-[60px] flex items-center justify-center">
                <Image
                  src="/assets/buy-a-car.svg"
                  alt="Buy a car illustration"
                  fill
                  className="object-contain object-right"
                />
              </div>
            </Link>

            {/* SELL A CAR Button */}
            <Link
              href="/sell"
              prefetch={false}
              className="flex-1 h-[96px] lg:h-[110px] rounded-[24px] bg-teal hover:bg-opacity-95 text-ink flex items-center justify-between pl-8 pr-4 py-3 btn-scale transition-all duration-200"
            >
              <span className="font-display text-2xl tracking-wider uppercase text-left leading-none">
                SELL A CAR
              </span>
              <div className="relative w-[90px] h-[65px] sm:w-[110px] sm:h-[80px] flex items-center justify-center">
                <Image
                  src="/assets/sell-a-car.svg"
                  alt="Sell a car illustration"
                  fill
                  className="object-contain object-right"
                />
              </div>
            </Link>
          </div>

          {/* Quieter Sub-link */}
          <div className="text-center md:text-left animate-stagger-3">
            <Link
              href="/#dream-car"
              className="inline-block font-display text-sm sm:text-base tracking-widest text-cream hover:text-brass transition-colors uppercase"
            >
              Not sure? FIND YOUR DREAM CAR &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop Only Trust Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full hidden md:block relative z-10 animate-stagger-4 pt-8">
        <div className="border-t border-cream/20 pt-4 flex justify-between items-center text-xs sm:text-sm font-display tracking-widest text-gray-pill opacity-80 uppercase">
          <div>{siteConfig.rating}★ GOOGLE RATING</div>
          <div>{siteConfig.reviewCount} REVIEWS</div>
          <div>{stockCount} CARS IN STOCK</div>
        </div>
      </div>
    </div>
  );
}
