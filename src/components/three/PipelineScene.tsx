import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function FloatingShape({
  position,
  color,
  speed = 1,
  size = 1,
}: {
  position: [number, number, number];
  color: string;
  speed?: number;
  size?: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.3;
    ref.current.rotation.y += 0.003 * speed;
  });
  return (
    <Float speed={speed * 0.5} rotationIntensity={0.3} floatIntensity={0.4}>
      <mesh ref={ref} position={position}>
        <octahedronGeometry args={[size, 0]} />
        <meshStandardMaterial
          color={color}
          wireframe
          transparent
          opacity={0.5}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>
    </Float>
  );
}

function ShieldShape({
  position,
  color,
}: {
  position: [number, number, number];
  color: string;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.5;
    ref.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.2) * 0.1;
  });
  return (
    <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.6}>
      <mesh ref={ref} position={position}>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial
          color={color}
          wireframe
          transparent
          opacity={0.35}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  );
}

function Particles({ count = 300 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 25;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#00e599"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[10, 10, 10]} intensity={0.4} color="#00e599" />
      <pointLight position={[-10, -5, -5]} intensity={0.25} color="#00d4ff" />
      <pointLight position={[0, -10, 5]} intensity={0.15} color="#ff4455" />

      <FloatingShape position={[-4, 1.5, -2]} color="#00e599" speed={0.8} size={0.8} />
      <FloatingShape position={[4, -1, -3]} color="#00d4ff" speed={1.1} size={0.6} />
      <FloatingShape position={[2, 2.5, -1]} color="#00e599" speed={0.6} size={0.5} />
      <FloatingShape position={[-2, -2, -4]} color="#00d4ff" speed={0.9} size={0.7} />
      <FloatingShape position={[0, -3, -2]} color="#ff4455" speed={0.7} size={0.4} />
      <ShieldShape position={[-1, 0.5, -3]} color="#00e599" />
      <ShieldShape position={[3, 1, -5]} color="#00d4ff" />
      <Particles count={400} />
    </>
  );
}

export default function PipelineScene() {
  return (
    <div className="absolute inset-0" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
