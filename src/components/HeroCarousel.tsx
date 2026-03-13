import { useState, useEffect } from "react";
import heroKitchen from "@/assets/hero-kitchen.jpg";
import heroDistribution from "@/assets/hero-distribution.jpg";
import heroFoodPacking from "@/assets/hero-food-packing.jpg";

const slides = [
  { image: heroKitchen, label: "Community Focus", caption: "Volunteers preparing meals in community kitchens across India" },
  { image: heroDistribution, label: "Food Distribution", caption: "Sharing surplus food with families who need it most" },
  { image: heroFoodPacking, label: "Zero Waste", caption: "Every meal packed with care reaches those in need" },
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-elevated">
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <img src={slide.image} alt={slide.caption} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <span className="inline-block px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold mb-2">
              {slide.label}
            </span>
            <p className="text-card text-sm md:text-base font-medium">{slide.caption}</p>
          </div>
        </div>
      ))}
      <div className="absolute bottom-6 right-6 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? "bg-primary w-6" : "bg-card/50"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
