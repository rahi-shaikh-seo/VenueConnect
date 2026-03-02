import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Priya Patel",
    role: "Bride, Ahmedabad",
    text: "VenueConnect helped us find the perfect wedding venue in just 2 days! The search filters made it so easy to compare options.",
    rating: 5,
  },
  {
    name: "Rajesh Shah",
    role: "Event Planner, Surat",
    text: "As an event planner, I use VenueConnect for all my clients. The venue details and instant enquiry feature saves hours of work.",
    rating: 5,
  },
  {
    name: "Meera Desai",
    role: "Venue Owner, Vadodara",
    text: "Since listing on VenueConnect, our bookings have increased by 40%. The lead quality is excellent and the platform is very easy to use.",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            What Our Users Say
          </h2>
          <p className="text-muted-foreground">Trusted by thousands across Gujarat</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl p-6 shadow-card relative"
            >
              <Quote className="w-8 h-8 text-primary/20 absolute top-4 right-4" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-golden text-golden" />
                ))}
              </div>
              <p className="text-foreground/80 mb-4 leading-relaxed">{t.text}</p>
              <div>
                <div className="font-semibold text-foreground">{t.name}</div>
                <div className="text-sm text-muted-foreground">{t.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
