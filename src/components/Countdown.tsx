import { motion } from 'framer-motion';

// Option 1: Animated Progress Ring
export function ProgressRingCountdown({ countdown, isRedirecting }: { countdown: number; isRedirecting: boolean }) {
  const progress = ((3 - countdown) / 3) * 100;
  const circumference = 2 * Math.PI * 40; // radius = 40

  return (
    <motion.div
      className="w-24 h-24 mx-auto mb-4 relative"
      variants={{
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 }
      }}
    >
      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="rgb(55, 65, 81)"
          strokeWidth="8"
          fill="transparent"
        />
        {/* Progress circle */}
        <motion.circle
          cx="50"
          cy="50"
          r="40"
          stroke="white"
          strokeWidth="8"
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (progress / 100) * circumference}
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          className="text-2xl font-bold text-white"
          key={countdown}
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {isRedirecting ? '🚀' : countdown}
        </motion.span>
      </div>
    </motion.div>
  );
}

// Option 2: Pulse Countdown with Ripple Effect
export function PulseCountdown({ countdown, isRedirecting }: { countdown: number; isRedirecting: boolean }) {
  return (
    <motion.div
      className="w-24 h-24 mx-auto mb-4 relative flex items-center justify-center"
      variants={{
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 }
      }}
    >
      {/* Ripple rings */}
      {[1, 2, 3].map((ring) => (
        <motion.div
          key={ring}
          className="absolute w-full h-full border border-white rounded-full"
          animate={{
            scale: [1, 2, 2.5],
            opacity: [0.6, 0.3, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: ring * 0.3,
            ease: "easeOut"
          }}
        />
      ))}

      {/* Center circle */}
      <motion.div
        className="w-16 h-16 bg-white rounded-full flex items-center justify-center relative z-10"
        animate={countdown > 0 ? {
          scale: [1, 1.1, 1],
        } : {}}
        transition={{
          duration: 1,
          repeat: countdown > 0 ? Infinity : 0,
        }}
      >
        <motion.span
          className="text-xl font-bold text-black"
          key={countdown}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20
          }}
        >
          {isRedirecting ? '🚀' : countdown}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}

// Option 3: Spinning Loading Segments
export function SegmentedCountdown({ countdown, isRedirecting }: { countdown: number; isRedirecting: boolean }) {
  const segments = 8;
  const activeSegments = Math.ceil(((3 - countdown) / 3) * segments);

  return (
    <motion.div
      className="w-24 h-24 mx-auto mb-4 relative"
      variants={{
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 }
      }}
    >
      <div className="absolute inset-0">
        {Array.from({ length: segments }).map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-6 rounded-full ${i < activeSegments ? 'bg-white' : 'bg-gray-600'
              }`}
            style={{
              top: '4px',
              left: '50%',
              transformOrigin: '50% 44px',
              transform: `translateX(-50%) rotate(${(360 / segments) * i}deg)`,
            }}
            animate={{
              opacity: i < activeSegments ? [0.4, 1, 0.4] : 0.3,
            }}
            transition={{
              duration: 0.8,
              repeat: i < activeSegments ? Infinity : 0,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          className="text-2xl font-bold text-white"
          key={countdown}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {isRedirecting ? '🚀' : countdown}
        </motion.span>
      </div>
    </motion.div>
  );
}

// Option 4: Morphing Shapes
export function MorphingCountdown({ countdown, isRedirecting }: { countdown: number; isRedirecting: boolean }) {
  const getShape = (count: number) => {
    switch (count) {
      case 3: return "50% 50% 50% 50%"; // Circle
      case 2: return "20% 20% 20% 20%"; // Rounded square
      case 1: return "0% 0% 0% 0%"; // Square
      default: return "50% 50% 50% 50%"; // Back to circle
    }
  };

  return (
    <motion.div
      className="w-24 h-24 mx-auto mb-4 relative"
      variants={{
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 }
      }}
    >
      <motion.div
        className="w-full h-full bg-white flex items-center justify-center"
        animate={{
          borderRadius: getShape(countdown),
          rotate: countdown > 0 ? [0, 90, 180, 270, 360] : 0,
        }}
        transition={{
          borderRadius: { duration: 0.5, ease: "easeInOut" },
          rotate: { duration: 2, repeat: countdown > 0 ? Infinity : 0, ease: "linear" }
        }}
      >
        <motion.span
          className="text-2xl font-bold text-black"
          key={countdown}
          initial={{ scale: 0, rotateY: 180 }}
          animate={{ scale: 1, rotateY: 0 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          {isRedirecting ? '🚀' : countdown}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}

// Option 5: Digital Clock Style
export function DigitalCountdown({ countdown, isRedirecting }: { countdown: number; isRedirecting: boolean }) {
  return (
    <motion.div
      className="mx-auto mb-4 relative"
      variants={{
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 }
      }}
    >
      <div className="bg-black border-2 border-white rounded-lg px-8 py-4 relative overflow-hidden">
        {/* Scanning line effect */}
        <motion.div
          className="absolute top-0 left-0 w-full h-0.5 bg-green-400"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 2,
            repeat: countdown > 0 ? Infinity : 0,
            ease: "linear"
          }}
        />

        {/* Digital display */}
        <motion.div
          className="font-mono text-4xl font-bold text-green-400 tracking-wider"
          animate={{
            textShadow: countdown > 0 ? [
              "0 0 5px #10b981",
              "0 0 10px #10b981",
              "0 0 15px #10b981",
              "0 0 5px #10b981"
            ] : "0 0 5px #10b981"
          }}
          transition={{ duration: 1, repeat: countdown > 0 ? Infinity : 0 }}
        >
          <motion.span
            key={countdown}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {isRedirecting ? 'GO!' : `00:0${countdown}`}
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Option 6: Particle Burst
export function ParticleCountdown({ countdown, isRedirecting }: { countdown: number; isRedirecting: boolean }) {
  return (
    <motion.div
      className="w-24 h-24 mx-auto mb-4 relative"
      variants={{
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 }
      }}
    >
      {/* Particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white rounded-full"
          style={{
            top: '50%',
            left: '50%',
          }}
          animate={{
            x: countdown > 0 ? [
              0,
              Math.cos((i * 30) * Math.PI / 180) * 30,
              Math.cos((i * 30) * Math.PI / 180) * 40,
              0
            ] : 0,
            y: countdown > 0 ? [
              0,
              Math.sin((i * 30) * Math.PI / 180) * 30,
              Math.sin((i * 30) * Math.PI / 180) * 40,
              0
            ] : 0,
            opacity: countdown > 0 ? [1, 0.5, 0, 1] : 0.3,
            scale: countdown > 0 ? [1, 1.5, 0.5, 1] : 1,
          }}
          transition={{
            duration: 2,
            repeat: countdown > 0 ? Infinity : 0,
            delay: i * 0.1,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center"
          animate={countdown > 0 ? {
            scale: [1, 1.2, 1],
          } : {}}
          transition={{
            duration: 1,
            repeat: countdown > 0 ? Infinity : 0,
          }}
        >
          <motion.span
            className="text-lg font-bold text-black"
            key={countdown}
            initial={{ scale: 0, rotate: 360 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            {isRedirecting ? '🚀' : countdown}
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
}