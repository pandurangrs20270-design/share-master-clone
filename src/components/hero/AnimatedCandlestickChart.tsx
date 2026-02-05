 import { motion } from "framer-motion";
 import { useEffect, useState } from "react";
 
 interface Candle {
   open: number;
   close: number;
   high: number;
   low: number;
   bullish: boolean;
 }
 
 const generateCandle = (prevClose: number): Candle => {
   const volatility = 8 + Math.random() * 12;
   const direction = Math.random() > 0.45 ? 1 : -1;
   const change = direction * (Math.random() * volatility);
   
   const open = prevClose;
   const close = Math.max(10, Math.min(90, prevClose + change));
   const wickExtension = Math.random() * 8;
   const high = Math.max(open, close) + wickExtension;
   const low = Math.min(open, close) - wickExtension;
   
   return {
     open,
     close,
     high: Math.min(95, high),
     low: Math.max(5, low),
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
   const [candles, setCandles] = useState<Candle[]>(() => generateInitialCandles(20));
   const [currentPrice, setCurrentPrice] = useState(candles[candles.length - 1]?.close || 50);
   const [formingCandle, setFormingCandle] = useState<Candle | null>(null);
   
   // Simulate price ticks for the forming candle
   useEffect(() => {
     const tickInterval = setInterval(() => {
       setFormingCandle((prev) => {
         if (!prev) {
           const newCandle = generateCandle(currentPrice);
           return { ...newCandle, close: newCandle.open };
         }
         
         const tick = (Math.random() - 0.5) * 4;
         const newClose = Math.max(5, Math.min(95, prev.close + tick));
         const newHigh = Math.max(prev.high, newClose);
         const newLow = Math.min(prev.low, newClose);
         
         setCurrentPrice(newClose);
         
         return {
           ...prev,
           close: newClose,
           high: newHigh,
           low: newLow,
           bullish: newClose >= prev.open,
         };
       });
     }, 150);
     
     return () => clearInterval(tickInterval);
   }, [currentPrice]);
   
   // Complete candle and start new one
   useEffect(() => {
     const candleInterval = setInterval(() => {
       if (formingCandle) {
         setCandles((prev) => {
           const newCandles = [...prev.slice(1), formingCandle];
           return newCandles;
         });
         setFormingCandle(null);
       }
     }, 3000);
     
     return () => clearInterval(candleInterval);
   }, [formingCandle]);
   
   const chartHeight = 160;
   const candleWidth = 12;
   const candleGap = 4;
   
   const priceToY = (price: number) => chartHeight - (price / 100) * chartHeight;
   
   return (
     <div className="relative w-full h-48 bg-card/50 rounded-xl border border-border/50 p-4 overflow-hidden">
       {/* Price axis */}
       <div className="absolute left-2 top-4 bottom-4 flex flex-col justify-between text-xs text-muted-foreground">
         <span>High</span>
         <span>Mid</span>
         <span>Low</span>
       </div>
       
       {/* Grid lines */}
       <div className="absolute inset-4 left-10">
         {[0, 25, 50, 75, 100].map((level) => (
           <div
             key={level}
             className="absolute w-full border-t border-border/30"
             style={{ top: `${level}%` }}
           />
         ))}
       </div>
       
       {/* Candlesticks */}
       <div className="absolute inset-4 left-10 flex items-end gap-1">
         {candles.map((candle, index) => {
           const bodyTop = priceToY(Math.max(candle.open, candle.close));
           const bodyBottom = priceToY(Math.min(candle.open, candle.close));
           const bodyHeight = Math.max(2, bodyBottom - bodyTop);
           const wickTop = priceToY(candle.high);
           const wickBottom = priceToY(candle.low);
           
           return (
             <motion.div
               key={index}
               className="relative"
               style={{ width: candleWidth }}
               initial={{ opacity: 0, scaleY: 0 }}
               animate={{ opacity: 1, scaleY: 1 }}
               transition={{ duration: 0.3, delay: index * 0.02 }}
             >
               {/* Wick */}
               <div
                 className={`absolute left-1/2 -translate-x-1/2 w-px ${
                   candle.bullish ? "bg-green-500" : "bg-red-500"
                 }`}
                 style={{
                   top: wickTop,
                   height: wickBottom - wickTop,
                 }}
               />
               {/* Body */}
               <motion.div
                 className={`absolute left-0 right-0 rounded-sm ${
                   candle.bullish
                     ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                     : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                 }`}
                 style={{
                   top: bodyTop,
                   height: bodyHeight,
                 }}
               />
             </motion.div>
           );
         })}
         
         {/* Forming candle (animated) */}
         {formingCandle && (
           <motion.div
             className="relative"
             style={{ width: candleWidth }}
           >
             {/* Wick */}
             <motion.div
               className={`absolute left-1/2 -translate-x-1/2 w-px ${
                 formingCandle.bullish ? "bg-green-500" : "bg-red-500"
               }`}
               animate={{
                 top: priceToY(formingCandle.high),
                 height: priceToY(formingCandle.low) - priceToY(formingCandle.high),
               }}
               transition={{ duration: 0.1 }}
             />
             {/* Body */}
             <motion.div
               className={`absolute left-0 right-0 rounded-sm ${
                 formingCandle.bullish
                   ? "bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]"
                   : "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]"
               }`}
               animate={{
                 top: priceToY(Math.max(formingCandle.open, formingCandle.close)),
                 height: Math.max(
                   2,
                   Math.abs(priceToY(formingCandle.close) - priceToY(formingCandle.open))
                 ),
               }}
               transition={{ duration: 0.1 }}
             />
           </motion.div>
         )}
       </div>
       
       {/* Current price line */}
       <motion.div
         className="absolute left-10 right-4 h-px bg-primary/80 z-10"
         animate={{ top: priceToY(currentPrice) + 16 }}
         transition={{ duration: 0.1 }}
       >
         <div className="absolute right-0 -top-2.5 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded font-mono">
           {currentPrice.toFixed(2)}
         </div>
       </motion.div>
       
       {/* Live indicator */}
       <div className="absolute top-2 right-2 flex items-center gap-1.5">
         <motion.div
           className="w-2 h-2 rounded-full bg-green-500"
           animate={{ opacity: [1, 0.3, 1] }}
           transition={{ duration: 1, repeat: Infinity }}
         />
         <span className="text-xs text-muted-foreground font-medium">LIVE</span>
       </div>
     </div>
   );
 };
 
 export default AnimatedCandlestickChart;