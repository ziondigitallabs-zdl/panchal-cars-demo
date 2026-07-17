"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import { siteConfig } from "@/data/site";
import { getGeneralWhatsAppLink } from "@/utils/whatsapp";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close drawer on path change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Determine if this is a "purple page" (which uses cream/white text & icons and transparent nav by default)
  const isPurplePage = pathname === "/";

  // Desktop active underline and text color
  const getDesktopLinkClass = (path: string) => {
    const isActive = pathname === path;
    const baseClass = "relative py-2 font-display text-lg tracking-wider transition-colors duration-200 hover:text-brass";
    if (isActive) {
      return `${baseClass} text-brass after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-brass`;
    }
    return `${baseClass} ${isPurplePage ? "text-cream" : "text-purple-ink"}`;
  };

  const scrollFooter = (e: React.MouseEvent) => {
    e.preventDefault();
    const footer = document.getElementById("footer");
    if (footer) {
      footer.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  const isSpecialHeaderPage = pathname === "/cars" || (pathname.startsWith("/cars/") && pathname !== "/cars/page");

  return (
    <>
      {/* Navbar Container */}
      <nav
        className={`w-full z-40 transition-colors duration-300 ${
          isSpecialHeaderPage ? "hidden lg:block" : "block"
        } ${
          isPurplePage
            ? "bg-transparent text-cream absolute top-0 left-0"
            : "bg-purple-deep text-cream sticky top-0 shadow-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo / Wordmark */}
          <Link
            href="/"
            className={`font-display text-2xl sm:text-3xl tracking-tighter ${
              isPurplePage ? "text-cream" : "text-white"
            }`}
          >
            PANCHAL CARS
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link href="/cars" className={getDesktopLinkClass("/cars")}>
              BUY A CAR
            </Link>
            <Link href="/sell" className={getDesktopLinkClass("/sell")}>
              SELL A CAR
            </Link>
            <Link
              href="/#deals"
              className={getDesktopLinkClass("/#deals")}
            >
              DEALS
            </Link>
            <Link href="/#reviews" className={getDesktopLinkClass("/#reviews")}>
              REVIEWS
            </Link>
            <Link
              href="/#footer"
              className={`font-display text-lg tracking-wider transition-colors duration-200 hover:text-brass ${
                isPurplePage ? "text-cream" : "text-white"
              }`}
            >
              CONTACT
            </Link>
          </div>

          {/* Desktop CTA Phone Button */}
          <div className="hidden lg:block">
            <a
              href={`tel:${siteConfig.phone1.replace(/\s+/g, "")}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brass text-white font-display text-base tracking-wider hover:bg-opacity-90 transition-transform btn-scale"
            >
              <Phone className="w-4 h-4 fill-current" />
              {siteConfig.phone1}
            </a>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-8 h-8" />
            ) : (
              <Menu
                className={`w-8 h-8 ${
                  isPurplePage
                    ? "text-cream"
                    : pathname === "/cars" || pathname.startsWith("/cars/") || pathname === "/sell" || pathname === "/dream-car/quiz"
                    ? "text-ink"
                    : "text-white"
                }`}
              />
            )}
          </button>
        </div>
      </nav>

      {/* Fullscreen Mobile Drawer */}
      <div
        className={`fixed inset-0 z-50 bg-purple-deep text-cream transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } lg:hidden flex flex-col justify-between p-6 overflow-y-auto`}
      >
        {/* Top bar inside drawer */}
        <div className="flex items-center justify-between">
          <span className="font-display text-2xl tracking-tighter text-cream">
            PANCHAL CARS
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 focus:outline-none"
            aria-label="Close menu"
          >
            <X className="w-8 h-8 text-cream" />
          </button>
        </div>

        {/* Stacked Anton links */}
        <div className="flex flex-col items-start space-y-6 my-auto pt-8">
          <Link
            href="/#hero"
            onClick={() => setIsOpen(false)}
            className="font-display text-4xl tracking-wide hover:text-brass transition-colors"
          >
            HOME
          </Link>
          <Link
            href="/cars"
            onClick={() => setIsOpen(false)}
            className="font-display text-4xl tracking-wide hover:text-brass transition-colors"
          >
            BUY A CAR
          </Link>
          <Link
            href="/sell"
            onClick={() => setIsOpen(false)}
            className="font-display text-4xl tracking-wide hover:text-brass transition-colors"
          >
            SELL A CAR
          </Link>
          <Link
            href="/#dream-car"
            onClick={() => setIsOpen(false)}
            className="font-display text-4xl tracking-wide hover:text-brass transition-colors"
          >
            FIND YOUR DREAM CAR
          </Link>
          <Link
            href="/#deals"
            onClick={() => setIsOpen(false)}
            className="font-display text-4xl tracking-wide hover:text-brass transition-colors"
          >
            DEAL OF THE DAY
          </Link>
          <Link
            href="/#reviews"
            onClick={() => setIsOpen(false)}
            className="font-display text-4xl tracking-wide hover:text-brass transition-colors"
          >
            REVIEWS
          </Link>
          <Link
            href="/#footer"
            onClick={() => setIsOpen(false)}
            className="font-display text-4xl tracking-wide hover:text-brass transition-colors"
          >
            CONTACT
          </Link>
        </div>

        {/* Contact details & WhatsApp CTA */}
        <div className="space-y-4 pt-6 border-t border-purple-night">
          <div className="space-y-2">
            <a
              href={`tel:${siteConfig.phone1.replace(/\s+/g, "")}`}
              className="flex items-center gap-3 text-lg font-body text-cream hover:text-brass"
            >
              <Phone className="w-5 h-5 text-brass" />
              {siteConfig.phone1}
            </a>
            <a
              href={`tel:${siteConfig.phone2.replace(/\s+/g, "")}`}
              className="flex items-center gap-3 text-lg font-body text-cream hover:text-brass"
            >
              <Phone className="w-5 h-5 text-brass" />
              {siteConfig.phone2}
            </a>
          </div>

          <a
            href={getGeneralWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-whatsapp text-white font-display text-lg tracking-wider hover:bg-opacity-95 transition-transform btn-scale"
          >
            WHATSAPP US
          </a>
        </div>
      </div>
    </>
  );
}
