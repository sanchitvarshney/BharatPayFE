import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface AppLoaderProps {
  logo?: string;
  label?: string;
}

const AppLoader = ({ logo = "/ms.png", label = "Loading BharatPay" }: AppLoaderProps) => {
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setDots((d) => (d + 1) % 4), 480);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center bg-white select-none overflow-hidden">
      {/* Subtle radial glow behind logo */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: 480,
          height: 480,
          background: "radial-gradient(circle, rgba(46,172,179,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Logo */}
      <motion.img
        src={logo}
        alt="Mscorpres Logo"
        className="w-48 sm:w-64 md:w-80 max-w-[80vw] relative z-10"
        initial={{ opacity: 0, scale: 0.82 }}
        animate={{ opacity: 1, scale: [0.97, 1.02, 0.97] }}
        transition={{
          opacity: { duration: 0.7 },
          scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      {/* Progress track */}
      <div className="relative z-10 mt-10 w-56 sm:w-72 h-1 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: "45%",
            background: "linear-gradient(90deg, transparent, #2eacb3, #00d4e4, transparent)",
          }}
          initial={{ x: "-110%" }}
          animate={{ x: "310%" }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 0.15,
          }}
        />
      </div>

      {/* Loading text */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="relative z-10 mt-4 text-xs font-semibold text-gray-400 tracking-widest uppercase"
      >
        {label}
        {".".repeat(dots)}
      </motion.p>
    </div>
  );
};

export default AppLoader;
