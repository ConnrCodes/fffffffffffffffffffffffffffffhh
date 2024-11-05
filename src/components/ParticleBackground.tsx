import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ParticleBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Create multiple particle systems
    const createParticleSystem = (count: number, size: number, color: number, speed: number) => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const velocities = new Float32Array(count * 3);

      for (let i = 0; i < count * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 10;
        positions[i + 1] = (Math.random() - 0.5) * 10;
        positions[i + 2] = (Math.random() - 0.5) * 10;

        velocities[i] = (Math.random() - 0.5) * speed;
        velocities[i + 1] = (Math.random() - 0.5) * speed;
        velocities[i + 2] = (Math.random() - 0.5) * speed;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      
      const material = new THREE.PointsMaterial({
        size,
        color,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
      });

      const particles = new THREE.Points(geometry, material);
      scene.add(particles);

      return { particles, velocities };
    };

    const particleSystems = [
      createParticleSystem(500, 0.015, 0x60A5FA, 0.002), // Blue
      createParticleSystem(300, 0.01, 0x34D399, 0.001),  // Green
      createParticleSystem(200, 0.008, 0x818CF8, 0.003)  // Purple
    ];

    camera.position.z = 3;

    // Mouse interaction
    const mouse = new THREE.Vector2();
    const target = new THREE.Vector2();
    const windowHalf = new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2);

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX - windowHalf.x) / windowHalf.x;
      mouse.y = (event.clientY - windowHalf.y) / windowHalf.y;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      // Smooth camera movement
      target.x = (1 - mouse.x) * 0.002;
      target.y = (1 - mouse.y) * 0.002;
      camera.rotation.x += 0.05 * (target.y - camera.rotation.x);
      camera.rotation.y += 0.05 * (target.x - camera.rotation.y);

      // Update particle positions
      particleSystems.forEach(({ particles, velocities }) => {
        const positions = (particles.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
        
        for (let i = 0; i < positions.length; i += 3) {
          positions[i] += velocities[i];
          positions[i + 1] += velocities[i + 1];
          positions[i + 2] += velocities[i + 2];

          // Reset particles that go out of bounds
          if (Math.abs(positions[i]) > 5) positions[i] *= -0.9;
          if (Math.abs(positions[i + 1]) > 5) positions[i + 1] *= -0.9;
          if (Math.abs(positions[i + 2]) > 5) positions[i + 2] *= -0.9;
        }

        particles.geometry.attributes.position.needsUpdate = true;
        particles.rotation.x += 0.0001;
        particles.rotation.y += 0.0001;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      windowHalf.set(window.innerWidth / 2, window.innerHeight / 2);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
      scene.clear();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ background: 'radial-gradient(circle at center, #1a1a2e 0%, #0f0f1a 100%)' }}
    />
  );
};

export default ParticleBackground;