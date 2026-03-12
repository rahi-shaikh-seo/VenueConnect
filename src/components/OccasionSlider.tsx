import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const occasions = [
  { icon: "💑", name: "Wedding" },
  { icon: "🎂", name: "Birthday" },
  { icon: "💍", name: "Engagement" },
  { icon: "🏊", name: "Pool Party" },
  { icon: "🍸", name: "Cocktail Party" },
  { icon: "👔", name: "Corporate Party" },
  { icon: "🎉", name: "Kitty Party" },
  { icon: "🏛️", name: "Banquet Hall" },
  { icon: "🎪", name: "Conference" },
  { icon: "🎭", name: "Reception" },
];

const OccasionSlider = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="bg-white py-4 md:py-6">
      <div className="container px-4">
        {/* Header */}
        <div className="text-center mb-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-primary/30" />
            <span className="text-[10.5px] font-semibold tracking-[3px] uppercase text-primary">
              Find Your Event
            </span>
            <div className="h-px w-12 bg-primary/30" />
          </div>

          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-4">
            What's the <span className="text-primary">Occasion?</span>
          </h2>

          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Discover the perfect venue for every celebration across Gujarat
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative max-w-7xl mx-auto">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-lg border border-border flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all hidden md:flex"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-lg border border-border flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all hidden md:flex"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Scrollable Cards */}
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth py-4 px-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {occasions.map((occasion, index) => (
              <Link
                key={index}
                to={occasion.name === "Banquet Hall" ? "/venues?type=Banquet+Hall" : `/venues?q=${occasion.name}`}
                onClick={() => setSelectedIndex(index)}
                className={`flex-shrink-0 w-[160px] group cursor-pointer transition-all duration-300 ${selectedIndex === index ? 'scale-105' : ''
                  }`}
              >
                <div className={`bg-white rounded-2xl p-6 transition-all duration-300 h-[180px] flex flex-col items-center justify-center ${selectedIndex === index
                    ? 'border-2 border-primary shadow-xl'
                    : 'border-2 border-border hover:border-primary/50 hover:shadow-md'
                   }`}>
                  {/* Icon */}
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {occasion.icon}
                  </div>
 
                  {/* Name */}
                  <div className={`text-base font-semibold text-center transition-colors ${selectedIndex === index ? 'text-primary' : 'text-foreground group-hover:text-primary'
                    }`}>
                    {occasion.name}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            <div className="w-8 h-1 rounded-full bg-primary" />
            <div className="w-1 h-1 rounded-full bg-border" />
            <div className="w-1 h-1 rounded-full bg-border" />
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default OccasionSlider;
