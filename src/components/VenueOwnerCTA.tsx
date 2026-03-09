import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const benefits = [
  "Get verified leads from real customers",
  "Increase your bookings by 3x",
  "Free exposure to thousands of event planners",
  "Easy dashboard to manage enquiries",
];

const VenueOwnerCTA = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-[#12080E]">
      {/* Background accents */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] tracking-[3px] uppercase font-semibold mb-6">
              For Venue Owners
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-semibold text-white leading-tight mb-4">
              List Your Business <br className="hidden md:block" />
              and get more bookings
            </h2>
            <div className="space-y-5 mb-10">
              {benefits.map((b, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                  <span className="text-white/90 text-sm md:text-base">{b}</span>
                </div>
              ))}
            </div>
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-medium px-8 w-full sm:w-auto" asChild>
              <Link to="/list-venue">
                List Your Business <ArrowRight className="w-4 h-4 ml-3" />
              </Link>
            </Button>
          </div>

          <div className="relative mt-8 md:mt-0">
            <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
              <div className="absolute inset-0 bg-gradient-to-t from-[#12080E]/80 to-transparent z-10 pointer-events-none" />
              <img
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80"
                alt="Venue owner managing bookings"
                className="w-full h-96 md:h-[500px] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl z-20">
              <div className="text-4xl font-display font-semibold text-white mb-1 drop-shadow-md">500+</div>
              <div className="text-[10px] tracking-[2px] font-semibold uppercase text-white/60">Venues listed</div>
            </div>
            <div className="absolute -top-6 -right-6 bg-primary/10 backdrop-blur-xl border border-primary/20 rounded-2xl p-6 shadow-2xl z-20">
              <div className="text-4xl font-display font-semibold text-primary mb-1 drop-shadow-md">10K+</div>
              <div className="text-[10px] tracking-[2px] font-semibold uppercase text-primary/60">Leads generated</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VenueOwnerCTA;
