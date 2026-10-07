# Barbearia Valência, site

Barbearia tradicional desde 2018 · Rua Papa João XXIII, 81 · Vila Cachoeirinha, Cachoeirinha/RS.

Conceito: **carimbado a ouro**. A logo vira uma peça 3D de folha de ouro prensada sobre couro verde, igual à
logo original. Quando o preloader sai, as três peças (cabelo, mecha, barba) descem e são prensadas no couro,
levantando poeira dourada. A luz segue o cursor e a sombra do relevo acompanha.

## Rodar

```bash
npm install
npm run dev       # desenvolvimento
npm run build     # type-check + build em dist/
npm run preview   # serve o build
```

## Trocar conteúdo

- **Textos, preços, horários, links e nomes**: `src/lib/data.ts`. Os preços são de referência e precisam ser confirmados.
- **Fotos**: `public/fotos/`. Substitua os arquivos mantendo os nomes:
  - `equipe-renan.jpg`, `equipe-rhuan.jpg`: barbeiros (retrato 4:5). Enquanto não existirem, o site usa uma foto de mock.
  - `casa-espaco.jpg`: o espaço real (retrato 3:4). Enquanto não existir, usa `casa-salao.jpg`.
  - `ritual-*.jpg`, `corte-0*.jpg`, `casa-*.jpg`: fotos de mock (Unsplash) para trocar por fotos reais.
- **Logo**: `src/lib/logo.ts` (vetorizada de `logo/image.png`). Ícones e imagem de compartilhamento ficam em `public/`.

## Seções

Hero 3D · A casa (manifesto) · O ritual (trilho horizontal, 6 tempos) · Barbeiros · Tabela da casa ·
Cortes (galeria com lightbox) · Desde 2018 (poste de barbeiro) · Escola Valência · Visite (mapa, horários, status aberto/fechado ao vivo) · Rodapé.

## Stack

React 19 · Vite · TypeScript · React Three Fiber + drei · GSAP (ScrollTrigger, SplitText) · Lenis.
Paleta da logo: verde `#263222` e ouro `#D4AC55`. Fontes: Bodoni Moda, Barlow Condensed e Hanken Grotesk.
