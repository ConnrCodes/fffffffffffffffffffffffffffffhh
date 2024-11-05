import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Battery, Wifi, Play, Stop, AlertTriangle, Settings } from 'lucide-react';
import { eufyService } from '../services/eufyService';

interface CameraStatus {
  battery: number;
  isCharging: boolean;
  wifiSignalLevel: number;
  lastEventTime: Date;
  isStreaming: boolean;
}

interface CameraStream {
  deviceSN: string;
  url: string;
}

const EufyCameras = () => {
  const [cameras, setCameras] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStreams, setActiveStreams] = useState<CameraStream[]>([]);
  const [cameraStatuses, setCameraStatuses] = useState<{ [key: string]: CameraStatus }>({});
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement }>({});

  useEffect(() => {
    initializeCameras();
    return () => {
      stopAllStreams();
      eufyService.disconnect();
    };
  }, []);

  const initializeCameras = async () => {
    try {
      await eufyService.initialize();
      const devices = await eufyService.getCameras();
      setCameras(devices);
      
      // Get initial status for all cameras
      const statuses: { [key: string]: CameraStatus } = {};
      for (const device of devices) {
        statuses[device.deviceSN] = await eufyService.getCameraStatus(device.deviceSN);
      }
      setCameraStatuses(statuses);
    } catch (err) {
      setError('Failed to initialize cameras');
      console.error('Camera initialization error:', err);
    } finally {
      setLoading(false);
    }
  };

  const startStream = async (deviceSN: string) => {
    try {
      const stream = await eufyService.startStream(deviceSN);
      setActiveStreams(prev => [...prev, { deviceSN, url: stream.url }]);
      
      // Update camera status
      const status = await eufyService.getCameraStatus(deviceSN);
      setCameraStatuses(prev => ({ ...prev, [deviceSN]: status }));
    } catch (err) {
      console.error('Failed to start stream:', err);
    }
  };

  const stopStream = async (deviceSN: string) => {
    try {
      await eufyService.stopStream(deviceSN);
      setActiveStreams(prev => prev.filter(stream => stream.deviceSN !== deviceSN));
      
      // Update camera status
      const status = await eufyService.getCameraStatus(deviceSN);
      setCameraStatuses(prev => ({ ...prev, [deviceSN]: status }));
    } catch (err) {
      console.error('Failed to stop stream:', err);
    }
  };

  const stopAllStreams = async () => {
    for (const stream of activeStreams) {
      await stopStream(stream.deviceSN);
    }
  };

  const getBatteryColor = (level: number) => {
    if (level > 70) return 'text-green-400';
    if (level > 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getWifiSignalColor = (level: number) => {
    if (level > -50) return 'text-green-400';
    if (level > -70) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (loading) {
    return (
      <motion.div
        className="bg-black/80 rounded-lg p-6 backdrop-blur-sm border border-blue-500/30 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400" />
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
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

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.2, rotate: 360 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              <Camera className="w-6 h-6 text-blue-400" />
            </motion.div>
            <h2 className="text-blue-400 text-lg font-semibold">Security Cameras</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {cameras.map(camera => {
            const status = cameraStatuses[camera.deviceSN];
            const isStreaming = activeStreams.some(stream => stream.deviceSN === camera.deviceSN);

            return (
              <motion.div
                key={camera.deviceSN}
                className="bg-blue-900/20 rounded-lg overflow-hidden border border-blue-500/30"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative aspect-video">
                  {isStreaming ? (
                    <video
                      ref={el => {
                        if (el) videoRefs.current[camera.deviceSN] = el;
                      }}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-black/50 flex items-center justify-center">
                      <Camera className="w-12 h-12 text-blue-400/50" />
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-medium">{camera.name}</h3>
                        <div className="flex items-center gap-4 text-sm mt-1">
                          {status && (
                            <>
                              <div className="flex items-center gap-1">
                                <Battery className={`w-4 h-4 ${getBatteryColor(status.battery)}`} />
                                <span className={getBatteryColor(status.battery)}>
                                  {status.battery}%
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Wifi className={`w-4 h-4 ${getWifiSignalColor(status.wifiSignalLevel)}`} />
                                <span className={getWifiSignalColor(status.wifiSignalLevel)}>
                                  {status.wifiSignalLevel} dBm
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <motion.button
                          onClick={() => isStreaming ? stopStream(camera.deviceSN) : startStream(camera.deviceSN)}
                          className={`p-2 rounded-lg ${
                            isStreaming 
                              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                              : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                          } transition-colors`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {isStreaming ? (
                            <Stop className="w-5 h-5" />
                          ) : (
                            <Play className="w-5 h-5" />
                          )}
                        </motion.button>
                        
                        <motion.button
                          className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Settings className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default EufyCameras;