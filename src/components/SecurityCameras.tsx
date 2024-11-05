import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Shield, AlertTriangle, Maximize2, RefreshCw } from 'lucide-react';

interface Camera {
  id: string;
  name: string;
  status: 'online' | 'offline';
  lastSnapshot: string;
  battery?: number;
}

const SecurityCameras = () => {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);

  useEffect(() => {
    const initializeCameras = async () => {
      try {
        // Simulated camera data for demo
        const mockCameras: Camera[] = [
          {
            id: '1',
            name: 'Front Door',
            status: 'online',
            battery: 85,
            lastSnapshot: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1'
          },
          {
            id: '2',
            name: 'Backyard',
            status: 'online',
            battery: 92,
            lastSnapshot: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6'
          },
          {
            id: '3',
            name: 'Garage',
            status: 'offline',
            battery: 15,
            lastSnapshot: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1'
          }
        ];

        setCameras(mockCameras);
      } catch (err) {
        setError('Failed to initialize security cameras');
        console.error('Camera initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeCameras();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    }
  };

  if (loading) {
    return (
      <motion.div
        className="bg-black/80 rounded-lg p-6 backdrop-blur-sm border border-blue-500/30 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="bg-black/80 rounded-lg p-6 backdrop-blur-sm border border-red-500/30 flex items-center gap-2 text-red-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <AlertTriangle className="w-6 h-6" />
        {error}
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-black/80 rounded-lg p-6 backdrop-blur-sm border border-blue-500/30 relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent"
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="flex items-center justify-between mb-6 relative z-10"
        variants={itemVariants}
      >
        <div className="flex items-center gap-2">
          <motion.div
            whileHover={{ scale: 1.2, rotate: 360 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            <Shield className="w-6 h-6 text-blue-400" />
          </motion.div>
          <h2 className="text-blue-400 text-lg font-semibold">Security Cameras</h2>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 relative z-10">
        {cameras.map(camera => (
          <motion.div
            key={camera.id}
            variants={itemVariants}
            className={`bg-blue-900/20 rounded-lg overflow-hidden border ${
              camera.status === 'online' 
                ? 'border-blue-500/30' 
                : 'border-red-500/30'
            }`}
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <img
                src={camera.lastSnapshot}
                alt={camera.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">{camera.name}</h3>
                    <div className="flex items-center gap-2 text-sm">
                      <span className={`flex items-center gap-1 ${
                        camera.status === 'online' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${
                          camera.status === 'online' ? 'bg-green-400' : 'bg-red-400'
                        }`} />
                        {camera.status}
                      </span>
                      {camera.battery && (
                        <span className={`text-${
                          camera.battery > 20 ? 'blue' : 'red'
                        }-400`}>
                          {camera.battery}%
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCamera(camera)}
                    className="p-2 bg-blue-500/20 rounded-lg hover:bg-blue-500/30 transition-colors"
                  >
                    <Maximize2 className="w-4 h-4 text-blue-400" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedCamera && (
          <motion.div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-4xl"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <img
                src={selectedCamera.lastSnapshot}
                alt={selectedCamera.name}
                className="w-full rounded-lg"
              />
              <button
                onClick={() => setSelectedCamera(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="absolute -bottom-32 -right-32 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
};

export default SecurityCameras;