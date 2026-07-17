import Link from "next/link";
import { Phone, Mail, MapPin, Instagram, Facebook, Youtube } from "lucide-react";
import { siteConfig } from "@/data/site";

export default function Footer() {
  return (
    <footer
      id="footer"
      className="bg-purple-ink text-cream py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden mt-auto border-t border-purple-night"
    >
      {/* Decorative stars */}
      <div className="absolute top-8 left-12 text-star-yellow opacity-40 select-none pointer-events-none text-xl">✦</div>
      <div className="absolute bottom-12 right-16 text-star-yellow opacity-30 select-none pointer-events-none text-sm">✦</div>
      <div className="absolute top-1/2 right-1/4 text-star-yellow opacity-20 select-none pointer-events-none text-lg">✦</div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8 relative z-10">
        {/* Left Side: Brand, Hours, Location */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="font-display text-3xl tracking-tighter text-white">
              PANCHAL CARS
            </span>
            <span className="inline-block self-start sm:self-center px-3 py-1 rounded-full bg-teal text-purple-ink font-display text-xs tracking-wider">
              OPEN 10 AM – 7 PM
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-pill opacity-90 text-sm sm:text-base">
            <MapPin className="w-4 h-4 text-brass" />
            <span>society Nr, Parth Bhoomi 1, Jupiter Rd, Manjalpur, Vadodara, Gujarat 390010</span>
          </div>
        </div>

        {/* Center: Contact Phones & Email */}
        <div className="space-y-4 lg:text-right">
          <div className="flex flex-col gap-3">
            <a
              href={`tel:${siteConfig.phone1.replace(/\s+/g, "")}`}
              className="flex items-center lg:justify-end gap-3 font-display text-2xl sm:text-3xl text-brass hover:text-white transition-colors"
            >
              <Phone className="w-5 h-5 fill-current" />
              {siteConfig.phone1}
            </a>
            <a
              href={`tel:${siteConfig.phone2.replace(/\s+/g, "")}`}
              className="flex items-center lg:justify-end gap-3 font-display text-2xl sm:text-3xl text-brass hover:text-white transition-colors"
            >
              <Phone className="w-5 h-5 fill-current" />
              {siteConfig.phone2}
            </a>
          </div>

          <a
            href={`mailto:${siteConfig.email}`}
            className="flex items-center lg:justify-end gap-2 text-gray-pill hover:text-brass transition-colors text-sm sm:text-base"
          >
            <Mail className="w-4 h-4" />
            <span>{siteConfig.email}</span>
          </a>
        </div>

        {/* Right Side: Social Media links */}
        <div className="space-y-4">
          <h4 className="font-display text-lg tracking-wider text-white">
            FOLLOW US
          </h4>
          <div className="flex items-center gap-4">
            <a
              href={siteConfig.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-instagram flex items-center justify-center text-white hover:scale-[1.1] transition-transform duration-200 shadow-md"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href={siteConfig.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center text-white hover:scale-[1.1] transition-transform duration-200 shadow-md"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5 fill-current" />
            </a>
            <a
              href={siteConfig.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[#FF0000] flex items-center justify-center text-white hover:scale-[1.1] transition-transform duration-200 shadow-md"
              aria-label="YouTube"
            >
              <Youtube className="w-5 h-5 fill-current" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-purple-night flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-gray-pill opacity-75">
        <p>&copy; {new Date().getFullYear()} Panchal Cars. All rights reserved.</p>
        <p>
          Made by{" "}
          <a
            href="https://ziondigitallabs.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brass hover:underline font-semibold"
          >
            Zion Digital Labs
          </a>
        </p>
      </div>
    </footer>
  );
}
