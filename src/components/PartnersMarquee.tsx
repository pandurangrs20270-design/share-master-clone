import { motion } from "framer-motion";

const partners = [
  { name: "NSE", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/9/95/National_Stock_Exchange_of_India_logo.svg/220px-National_Stock_Exchange_of_India_logo.svg.png" },
  { name: "BSE", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/BSE_logo.svg/200px-BSE_logo.svg.png" },
  { name: "SEBI", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d7/Securities_and_Exchange_Board_of_India_logo.svg/200px-Securities_and_Exchange_Board_of_India_logo.svg.png" },
  { name: "Zerodha", logo: "https://zerodha.com/static/images/logo.svg" },
  { name: "Angel One", logo: "https://www.angelone.in/assets/images/logo.svg" },
  { name: "Upstox", logo: "https://assets.upstox.com/content/assets/images/upstox-logo.svg" },
  { name: "Groww", logo: "https://groww.in/groww-logo-270.png" },
  { name: "5Paisa", logo: "https://www.5paisa.com/images/5paisa-logo.svg" },
];

const PartnersMarquee = () => {
  return (
    <section className="py-12 bg-muted/50 overflow-hidden">
      <div className="container mx-auto px-4 mb-8">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-muted-foreground font-medium"
        >
          Trusted by leading brokers and trading platforms
        </motion.p>
      </div>

      {/* Marquee Container */}
      <div className="relative">
        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-muted/50 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-muted/50 to-transparent z-10" />

        {/* Scrolling Content */}
        <div className="flex animate-marquee">
          {/* First set */}
          {partners.map((partner, index) => (
            <div
              key={`${partner.name}-1-${index}`}
              className="flex-shrink-0 mx-8 flex items-center justify-center"
            >
              <div className="w-32 h-16 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="text-xl font-bold text-muted-foreground">${partner.name}</span>`;
                  }}
                />
              </div>
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {partners.map((partner, index) => (
            <div
              key={`${partner.name}-2-${index}`}
              className="flex-shrink-0 mx-8 flex items-center justify-center"
            >
              <div className="w-32 h-16 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="text-xl font-bold text-muted-foreground">${partner.name}</span>`;
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersMarquee;
