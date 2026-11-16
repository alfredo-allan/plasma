"use client";

import * as THREE from "three";
import { Environment, Float } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { SYMBOL_PATHS } from "@/components/logoPaths";

type Props = {
  /** Incrementar este número dispara um "kickflip" (giro rápido) no símbolo */
  flip: number;
};

/** Giro base, em rad/s - lento, tipo roda rolando devagar */
const BASE_SPIN = 0.9;

/**
 * O símbolo vermelho da Plasma em 3D, para o portal de entrada.
 *
 * A geometria é extrudada a partir dos MESMOS paths do <Logo/>
 * (`logoPaths.ts`), então se o logo mudar, o 3D muda junto. Frente/verso
 * em vermelho laqueado, laterais e chanfro em preto - o mesmo "contorno
 * preto" do nome no logo 2D.
 *
 * Interação: gira sozinho; arrastar (mouse ou dedo) joga o giro pro lado
 * do gesto, com inércia, e ele volta ao ritmo base sozinho.
 */
export default function EntryLogo3D({ flip }: Props) {
  const dragRef = useRef({ active: false, x: 0, y: 0, t: 0, dx: 0, dy: 0 });

  return (
    <div
      className="absolute inset-0 cursor-grab touch-none active:cursor-grabbing"
      onPointerDown={(e) => {
        dragRef.current = { active: true, x: e.clientX, y: e.clientY, t: performance.now(), dx: 0, dy: 0 };
        (e.target as Element).setPointerCapture?.(e.pointerId);
      }}
      onPointerMove={(e) => {
        const d = dragRef.current;
        if (!d.active) return;
        d.dx += e.clientX - d.x;
        d.dy += e.clientY - d.y;
        d.x = e.clientX;
        d.y = e.clientY;
      }}
      onPointerUp={() => (dragRef.current.active = false)}
      onPointerCancel={() => (dragRef.current.active = false)}
    >
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 6], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          {/* mesmo HDR do skate do Hero - já fica no cache pra ele */}
          <Environment files="/hdr/warehouse-256.hdr" />
        </Suspense>
        <directionalLight position={[3, 4, 5]} intensity={1.6} />
        <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.6}>
          <Symbol flip={flip} dragRef={dragRef} />
        </Float>
      </Canvas>
    </div>
  );
}

type DragRef = React.MutableRefObject<{ active: boolean; dx: number; dy: number }>;

function Symbol({ flip, dragRef }: { flip: number; dragRef: DragRef }) {
  const groupRef = useRef<THREE.Group>(null);
  const spin = useRef({ vy: BASE_SPIN, vx: 0 });
  const { viewport } = useThree();

  const geometry = useMemo(() => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg">${SYMBOL_PATHS.map(
      (p) => `<path d="${p.d}"/>`,
    ).join("")}</svg>`;
    const data = new SVGLoader().parse(svg);
    const shapes = data.paths.flatMap((path) => SVGLoader.createShapes(path));

    const geo = new THREE.ExtrudeGeometry(shapes, {
      depth: 12,
      bevelEnabled: true,
      bevelThickness: 2.2,
      bevelSize: 1.4,
      bevelSegments: 4,
      curveSegments: 24,
    });
    geo.center();
    return geo;
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  // grupo 0 da ExtrudeGeometry = frente/verso, grupo 1 = laterais + chanfro
  const materials = useMemo(
    () => [
      new THREE.MeshPhysicalMaterial({
        color: "#DD3726",
        roughness: 0.32,
        metalness: 0.05,
        clearcoat: 1,
        clearcoatRoughness: 0.18,
      }),
      new THREE.MeshStandardMaterial({ color: "#0b0b0b", roughness: 0.55, metalness: 0.2 }),
    ],
    [],
  );
  useEffect(() => () => materials.forEach((m) => m.dispose()), [materials]);

  // kickflip: giro rápido no eixo X + empurrão no Y
  useEffect(() => {
    if (flip === 0) return;
    spin.current.vx += 16;
    spin.current.vy += 8;
  }, [flip]);

  useFrame((_, rawDt) => {
    const g = groupRef.current;
    if (!g) return;
    const dt = Math.min(rawDt, 1 / 20);
    const s = spin.current;
    const d = dragRef.current;

    if (d.active) {
      // arrasto vira velocidade (com inércia ao soltar)
      s.vy = (d.dx * 0.012) / dt;
      s.vx = (d.dy * 0.012) / dt;
      d.dx = 0;
      d.dy = 0;
    } else {
      s.vy += (BASE_SPIN - s.vy) * Math.min(1, dt * 1.2);
      s.vx *= Math.exp(-dt * 2.2);
      // quando o flip perde força, endireita no múltiplo de 360° mais próximo
      if (Math.abs(s.vx) < 1.2) {
        const target = Math.round(g.rotation.x / (Math.PI * 2)) * Math.PI * 2;
        g.rotation.x += (target - g.rotation.x) * Math.min(1, dt * 3);
      }
    }

    g.rotation.y += s.vy * dt;
    g.rotation.x += s.vx * dt;
  });

  // ~80 unidades de SVG -> ~70% da largura, sem passar de metade da altura
  // (no celular em pé a largura é que manda, então ele fica bem maior)
  const scale = Math.min(viewport.width * 0.7, viewport.height * 0.5) / 80;

  return (
    <group ref={groupRef}>
      {/* y invertido: no SVG o eixo Y cresce pra baixo */}
      <mesh geometry={geometry} material={materials} scale={[scale, -scale, scale]} />
    </group>
  );
}
