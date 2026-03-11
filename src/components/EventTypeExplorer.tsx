import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const eventTypes = [
  {
    name: "Wedding",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    count: "4,200+ venues"
  },
  {
    name: "Engagement",
    image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80",
    count: "1,900+ venues"
  },
  {
    name: "Birthday",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80",
    count: "3,100+ venues"
  },
  {
    name: "Corporate Event",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    count: "2,800+ venues"
  },
  {
    name: "Reception",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
    count: "2,400+ venues"
  },
  {
    name: "Garba Event",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80",
    count: "850+ venues"
  },
  {
    name: "Kitty Party",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80",
    count: "1,200+ venues"
  },
  {
    name: "Pool Party",
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80",
    count: "680+ venues"
  },
];

const EventTypeExplorer = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-primary/30" />
            <span className="text-[10.5px] font-semibold tracking-[3px] uppercase text-primary">
              Browse by Occasion
            </span>
            <div className="h-px w-12 bg-primary/30" />
          </div>
          
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-4">
            Find Venues for <em className="italic text-primary">Every Celebration</em>
          </h2>
          
          <p className="text-[15px] text-muted-foreground max-w-2xl mx-auto">
            Discover the perfect venue for your special occasion across Gujarat
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {eventTypes.map((event, i) => (
            <motion.div
              key={event.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/venues?q=${event.name}`}
                className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer block"
              >
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h3 className="font-display text-2xl font-semibold text-white mb-2">
                    {event.name}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {event.count}
                  </p>
                </div>

                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventTypeExplorer;
