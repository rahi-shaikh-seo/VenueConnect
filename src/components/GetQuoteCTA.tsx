import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, CheckCircle2, Gift, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { gujaratCities } from "@/lib/cities";

const GetQuoteCTA = () => {
  return (
    <section className="py-4 md:py-6 bg-gradient-to-br from-primary/10 via-primary/5 to-white">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="grid md:grid-cols-2">
              {/* Left Side - Form */}
              <div className="p-8 md:p-10">
                <div className="flex items-center gap-2 mb-4">
                  <Gift className="w-6 h-6 text-primary" />
                  <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                    Get Upto 10% Discount
                  </span>
                </div>
                
                <h3 className="font-display text-3xl font-semibold text-foreground mb-3">
                  Get Best <em className="italic text-primary">Suited Venues</em>
                </h3>
                
                <p className="text-sm text-muted-foreground mb-6">
                  Share your details & get personalized venue recommendations with exclusive discounts
                </p>

                <div className="space-y-4">
                  <Input 
                    placeholder="Your Name" 
                    className="h-12"
                  />
                  
                  <Input 
                    type="tel" 
                    placeholder="Phone Number" 
                    className="h-12"
                  />
                  
                  <Input 
                    type="email" 
                    placeholder="Email Address" 
                    className="h-12"
                  />
                  
                  <Select>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select Event Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wedding">Wedding</SelectItem>
                      <SelectItem value="birthday">Birthday</SelectItem>
                      <SelectItem value="corporate">Corporate Event</SelectItem>
                      <SelectItem value="engagement">Engagement</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent>
                      {gujaratCities.map(c => (
                          <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold">
                    Get Free Quotes
                  </Button>
                </div>
              </div>

              {/* Right Side - Visual */}
              <div className="relative bg-gradient-to-br from-primary to-primary/80 p-10 flex items-center justify-center">
                <div className="text-center text-white">
                  <Sparkles className="w-16 h-16 mx-auto mb-6 animate-pulse" />
                  
                  <h4 className="font-display text-2xl font-semibold mb-4">
                    Why Choose Us?
                  </h4>
                  
                  <div className="space-y-4 text-left">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm">✓</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">35,000+ Venues</p>
                        <p className="text-xs text-white/80">Largest venue network</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm">✓</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Best Price Guarantee</p>
                        <p className="text-xs text-white/80">Exclusive discounts</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm">✓</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Free Expert Advice</p>
                        <p className="text-xs text-white/80">Dedicated support team</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm">✓</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">6.5 Lac+ Happy Users</p>
                        <p className="text-xs text-white/80">Trusted by thousands</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GetQuoteCTA;
