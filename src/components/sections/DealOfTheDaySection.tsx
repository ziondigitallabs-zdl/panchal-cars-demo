import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cars } from "@/data/cars";
import { getCarWhatsAppLink } from "@/utils/whatsapp";

export default function DealOfTheDaySection() {
  // Showcase cars with id 1, 2, 3
  const heroCar = cars.find((c) => c.id === 1)!;
  const deal2 = cars.find((c) => c.id === 2)!;
  const deal3 = cars.find((c) => c.id === 3)!;

  const formatPrice = (price: number) => new Intl.NumberFormat("en-IN").format(price);
  const formatKm = (km: number) => new Intl.NumberFormat("en-IN").format(km);

  return (
    <div className="relative py-16 sm:py-24 bg-purple-deep text-cream overflow-hidden border-t border-purple-night">
      {/* Background Star decoration */}
      <div className="absolute top-24 left-10 text-star-yellow opacity-40 select-none text-xl">✦</div>
      <div className="absolute bottom-24 right-12 text-star-yellow opacity-35 select-none text-sm">✦</div>
      <div className="absolute top-1/2 right-1/4 text-star-yellow opacity-20 select-none text-lg">✦</div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 space-y-12">
        {/* Header Block */}
        <div className="text-center md:text-left space-y-3 animate-stagger-1">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-[clamp(3.5rem,5.5vw,5rem)] tracking-tight uppercase leading-[0.9]">
            DEAL OF <br />
            <span className="text-brass">THE DAY</span>
          </h1>
          <p className="font-body text-sm sm:text-base lg:text-lg text-gray-pill opacity-90 max-w-md">
            3 hand-picked cars. New deals every morning.
          </p>
        </div>

        {/* Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch animate-stagger-2">
          
          {/* Hero Deal Card (Car 1) - takes lg:col-span-8 */}
          <div className="lg:col-span-8 bg-white rounded-[24px] overflow-hidden text-ink flex flex-col justify-between shadow-lg h-full">
            {/* Thumbnail */}
            <Link
              href={`/cars/${heroCar.slug}`}
              prefetch={false}
              className="relative aspect-video w-full block"
            >
              <Image
                src="/cars/thumbs/1.webp"
                alt={`${heroCar.year} ${heroCar.make} ${heroCar.model}`}
                fill
                className="object-cover"
                priority
              />
              <span className="absolute top-4 left-4 px-4 py-1.5 rounded-full bg-brass text-white font-display text-xs tracking-widest uppercase shadow-md">
                TODAY'S TOP DEAL
              </span>
            </Link>

            {/* Info details */}
            <div className="p-6 space-y-6 flex-grow flex flex-col justify-between">
              <div className="space-y-2">
                <Link
                  href={`/cars/${heroCar.slug}`}
                  prefetch={false}
                  className="font-display text-2xl sm:text-3xl tracking-wider leading-tight hover:text-violet transition-colors block"
                >
                  {heroCar.year} {heroCar.make} {heroCar.model} {heroCar.variant}
                </Link>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-gray-pill text-ink font-body text-xs font-semibold tracking-wide uppercase">
                    {heroCar.fuel}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-gray-pill text-ink font-body text-xs font-semibold tracking-wide uppercase">
                    {heroCar.transmission}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-gray-pill text-ink font-body text-xs font-semibold tracking-wide uppercase">
                    {formatKm(heroCar.km)} KM
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-pill">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-muted font-body uppercase tracking-wider">SPECIAL PRICE</span>
                  <span className="font-display text-3xl sm:text-4xl text-violet leading-none">
                    ₹{formatPrice(heroCar.price)}
                  </span>
                </div>

                <a
                  href={getCarWhatsAppLink(heroCar.year, heroCar.make, heroCar.model, heroCar.variant, heroCar.price)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-full bg-whatsapp text-white font-display text-base tracking-wider hover:bg-opacity-95 text-center btn-scale transition-transform"
                >
                  ENQUIRE ON WHATSAPP
                </a>
              </div>
            </div>
          </div>

          {/* Smaller Deals (Car 2 and Car 3) - takes lg:col-span-4 */}
          <div className="lg:col-span-4 flex flex-col gap-6 justify-between">
            <h3 className="font-display text-lg tracking-wider text-brass uppercase border-b border-cream/20 pb-2 hidden lg:block">
              MORE DEALS
            </h3>

            {/* Smaller cards grid on mobile, stacked on desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-6 flex-grow">
              {[deal2, deal3].map((car) => (
                <div
                  key={car.id}
                  className="bg-white rounded-[20px] overflow-hidden text-ink flex flex-col justify-between shadow-md group"
                >
                  <Link
                    href={`/cars/${car.slug}`}
                    prefetch={false}
                    className="relative aspect-video w-full block"
                  >
                    <Image
                      src={`/cars/thumbs/${car.id}.webp`}
                      alt={`${car.year} ${car.make} ${car.model}`}
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </Link>

                  <div className="p-4 space-y-4 flex-grow flex flex-col justify-between">
                    <div className="space-y-1">
                      <Link
                        href={`/cars/${car.slug}`}
                        prefetch={false}
                        className="font-display text-sm sm:text-base tracking-wider leading-tight group-hover:text-violet transition-colors block line-clamp-1"
                      >
                        {car.year} {car.make} {car.model}
                      </Link>
                      <p className="font-display text-lg text-violet">
                        ₹{formatPrice(car.price)}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-gray-pill flex justify-between items-center text-[10px] text-gray-muted font-body uppercase">
                      <span>{car.fuel}</span>
                      <span>{formatKm(car.km)} KM</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Navigation Link */}
        <div className="text-center animate-stagger-3 pt-4">
          <Link
            href="/cars"
            prefetch={false}
            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white text-ink font-display text-lg tracking-wider hover:bg-cream transition-transform btn-scale shadow-lg"
          >
            SEE ALL {cars.length} CARS
            <ArrowRight className="w-5 h-5 text-brass" />
          </Link>
        </div>
      </div>
    </div>
  );
}
