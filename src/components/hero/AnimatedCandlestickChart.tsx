import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Candle {
  id: number;
  open: number;
  close: number;
  high: number;
  low: number;
  bullish: boolean;
}

interface FloatingLabel {
  id: number;
  text: string;
  x: number;
  y: number;
  type: "buy" | "sell" | "breakout";
}

const CHART_CONFIG = {
  desktop: { candleCount: 25, candleWidth: 16, gap: 6, height: 320 },
  mobile: { candleCount: 12, candleWidth: 12, gap: 4, height: 200 },
};

let candleIdCounter = 0;
let labelIdCounter = 0;

const generateCandle = (prevClose: number): Candle => {
  const volatility = 6 + Math.random() * 10;
  const direction = Math.random() > 0.45 ? 1 : -1;
  const change = direction * (Math.random() * volatility);
  
  const open = prevClose;
  const close = Math.max(15, Math.min(85, prevClose + change));
  const wickExtension = Math.random() * 6;
  const high = Math.min(92, Math.max(open, close) + wickExtension);
  const low = Math.max(8, Math.min(open, close) - wickExtension);
  
  return {
    id: candleIdCounter++,
    open,
    close,
    high,
    low,
    bullish: close >= open,
  };
};

const generateInitialCandles = (count: number): Candle[] => {
  const candles: Candle[] = [];
  let prevClose = 50;
  
  for (let i = 0; i < count; i++) {
    const candle = generateCandle(prevClose);
    candles.push(candle);
    prevClose = candle.close;
  }
  
  return candles;
};

const AnimatedCandlestickChart = () => {
  const isMobile = useIsMobile();
  const config = isMobile ? CHART_CONFIG.mobile : CHART_CONFIG.desktop;
  
  const [candles, setCandles] = useState<Candle[]>(() => generateInitialCandles(config.candleCount));
  const [currentPrice, setCurrentPrice] = useState(candles[candles.length - 1]?.close || 50);
  const [formingCandle, setFormingCandle] = useState<Candle | null>(null);
  const [floatingLabels, setFloatingLabels] = useState<FloatingLabel[]>([]);
  const [priceHistory, setPriceHistory] = useState<number[]>([]);
  
  const priceToY = useCallback((price: number) => {
    return config.height - (price / 100) * config.height;
  }, [config.height]);
  
  // Generate floating labels occasionally
  useEffect(() => {
    const labelInterval = setInterval(() => {
      if (Math.random() > 0.6) {
        const labels = ["BUY", "SELL", "Breakout", "Support", "Resistance"];
        const types: ("buy" | "sell" | "breakout")[] = ["buy", "sell", "breakout"];
        const randomLabel = labels[Math.floor(Math.random() * labels.length)];
        const randomType = types[Math.floor(Math.random() * types.length)];
        
        const newLabel: FloatingLabel = {
          id: labelIdCounter++,
          text: randomLabel,
          x: 20 + Math.random() * 60,
          y: 20 + Math.random() * 60,
          type: randomType,
        };
        
        setFloatingLabels(prev => [...prev.slice(-3), newLabel]);
        
        setTimeout(() => {
          setFloatingLabels(prev => prev.filter(l => l.id !== newLabel.id));
        }, 3000);
      }
    }, 2500);
    
    return () => clearInterval(labelInterval);
  }, []);
  
  // Simulate price ticks for the forming candle
  useEffect(() => {
    const tickInterval = setInterval(() => {
      setFormingCandle((prev) => {
        if (!prev) {
          const newCandle = generateCandle(currentPrice);
          return { ...newCandle, close: newCandle.open };
        }
        
        const tick = (Math.random() - 0.5) * 3;
        const newClose = Math.max(10, Math.min(90, prev.close + tick));
        const newHigh = Math.max(prev.high, newClose);
        const newLow = Math.min(prev.low, newClose);
        
        setCurrentPrice(newClose);
        setPriceHistory(hist => [...hist.slice(-50), newClose]);
        
        return {
          ...prev,
          close: newClose,
          high: newHigh,
          low: newLow,
          bullish: newClose >= prev.open,
        };
      });
    }, isMobile ? 200 : 120);
    
    return () => clearInterval(tickInterval);
  }, [currentPrice, isMobile]);
  
  // Complete candle and start new one (every 1.5-2 seconds)
  useEffect(() => {
    const candleInterval = setInterval(() => {
      if (formingCandle) {
        setCandles((prev) => {
          const newCandles = [...prev.slice(1), formingCandle];
          return newCandles;
        });
        setFormingCandle(null);
      }
    }, isMobile ? 2500 : 1800);
    
    return () => clearInterval(candleInterval);
  }, [formingCandle, isMobile]);
  
  // Price line path
  const priceLine = useMemo(() => {
    if (priceHistory.length < 2) return "";
    const step = 100 / priceHistory.length;
    return priceHistory
      .map((price, i) => `${i === 0 ? "M" : "L"} ${i * step}% ${priceToY(price)}`)
      .join(" ");
  }, [priceHistory, priceToY]);

  const getLabelColor = (type: FloatingLabel["type"]) => {
    switch (type) {
      case "buy": return "text-green-400 border-green-400/30 bg-green-400/10";
      case "sell": return "text-red-400 border-red-400/30 bg-red-400/10";
      case "breakout": return "text-yellow-400 border-yellow-400/30 bg-yellow-400/10";
    }
  };
  
  return (
    <div className="relative w-full rounded-2xl overflow-hidden" style={{ height: config.height + 60 }}>
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(148,163,184,0.3)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      {/* Ambient glow effects */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-green-500/10 blur-3xl"
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full bg-red-500/10 blur-3xl"
        animate={{ opacity: [0.3, 0.5, 0.3], scale: [1.2, 1, 1.2] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      
      {/* Price axis labels */}
      <div className="absolute left-3 top-6 bottom-12 flex flex-col justify-between text-[10px] text-slate-500 font-mono z-10">
        <span>92.00</span>
        <span>70.00</span>
        <span>50.00</span>
        <span>30.00</span>
        <span>8.00</span>
      </div>
      
      {/* Horizontal grid lines */}
      <div className="absolute left-12 right-4 top-6" style={{ height: config.height }}>
        {[0, 25, 50, 75, 100].map((level) => (
          <div
            key={level}
            className="absolute w-full border-t border-slate-700/50"
            style={{ top: `${level}%` }}
          />
        ))}
      </div>
      
      {/* Price line overlay */}
      {priceLine && (
        <svg className="absolute left-12 right-4 top-6 overflow-visible" style={{ height: config.height }}>
          <motion.path
            d={priceLine}
            fill="none"
            stroke="url(#priceGradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
          />
          <defs>
            <linearGradient id="priceGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(59,130,246,0.3)" />
              <stop offset="100%" stopColor="rgba(59,130,246,0.8)" />
            </linearGradient>
          </defs>
        </svg>
      )}
      
      {/* Candlesticks container */}
      <div 
        className="absolute left-12 right-4 top-6 flex items-end justify-end"
        style={{ height: config.height, gap: config.gap }}
      >
        <AnimatePresence mode="popLayout">
          {candles.map((candle) => {
            const bodyTop = priceToY(Math.max(candle.open, candle.close));
            const bodyBottom = priceToY(Math.min(candle.open, candle.close));
            const bodyHeight = Math.max(2, bodyBottom - bodyTop);
            const wickTop = priceToY(candle.high);
            const wickBottom = priceToY(candle.low);
            
            return (
              <motion.div
                key={candle.id}
                className="relative flex-shrink-0"
                style={{ width: config.candleWidth, height: config.height }}
                initial={{ opacity: 0, x: config.candleWidth + config.gap }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -(config.candleWidth + config.gap) }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {/* Wick */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 w-[1px] ${
                    candle.bullish ? "bg-green-500" : "bg-red-500"
                  }`}
                  style={{
                    top: wickTop,
                    height: wickBottom - wickTop,
                  }}
                />
                {/* Body */}
                <div
                  className={`absolute left-0 right-0 rounded-[2px] ${
                    candle.bullish
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                  style={{
                    top: bodyTop,
                    height: bodyHeight,
                  }}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {/* Forming candle with glow */}
        {formingCandle && (
          <motion.div
            className="relative flex-shrink-0"
            style={{ width: config.candleWidth, height: config.height }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Glow effect */}
            <motion.div
              className={`absolute left-1/2 -translate-x-1/2 w-8 rounded-full blur-md ${
                formingCandle.bullish ? "bg-green-500/40" : "bg-red-500/40"
              }`}
              animate={{
                top: priceToY(Math.max(formingCandle.open, formingCandle.close)) - 8,
                height: Math.max(20, Math.abs(priceToY(formingCandle.close) - priceToY(formingCandle.open)) + 16),
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{ opacity: { duration: 1, repeat: Infinity }, default: { duration: 0.1 } }}
            />
            {/* Wick */}
            <motion.div
              className={`absolute left-1/2 -translate-x-1/2 w-[1px] ${
                formingCandle.bullish ? "bg-green-400" : "bg-red-400"
              }`}
              animate={{
                top: priceToY(formingCandle.high),
                height: priceToY(formingCandle.low) - priceToY(formingCandle.high),
              }}
              transition={{ duration: 0.08, ease: "linear" }}
            />
            {/* Body */}
            <motion.div
              className={`absolute left-0 right-0 rounded-[2px] ${
                formingCandle.bullish
                  ? "bg-green-400 shadow-[0_0_12px_rgba(34,197,94,0.5)]"
                  : "bg-red-400 shadow-[0_0_12px_rgba(239,68,68,0.5)]"
              }`}
              animate={{
                top: priceToY(Math.max(formingCandle.open, formingCandle.close)),
                height: Math.max(2, Math.abs(priceToY(formingCandle.close) - priceToY(formingCandle.open))),
              }}
              transition={{ duration: 0.08, ease: "linear" }}
            />
          </motion.div>
        )}
      </div>
      
      {/* Current price line */}
      <motion.div
        className="absolute left-12 right-4 h-[1px] z-10"
        style={{ background: "linear-gradient(90deg, transparent, #3b82f6, #3b82f6, transparent)" }}
        animate={{ top: priceToY(currentPrice) + 24 }}
        transition={{ duration: 0.08, ease: "linear" }}
      >
        <motion.div 
          className="absolute right-0 -top-3 bg-blue-500 text-white text-[10px] px-2 py-1 rounded font-mono font-medium"
          animate={{ opacity: [0.9, 1, 0.9] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          ₹{currentPrice.toFixed(2)}
        </motion.div>
      </motion.div>
      
      {/* Floating trading labels */}
      <AnimatePresence>
        {floatingLabels.map((label) => (
          <motion.div
            key={label.id}
            className={`absolute px-2 py-1 text-[10px] font-bold rounded border backdrop-blur-sm z-20 ${getLabelColor(label.type)}`}
            style={{ left: `${label.x}%`, top: `${label.y}%` }}
            initial={{ opacity: 0, scale: 0.5, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            {label.text}
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* Live indicator */}
      <div className="absolute top-3 right-3 flex items-center gap-2 bg-slate-800/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-700/50 z-20">
        <motion.div
          className="w-2 h-2 rounded-full bg-green-500"
          animate={{ opacity: [1, 0.4, 1], scale: [1, 0.9, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <span className="text-[10px] text-slate-300 font-semibold tracking-wider">LIVE</span>
      </div>
      
      {/* Stock symbol */}
      <div className="absolute bottom-3 left-3 flex items-center gap-2 z-20">
        <span className="text-slate-400 text-xs font-mono">NIFTY50</span>
        <span className={`text-xs font-bold ${currentPrice >= 50 ? "text-green-400" : "text-red-400"}`}>
          {currentPrice >= 50 ? "▲" : "▼"} {Math.abs(currentPrice - 50).toFixed(2)}%
        </span>
      </div>
      
      {/* Time labels */}
      <div className="absolute bottom-3 right-3 text-[10px] text-slate-500 font-mono z-20">
        <span>1m Chart</span>
      </div>
    </div>
  );
};

export default AnimatedCandlestickChart;