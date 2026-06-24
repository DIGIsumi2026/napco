import { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';

/* ─── Paper Sheet ─────────────────────────────────────────── */
function PaperSheet({
  position,
  rotation,
  floatOffset,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  floatOffset: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const t = useRef(floatOffset);

  useFrame((_, delta) => {
    t.current += delta;
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(t.current * 0.6) * 0.18;
      meshRef.current.rotation.z = rotation[2] + Math.sin(t.current * 0.4) * 0.06;
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} castShadow>
      <planeGeometry args={[1.6, 2.1, 12, 16]} />
      <MeshDistortMaterial
        color="#e8e8f4"
        distort={0.18}
        speed={1.2}
        roughness={0.3}
        metalness={0.05}
        transparent
        opacity={0.72}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* ─── Print Roller ────────────────────────────────────────── */
function PrintRoller({
  position,
  floatOffset,
}: {
  position: [number, number, number];
  floatOffset: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const t = useRef(floatOffset);

  useFrame((_, delta) => {
    t.current += delta;
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(t.current * 0.5) * 0.12;
      meshRef.current.rotation.x += delta * 0.4;
    }
  });

  return (
    <mesh ref={meshRef} position={position} castShadow>
      <cylinderGeometry args={[0.18, 0.18, 1.4, 24]} />
      <meshStandardMaterial color="#6d28d9" metalness={0.7} roughness={0.2} />
    </mesh>
  );
}

/* ─── Scene that handles mouse + click ───────────────────── */
function Scene() {
  const { gl } = useThree();
  const groupRef = useRef<THREE.Group>(null!);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = gl.domElement;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
      mouse.current = { x: nx, y: ny };

      if (groupRef.current) {
        gsap.to(groupRef.current.rotation, {
          y: nx * 0.35,
          x: ny * 0.2,
          duration: 1.2,
          ease: 'power2.out',
        });
      }
    };

    const onClick = () => {
      if (groupRef.current) {
        gsap.to(groupRef.current.rotation, {
          y: groupRef.current.rotation.y + Math.PI * 2,
          duration: 0.95,
          ease: 'power2.inOut',
        });
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('click', onClick);
    };
  }, [gl]);

  return (
    <group ref={groupRef}>
      {/* Ambient + directional lights */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 8, 4]} intensity={1.2} castShadow />
      <pointLight position={[-4, -2, 2]} intensity={0.5} color="#a855f7" />

      {/* Paper sheets */}
      <PaperSheet position={[-2.2, 0.3, -0.5]} rotation={[0.1, 0.3, -0.15]} floatOffset={0} />
      <PaperSheet position={[2.4, -0.2, -0.8]} rotation={[-0.05, -0.4, 0.2]} floatOffset={2.1} />

      {/* Print rollers */}
      <PrintRoller position={[-0.8, 1.2, 0.3]} floatOffset={1.0} />
      <PrintRoller position={[1.2, -1.0, 0.1]} floatOffset={3.2} />
    </group>
  );
}

/* ─── Exported Canvas wrapper ─────────────────────────────── */
export default function Hero3DScene() {
  return (
    <div className="hero-3d-canvas" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
