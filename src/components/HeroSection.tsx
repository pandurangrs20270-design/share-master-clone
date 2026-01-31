import { motion } from "framer-motion";
import { ArrowRight, Play, Users, Award, BookOpen, TrendingUp, TrendingDown, BarChart3, CandlestickChart } from "lucide-react";

const HeroSection = () => {
  const stats = [
    { icon: Users, value: "10K+", label: "Students Trained" },
    { icon: Award, value: "8+", label: "Years Experience" },
    { icon: BookOpen, value: "15+", label: "Courses Offered" },
  ];

  // Floating stock ticker data
  const stockTickers = [
    { symbol: "NIFTY", value: "22,456.80", change: "+1.2%", up: true },
    { symbol: "SENSEX", value: "73,890.45", change: "+0.8%", up: true },
    { symbol: "BANKNIFTY", value: "47,234.20", change: "-0.5%", up: false },
    { symbol: "RELIANCE", value: "2,945.30", change: "+2.1%", up: true },
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>

      {/* Animated Chart Lines */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <svg className="absolute w-full h-full opacity-20" preserveAspectRatio="none">
          <motion.path
            d="M0 400 Q 200 300, 400 350 T 800 300 T 1200 350 T 1600 280 T 2000 320"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 3, ease: "easeInOut" }}
          />
          <motion.path
            d="M0 500 Q 150 420, 300 480 T 600 400 T 900 450 T 1200 380 T 1500 420 T 1800 360"
            fill="none"
            stroke="hsl(var(--accent))"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 3, delay: 0.5, ease: "easeInOut" }}
          />
        </svg>
      </div>

      {/* Floating Candlestick Charts */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          >
            <div className={`flex items-end gap-1 ${i % 2 === 0 ? 'text-green-500' : 'text-red-500'}`}>
              <div className="w-1 bg-current rounded" style={{ height: `${20 + Math.random() * 30}px` }} />
              <div className="w-1 bg-current rounded" style={{ height: `${20 + Math.random() * 30}px` }} />
              <div className="w-1 bg-current rounded" style={{ height: `${20 + Math.random() * 30}px` }} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Animated Background Orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-accent/10 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-primary/5 to-accent/5 blur-3xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Floating Stock Tickers */}
      <div className="absolute top-20 right-8 z-10 hidden xl:block">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
          className="space-y-3"
        >
          {stockTickers.map((ticker, index) => (
            <motion.div
              key={ticker.symbol}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 + index * 0.1 }}
              className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg px-4 py-2 shadow-lg"
            >
              <div className="flex items-center gap-3">
                {ticker.up ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{ticker.symbol}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">{ticker.value}</span>
                    <span className={`text-xs font-medium ${ticker.up ? 'text-green-500' : 'text-red-500'}`}>
                      {ticker.change}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="container mx-auto px-4 z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6"
            >
              🎯 India's Most Trusted Stock Market Academy
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            >
              Learn{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Stock Market Trading
              </span>{" "}
              From Certified Experts
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0"
            >
              Master the art of trading with our comprehensive courses. Learn Technical Analysis, 
              Live Trading & Investment Strategies from industry experts.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
            >
              <motion.a
                href="#courses"
                className="btn-hero"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Courses
                <ArrowRight className="ml-2" size={20} />
              </motion.a>
              <motion.a
                href="#about"
                className="btn-hero-outline flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play size={20} />
                Watch Demo
              </motion.a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-6"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="text-center lg:text-left"
                >
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                    <stat.icon className="text-primary" size={24} />
                    <span className="text-2xl md:text-3xl font-bold text-foreground">
                      {stat.value}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Stock Market Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            {/* Main Chart Card */}
            <motion.div
              className="relative z-10 bg-card/90 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-2xl"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <CandlestickChart className="text-primary" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">NIFTY 50</p>
                    <p className="text-xs text-muted-foreground">Live Market Data</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-foreground">22,456.80</p>
                  <p className="text-sm text-green-500 font-medium">+264.25 (1.19%)</p>
                </div>
              </div>

              {/* Mini Chart Visualization */}
              <div className="h-40 flex items-end gap-1 justify-center">
                {[40, 55, 35, 65, 45, 70, 50, 80, 60, 75, 55, 85, 65, 90, 70, 95, 75, 88, 80, 92].map((height, i) => (
                  <motion.div
                    key={i}
                    className={`w-3 rounded-t ${i >= 14 ? 'bg-green-500' : 'bg-primary/30'}`}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: 0.5 + i * 0.05, duration: 0.5 }}
                  />
                ))}
              </div>

              {/* Chart Labels */}
              <div className="flex justify-between mt-4 text-xs text-muted-foreground">
                <span>9:15 AM</span>
                <span>12:00 PM</span>
                <span>3:30 PM</span>
              </div>
            </motion.div>

            {/* Floating Badge - Top Right */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
              className="absolute -top-4 -right-4 bg-card p-4 rounded-xl shadow-xl border z-20"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <TrendingUp className="text-green-500" size={24} />
                </div>
                <div>
                  <p className="font-semibold text-foreground">+32%</p>
                  <p className="text-sm text-muted-foreground">Avg. Returns</p>
                </div>
              </div>
            </motion.div>

            {/* Floating Badge - Bottom Left */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 }}
              className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-xl border z-20"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="text-primary" size={24} />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Live Trading</p>
                  <p className="text-sm text-muted-foreground">Real Market Practice</p>
                </div>
              </div>
            </motion.div>

            {/* Background Decorative Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full border-2 border-primary/20 -z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] rounded-full border border-primary/10 -z-10" />
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-primary/50 flex justify-center pt-2"
        >
          <motion.div
            animate={{ opacity: [0, 1, 0], y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-primary"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
