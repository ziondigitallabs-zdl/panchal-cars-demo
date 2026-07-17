"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Heart, Phone, ShieldCheck } from "lucide-react";
import { Car } from "@/data/cars";
import { siteConfig } from "@/data/site";
import { getCarWhatsAppLink } from "@/utils/whatsapp";

interface CarDetailViewProps {
  car: Car;
  gallery: string[];
  moreCars: Car[];
}

export default function CarDetailView({ car, gallery, moreCars }: CarDetailViewProps) {
  const router = useRouter();
  const carouselRef = useRef<HTMLDivElement>(null);

  // Gallery states
  const [activeIndex, setActiveIndex] = useState(0);
  const [liked, setLiked] = useState(false);

  // Sync Favorites (like) state
  useEffect(() => {
    const saved = localStorage.getItem("liked_cars");
    if (saved) {
      try {
        const list = JSON.parse(saved);
        setLiked(list.includes(car.id));
      } catch (e) {
        console.error(e);
      }
    }
  }, [car.id]);

  const toggleLike = () => {
    const saved = localStorage.getItem("liked_cars");
    let list: number[] = [];
    if (saved) {
      try {
        list = JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    if (list.includes(car.id)) {
      list = list.filter((id) => id !== car.id);
      setLiked(false);
    } else {
      list.push(car.id);
      setLiked(true);
    }
    localStorage.setItem("liked_cars", JSON.stringify(list));
  };

  const handleBack = () => {
    // Attempt router back to preserve query params, fallback to /cars
    if (typeof window !== "undefined" && document.referrer.includes("/cars")) {
      router.back();
    } else {
      router.push("/cars");
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const index = Math.round(container.scrollLeft / container.clientWidth);
    if (index >= 0 && index < gallery.length) {
      setActiveIndex(index);
    }
  };

  const scrollCarouselTo = (idx: number) => {
    const container = carouselRef.current;
    if (container) {
      container.scrollTo({
        left: idx * container.clientWidth,
        behavior: "smooth"
      });
      setActiveIndex(idx);
    }
  };

  // Indian currency formatting
  const formattedPrice = new Intl.NumberFormat("en-IN").format(car.price);
  const formattedKm = new Intl.NumberFormat("en-IN").format(car.km);

  return (
    <div className="min-h-screen bg-cream text-ink pb-32">
      {/* Mobile Sticky Header */}
      <header className="bg-purple-deep text-cream sticky top-0 z-30 shadow-md lg:hidden">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="p-1 hover:text-brass transition-colors"
            aria-label="Back to listings"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <span className="font-display text-lg tracking-wider">PANCHAL CARS</span>
          <button
            onClick={toggleLike}
            className="p-1 text-gray-muted hover:text-red-500 transition-colors"
            aria-label="Favorite car"
          >
            <Heart
              className={`w-6 h-6 transition-all ${
                liked ? "fill-red-500 text-red-500 scale-110" : "fill-none"
              }`}
            />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Dynamic Gallery & Main Info Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDE: Dynamic Gallery */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Mobile Carousel Swipe Container */}
            <div className="relative w-full aspect-video rounded-[24px] overflow-hidden bg-black lg:hidden">
              <div
                ref={carouselRef}
                onScroll={handleScroll}
                className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-none"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {gallery.map((img, idx) => (
                  <div
                    key={idx}
                    className="w-full h-full flex-shrink-0 snap-start snap-always relative"
                  >
                    <Image
                      src={img}
                      alt={`${car.year} ${car.make} ${car.model} Gallery ${idx + 1}`}
                      fill
                      className="object-cover"
                      priority={idx === 0}
                    />
                  </div>
                ))}
              </div>

              {/* Counter Badge */}
              <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-sm text-white font-display text-xs tracking-wider">
                {activeIndex + 1} / {gallery.length}
              </div>
            </div>

            {/* Mobile Dots Strip */}
            <div className="flex justify-center gap-1.5 lg:hidden">
              {gallery.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollCarouselTo(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    idx === activeIndex ? "bg-violet w-5" : "bg-gray-pill"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Desktop Layout: Big Main + Column Thumbnails */}
            <div className="hidden lg:grid grid-cols-12 gap-4">
              {/* Clickable Column Thumbnails (Col 2) */}
              <div className="col-span-2 flex flex-col gap-3 h-[400px] overflow-y-auto pr-1 scrollbar-thin">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`relative w-full aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                      idx === activeIndex ? "border-violet scale-[1.02]" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Large Main Active Image (Col 10) */}
              <div className="col-span-10 relative h-[400px] rounded-[24px] overflow-hidden bg-black shadow-sm">
                <Image
                  src={gallery[activeIndex]}
                  alt={`${car.year} ${car.make} ${car.model}`}
                  fill
                  className="object-cover"
                  priority
                />
                <button
                  onClick={toggleLike}
                  className="absolute top-4 right-4 p-3 rounded-full bg-white/80 backdrop-blur-sm text-gray-muted hover:text-red-500 transition-colors shadow-md z-10"
                  aria-label="Favorite car"
                >
                  <Heart
                    className={`w-6 h-6 transition-all ${
                      liked ? "fill-red-500 text-red-500 scale-110" : "fill-none"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Title details and specs */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* White card below gallery */}
            <div className="bg-white p-6 rounded-[24px] space-y-4">
              <div className="space-y-1">
                <span className="font-display text-xs text-gray-muted tracking-widest uppercase">
                  {car.regCity} REGISTRATION
                </span>
                <h1 className="font-display text-3xl sm:text-4xl tracking-wider leading-tight">
                  {car.year} {car.make} {car.model} {car.variant}
                </h1>
                <p className="font-display text-4xl text-violet leading-none pt-2">
                  ₹{formattedPrice}
                </p>
              </div>

              {/* Pills row */}
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="px-3.5 py-1.5 rounded-full bg-gray-pill text-ink font-body text-xs font-semibold tracking-wide uppercase">
                  {car.fuel}
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-gray-pill text-ink font-body text-xs font-semibold tracking-wide uppercase">
                  {car.transmission}
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-gray-pill text-ink font-body text-xs font-semibold tracking-wide uppercase">
                  {formattedKm} KM
                </span>
              </div>
            </div>

            {/* Desktop prominent right CTA Card (visible on desktop) */}
            <div className="hidden lg:block bg-white p-6 rounded-[24px] space-y-4 shadow-sm border border-gray-pill">
              <div className="text-center pb-2 border-b border-gray-pill">
                <p className="text-gray-muted text-xs font-body uppercase">ENQUIRE ABOUT THIS VEHICLE</p>
                <p className="font-display text-2xl text-violet mt-1">₹{formattedPrice}</p>
              </div>

              <div className="flex flex-col gap-3">
                <a
                  href={getCarWhatsAppLink(car.year, car.make, car.model, car.variant, car.price)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-whatsapp text-white font-display text-lg tracking-wider hover:bg-opacity-95 transition-transform btn-scale"
                >
                  ENQUIRE ON WHATSAPP
                </a>
                <a
                  href={`tel:${siteConfig.phone1.replace(/\s+/g, "")}`}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-violet text-white font-display text-lg tracking-wider hover:bg-opacity-95 transition-transform btn-scale"
                >
                  <Phone className="w-5 h-5 fill-current" />
                  CALL NOW
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Spec Sheet Grid (Full Width below header/gallery) */}
        <div className="mt-8 bg-white p-6 sm:p-8 rounded-[24px] space-y-6">
          <h2 className="font-display text-2xl tracking-wider border-b border-gray-pill pb-4">
            SPECIFICATION SHEET
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 font-body text-sm sm:text-base">
            {[
              { label: "Registration", val: `${car.regCode} · ${car.regCity}` },
              { label: "Make", val: car.make },
              { label: "Model", val: car.model },
              { label: "Variant", val: car.variant },
              { label: "Year", val: car.yearLabel },
              { label: "Owner", val: `${car.owner} Owner` },
              { label: "Colour", val: car.colour },
              { label: "Transmission", val: car.transmission },
              { label: "Fuel", val: car.fuel },
              { label: "Airbags", val: car.airbags },
              { label: "Insurance", val: car.insurance },
              { label: "Kms driven", val: `${formattedKm} km` },
              { label: "Keys", val: car.keys }
            ].map((spec, idx) => (
              <div
                key={idx}
                className="flex justify-between py-2.5 border-b border-gray-pill/40 last:border-none md:last:border-b"
              >
                <span className="text-gray-muted">{spec.label}</span>
                <span className="font-semibold text-ink text-right">{spec.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* MORE CARS Strip */}
        <div className="mt-12 space-y-6">
          <h2 className="font-display text-2xl tracking-wider">
            MORE AVAILABLE VEHICLES
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {moreCars.map((mCar) => {
              const mPrice = new Intl.NumberFormat("en-IN").format(mCar.price);
              const mKm = new Intl.NumberFormat("en-IN").format(mCar.km);

              return (
                <Link
                  href={`/cars/${mCar.slug}`}
                  prefetch={false}
                  key={mCar.id}
                  className="group bg-white rounded-[24px] overflow-hidden flex flex-col justify-between hover:scale-[1.01] transition-transform duration-200 shadow-sm border border-gray-pill/30"
                >
                  <div className="relative aspect-video w-full">
                    <Image
                      src={`/cars/thumbs/${mCar.id}.webp`}
                      alt={`${mCar.year} ${mCar.make} ${mCar.model}`}
                      fill
                      sizes="(max-width: 640px) 100vw, 30vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="font-display text-base tracking-wider group-hover:text-violet transition-colors">
                      {mCar.year} {mCar.make} {mCar.model}
                    </h3>
                    <div className="flex justify-between items-center">
                      <p className="font-display text-lg text-violet">₹{mPrice}</p>
                      <span className="text-xs text-gray-muted font-body uppercase">
                        {mKm} KM &middot; {mCar.fuel}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Sticky Actions Bar (Mobile Only) */}
      <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-white border-t border-gray-pill p-4 flex items-center justify-between gap-4 shadow-xl">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-muted font-body uppercase">PRICE</span>
          <span className="font-display text-xl text-violet leading-none">₹{formattedPrice}</span>
        </div>

        <div className="flex gap-2 flex-grow justify-end">
          <a
            href={getCarWhatsAppLink(car.year, car.make, car.model, car.variant, car.price)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 rounded-full bg-whatsapp text-white font-display text-sm tracking-wider hover:bg-opacity-95 btn-scale flex-grow text-center"
          >
            WHATSAPP
          </a>
          <a
            href={`tel:${siteConfig.phone1.replace(/\s+/g, "")}`}
            className="px-4 py-3 rounded-full bg-violet text-white font-display text-sm tracking-wider hover:bg-opacity-95 btn-scale flex items-center gap-1"
          >
            <Phone className="w-4 h-4 fill-current" />
            CALL
          </a>
        </div>
      </div>
    </div>
  );
}
