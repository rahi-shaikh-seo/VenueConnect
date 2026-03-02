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
    <section className="py-16 bg-secondary/50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            How VenueConnect Works
          </h2>
          <p className="text-muted-foreground">Four simple steps to your perfect venue</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative text-center"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl gradient-primary flex items-center justify-center mb-4">
                <step.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-7 h-7 rounded-full bg-card border-2 border-primary flex items-center justify-center text-xs font-bold text-primary">
                {i + 1}
              </div>
              <h3 className="text-lg font-display font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
