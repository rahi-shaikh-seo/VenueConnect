import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const vendors = [
  { name: "Photographers", image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80" },
  { name: "Makeup Artists", image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80" },
  { name: "Mehndi Artists", image: "https://images.unsplash.com/photo-1610041321427-8c710f5451ff?w=800&q=80" },
  { name: "Bands", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80" },
  { name: "Decorators", image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80" },
  { name: "Caterers", image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80" },
  { name: "Event Planners", image: "https://images.unsplash.com/photo-1505366518421-18cece5ebf4c?w=800&q=80" },
  { name: "Bridal Wear", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80" },
  { name: "Groom Wear", image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e5?w=800&q=80" },
  { name: "Invitations", image: "https://images.unsplash.com/photo-1572620786938-1a5568112668?w=800&q=80" },
  { name: "DJ", image: "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800&q=80" },
  { name: "Florists", image: "https://images.unsplash.com/photo-1490750967868-88df5691cc5a?w=800&q=80" },
  { name: "Wedding Photographers", image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80" },
  { name: "Jewellers", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80" },
  { name: "Choreographers", image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&q=80" },
  { name: "Tent Houses", image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80" },
  { name: "Astrologers", image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80" },
  { name: "Cakes", image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80" },
  { name: "Entertainers", image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&q=80" },
  { name: "Gifts", image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80" },
  { name: "Magicians", image: "https://images.unsplash.com/photo-1593642533144-3d62aa4783ec?w=800&q=80" },
  { name: "Wedding Planners", image: "https://images.unsplash.com/photo-1522413452208-996ff3f3e740?w=800&q=80" },
];

// Split into two rows of 11 each
const row1 = vendors.slice(0, 11);
const row2 = vendors.slice(11, 22);

const VendorCard = ({ vendor, index }: { vendor: typeof vendors[0], index: number }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04 }}
      className="flex-shrink-0 w-[170px] snap-center group cursor-pointer"
      onClick={() => navigate(`/vendors?category=${vendor.name.toLowerCase()}`)}
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-border/50 hover:-translate-y-1 duration-300">
        <div className="h-32 overflow-hidden">
          <img
            src={vendor.image}
            alt={vendor.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="p-3 text-center bg-white">
          <h3 className="font-semibold text-[13px] text-foreground group-hover:text-primary transition-colors leading-tight">
            {vendor.name}
          </h3>
        </div>
      </div>
    </motion.div>
  );
};

const VendorCategories = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="w-full px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-2">
            Vendors By Category
          </h2>
          <p className="text-muted-foreground text-sm">Browse all 22 vendor categories for your event</p>
        </motion.div>

        <div className="relative max-w-[1400px] mx-auto space-y-4">
          {/* Row 1 - Scroll on both mobile and desktop */}
          <div
            className="flex gap-4 overflow-x-auto snap-x pb-2"
            style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(0,0,0,0.15) transparent" }}
          >
            {row1.map((vendor, index) => (
              <VendorCard key={vendor.name} vendor={vendor} index={index} />
            ))}
          </div>

          {/* Row 2 */}
          <div
            className="flex gap-4 overflow-x-auto snap-x pb-2"
            style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(0,0,0,0.15) transparent" }}
          >
            {row2.map((vendor, index) => (
              <VendorCard key={vendor.name} vendor={vendor} index={index + 11} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VendorCategories;
