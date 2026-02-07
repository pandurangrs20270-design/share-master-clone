import { motion } from "framer-motion";

// Partner data with brand colors for text fallback
const partners = [
  { 
    name: "NSE", 
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/9/95/National_Stock_Exchange_of_India_logo.svg/220px-National_Stock_Exchange_of_India_logo.svg.png",
    color: "#003366"
  },
  { 
    name: "BSE", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/BSE_logo.svg/200px-BSE_logo.svg.png",
    color: "#DC143C"
  },
  { 
    name: "SEBI", 
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d7/Securities_and_Exchange_Board_of_India_logo.svg/200px-Securities_and_Exchange_Board_of_India_logo.svg.png",
    color: "#1a365d"
  },
  { 
    name: "Zerodha", 
    logo: "https://zerodha.com/static/images/logo.svg",
    color: "#387ED1"
  },
  { 
    name: "Angel One", 
    logo: "https://www.angelone.in/assets/images/logo.svg",
    color: "#FF3D00"
  },
  { 
    name: "Upstox", 
    logo: "https://assets.upstox.com/content/assets/images/upstox-logo.svg",
    color: "#6B3FA0"
  },
  { 
    name: "Groww", 
    logo: "https://groww.in/groww-logo-270.png",
    color: "#00D09C"
  },
  { 
    name: "5Paisa", 
    logo: "https://www.5paisa.com/images/5paisa-logo.svg",
    color: "#2B6CB0"
  },
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
              <div className="w-32 h-16 flex items-center justify-center transition-all duration-300 hover:scale-110">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    const span = document.createElement('span');
                    span.className = 'text-xl font-bold';
                    span.style.color = partner.color;
                    span.textContent = partner.name;
                    (e.target as HTMLImageElement).parentElement?.appendChild(span);
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
              <div className="w-32 h-16 flex items-center justify-center transition-all duration-300 hover:scale-110">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    const span = document.createElement('span');
                    span.className = 'text-xl font-bold';
                    span.style.color = partner.color;
                    span.textContent = partner.name;
                    (e.target as HTMLImageElement).parentElement?.appendChild(span);
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
