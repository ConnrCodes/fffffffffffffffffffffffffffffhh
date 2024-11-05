import React, { useState, useEffect } from 'react';
import { Database, Cpu, HardDrive } from 'lucide-react';

const MemoryStats = () => {
  const [stats, setStats] = useState({
    memory: {
      used: 0,
      total: 16384, // 16GB in MB
      percentage: 0
    },
    cpu: {
      usage: 0,
      cores: navigator.hardwareConcurrency || 4
    },
    storage: {
      used: 0,
      total: 512000, // 512GB in MB
      percentage: 0
    }
  });

  useEffect(() => {
    const updateStats = () => {
      // Simulate memory usage
      const memoryUsed = Math.floor(Math.random() * 8192) + 4096; // 4-12GB
      const memoryPercentage = (memoryUsed / stats.memory.total) * 100;

      // Simulate CPU usage
      const cpuUsage = Math.floor(Math.random() * 60) + 20; // 20-80%

      // Simulate storage usage
      const storageUsed = Math.floor(Math.random() * 256000) + 128000; // 128-384GB
      const storagePercentage = (storageUsed / stats.storage.total) * 100;

      setStats({
        memory: {
          used: memoryUsed,
          total: stats.memory.total,
          percentage: memoryPercentage
        },
        cpu: {
          usage: cpuUsage,
          cores: stats.cpu.cores
        },
        storage: {
          used: storageUsed,
          total: stats.storage.total,
          percentage: storagePercentage
        }
      });
    };

    const interval = setInterval(updateStats, 2000);
    updateStats();
    return () => clearInterval(interval);
  }, []);

  const formatSize = (mb: number) => {
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(1)} GB`;
    }
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="bg-black/80 rounded-lg p-6 backdrop-blur-sm border border-purple-500/30">
      <h2 className="text-purple-400 text-lg font-semibold mb-4">System Resources</h2>
      
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center text-purple-300">
              <HardDrive className="w-4 h-4 mr-2" />
              <span>Memory</span>
            </div>
            <span className="text-purple-400 text-sm">
              {formatSize(stats.memory.used)} / {formatSize(stats.memory.total)}
            </span>
          </div>
          <div className="h-2 bg-purple-900/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 transition-all duration-500"
              style={{ width: `${stats.memory.percentage}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center text-purple-300">
              <Cpu className="w-4 h-4 mr-2" />
              <span>CPU ({stats.cpu.cores} cores)</span>
            </div>
            <span className="text-purple-400 text-sm">{stats.cpu.usage}%</span>
          </div>
          <div className="h-2 bg-purple-900/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 transition-all duration-500"
              style={{ width: `${stats.cpu.usage}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center text-purple-300">
              <Database className="w-4 h-4 mr-2" />
              <span>Storage</span>
            </div>
            <span className="text-purple-400 text-sm">
              {formatSize(stats.storage.used)} / {formatSize(stats.storage.total)}
            </span>
          </div>
          <div className="h-2 bg-purple-900/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 transition-all duration-500"
              style={{ width: `${stats.storage.percentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryStats;