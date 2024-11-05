import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

const HolographicCircle = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });

    renderer.setSize(256, 256);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create main holographic ring
    const torusGeometry = new THREE.TorusGeometry(1, 0.02, 32, 100);
    const torusMaterial = new THREE.MeshPhongMaterial({
      color: 0x60A5FA,
      emissive: 0x60A5FA,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    scene.add(torus);

    // Create inner rotating rings with more detail
    const createRing = (radius: number, color: number, thickness: number) => {
      const geometry = new THREE.TorusGeometry(radius, thickness, 32, 100);
      const material = new THREE.MeshPhongMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
      });
      return new THREE.Mesh(geometry, material);
    };

    const innerRings = [
      createRing(0.7, 0x34D399, 0.01),
      createRing(0.5, 0x818CF8, 0.01),
      createRing(0.3, 0xF87171, 0.005)
    ];
    innerRings.forEach(ring => scene.add(ring));

    // Add ambient and point lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const createPointLight = (color: number, intensity: number, position: THREE.Vector3) => {
      const light = new THREE.PointLight(color, intensity, 100);
      light.position.copy(position);
      return light;
    };

    const lights = [
      createPointLight(0x60A5FA, 2, new THREE.Vector3(5, 5, 5)),
      createPointLight(0x34D399, 1, new THREE.Vector3(-5, -5, 5)),
      createPointLight(0xF87171, 1, new THREE.Vector3(0, 0, 5))
    ];
    lights.forEach(light => scene.add(light));

    // Add particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 200;
    const posArray = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 3;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.005,
      color: 0x60A5FA,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 3;

    // Animation
    let frame: number;
    const animate = () => {
      frame = requestAnimationFrame(animate);

      // Rotate main torus
      torus.rotation.x += 0.01;
      torus.rotation.y += 0.01;

      // Rotate inner rings with different speeds and axes
      innerRings[0].rotation.x += 0.02;
      innerRings[0].rotation.z += 0.02;
      innerRings[1].rotation.y += 0.03;
      innerRings[1].rotation.z -= 0.02;
      innerRings[2].rotation.x -= 0.02;
      innerRings[2].rotation.y += 0.01;

      // Animate particles
      particlesMesh.rotation.x += 0.001;
      particlesMesh.rotation.y += 0.001;

      // Pulse effect on materials
      const time = Date.now() * 0.001;
      const pulse = Math.sin(time) * 0.2 + 0.8;
      torusMaterial.opacity = 0.8 * pulse;
      innerRings.forEach(ring => {
        (ring.material as THREE.MeshPhongMaterial).opacity = 0.6 * pulse;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(frame);
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <motion.div 
      ref={containerRef}
      className="relative w-64 h-64"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div 
          className="text-blue-400 text-2xl font-bold tracking-wider"
          animate={{ 
            textShadow: [
              "0 0 8px #60A5FA",
              "0 0 16px #60A5FA",
              "0 0 24px #60A5FA",
              "0 0 16px #60A5FA",
              "0 0 8px #60A5FA"
            ]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          FLETCHER
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HolographicCircle;