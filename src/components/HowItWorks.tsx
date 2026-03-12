import { Search, GitCompare, Send, Handshake } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  { icon: Search, title: "Search", desc: "Find venues matching your event needs" },
  { icon: GitCompare, title: "Compare", desc: "Compare prices, capacity & amenities" },
  { icon: Send, title: "Enquire", desc: "Send enquiry directly to venue owners" },
  { icon: Handshake, title: "Connect", desc: "Get responses & book your venue" },
];

const HowItWorks = () => {
  return (
    <section className="py-8 bg-secondary/50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-primary/30" />
            <span className="text-[10px] font-semibold tracking-[3px] uppercase text-primary">
              Simple Process
            </span>
            <div className="h-px w-8 bg-primary/30" />
          </div>

          <h2 className="text-4xl md:text-5xl font-display font-semibold text-foreground mb-4">
            How VenueConnect <span className="italic font-light text-primary">Works</span>
          </h2>
          <p className="text-muted-foreground font-light tracking-wide">Four simple steps to your perfect venue</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative text-center group"
            >
              <div className="relative w-24 h-24 mx-auto rounded-full bg-white shadow-sm border border-black/5 flex items-center justify-center mb-6 group-hover:shadow-xl transition-all duration-500 group-hover:-translate-y-1">
                <div className="absolute inset-0 rounded-full border border-primary/20 scale-[0.85] group-hover:scale-100 transition-transform duration-500" />
                <step.icon className="w-8 h-8 text-primary relative z-10 transition-transform duration-500 group-hover:scale-110" strokeWidth={1.5} />

                {/* Connecting Line (hidden on last item) */}
                {i !== steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 left-[100%] w-[calc(100%-1rem)] h-[1px] bg-gradient-to-r from-primary/30 to-transparent -translate-y-1/2 z-0" />
                )}
              </div>
              <div className="mb-3 text-[10px] font-semibold tracking-[3px] uppercase text-primary/60">
                Step 0{i + 1}
              </div>
              <h3 className="text-xl font-display font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed px-4">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
