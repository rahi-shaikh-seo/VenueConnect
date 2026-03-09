import { motion } from "framer-motion";

const vendors = [
  {
    name: "Photographers",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
  },
  {
    name: "Makeup Artists",
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80",
  },
  {
    name: "Mehndi Artists",
    image: "https://images.unsplash.com/photo-1610041321427-8c710f5451ff?w=800&q=80",
  },
  {
    name: "Bands",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
  },
  {
    name: "Decorators",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
  },
  {
    name: "Caterers",
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80",
  },
  {
    name: "Planners",
    image: "https://images.unsplash.com/photo-1505366518421-18cece5ebf4c?w=800&q=80",
  },
  {
    name: "Bridal Wear",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
  },
  {
    name: "Groom Wear",
    image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e5?w=800&q=80",
  },
  {
    name: "Invitations",
    image: "https://images.unsplash.com/photo-1572620786938-1a5568112668?w=800&q=80",
  }
];

const VendorCategories = () => {

  return (
    <section className="py-20 bg-muted/30">
      <div className="w-full px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Vendors By Category
          </h2>
        </motion.div>

        <div className="relative max-w-7xl mx-auto">
          {/* Categories Grid/Scroll Container */}
          <div
            className="flex md:grid md:grid-cols-5 gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x scrollbar-hide px-4 md:px-0 pb-8"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {vendors.map((vendor, index) => (
              <motion.div
                key={vendor.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex-shrink-0 w-[240px] md:w-auto snap-center group cursor-pointer"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-border/50">
                  <div className="h-40 overflow-hidden">
                    <img
                      src={vendor.image}
                      alt={vendor.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 text-center bg-white">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {vendor.name}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      </div>
    </section>
  );
};

export default VendorCategories;
