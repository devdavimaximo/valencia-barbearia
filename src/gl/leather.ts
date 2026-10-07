import * as THREE from 'three';

/**
 * Couro granulado procedural, sem nenhum arquivo: um campo de altura feito de Worley (F2 − F1)
 * (os vincos entre os "grãos") mais um ruído fino, convertido em normal map tileável.
 * O mesmo mapa, mais denso e mais fraco, dá a textura martelada da folha de ouro (como na logo original).
 */
export function makeLeatherNormal(size = 512, cells = 34, seed = 7): THREE.CanvasTexture {
  let s = seed;
  const rnd = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };

  const pts = new Float32Array(cells * cells * 2);
  for (let i = 0; i < cells * cells; i++) {
    pts[i * 2] = rnd();
    pts[i * 2 + 1] = rnd();
  }

  const h = new Float32Array(size * size);
  const cs = size / cells;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cx = Math.floor(x / cs);
      const cy = Math.floor(y / cs);
      let f1 = 1e9;
      let f2 = 1e9;
      for (let j = -1; j <= 1; j++) {
        for (let i = -1; i <= 1; i++) {
          const gx = (cx + i + cells) % cells;
          const gy = (cy + j + cells) % cells;
          const px = (cx + i + pts[(gy * cells + gx) * 2]) * cs;
          const py = (cy + j + pts[(gy * cells + gx) * 2 + 1]) * cs;
          const d = Math.hypot(px - x, py - y);
          if (d < f1) {
            f2 = f1;
            f1 = d;
          } else if (d < f2) f2 = d;
        }
      }
      const edge = Math.min(1, (f2 - f1) / (cs * 0.32));
      // grão arredondado: sobe rápido e achata no topo
      h[y * size + x] = Math.sqrt(edge) * 0.85 + rnd() * 0.15;
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(size, size);
  const at = (x: number, y: number) => h[((y + size) % size) * size + ((x + size) % size)];
  const k = 2.4;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (at(x + 1, y) - at(x - 1, y)) * k;
      const dy = (at(x, y + 1) - at(x, y - 1)) * k;
      const l = Math.hypot(dx, dy, 1);
      const o = (y * size + x) * 4;
      img.data[o] = ((-dx / l) * 0.5 + 0.5) * 255;
      img.data[o + 1] = ((dy / l) * 0.5 + 0.5) * 255;
      img.data[o + 2] = ((1 / l) * 0.5 + 0.5) * 255;
      img.data[o + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.NoColorSpace;
  tex.anisotropy = 8;
  return tex;
}
