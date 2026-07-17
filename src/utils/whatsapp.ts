import { siteConfig } from "@/data/site";

export function getGeneralWhatsAppLink(): string {
  const message = "Hi, I'm looking for a used car. Can you help?";
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function getCarWhatsAppLink(year: number, make: string, model: string, variant: string, price: number): string {
  // Format price in Indian style
  const priceFormatted = new Intl.NumberFormat('en-IN').format(price);
  const message = `Hi, I saw the ${year} ${make} ${model} ${variant} (₹${priceFormatted}) on your website. Is it still available?`;
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export interface SellCarDetails {
  brand: string;
  model: string;
  year: string;
  fuel: string;
  gearbox: string;
  km: string;
  owner: string;
}

export function getSellWhatsAppLink(details: SellCarDetails): string {
  const message = `Hi, I want to sell my car:
Brand: ${details.brand}
Model: ${details.model}
Year: ${details.year}
Fuel: ${details.fuel}
Gearbox: ${details.gearbox}
KM driven: ${details.km}
Owner: ${details.owner}`;
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
