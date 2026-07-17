import HeroSection from "@/components/sections/HeroSection";
import DreamCarIntroSection from "@/components/sections/DreamCarIntroSection";
import DealOfTheDaySection from "@/components/sections/DealOfTheDaySection";
import ReviewsSection from "@/components/sections/ReviewsSection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      <section id="hero">
        <HeroSection />
      </section>
      <section id="dream-car">
        <DreamCarIntroSection />
      </section>
      <section id="deals">
        <DealOfTheDaySection />
      </section>
      <section id="reviews">
        <ReviewsSection />
      </section>
      <Footer />
    </div>
  );
}
