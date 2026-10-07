import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import gsap from 'gsap';

import { LOGO, LOGO_H, LOGO_W } from '../lib/logo';
import { pointer, REDUCED, TOUCH } from '../lib/pointer';
import { makeLeatherNormal } from './leather';

/* ------------------------------------------------------------------ */
/* Geometria: a logo vetorizada vira três peças extrudadas com bisel  */
/* ------------------------------------------------------------------ */

/** Lê os caminhos do potrace (só M, L, C, Z). O maior contorno é a peça; os demais, furos (a boca). */
function toShape(d: string) {
  const tok = d.match(/[MLCZ]|-?\d*\.?\d+/g) ?? [];
  const subs: THREE.Path[] = [];
  let cur: THREE.Path | null = null;
  let cmd = '';
  let i = 0;
  const n = () => parseFloat(tok[i++]);
  while (i < tok.length) {
    if (/[MLCZ]/.test(tok[i])) cmd = tok[i++];
    if (cmd === 'Z') continue;
    if (cmd === 'M') {
      cur = new THREE.Path();
      cur.moveTo(n(), n());
      subs.push(cur);
      cmd = 'L';
    } else if (cmd === 'L') cur!.lineTo(n(), n());
    else if (cmd === 'C') cur!.bezierCurveTo(n(), n(), n(), n(), n(), n());
  }
  const pts = subs.map((p) => p.getPoints(10));
  const areas = pts.map((p) => Math.abs(THREE.ShapeUtils.area(p)));
  const outer = areas.indexOf(Math.max(...areas));
  const shape = new THREE.Shape(pts[outer]);
  shape.holes = pts.filter((_, j) => j !== outer).map((p) => new THREE.Path(p));
  return shape;
}

function partGeometry(d: string) {
  const shapes = [toShape(d)];
  const geo = new THREE.ExtrudeGeometry(shapes, {
    depth: 6,
    curveSegments: 10,
    bevelEnabled: true,
    // offset 0: a face da frente fica com o contorno exato (encolher quebra as pontas finas);
    // o bisel cresce para fora e a base fica escondida sob o couro
    bevelThickness: 7,
    bevelSize: 3.5,
    bevelOffset: 0,
    bevelSegments: 7,
  });
  geo.translate(-LOGO_W / 2, -LOGO_H / 2, 0);
  geo.computeVertexNormals();
  return geo;
}

/* ------------------------------------------------------------------ */
/* Poeira dourada: suspensa no ar + a nuvem que levanta no impacto    */
/* ------------------------------------------------------------------ */

const dustVert = /* glsl */ `
  attribute vec4 aSeed;
  uniform float uTime;
  uniform float uPixel;
  uniform float uBurst;
  uniform float uMode;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    float t = uTime;
    if (uMode < 0.5) {
      // poeira em suspensão: sobe devagar e volta por baixo
      p.y = mod(p.y + t * (0.05 + aSeed.w * 0.08) + 4.0, 8.0) - 4.0;
      p.x += sin(t * 0.3 + aSeed.x * 6.283) * 0.18;
      p.z += cos(t * 0.25 + aSeed.y * 6.283) * 0.12;
      vAlpha = (0.35 + 0.65 * pow(0.5 + 0.5 * sin(t * (0.8 + aSeed.z * 1.6) + aSeed.x * 40.0), 3.0));
    } else {
      // nuvem do impacto: aSeed.xyz é a direção
      float b = max(uBurst, 0.0);
      float k = 1.0 - exp(-b * 3.2);
      p += aSeed.xyz * k * (0.9 + aSeed.w * 1.4);
      p.y += b * b * 0.06 - b * 0.1;
      vAlpha = uBurst < 0.0 ? 0.0 : smoothstep(2.4, 0.0, b) * smoothstep(0.0, 0.05, b);
    }
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (uMode < 0.5 ? 2.2 : 3.0) * (0.5 + aSeed.w) * uPixel * (6.0 / -mv.z);
  }
`;

const dustFrag = /* glsl */ `
  varying float vAlpha;
  uniform vec3 uColor;
  uniform float uOpacity;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(uColor, a * a * vAlpha * uOpacity);
  }
`;

function Dust({ mode, count, burstRef }: { mode: 0 | 1; count: number; burstRef?: { current: number } }) {
  const gl = useThree((s) => s.gl);
  const { geo, mat } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count * 4);
    for (let i = 0; i < count; i++) {
      if (mode === 0) {
        pos[i * 3] = (Math.random() - 0.5) * 12;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
        pos[i * 3 + 2] = Math.random() * 4.5 - 0.5;
        seed.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
      } else {
        // nasce na borda da silhueta e corre rente ao couro
        const a = Math.random() * Math.PI * 2;
        const rx = 1.05;
        const ry = 1.75;
        pos[i * 3] = Math.cos(a) * rx * (0.75 + Math.random() * 0.3);
        pos[i * 3 + 1] = Math.sin(a) * ry * (0.75 + Math.random() * 0.3);
        pos[i * 3 + 2] = 0.08;
        const dir = new THREE.Vector3(Math.cos(a), Math.sin(a) * 0.8, 0.25 + Math.random() * 0.9).normalize();
        seed.set([dir.x, dir.y, dir.z, Math.random()], i * 4);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 4));
    const mat = new THREE.ShaderMaterial({
      vertexShader: dustVert,
      fragmentShader: dustFrag,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPixel: { value: 1 },
        uBurst: { value: -1 },
        uMode: { value: mode },
        uColor: { value: new THREE.Color(mode === 0 ? '#F3D48A' : '#E9C877') },
        uOpacity: { value: mode === 0 ? 0.9 : 1.2 },
      },
    });
    return { geo, mat };
  }, [count, mode]);

  useFrame((state) => {
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uPixel.value = gl.getPixelRatio() * (state.size.height / 900) * 4;
    if (burstRef) mat.uniforms.uBurst.value = burstRef.current < 0 ? -1 : state.clock.elapsedTime - burstRef.current;
  });

  return <points geometry={geo} material={mat} frustumCulled={false} />;
}

/* ------------------------------------------------------------------ */
/* Feixe de luz da janela                                              */
/* ------------------------------------------------------------------ */

function Beam() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uTime: { value: 0 } },
        vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: `
          varying vec2 vUv; uniform float uTime;
          void main(){
            float across = smoothstep(0.0, 0.5, vUv.x) * smoothstep(1.0, 0.5, vUv.x);
            float along = smoothstep(0.0, 0.35, vUv.y) * smoothstep(1.0, 0.6, vUv.y);
            float flick = 0.9 + 0.1 * sin(uTime * 0.7 + vUv.y * 4.0);
            gl_FragColor = vec4(vec3(1.0, 0.86, 0.58), pow(across, 1.6) * along * 0.075 * flick);
          }`,
      }),
    [],
  );
  useFrame((s) => (mat.uniforms.uTime.value = s.clock.elapsedTime));
  return (
    <mesh position={[-1.6, 1.4, 1.2]} rotation={[0, 0, -0.62]} material={mat}>
      <planeGeometry args={[3.4, 14]} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/* Couro + carimbo                                                      */
/* ------------------------------------------------------------------ */

type Stage = { ready: boolean };

function Press({ stage, onImpact }: { stage: Stage; onImpact: () => void }) {
  const { viewport, camera } = useThree();
  const group = useRef<THREE.Group>(null);
  const tilt = useRef<THREE.Group>(null);
  const parts = useRef<(THREE.Mesh | null)[]>([]);
  const light = useRef<THREE.SpotLight>(null);
  const target = useMemo(() => new THREE.Object3D(), []);
  const burst = useRef(-1);
  const started = useRef(false);

  const { geos, gold, leather } = useMemo(() => {
    const geos = [partGeometry(LOGO.hair), partGeometry(LOGO.lock), partGeometry(LOGO.beard)];
    const n1 = makeLeatherNormal(512, 34, 11);
    n1.repeat.set(26, 16);
    const n2 = n1.clone();
    n2.needsUpdate = true;
    // UV da face frontal = coordenadas da forma (0..432); um tile a cada ~70 unidades
    n2.repeat.set(1 / 40, 1 / 40);
    const leather = new THREE.MeshStandardMaterial({
      color: '#33452B',
      roughness: 0.82,
      metalness: 0,
      normalMap: n1,
      normalScale: new THREE.Vector2(0.7, 0.7),
      envMapIntensity: 0.5,
    });
    const gold = new THREE.MeshPhysicalMaterial({
      color: '#B8862F',
      metalness: 1,
      roughness: 0.48,
      normalMap: n2,
      normalScale: new THREE.Vector2(0.55, 0.55),
      clearcoat: 0.15,
      clearcoatRoughness: 0.45,
      envMapIntensity: 0.55,
    });
    return { geos, gold, leather };
  }, []);

  // A logo é encaixada no vão .hero__slot do layout (entre os textos e acima da palavra),
  // medido no próprio aparelho: nunca fica por cima de texto, em nenhuma proporção de tela.
  const size = useThree((st) => st.size);
  const gl = useThree((st) => st.gl);
  const [slot, setSlot] = useState<{ cx: number; cy: number; w: number; h: number } | null>(null);
  useEffect(() => {
    const hero = gl.domElement.closest<HTMLElement>('.hero');
    const el = hero?.querySelector<HTMLElement>('.hero__slot');
    if (!hero || !el) return;
    const measure = () => {
      const a = el.getBoundingClientRect();
      const b = hero.getBoundingClientRect();
      setSlot({ cx: a.left - b.left + a.width / 2, cy: a.top - b.top + a.height / 2, w: a.width, h: a.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    ro.observe(hero);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [gl]);

  const wpp = viewport.height / size.height;
  const fit = slot ? Math.min(slot.h * 0.8, (slot.w * 0.62 * LOGO_H) / LOGO_W) * wpp : viewport.height * 0.4;
  const logoH = Math.min(fit, viewport.height * (size.width < 900 ? 0.34 : 0.46));
  const s = logoH / LOGO_H;
  const baseX = slot ? (slot.cx - size.width / 2) * wpp : 0;
  const baseY = slot ? (size.height / 2 - slot.cy) * wpp : viewport.height * 0.1;

  useEffect(() => {
    light.current!.target = target;
  }, [target]);

  // estado inicial: peças acima do couro, fora de quadro
  useEffect(() => {
    parts.current.forEach((m) => {
      if (!m) return;
      m.position.z = 70 / s;
      m.visible = false;
    });
  }, [s]);

  useFrame((state, dt) => {
    // dispara a prensa quando o preloader sai
    if (stage.ready && !started.current) {
      started.current = true;
      const meshes = parts.current.filter(Boolean) as THREE.Mesh[];
      const tl = gsap.timeline();
      meshes.forEach((m, i) => {
        m.visible = true;
        m.rotation.set(0, 0, (i - 1) * 0.06);
        m.position.z = 1600;
        tl.to(m.position, { z: 0, duration: REDUCED ? 0.01 : 0.85, ease: 'power4.in' }, i * 0.12);
        tl.to(m.rotation, { z: 0, duration: 0.85, ease: 'power3.in' }, i * 0.12);
      });
      tl.add(() => {
        burst.current = state.clock.elapsedTime;
        onImpact();
        // tranco de prensa: a câmera sente o golpe
        gsap.fromTo(camera.position, { y: -0.06 }, { y: 0, duration: 0.6, ease: 'elastic.out(1.2, 0.3)' });
        gsap.fromTo(light.current!, { intensity: 300 }, { intensity: 140, duration: 1.4, ease: 'power2.out' });
      }, '>-0.02');
    }

    // ponteiro (ou um balanço lento no toque)
    const t = state.clock.elapsedTime;
    const px = TOUCH ? Math.sin(t * 0.35) * 0.55 : pointer.nx;
    const py = TOUCH ? Math.cos(t * 0.27) * 0.35 + 0.15 : pointer.ny;

    // progresso do scroll pelo hero
    const p = Math.min(1, window.scrollY / window.innerHeight);

    const k = 1 - Math.pow(0.0012, dt);
    if (tilt.current) {
      tilt.current.rotation.y += (px * 0.22 - tilt.current.rotation.y) * k;
      tilt.current.rotation.x += (-py * 0.14 - p * 0.75 - tilt.current.rotation.x) * k;
    }
    if (group.current) {
      group.current.position.set(baseX, baseY + p * viewport.height * 0.12, 0);
    }
    if (light.current) {
      const lx = px * viewport.width * 0.42;
      const ly = py * viewport.height * 0.42 + 0.6;
      light.current.position.x += (lx - light.current.position.x) * k;
      light.current.position.y += (ly - light.current.position.y) * k;
      target.position.set(light.current.position.x * 0.25, baseY + light.current.position.y * 0.12, 0);
    }
  });

  return (
    <>
      <ambientLight intensity={0.12} color="#cfe0c0" />
      <spotLight
        ref={light}
        position={[1.5, 2.5, 6]}
        intensity={140}
        angle={0.55}
        penumbra={1}
        decay={2}
        distance={30}
        color="#FFE7BD"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-radius={6}
      />
      <primitive object={target} />

      <group ref={tilt}>
        <mesh material={leather} receiveShadow position={[0, 0, -0.02]}>
          <planeGeometry args={[40, 26]} />
        </mesh>
        <group ref={group} position={[baseX, baseY, 0]} scale={[s, -s, s]}>
          {geos.map((g, i) => (
            <mesh
              key={i}
              ref={(m) => {
                parts.current[i] = m;
              }}
              geometry={g}
              material={gold}
              castShadow
            />
          ))}
        </group>
        <group position={[baseX, baseY, 0]} scale={logoH / 3.6}>
          <Dust mode={1} count={TOUCH ? 160 : 320} burstRef={burst} />
        </group>
      </group>

      <Dust mode={0} count={TOUCH ? 140 : 300} />
      <Beam />

      <Environment resolution={256} frames={1}>
        {/* difusores redondos e grandes: brilho macio, sem bordas duras refletidas na folha */}
        <Lightformer form="circle" intensity={1.1} color="#FFE2A8" position={[-2, 6, 5]} scale={9} target={[0, 0, 0]} />
        <Lightformer form="circle" intensity={0.7} color="#FFF0D0" position={[-8, 0, 4]} scale={7} target={[0, 0, 0]} />
        <Lightformer form="circle" intensity={0.45} color="#CFE3B4" position={[8, -2, 4]} scale={7} target={[0, 0, 0]} />
        <Lightformer form="circle" intensity={0.9} color="#FFD58A" position={[3, 2, 9]} scale={5} target={[0, 0, 0]} />
      </Environment>
    </>
  );
}

/* ------------------------------------------------------------------ */

export default function Stamp({
  ready,
  onLoaded,
  onImpact,
}: {
  ready: boolean;
  onLoaded: () => void;
  onImpact: () => void;
}) {
  const stage = useRef<Stage>({ ready: false }).current;
  stage.ready = ready;
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [failed, setFailed] = useState(false);

  // só renderiza enquanto o hero está na tela
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '80px' });
    io.observe(host.current!);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    try {
      const c = document.createElement('canvas');
      if (!(c.getContext('webgl2') || c.getContext('webgl'))) throw new Error('sem webgl');
    } catch {
      setFailed(true);
      onLoaded();
    }
  }, [onLoaded]);

  return (
    <div className="stamp" ref={host} aria-hidden="true">
      {!failed && (
        <Canvas
          shadows
          dpr={TOUCH ? [1, 1.6] : [1, 2]}
          frameloop={visible ? 'always' : 'never'}
          camera={{ position: [0, 0, 12], fov: 28, near: 0.1, far: 60 }}
          gl={{ antialias: true, powerPreference: 'high-performance', toneMappingExposure: 0.95 }}
          onCreated={() => requestAnimationFrame(() => requestAnimationFrame(onLoaded))}
        >
          <Press stage={stage} onImpact={onImpact} />
        </Canvas>
      )}
    </div>
  );
}
