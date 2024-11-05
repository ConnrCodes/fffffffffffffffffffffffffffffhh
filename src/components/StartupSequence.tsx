import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Cpu, Database, Wifi, Server, Check, Camera } from 'lucide-react';
import { useInternetSpeed } from '../hooks/useInternetSpeed';

const StartupSequence = ({ onComplete }: { onComplete: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { download, latency } = useInternetSpeed();
  
  const steps = [
    { icon: Shield, text: 'Initializing Security Protocols', delay: 1000 },
    { icon: Camera, text: 'Connecting to Security Cameras', delay: 1500 },
    { icon: Server, text: 'Establishing Server Connection', delay: 1000 },
    { icon: Database, text: 'Loading Database Connections', delay: 1200 },
    { icon: Wifi, text: 'Testing Network Connectivity', delay: 1300 },
    { icon: Cpu, text: 'Starting Core Systems', delay: 1000 },
  ];

  useEffect(() => {
    if (currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, steps[currentStep].delay);

      return () => clearTimeout(timer);
    } else {
      const finalTimer = setTimeout(() => {
        onComplete();
      }, 1000);

      return () => clearTimeout(finalTimer);
    }
  }, [currentStep, steps.length, onComplete]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/95 flex items-center justify-center z-50"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="max-w-md w-full space-y-8 p-8">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold text-purple-400 mb-2">
              Fletcher AI
            </h1>
            <p className="text-purple-300/70">System Initialization</p>
          </motion.div>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className={`flex items-center gap-4 p-4 rounded-lg ${
                  index <= currentStep
                    ? 'bg-purple-900/20 border border-purple-500/30'
                    : 'bg-gray-900/20 border border-gray-500/30'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: index <= currentStep ? 1 : 0.5,
                  x: 0,
                  transition: { delay: index * 0.2 }
                }}
              >
                {index < currentStep ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={index <= currentStep ? 'text-purple-400' : 'text-gray-500'}
                  >
                    <Check className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    animate={
                      index === currentStep
                        ? {
                            scale: [1, 1.2, 1],
                            rotate: [0, 180, 360],
                            transition: {
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }
                          }
                        : {}
                    }
                    className={index <= currentStep ? 'text-purple-400' : 'text-gray-500'}
                  >
                    <step.icon className="w-6 h-6" />
                  </motion.div>
                )}
                <span className={index <= currentStep ? 'text-purple-300' : 'text-gray-500'}>
                  {step.text}
                </span>
                {index === currentStep && (
                  <motion.div
                    className="ml-auto h-1 w-full max-w-[100px] bg-purple-900/30 rounded-full overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      className="h-full bg-purple-500"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{
                        duration: step.delay / 1000,
                        ease: "linear"
                      }}
                    />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-8 text-center space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="text-purple-400">Network Status</div>
            <div className="flex justify-center gap-4 text-sm">
              <div className="text-purple-300">
                Download: {download.toFixed(1)} Mbps
              </div>
              <div className="text-purple-300">
                Latency: {latency.toFixed(0)} ms
              </div>
            </div>
          </motion.div>

          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.1, 0.2, 0.1],
              transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-purple-500/20" />
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StartupSequence;