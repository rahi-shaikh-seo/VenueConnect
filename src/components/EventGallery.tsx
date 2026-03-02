import { Calendar, MapPin, Users, Heart } from "lucide-react";
import { motion } from "framer-motion";

const galleryEvents = [
  {
    title: "Grand Wedding Celebration",
    venue: "The Grand Rajwada, Ahmedabad",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    type: "Wedding"
  },
  {
    title: "Corporate Annual Summit",
    venue: "Sapphire Convention, Rajkot",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    type: "Corporate"
  },
  {
    title: "Birthday Party Celebration",
    venue: "Royal Greens Farmhouse, Surat",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80",
    type: "Birthday"
  },
  {
    title: "Elegant Engagement Ceremony",
    venue: "Lakshmi Vilas Banquet, Vadodara",
    image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80",
    type: "Engagement"
  },
  {
    title: "Pool Party Extravaganza",
    venue: "Sunset Resort, Gandhinagar",
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80",
    type: "Pool Party"
  },
  {
    title: "Traditional Reception",
    venue: "Heritage Palace, Bhavnagar",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
    type: "Reception"
  },
  {
    title: "Garba Night Festival",
    venue: "City Convention Center, Ahmedabad",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80",
    type: "Garba"
  },
  {
    title: "Intimate Kitty Party",
    venue: "Garden Restaurant, Surat",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80",
    type: "Kitty Party"
  },
];

const EventGallery = () => {
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
              Get Inspired
            </span>
            <div className="h-px w-12 bg-primary/30" />
          </div>
          
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">
            Event <em className="italic text-primary">Gallery</em>
          </h2>
          
          <p className="text-[15px] text-muted-foreground max-w-2xl mx-auto">
            Browse through beautiful events hosted at our partner venues
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {galleryEvents.map((event, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative h-80 rounded-xl overflow-hidden mb-4">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 rounded-full bg-primary text-white text-xs font-semibold">
                    {event.type}
                  </span>
                </div>

                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-display text-xl font-semibold text-white mb-2">
                    {event.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-white/80 text-xs">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{event.venue}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-sm text-muted-foreground mb-4">
            Want to see your event featured here?
          </p>
          <a
            href="/list-venue"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
          >
            List Your Venue
          </a>
        </div>
      </div>
    </section>
  );
};

export default EventGallery;
