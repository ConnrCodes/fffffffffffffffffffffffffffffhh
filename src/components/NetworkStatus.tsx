import React from 'react';
import { motion } from 'framer-motion';
import { Wifi, Activity } from 'lucide-react';
import { useInternetSpeed } from '../hooks/useInternetSpeed';

const NetworkStatus = () => {
  const { download, latency } = useInternetSpeed();

  const getSpeedColor = (speed: number) => {
    if (speed > 50) return 'text-green-400';
    if (speed > 20) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getLatencyColor = (ms: number) => {
    if (ms < 50) return 'text-green-400';
    if (ms < 100) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <motion.div
      className="fixed bottom-4 right-4 bg-black/80 rounded-lg p-3 backdrop-blur-sm border border-purple-500/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Wifi className="w-4 h-4 text-purple-400" />
          </motion.div>
          <span className={`text-sm ${getSpeedColor(download)}`}>
            {download.toFixed(1)} Mbps
          </span>
        </div>

        <div className="flex items-center gap-2">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Activity className="w-4 h-4 text-purple-400" />
          </motion.div>
          <span className={`text-sm ${getLatencyColor(latency)}`}>
            {latency.toFixed(0)} ms
          </span>
        </div>
      </div>

      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-purple-500/10"
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
};

export default NetworkStatus;