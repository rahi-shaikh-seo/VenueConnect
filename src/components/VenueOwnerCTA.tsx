import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const benefits = [
  "Get verified leads from real customers",
  "Increase your bookings by 3x",
  "Free exposure to thousands of event planners",
  "Easy dashboard to manage enquiries",
];

const VenueOwnerCTA = () => {
  return (
    <section className="py-20 bg-foreground">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-semibold mb-4">
              For Venue Owners
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-background mb-6">
              List Your Venue <span className="text-gradient">FREE</span>
            </h2>
            <div className="space-y-4 mb-8">
              {benefits.map((b) => (
                <div key={b} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-venue-green flex-shrink-0" />
                  <span className="text-background/80">{b}</span>
                </div>
              ))}
            </div>
            <Button size="lg" className="gradient-primary text-primary-foreground border-0 hover:opacity-90 text-base px-8">
              List Your Venue <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80"
                alt="Venue owner managing bookings"
                className="w-full h-80 object-cover rounded-2xl"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-card rounded-xl p-4 shadow-card-hover">
              <div className="text-2xl font-display font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Venues listed</div>
            </div>
            <div className="absolute -top-4 -right-4 bg-card rounded-xl p-4 shadow-card-hover">
              <div className="text-2xl font-display font-bold text-venue-green">10K+</div>
              <div className="text-sm text-muted-foreground">Leads generated</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VenueOwnerCTA;
