"use client";

import { usePathname } from "next/navigation";
import { getGeneralWhatsAppLink } from "@/utils/whatsapp";

export default function FloatingWhatsApp() {
  const pathname = usePathname();

  // Show only on /cars and /cars/[slug]
  const shouldShow = pathname === "/cars" || (pathname.startsWith("/cars/") && pathname !== "/cars/page");

  if (!shouldShow) return null;

  return (
    <a
      href={getGeneralWhatsAppLink()}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-whatsapp text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-200 btn-scale"
      aria-label="Chat on WhatsApp"
    >
      <svg
        className="w-8 h-8 fill-current"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.859-4.42 9.863-9.864.002-2.637-1.023-5.116-2.887-6.98C16.584 1.897 14.1 1.872 11.998 1.872c-5.442 0-9.866 4.42-9.87 9.865-.001 1.836.505 3.631 1.464 5.192l-1.02 3.729 3.822-1.004zM18.01 14.93c-.33-.165-1.956-.967-2.257-1.077-.302-.11-.522-.165-.742.165-.22.33-.852 1.076-1.044 1.297-.19.22-.383.247-.713.082-1.37-.686-2.42-1.2-3.298-2.706-.23-.396.23-.367.659-1.22.072-.148.036-.278-.018-.387-.054-.11-.522-1.256-.716-1.721-.188-.452-.38-.39-.522-.397-.134-.007-.287-.008-.44-.008-.153 0-.401.057-.611.287-.21.23-.804.786-.804 1.917 0 1.13.822 2.222.937 2.377.115.155 1.618 2.47 3.92 3.465 2.302.995 2.302.664 2.716.624.415-.04 1.341-.548 1.53-.1.19-.548.19-1.02.135-1.11-.055-.09-.205-.145-.536-.31z" />
      </svg>
    </a>
  );
}
