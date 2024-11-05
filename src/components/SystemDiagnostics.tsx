import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  Memory, 
  HardDrive, 
  Activity, 
  Thermometer,
  Network,
  Zap,
  AlertTriangle
} from 'lucide-react';

interface SystemMetrics {
  cpu: {
    usage: number;
    temperature: number;
    cores: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  storage: {
    used: number;
    total: number;
    readSpeed: number;
    writeSpeed: number;
  };
  network: {
    download: number;
    upload: number;
    latency: number;
    packetLoss: number;
  };
  power: {
    voltage: number;
    current: number;
    efficiency: number;
  };
}

const SystemDiagnostics = () => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: { usage: 0, temperature: 0, cores: navigator.hardwareConcurrency },
    memory: { used: 0, total: 16384, percentage: 0 },
    storage: { used: 0, total: 512000, readSpeed: 0, writeSpeed: 0 },
    network: { download: 0, upload: 0, latency: 0, packetLoss: 0 },
    power: { voltage: 0, current: 0, efficiency: 0 }
  });

  const [alerts, setAlerts] = useState<string[]>([]);

  useEffect(() => {
    const updateMetrics = () => {
      // Simulate real metrics with realistic fluctuations
      const newMetrics: SystemMetrics = {
        cpu: {
          usage: Math.floor(Math.random() * 40) + 20,
          temperature: Math.floor(Math.random() * 20) + 40,
          cores: navigator.hardwareConcurrency
        },
        memory: {
          used: Math.floor(Math.random() * 8192) + 4096,
          total: 16384,
          percentage: 0
        },
        storage: {
          used: Math.floor(Math.random() * 256000) + 128000,
          total: 512000,
          readSpeed: Math.floor(Math.random() * 500) + 200,
          writeSpeed: Math.floor(Math.random() * 300) + 150
        },
        network: {
          download: Math.floor(Math.random() * 100) + 50,
          upload: Math.floor(Math.random() * 50) + 25,
          latency: Math.floor(Math.random() * 50) + 10,
          packetLoss: Math.random() * 2
        },
        power: {
          voltage: 11.8 + Math.random() * 0.4,
          current: 2 + Math.random() * 1,
          efficiency: 85 + Math.random() * 10
        }
      };

      // Calculate memory percentage
      newMetrics.memory.percentage = (newMetrics.memory.used / newMetrics.memory.total) * 100;

      // Check for alerts
      const newAlerts: string[] = [];
      if (newMetrics.cpu.temperature > 55) {
        newAlerts.push('High CPU temperature detected');
      }
      if (newMetrics.memory.percentage > 80) {
        newAlerts.push('Memory usage critical');
      }
      if (newMetrics.network.packetLoss > 1.5) {
        newAlerts.push('High packet loss detected');
      }

      setMetrics(newMetrics);
      setAlerts(newAlerts);
    };

    const interval = setInterval(updateMetrics, 2000);
    updateMetrics();
    return () => clearInterval(interval);
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

  const MetricCard = ({ 
    title, 
    icon: Icon, 
    values, 
    color 
  }: { 
    title: string; 
    icon: any; 
    values: { label: string; value: string | number; unit?: string }[]; 
    color: string;
  }) => (
    <motion.div
      variants={itemVariants}
      className={`bg-black/60 rounded-lg p-4 border border-${color}-500/30`}
      whileHover={{ scale: 1.02 }}
    >
      <div className={`flex items-center gap-2 text-${color}-400 mb-3`}>
        <motion.div
          whileHover={{ scale: 1.2, rotate: 360 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
        >
          <Icon className="w-5 h-5" />
        </motion.div>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <div className="space-y-2">
        {values.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className={`text-${color}-300/70 text-sm`}>{item.label}</span>
            <span className={`text-${color}-400`}>
              {item.value}
              {item.unit && <span className="text-sm ml-1">{item.unit}</span>}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <AnimatePresence mode="wait">
        {alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-900/20 border border-red-500/30 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 text-red-400 mb-2">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-semibold">System Alerts</h3>
            </div>
            <div className="space-y-1">
              {alerts.map((alert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-red-300"
                >
                  • {alert}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-4">
        <MetricCard
          title="CPU"
          icon={Cpu}
          color="blue"
          values={[
            { label: "Usage", value: `${metrics.cpu.usage}%` },
            { label: "Temperature", value: metrics.cpu.temperature, unit: "°C" },
            { label: "Cores", value: metrics.cpu.cores }
          ]}
        />

        <MetricCard
          title="Memory"
          icon={Memory}
          color="purple"
          values={[
            { label: "Usage", value: `${metrics.memory.percentage.toFixed(1)}%` },
            { label: "Used", value: (metrics.memory.used / 1024).toFixed(1), unit: "GB" },
            { label: "Total", value: (metrics.memory.total / 1024).toFixed(1), unit: "GB" }
          ]}
        />

        <MetricCard
          title="Storage"
          icon={HardDrive}
          color="emerald"
          values={[
            { label: "Used", value: `${((metrics.storage.used / metrics.storage.total) * 100).toFixed(1)}%` },
            { label: "Read Speed", value: metrics.storage.readSpeed, unit: "MB/s" },
            { label: "Write Speed", value: metrics.storage.writeSpeed, unit: "MB/s" }
          ]}
        />

        <MetricCard
          title="Network"
          icon={Network}
          color="cyan"
          values={[
            { label: "Download", value: metrics.network.download, unit: "Mbps" },
            { label: "Upload", value: metrics.network.upload, unit: "Mbps" },
            { label: "Latency", value: metrics.network.latency, unit: "ms" }
          ]}
        />

        <MetricCard
          title="Power"
          icon={Zap}
          color="yellow"
          values={[
            { label: "Voltage", value: metrics.power.voltage.toFixed(1), unit: "V" },
            { label: "Current", value: metrics.power.current.toFixed(1), unit: "A" },
            { label: "Efficiency", value: `${metrics.power.efficiency.toFixed(1)}%` }
          ]}
        />

        <MetricCard
          title="System Health"
          icon={Activity}
          color="rose"
          values={[
            { label: "Status", value: alerts.length === 0 ? "Healthy" : "Warning" },
            { label: "Uptime", value: "12:34:56" },
            { label: "Active Processes", value: "124" }
          ]}
        />
      </div>

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

export default SystemDiagnostics;