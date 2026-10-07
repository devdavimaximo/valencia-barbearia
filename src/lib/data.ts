// Tudo o que a barbearia pode querer trocar sem mexer em layout fica aqui.
// Fotos: substitua os arquivos em public/fotos/ mantendo os nomes (ou ajuste os caminhos abaixo).

export const FOUNDED = 2018;
export const YEARS = Math.max(1, new Date().getFullYear() - FOUNDED);

export const INFO = {
  name: 'Barbearia Valência',
  street: 'Rua Papa João XXIII, 81 · Sala 01',
  district: 'Vila Cachoeirinha',
  city: 'Cachoeirinha · RS',
  cep: '94910-170',
  phone: '(51) 99013-4988',
  email: 'barbeariavalencia81@gmail.com',
  instagram: '@barbearia.valencia',
};

const WA_TEXT = encodeURIComponent('Olá, Valência! Quero agendar um horário.');

export const LINKS = {
  agenda: 'https://sites.appbarber.com.br/barbeariavalenc-af8y',
  whatsapp: `https://wa.me/5551990134988?text=${WA_TEXT}`,
  escola: `https://wa.me/5551990134988?text=${encodeURIComponent('Olá! Quero saber da próxima turma do curso de barbeiro.')}`,
  instagram: 'https://www.instagram.com/barbearia.valencia/',
  facebook: 'https://www.facebook.com/barbeariavalencia/',
  maps: 'https://www.google.com/maps/search/?api=1&query=Rua+Papa+Jo%C3%A3o+XXIII+81+Vila+Cachoeirinha+Cachoeirinha+RS',
  embed: 'https://www.google.com/maps?q=Rua+Papa+Jo%C3%A3o+XXIII,+81,+Cachoeirinha+-+RS,+94910-170&z=16&output=embed',
};

/** 0 = domingo. Horário em America/Sao_Paulo. */
export const HOURS: { day: string; short: string; open?: [number, number] }[] = [
  { day: 'Domingo', short: 'Dom' },
  { day: 'Segunda', short: 'Seg', open: [10, 20] },
  { day: 'Terça', short: 'Ter', open: [10, 20] },
  { day: 'Quarta', short: 'Qua', open: [10, 20] },
  { day: 'Quinta', short: 'Qui', open: [10, 20] },
  { day: 'Sexta', short: 'Sex', open: [10, 20] },
  { day: 'Sábado', short: 'Sáb', open: [10, 18] },
];

export const RITUAL = [
  {
    n: 'I',
    title: 'A conversa',
    text: 'Antes da tesoura, o espelho. A gente olha o formato do rosto, o redemoinho, a rotina, e combina o corte com você, não com a moda da semana.',
    img: 'fotos/ritual-espelho.jpg',
    time: '5 min',
  },
  {
    n: 'II',
    title: 'Toalha quente',
    text: 'O vapor abre os poros e amacia o fio. É o primeiro minuto em que você esquece do celular.',
    img: 'fotos/ritual-toalha.jpg',
    time: '3 min',
  },
  {
    n: 'III',
    title: 'Tesoura & pente',
    text: 'Volume no lugar certo, camada por camada. Tesoura é paciência, e paciência é a casa.',
    img: 'fotos/ritual-tesoura.jpg',
    time: '20 min',
  },
  {
    n: 'IV',
    title: 'A máquina',
    text: 'Degradê limpo, sem marca de pente. Do zero ao comprimento, transição que só se vê de perto.',
    img: 'fotos/ritual-maquina.jpg',
    time: '10 min',
  },
  {
    n: 'V',
    title: 'Espuma & navalha',
    text: 'Pincel, espuma morna e lâmina nova. O contorno da barba e da nuca desenhado à mão livre.',
    img: 'fotos/ritual-bancada.jpg',
    time: '15 min',
  },
  {
    n: 'VI',
    title: 'O acabamento',
    text: 'Pós-barba, pomada, um último ajuste de pente. Você levanta da cadeira outro homem, e já marca o próximo.',
    img: 'fotos/ritual-navalha.jpg',
    time: '5 min',
  },
];

/**
 * Serviços e preços conforme a agenda online (AppBarber).
 * `img` aparece flutuando ao passar o mouse sobre a linha; `badge` é um selo opcional.
 */
export const SERVICES: {
  group: string;
  items: { name: string; desc: string; price: string; time: string; img: string; badge?: string }[];
}[] = [
  {
    group: 'Cabelo',
    items: [
      { name: 'Cabelo', desc: 'Corte na tesoura e na máquina', price: '45', time: '30 min', img: 'fotos/corte-01.jpg' },
      { name: 'Degradê navalhado', desc: 'Degradê com acabamento na navalha', price: '55', time: '1h', img: 'fotos/corte-03.jpg' },
      { name: 'Luzes e corte', desc: 'Luzes com o corte incluso', price: '280', time: '4h', img: 'fotos/corte-02.jpg' },
      { name: 'Platinado e corte', desc: 'Platinado com o corte incluso', price: '320', time: '4h', img: 'fotos/corte-04.jpg' },
    ],
  },
  {
    group: 'Barba & rosto',
    items: [
      { name: 'Barba', desc: 'Barba aparada e desenhada', price: '40', time: '30 min', img: 'fotos/corte-05.jpg' },
      { name: 'Limpeza de pele completa', desc: 'Limpeza facial completa', price: '40', time: '30 min', img: 'fotos/ritual-toalha.jpg' },
      { name: 'Nariz e orelha com cera', desc: 'Depilação com cera', price: '20', time: '30 min', img: 'fotos/ritual-bancada.jpg' },
    ],
  },
  {
    group: 'Combos',
    items: [
      { name: 'Cabelo e barba', desc: 'Corte e barba', price: '80', time: '1h', img: 'fotos/ritual-espuma.jpg' },
      { name: 'Cabelo e barba com máquina', desc: 'Corte e barba feitos na máquina', price: '65', time: '1h', img: 'fotos/ritual-maquina.jpg' },
      { name: 'Cabelo e sobrancelha', desc: 'Corte e sobrancelha', price: '55', time: '30 min', img: 'fotos/corte-07.jpg' },
      { name: 'Cabelo, barba e sobrancelha', desc: 'O pacote completo', price: '90', time: '1h', img: 'fotos/ritual-navalha.jpg', badge: 'Completo' },
    ],
  },
];

export const CUTS = [
  { name: 'Low fade', img: 'fotos/corte-01.jpg' },
  { name: 'Crop texturizado', img: 'fotos/corte-02.jpg' },
  { name: 'Pompadour', img: 'fotos/corte-03.jpg' },
  { name: 'Afro com degradê', img: 'fotos/corte-04.jpg' },
  { name: 'Barba desenhada', img: 'fotos/corte-05.jpg' },
  { name: 'Barba na navalha', img: 'fotos/corte-06.jpg' },
  { name: 'Social clássico', img: 'fotos/corte-07.jpg' },
  { name: 'Contorno à navalha', img: 'fotos/ritual-navalha.jpg' },
  { name: 'Fade na máquina', img: 'fotos/ritual-maquina.jpg' },
  { name: 'Barba & espuma', img: 'fotos/ritual-espuma.jpg' },
];

/** Hora atual em Cachoeirinha, independente do fuso de quem visita. */
export function nowInRS() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  const wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  return { day: wd, hour: Number(get('hour')) % 24, minute: Number(get('minute')) };
}

export function openStatus() {
  const { day, hour, minute } = nowInRS();
  const t = hour + minute / 60;
  const today = HOURS[day];
  if (today.open && t >= today.open[0] && t < today.open[1]) {
    const left = today.open[1] - t;
    return { open: true, day, label: left <= 1 ? 'Aberto · fecha em breve' : `Aberto agora · até ${today.open[1]}h` };
  }
  // próximo dia com expediente
  for (let i = 0; i < 7; i++) {
    const d = (day + i) % 7;
    const h = HOURS[d];
    if (!h.open) continue;
    if (i === 0 && t < h.open[0]) return { open: false, day, label: `Fechado · abre hoje às ${h.open[0]}h` };
    if (i === 1) return { open: false, day, label: `Fechado · abre amanhã às ${h.open[0]}h` };
    if (i > 1) return { open: false, day, label: `Fechado · abre ${h.day.toLowerCase()} às ${h.open[0]}h` };
  }
  return { open: false, day, label: 'Fechado' };
}

/** Os dois barbeiros da casa. Fotos reais em public/fotos/equipe-*.jpg */
export const TEAM = [
  { name: 'Renan', chair: '01', img: 'fotos/equipe-renan.jpg', pos: '24% 30%' },
  { name: 'Rhuan', chair: '02', img: 'fotos/equipe-rhuan.jpg', pos: '55% 30%' },
];

/** Foto real do espaço. */
export const SPACE_IMG = 'fotos/casa-espaco.jpg';
