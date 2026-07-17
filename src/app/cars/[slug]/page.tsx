import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { cars } from "@/data/cars";
import CarDetailView from "@/components/CarDetailView";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CarDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const car = cars.find((c) => c.slug === slug);

  if (!car) {
    notFound();
  }

  // Dynamically resolve all gallery images on disk for this car ID
  let galleryImages: string[] = [];
  try {
    const galleryDir = path.join(process.cwd(), "public", "cars", "gallery", String(car.id));
    if (fs.existsSync(galleryDir)) {
      galleryImages = fs.readdirSync(galleryDir)
        .filter((file) => file.endsWith(".webp") || file.endsWith(".jpg") || file.endsWith(".png"))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }))
        .map((file) => `/cars/gallery/${car.id}/${file}`);
    }
  } catch (error) {
    console.error("Error reading gallery files:", error);
  }

  // Fallback to thumbnail if gallery folder is empty
  if (galleryImages.length === 0) {
    galleryImages = [`/cars/thumbs/${car.id}.webp`];
  }

  // Find 3 other random cars for the "MORE CARS" strip
  const otherCars = cars
    .filter((c) => c.id !== car.id)
    .slice(0, 3);

  return (
    <CarDetailView
      car={car}
      gallery={galleryImages}
      moreCars={otherCars}
    />
  );
}
