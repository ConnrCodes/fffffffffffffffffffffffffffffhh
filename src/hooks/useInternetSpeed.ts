import { useState, useEffect } from 'react';

interface SpeedData {
  download: number;
  latency: number;
}

export const useInternetSpeed = () => {
  const [speed, setSpeed] = useState<SpeedData>({ download: 0, latency: 0 });

  useEffect(() => {
    const sampleUrls = [
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500',
      'https://images.unsplash.com/photo-1534270804882-6b5048b1c1fc?w=500',
      'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=500',
    ];

    const measureLatency = async (): Promise<number> => {
      if ('RTCPeerConnection' in window) {
        try {
          const pc = new RTCPeerConnection();
          const dc = pc.createDataChannel('speed-test');
          
          const start = performance.now();
          await pc.createOffer();
          const latency = performance.now() - start;
          
          pc.close();
          return Math.round(latency);
        } catch (error) {
          console.error('RTCPeerConnection error:', error);
        }
      }
      
      // Fallback to ping test
      const start = performance.now();
      await fetch('/favicon.ico', { cache: 'no-store' });
      return Math.round(performance.now() - start);
    };

    const measureDownloadSpeed = async (): Promise<number> => {
      const startTime = performance.now();
      let totalBytes = 0;

      try {
        // Download multiple samples in parallel
        const downloads = sampleUrls.map(async url => {
          const response = await fetch(url, { cache: 'no-store' });
          const blob = await response.blob();
          return blob.size;
        });

        const sizes = await Promise.all(downloads);
        totalBytes = sizes.reduce((acc, size) => acc + size, 0);

        const durationInSeconds = (performance.now() - startTime) / 1000;
        const bitsPerSecond = (totalBytes * 8) / durationInSeconds;
        const megabitsPerSecond = bitsPerSecond / (1024 * 1024);

        return Number(megabitsPerSecond.toFixed(1));
      } catch (error) {
        console.error('Speed test failed:', error);
        return 0;
      }
    };

    const updateMetrics = async () => {
      try {
        const [downloadSpeed, latencyTime] = await Promise.all([
          measureDownloadSpeed(),
          measureLatency()
        ]);

        setSpeed({
          download: downloadSpeed,
          latency: latencyTime
        });
      } catch (error) {
        console.error('Failed to update metrics:', error);
      }
    };

    // Initial measurement
    updateMetrics();

    // Regular updates
    const interval = setInterval(updateMetrics, 10000); // Every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return speed;
};