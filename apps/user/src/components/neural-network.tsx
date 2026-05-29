"use client";
import { useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const NODE_COUNT = 90;
const CONNECTION_DIST = 3.2;
const COLORS = {
  primary: new THREE.Color("hsl(var(--color-primary) / 1)"),
  accent: new THREE.Color("hsl(var(--color-accent) / 1)"),
};

type Node = {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  phase: number;
};

function useReducedMotion() {
  if (typeof window === "undefined") return false;
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  return mq.matches;
}

function Scene({ mouse }: { mouse: React.MutableRefObject<[number, number]> }) {
  const groupRef = useRef<THREE.Group>(null);
  const reduced = useReducedMotion();
  const { viewport } = useThree();

  const nodes = useMemo<Node[]>(() => {
    const arr: Node[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      arr.push({
        pos: new THREE.Vector3(
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 8 - 2,
        ),
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 0.004,
          (Math.random() - 0.5) * 0.004,
          (Math.random() - 0.5) * 0.002,
        ),
        phase: Math.random() * Math.PI * 2,
      });
    }
    return arr;
  }, []);

  const edges = useMemo(() => {
    const pairs: [number, number][] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const d = nodes[i]!.pos.distanceTo(nodes[j]!.pos);
        if (d < CONNECTION_DIST && Math.random() < 0.35) {
          pairs.push([i, j]);
        }
      }
    }
    return pairs;
  }, [nodes]);

  useFrame((state, delta) => {
    if (!groupRef.current || reduced) return;

    const time = state.clock.elapsedTime;

    nodes.forEach((n, i) => {
      n.pos.x += Math.sin(time * 0.3 + n.phase) * 0.002;
      n.pos.y += Math.cos(time * 0.25 + n.phase * 1.3) * 0.002;
      n.pos.z += Math.sin(time * 0.2 + n.phase * 0.7) * 0.001;
    });

    const mx = mouse.current[0] * 0.3;
    const my = -mouse.current[1] * 0.3;

    groupRef.current.position.x += (mx - groupRef.current.position.x) * 0.02;
    groupRef.current.position.y += (my - groupRef.current.position.y) * 0.02;
    groupRef.current.rotation.y += (mx * 0.005 - groupRef.current.rotation.y) * 0.02;
    groupRef.current.rotation.x += (my * 0.005 - groupRef.current.rotation.x) * 0.02;
  });

  const linePositions = useMemo(() => {
    const positions: number[] = [];
    const opacities: number[] = [];
    edges.forEach(([i, j]) => {
      const p1 = nodes[i]!.pos;
      const p2 = nodes[j]!.pos;
      positions.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
      const d = p1.distanceTo(p2);
      const o = Math.max(0, 1 - d / CONNECTION_DIST) * 0.4;
      opacities.push(o, o);
    });
    return { positions: new Float32Array(positions), opacities: new Float32Array(opacities) };
  }, [nodes, edges]);

  const nodePositions = useMemo(() => {
    const positions: number[] = [];
    const sizes: number[] = [];
    const colors: number[] = [];
    nodes.forEach((n) => {
      positions.push(n.pos.x, n.pos.y, n.pos.z);
      sizes.push(0.04 + Math.random() * 0.06);
      const t = Math.random();
      const c = COLORS.primary.clone().lerp(COLORS.accent, t);
      colors.push(c.r, c.g, c.b);
    });
    return { positions: new Float32Array(positions), sizes: new Float32Array(sizes), colors: new Float32Array(colors) };
  }, [nodes]);

  return (
    <group ref={groupRef}>
      <Lines positions={linePositions.positions} opacities={linePositions.opacities} />
      <Nodes positions={nodePositions.positions} sizes={nodePositions.sizes} colors={nodePositions.colors} />
    </group>
  );
}

function Lines({ positions, opacities }: { positions: Float32Array; opacities: Float32Array }) {
  const ref = useRef<THREE.LineSegments>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("opacity", new THREE.BufferAttribute(opacities, 1));
    return g;
  }, [positions, opacities]);

  return (
    <lineSegments ref={ref} geometry={geo}>
      <lineBasicMaterial
        transparent
        vertexColors={false}
        color="hsl(var(--color-primary) / 0.3)"
        opacity={0.25}
        depthWrite={false}
      />
    </lineSegments>
  );
}

function Nodes({ positions, sizes, colors }: { positions: Float32Array; sizes: Float32Array; colors: Float32Array }) {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return g;
  }, [positions, sizes, colors]);

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        size={0.08}
        transparent
        vertexColors
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function NeuralNetwork() {
  const mouseRef = useRef<[number, number]>([0, 0]);
  const reduced = useReducedMotion();

  const onPointerMove = useCallback((e: { clientX: number; clientY: number }) => {
    mouseRef.current = [
      (e.clientX / window.innerWidth) * 2 - 1,
      (e.clientY / window.innerHeight) * 2 - 1,
    ];
  }, []);

  if (reduced) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      onPointerMove={onPointerMove}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
        style={{ opacity: 0.35 }}
      >
        <Scene mouse={mouseRef} />
      </Canvas>
    </div>
  );
}
