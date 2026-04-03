import { motion } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";

const vendors = [
  { name: "Photographers", image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&q=80" },
  { name: "Makeup Artists", image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&q=80" },
  { name: "Mehndi Artists", image: "https://images.unsplash.com/photo-1610041321427-8c710f5451ff?w=400&q=80" },
  { name: "Bands", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80" },
  { name: "Decorators", image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80" },
  { name: "Caterers", image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=400&q=80" },
  { name: "Event Planners", image: "https://images.unsplash.com/photo-1505366518421-18cece5ebf4c?w=400&q=80" },
  { name: "Bridal Wear", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80" },
  { name: "Groom Wear", image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e5?w=400&q=80" },
  { name: "Invitations", image: "https://images.unsplash.com/photo-1572620786938-1a5568112668?w=400&q=80" },
  { name: "DJ", image: "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=400&q=80" },
  { name: "Florists", image: "https://images.unsplash.com/photo-1490750967868-88df5691cc5a?w=400&q=80" },
  { name: "Wedding Photographers", image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&q=80" },
  { name: "Jewellers", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80" },
  { name: "Choreographers", image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=400&q=80" },
  { name: "Tent Houses", image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&q=80" },
  { name: "Astrologers", image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80" },
  { name: "Cakes", image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&q=80" },
  { name: "Entertainers", image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=400&q=80" },
  { name: "Gifts", image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&q=80" },
  { name: "Magicians", image: "https://images.unsplash.com/photo-1593642533144-3d62aa4783ec?w=400&q=80" },
  { name: "Wedding Planners", image: "https://images.unsplash.com/photo-1522413452208-996ff3f3e740?w=400&q=80" },
];

// Row 1: first 11, Row 2: last 11 (reversed for opposite scroll direction)
const row1 = vendors.slice(0, 11);
const row2 = [...vendors.slice(11, 22)].reverse();

const VendorCard = ({ name, image }: { name: string; image: string }) => (
  <Link
    href={`/vendors?category=${encodeURIComponent(name.toLowerCase())}`}
    className="flex-shrink-0 w-[160px] cursor-pointer group block"
  >
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border/50 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      <div className="h-28 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="px-3 py-2 text-center">
        <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">{name}</p>
      </div>
    </div>
  </Link>
);

const InfiniteRow = ({ items, direction = "left" }: {
  items: typeof vendors;
  direction?: "left" | "right";
}) => {
  // Duplicate for seamless loop
  const doubled = [...items, ...items];
  const animation = direction === "left" ? "scrollLeft" : "scrollRight";

  return (
    <div className="overflow-hidden">
      <div
        className={`flex gap-4 w-max animate-[${animation}_40s_linear_infinite] hover:[animation-play-state:paused]`}
        style={{
          animation: `${animation} 40s linear infinite`,
        }}
      >
        {doubled.map((v, i) => (
          <VendorCard
            key={`${v.name}-${i}`}
            name={v.name}
            image={v.image}
          />
        ))}
      </div>
    </div>
  );
};

const VendorCategories = () => {

  return (
    <section className="py-4 md:py-6 bg-muted/30 overflow-hidden">
      <div className="container px-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-3">
            Vendors By Category
          </h2>
          <p className="text-muted-foreground text-sm">Browse all 22 vendor categories for your event</p>
        </motion.div>
      </div>

      <div className="space-y-4 pb-2">
        {/* Row 1 → scrolls left */}
        <InfiniteRow items={row1} direction="left" />
        {/* Row 2 → scrolls right */}
        <InfiniteRow items={row2} direction="right" />
      </div>

      <style>{`
        @keyframes scrollLeft {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scrollRight {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
};

export default VendorCategories;
