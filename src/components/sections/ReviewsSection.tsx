"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, MapPin, ChevronDown, ChevronUp, MessageCircle } from "lucide-react";
import { reviews } from "@/data/reviews";
import { siteConfig } from "@/data/site";
import { getGeneralWhatsAppLink } from "@/utils/whatsapp";

// Helper to get initials
function getInitials(name: string): string {
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

const AVATAR_COLORS = [
  "bg-violet text-white",
  "bg-teal text-ink",
  "bg-brass text-white",
  "bg-purple-night text-cream",
  "bg-star-yellow text-ink"
];

function getAvatarColor(id: number): string {
  return AVATAR_COLORS[(id - 1) % AVATAR_COLORS.length];
}

export default function ReviewsSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  // Summary stars rendering helper for 4.2 rating
  const renderSummaryStars = () => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4].map((i) => (
          <Star key={i} className="w-5 h-5 lg:w-6 lg:h-6 fill-star-yellow text-star-yellow" />
        ))}
        {/* 4.2 Star: 20% filled, 80% gray */}
        <svg className="w-5 h-5 lg:w-6 lg:h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="partialStarGradHome">
              <stop offset="20%" stopColor="#FFC93C" />
              <stop offset="20%" stopColor="#E8E5DE" />
            </linearGradient>
          </defs>
          <path
            d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"
            fill="url(#partialStarGradHome)"
            stroke="none"
          />
        </svg>
      </div>
    );
  };

  const renderReviewStars = (stars: number) => {
    return (
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i < stars ? "fill-star-yellow text-star-yellow" : "text-gray-pill fill-gray-pill"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="relative py-16 sm:py-24 bg-purple-deep text-cream overflow-hidden border-t border-purple-night">
      {/* Decorative stars */}
      <div className="absolute top-24 left-10 text-star-yellow opacity-40 select-none text-xl">✦</div>
      <div className="absolute bottom-24 right-12 text-star-yellow opacity-35 select-none text-sm">✦</div>
      <div className="absolute top-1/2 left-1/4 text-star-yellow opacity-20 select-none text-lg">✦</div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 space-y-12">
        {/* Header Section */}
        <div className="text-center md:text-left space-y-3 animate-stagger-1">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-[clamp(3.5rem,5.5vw,5rem)] tracking-tight uppercase leading-[0.9] lg:mb-1">
            TRUSTED BY <br />
            <span className="text-brass">VADODARA</span>
          </h1>
          <p className="font-body text-sm sm:text-base lg:text-lg text-gray-pill opacity-90 max-w-md">
            Here's what our customers say about their buying and selling experiences.
          </p>
        </div>

        {/* Rating Metrics & Reviews List Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Ratings Block & Location Card */}
          <div className="lg:col-span-5 space-y-6 animate-stagger-2">
            
            {/* Rating Summary Card */}
            <div className="bg-[#2E0670] p-6 rounded-[24px] space-y-4 border border-[#4309AC]/50">
              <div className="flex items-center gap-4">
                <span className="font-display text-5xl lg:text-6xl text-brass leading-none">{siteConfig.rating}</span>
                <div className="space-y-1">
                  {renderSummaryStars()}
                  <p className="font-body text-xs text-gray-pill uppercase tracking-wider">
                    {siteConfig.reviewCount} reviews on Google
                  </p>
                </div>
              </div>
            </div>

            {/* Flat Cartoon-Style Location Card */}
            <div className="bg-white text-ink p-6 rounded-[24px] space-y-6 shadow-lg">
              <div className="space-y-2">
                <h3 className="font-display text-xl tracking-wider text-purple-deep leading-tight">
                  PANCHAL CARS
                </h3>
                <div className="flex items-start gap-2 text-xs text-gray-muted font-body">
                  <MapPin className="w-4 h-4 text-brass flex-shrink-0 mt-0.5" />
                  <span>society Nr, Parth Bhoomi 1, Jupiter Rd, Manjalpur, Vadodara, Gujarat 390010</span>
                </div>
                <p className="text-xs font-semibold text-teal bg-teal/10 inline-block px-3 py-1 rounded-full uppercase tracking-wider">
                  Open today until 7:00 PM
                </p>
              </div>

              {/* Map Illustration Block */}
              <div className="relative w-full h-[140px] lg:h-[160px] rounded-xl overflow-hidden border border-purple-night flex-shrink-0">
                <Image
                  src="/assets/map-mobile.webp"
                  alt="Panchal Cars Location Map Mobile"
                  fill
                  className="object-cover md:hidden"
                />
                <Image
                  src="/assets/map-desktop.webp"
                  alt="Panchal Cars Location Map Desktop"
                  fill
                  className="object-cover hidden md:block"
                />
              </div>

              <div className="flex flex-col gap-3 pt-1">
                <a
                  href={siteConfig.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-violet text-white font-display text-sm tracking-wider hover:bg-opacity-95 text-center rounded-full btn-scale block shadow"
                >
                  OPEN IN GOOGLE MAPS
                </a>
                <a
                  href={getGeneralWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-white border border-whatsapp text-whatsapp hover:bg-whatsapp/5 font-display text-sm tracking-wider text-center rounded-full btn-scale flex items-center justify-center gap-1.5 block"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  MESSAGE ON WHATSAPP
                </a>
              </div>
            </div>

          </div>

          {/* RIGHT: Customer Reviews Cards List */}
          <div className="lg:col-span-7 space-y-4 animate-stagger-3 lg:max-h-[620px] lg:overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-brass/25">
            {reviews.map((rev) => {
              const avatarBg = getAvatarColor(rev.id);
              const initials = getInitials(rev.name);

              return (
                <div
                  key={rev.id}
                  className="bg-cream text-ink p-4 sm:p-5 lg:p-4 rounded-[20px] space-y-3 shadow-sm relative overflow-hidden"
                >
                  {/* Top card row: avatar, name, stars */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-display text-xs ${avatarBg}`}>
                        {initials}
                      </div>
                      
                      <div className="space-y-0.5">
                        <div className="flex items-baseline gap-2">
                          <h4 className="font-display text-xs sm:text-sm tracking-wider">{rev.name}</h4>
                          <span className="font-body text-[9px] text-gray-muted">{rev.date}</span>
                        </div>
                        {renderReviewStars(rev.stars)}
                      </div>
                    </div>

                    {rev.tag && (
                      <span className="px-2 py-0.5 rounded-full bg-teal/15 text-teal font-display text-[9px] tracking-wider uppercase font-semibold">
                        {rev.tag}
                      </span>
                    )}
                  </div>

                  {/* Review Text */}
                  <div>
                    {rev.isLong ? (
                      <div className="space-y-1">
                        <p className={`font-body text-[11px] sm:text-xs text-ink leading-relaxed transition-all duration-300 ${
                          isExpanded ? "line-clamp-none" : "line-clamp-3"
                        }`}>
                          {rev.text}
                        </p>
                        <button
                          onClick={() => setIsExpanded(!isExpanded)}
                          className="font-display text-[9px] text-brass hover:text-purple-deep tracking-wider uppercase flex items-center gap-1 focus:outline-none"
                        >
                          {isExpanded ? (
                            <>
                              SHOW LESS <ChevronUp className="w-3 h-3" />
                            </>
                          ) : (
                            <>
                              SHOW MORE <ChevronDown className="w-3 h-3" />
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <p className="font-body text-[11px] sm:text-xs text-ink leading-relaxed">
                        {rev.text}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
