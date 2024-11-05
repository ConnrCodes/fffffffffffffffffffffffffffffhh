import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Play, Pause, X, AlertTriangle } from 'lucide-react';

interface Process {
  id: number;
  name: string;
  cpu: number;
  memory: number;
  status: 'running' | 'suspended' | 'error';
  threads: number;
}

const ProcessMonitor = () => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);

  useEffect(() => {
    const updateProcesses = () => {
      // Simulate real process data
      const mockProcesses: Process[] = [
        {
          id: 1,
          name: 'System',
          cpu: Math.random() * 10 + 5,
          memory: Math.random() * 500 + 200,
          status: 'running',
          threads: 24
        },
        {
          id: 2,
          name: 'Browser',
          cpu: Math.random() * 20 + 10,
          memory: Math.random() * 1000 + 500,
          status: 'running',
          threads: 12
        },
        {
          id: 3,
          name: 'Database',
          cpu: Math.random() * 15 + 5,
          memory: Math.random() * 300 + 100,
          status: Math.random() > 0.9 ? 'error' : 'running',
          threads: 8
        },
        // Add more mock processes as needed
      ];

      setProcesses(mockProcesses);
    };

    const interval = setInterval(updateProcesses, 2000);
    updateProcesses();
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-400';
      case 'suspended': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

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

  return (
    <motion.div
      className="bg-black/80 rounded-lg p-6 backdrop-blur-sm border border-cyan-500/30 relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent"
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
        className="flex items-center justify-between mb-4 relative z-10"
        variants={itemVariants}
      >
        <div className="flex items-center gap-2">
          <motion.div
            whileHover={{ scale: 1.2, rotate: 360 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            <Activity className="w-5 h-5 text-cyan-400" />
          </motion.div>
          <h2 className="text-cyan-400 font-semibold">Process Monitor</h2>
        </div>
      </motion.div>

      <div className="space-y-2 relative z-10">
        <div className="grid grid-cols-5 gap-4 text-sm text-cyan-300/70 pb-2 border-b border-cyan-500/30">
          <div>Process</div>
          <div>CPU %</div>
          <div>Memory (MB)</div>
          <div>Status</div>
          <div>Threads</div>
        </div>

        <AnimatePresence mode="popLayout">
          {processes.map(process => (
            <motion.div
              key={process.id}
              className={`grid grid-cols-5 gap-4 py-2 text-sm ${
                selectedProcess?.id === process.id
                  ? 'bg-cyan-500/20'
                  : 'hover:bg-cyan-500/10'
              } rounded-lg cursor-pointer transition-colors`}
              onClick={() => setSelectedProcess(process)}
              variants={itemVariants}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-cyan-300">{process.name}</div>
              <div className="text-cyan-400">{process.cpu.toFixed(1)}%</div>
              <div className="text-cyan-400">{Math.round(process.memory)} MB</div>
              <div className={`flex items-center gap-2 ${getStatusColor(process.status)}`}>
                {process.status === 'running' ? (
                  <Play className="w-3 h-3" />
                ) : process.status === 'suspended' ? (
                  <Pause className="w-3 h-3" />
                ) : (
                  <AlertTriangle className="w-3 h-3" />
                )}
                {process.status}
              </div>
              <div className="text-cyan-400">{process.threads}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedProcess && (
          <motion.div
            className="absolute inset-x-0 bottom-0 p-4 bg-cyan-900/50 backdrop-blur-sm border-t border-cyan-500/30"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-cyan-300 font-medium mb-2">
                  Process Details: {selectedProcess.name}
                </h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                  <div className="text-cyan-400/70">Process ID:</div>
                  <div className="text-cyan-300">{selectedProcess.id}</div>
                  <div className="text-cyan-400/70">CPU Usage:</div>
                  <div className="text-cyan-300">{selectedProcess.cpu.toFixed(1)}%</div>
                  <div className="text-cyan-400/70">Memory Usage:</div>
                  <div className="text-cyan-300">{Math.round(selectedProcess.memory)} MB</div>
                  <div className="text-cyan-400/70">Thread Count:</div>
                  <div className="text-cyan-300">{selectedProcess.threads}</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedProcess(null)}
                className="text-cyan-400 hover:text-cyan-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="absolute -bottom-32 -right-32 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"
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

export default ProcessMonitor;